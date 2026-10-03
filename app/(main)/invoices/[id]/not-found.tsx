import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileX } from 'lucide-react';

export default function InvoiceNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <FileX className="h-16 w-16 text-muted-foreground" />
      <h1 className="text-2xl font-bold">Invoice Not Found</h1>
      <p className="text-muted-foreground">
        The invoice you're looking for doesn't exist or has been deleted.
      </p>
      <Button asChild>
        <Link href="/">Back to Invoices</Link>
      </Button>
    </div>
  );
}
