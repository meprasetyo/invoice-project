import { invoiceService } from '@/services/invoice.service';
import { InvoiceTable } from './_components/invoice-table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface HomePageProps {
  searchParams: Promise<{ search?: string; page?: string }>;
}

export const metadata = {
  title: 'Invoices — Invoice Generator',
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const search = params.search ?? '';
  const page = Number(params.page ?? 1);

  let result;
  try {
    result = await invoiceService.getInvoices({ search, page, pageSize: 10 });
  } catch {
    result = { data: [], total: 0, page: 1, pageSize: 10, totalPages: 0 };
  }

  return (
    <div className="container mx-auto max-w-screen-xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Invoices</h1>
          <p className="text-sm text-muted-foreground">
            {result.total} invoice{result.total !== 1 ? 's' : ''} total
          </p>
        </div>
        <Button asChild>
          <Link href="/new-invoice">+ Create New Invoice</Link>
        </Button>
      </div>

      <InvoiceTable
        data={result.data}
        total={result.total}
        page={result.page}
        totalPages={result.totalPages}
        search={search}
      />
    </div>
  );
}
