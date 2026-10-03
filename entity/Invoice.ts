import { BaseEntity } from './Base';

export type InvoiceStatus = 'Draft' | 'Sent' | 'Paid' | 'Cancelled';

export interface InvoiceEntity extends Omit<BaseEntity, 'is_deleted' | 'deleted_at'> {
  invoice_number: string;
  client_name: string;
  client_address: string;
  issue_date: string;
  due_date: string;
  total_amount: string;
  status: InvoiceStatus;
}

export interface InvoiceItemEntity {
  id: string;
  invoice_id: string;
  description: string;
  quantity: number;
  unit_price: string;
  line_total: string;
}

export interface InvoiceWithItems extends InvoiceEntity {
  items: InvoiceItemEntity[];
}
