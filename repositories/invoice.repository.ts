import { db } from '@/lib/db';
import { invoices, invoiceItems } from '@/drizzle/schema';
import { eq, desc, ilike, or, sql } from 'drizzle-orm';
import type { CreateInvoiceDto } from '@/dtos/invoice.dto';

export class InvoiceRepository {
  /**
   * Find all invoices with optional search/pagination
   */
  async findAll(options?: {
    search?: string;
    page?: number;
    pageSize?: number;
  }) {
    const { search, page = 1, pageSize = 10 } = options ?? {};
    const offset = (page - 1) * pageSize;

    const baseQuery = db
      .select({
        id: invoices.id,
        invoice_number: invoices.invoice_number,
        client_name: invoices.client_name,
        issue_date: invoices.issue_date,
        due_date: invoices.due_date,
        total_amount: invoices.total_amount,
        status: invoices.status,
        created_at: invoices.created_at,
      })
      .from(invoices);

    const whereClause = search
      ? or(
          ilike(invoices.invoice_number, `%${search}%`),
          ilike(invoices.client_name, `%${search}%`),
        )
      : undefined;

    const [rows, countRows] = await Promise.all([
      whereClause
        ? baseQuery
            .where(whereClause)
            .orderBy(desc(invoices.created_at))
            .limit(pageSize)
            .offset(offset)
        : baseQuery
            .orderBy(desc(invoices.created_at))
            .limit(pageSize)
            .offset(offset),
      db
        .select({ count: sql<number>`count(*)` })
        .from(invoices)
        .where(whereClause),
    ]);

    return {
      data: rows,
      total: Number(countRows[0]?.count ?? 0),
      page,
      pageSize,
      totalPages: Math.ceil(Number(countRows[0]?.count ?? 0) / pageSize),
    };
  }

  /**
   * Find a single invoice with all its items
   */
  async findById(id: string) {
    const [invoice] = await db
      .select()
      .from(invoices)
      .where(eq(invoices.id, id));

    if (!invoice) return null;

    const items = await db
      .select()
      .from(invoiceItems)
      .where(eq(invoiceItems.invoice_id, id));

    return { ...invoice, items };
  }

  /**
   * Generate the next sequential invoice number (INV-YYYYMMDD-XXXX)
   */
  async generateInvoiceNumber(): Promise<string> {
    const today = new Date();
    const datePart = today
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, '');

    const [result] = await db
      .select({ count: sql<number>`count(*)` })
      .from(invoices);

    const seq = (Number(result?.count ?? 0) + 1).toString().padStart(4, '0');
    return `INV-${datePart}-${seq}`;
  }

  /**
   * Create an invoice together with its items in a transaction
   */
  async create(dto: CreateInvoiceDto) {
    const invoice_number = await this.generateInvoiceNumber();

    // Compute totals
    const computedItems = dto.items.map((item) => ({
      ...item,
      line_total: item.quantity * item.unit_price,
    }));
    const total_amount = computedItems.reduce(
      (sum, item) => sum + item.line_total,
      0,
    );

    const [created] = await db
      .insert(invoices)
      .values({
        invoice_number,
        client_name: dto.client_name,
        client_address: dto.client_address,
        issue_date: dto.issue_date,
        due_date: dto.due_date,
        status: dto.status,
        total_amount: total_amount.toFixed(2),
      })
      .returning();

    await db.insert(invoiceItems).values(
      computedItems.map((item) => ({
        invoice_id: created.id,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price.toFixed(2),
        line_total: item.line_total.toFixed(2),
      })),
    );

    return created;
  }

  /**
   * Update invoice status
   */
  async updateStatus(id: string, status: 'Draft' | 'Sent' | 'Paid' | 'Cancelled') {
    const [updated] = await db
      .update(invoices)
      .set({ status, updated_at: new Date() })
      .where(eq(invoices.id, id))
      .returning();
    return updated;
  }

  /**
   * Delete an invoice (cascade deletes items via FK)
   */
  async delete(id: string) {
    await db.delete(invoices).where(eq(invoices.id, id));
  }
}

// Singleton export
export const invoiceRepository = new InvoiceRepository();
