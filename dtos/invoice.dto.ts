import { z } from 'zod';

// ── Zod schemas ───────────────────────────────────────────────────────────────

export const invoiceItemSchema = z.object({
  id: z.string().optional(),
  description: z.string().min(1, 'Description is required'),
  quantity: z.coerce
    .number()
    .int()
    .min(1, 'Quantity must be at least 1'),
  unit_price: z.coerce
    .number()
    .min(0.01, 'Unit price must be greater than 0'),
});

export const createInvoiceSchema = z.object({
  client_name: z.string().min(1, 'Client name is required'),
  client_address: z.string().min(1, 'Client address is required'),
  issue_date: z.string().min(1, 'Issue date is required'),
  due_date: z.string().min(1, 'Due date is required'),
  status: z.enum(['Draft', 'Sent', 'Paid', 'Cancelled']).default('Draft'),
  items: z
    .array(invoiceItemSchema)
    .min(1, 'At least one item is required'),
});

export const updateInvoiceSchema = createInvoiceSchema.partial();

// ── TypeScript types derived from Zod ────────────────────────────────────────

export type InvoiceItemFormData = z.infer<typeof invoiceItemSchema>;
export type CreateInvoiceDto = z.infer<typeof createInvoiceSchema>;
export type UpdateInvoiceDto = z.infer<typeof updateInvoiceSchema>;

// ── Response types ────────────────────────────────────────────────────────────

export interface InvoiceListDto {
  id: string;
  invoice_number: string;
  client_name: string;
  issue_date: string;
  due_date: string;
  total_amount: string;
  status: 'Draft' | 'Sent' | 'Paid' | 'Cancelled';
  created_at: Date;
}

export interface InvoiceDetailDto extends InvoiceListDto {
  client_address: string;
  updated_at: Date;
  items: {
    id: string;
    description: string;
    quantity: number;
    unit_price: string;
    line_total: string;
  }[];
}

export interface PaginatedInvoicesDto {
  data: InvoiceListDto[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
