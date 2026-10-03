import {
  pgTable,
  varchar,
  text,
  date,
  numeric,
  timestamp,
  integer,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// ── invoices ──────────────────────────────────────────────────────────────────
export const invoices = pgTable('invoices', {
  id: varchar('id', { length: 36 })
    .primaryKey()
    .notNull()
    .default(sql`gen_random_uuid()`),
  invoice_number: varchar('invoice_number', { length: 50 }).notNull().unique(),
  client_name: varchar('client_name', { length: 255 }).notNull(),
  client_address: text('client_address').notNull(),
  issue_date: date('issue_date').notNull(),
  due_date: date('due_date').notNull(),
  total_amount: numeric('total_amount', { precision: 15, scale: 2 })
    .notNull()
    .default('0'),
  status: varchar('status', { length: 20 }).notNull().default('Draft'),
  created_at: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ── invoice_items ─────────────────────────────────────────────────────────────
export const invoiceItems = pgTable('invoice_items', {
  id: varchar('id', { length: 36 })
    .primaryKey()
    .notNull()
    .default(sql`gen_random_uuid()`),
  invoice_id: varchar('invoice_id', { length: 36 })
    .notNull()
    .references(() => invoices.id, { onDelete: 'cascade' }),
  description: varchar('description', { length: 500 }).notNull(),
  quantity: integer('quantity').notNull().default(1),
  unit_price: numeric('unit_price', { precision: 15, scale: 2 })
    .notNull()
    .default('0'),
  line_total: numeric('line_total', { precision: 15, scale: 2 })
    .notNull()
    .default('0'),
});

// ── Types ─────────────────────────────────────────────────────────────────────
export type Invoice = typeof invoices.$inferSelect;
export type NewInvoice = typeof invoices.$inferInsert;
export type InvoiceItem = typeof invoiceItems.$inferSelect;
export type NewInvoiceItem = typeof invoiceItems.$inferInsert;
export type InvoiceStatus = 'Draft' | 'Sent' | 'Paid' | 'Cancelled';
