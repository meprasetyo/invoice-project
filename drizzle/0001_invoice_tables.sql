-- Create invoice status enum
DO $$ BEGIN
  CREATE TYPE "invoice_status" AS ENUM ('Draft', 'Sent', 'Paid', 'Cancelled');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create invoices table
CREATE TABLE IF NOT EXISTS "invoices" (
  "id"             VARCHAR(36) PRIMARY KEY NOT NULL DEFAULT gen_random_uuid()::text,
  "invoice_number" VARCHAR(50) NOT NULL UNIQUE,
  "client_name"    VARCHAR(255) NOT NULL,
  "client_address" TEXT NOT NULL,
  "issue_date"     DATE NOT NULL,
  "due_date"       DATE NOT NULL,
  "total_amount"   NUMERIC(15, 2) NOT NULL DEFAULT 0,
  "status"         "invoice_status" NOT NULL DEFAULT 'Draft',
  "created_at"     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updated_at"     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create invoice_items table
CREATE TABLE IF NOT EXISTS "invoice_items" (
  "id"          VARCHAR(36) PRIMARY KEY NOT NULL DEFAULT gen_random_uuid()::text,
  "invoice_id"  VARCHAR(36) NOT NULL REFERENCES "invoices"("id") ON DELETE CASCADE,
  "description" VARCHAR(500) NOT NULL,
  "quantity"    INTEGER NOT NULL DEFAULT 1,
  "unit_price"  NUMERIC(15, 2) NOT NULL DEFAULT 0,
  "line_total"  NUMERIC(15, 2) NOT NULL DEFAULT 0
);

-- Index for FK lookups
CREATE INDEX IF NOT EXISTS "invoice_items_invoice_id_idx" ON "invoice_items"("invoice_id");
