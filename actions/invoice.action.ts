'use server';

import { revalidatePath } from 'next/cache';
import { invoiceService } from '@/services/invoice.service';
import { createInvoiceSchema } from '@/dtos/invoice.dto';
import type { CreateInvoiceDto } from '@/dtos/invoice.dto';

// ── Generic action result type ────────────────────────────────────────────────
export type ActionResult<T = unknown> =
  | { success: true; data: T }
  | { success: false; error: string };

// ── Get all invoices ──────────────────────────────────────────────────────────
export async function getInvoicesAction(options?: {
  search?: string;
  page?: number;
  pageSize?: number;
}): Promise<ActionResult> {
  try {
    const result = await invoiceService.getInvoices(options);
    return { success: true, data: result };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}

// ── Get single invoice ────────────────────────────────────────────────────────
export async function getInvoiceByIdAction(id: string): Promise<ActionResult> {
  try {
    const invoice = await invoiceService.getInvoiceById(id);
    return { success: true, data: invoice };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}

// ── Create invoice ────────────────────────────────────────────────────────────
export async function createInvoiceAction(
  dto: CreateInvoiceDto,
): Promise<ActionResult<{ id: string }>> {
  try {
    const parsed = createInvoiceSchema.safeParse(dto);
    if (!parsed.success) {
      const message = parsed.error.errors.map((e) => e.message).join(', ');
      return { success: false, error: message };
    }

    const created = await invoiceService.createInvoice(parsed.data);
    revalidatePath('/');
    return { success: true, data: { id: created.id } };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}

// ── Update invoice status ─────────────────────────────────────────────────────
export async function updateInvoiceStatusAction(
  id: string,
  status: 'Draft' | 'Sent' | 'Paid' | 'Cancelled',
): Promise<ActionResult> {
  try {
    const updated = await invoiceService.updateInvoiceStatus(id, status);
    revalidatePath('/');
    revalidatePath(`/invoices/${id}`);
    return { success: true, data: updated };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}

// ── Delete invoice ────────────────────────────────────────────────────────────
export async function deleteInvoiceAction(id: string): Promise<ActionResult> {
  try {
    await invoiceService.deleteInvoice(id);
    revalidatePath('/');
    return { success: true, data: null };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}
