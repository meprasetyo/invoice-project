import { CreateInvoiceForm } from './_components/create-invoice-form';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Create Invoice — Invoice Generator',
};

export default function NewInvoicePage() {
  return (
    <div className="container mx-auto max-w-screen-lg px-4 py-8">
      <div className="mb-6 flex items-center gap-3">
        <Button asChild variant="ghost" size="sm">
          <Link href="/">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Create New Invoice
          </h1>
          <p className="text-sm text-muted-foreground">
            Fill in the details below to generate a new invoice
          </p>
        </div>
      </div>

      <CreateInvoiceForm />
    </div>
  );
}
