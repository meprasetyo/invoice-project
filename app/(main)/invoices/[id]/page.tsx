import { notFound } from 'next/navigation';
import { invoiceService } from '@/services/invoice.service';
import { InvoiceStatusBadge } from '@/components/invoice-status-badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowLeft, Printer } from 'lucide-react';
import { format } from 'date-fns';
import { InvoiceActions } from './_components/invoice-actions';
import { PrintButton } from './_components/print-button';

interface InvoiceDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: InvoiceDetailPageProps) {
  const { id } = await params;
  try {
    const invoice = await invoiceService.getInvoiceById(id);
    return { title: `${invoice.invoice_number} — Invoice Generator` };
  } catch {
    return { title: 'Invoice Not Found' };
  }
}

export default async function InvoiceDetailPage({
  params,
}: InvoiceDetailPageProps) {
  const { id } = await params;

  let invoice;
  try {
    invoice = await invoiceService.getInvoiceById(id);
  } catch {
    notFound();
  }

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'dd MMMM yyyy');
    } catch {
      return dateStr;
    }
  };

  const formatCurrency = (value: string | number) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(Number(value));

  return (
    <div className="container mx-auto max-w-screen-lg px-4 py-8">
      {/* ── Header ── */}
      <div className="mb-6 flex items-center justify-between gap-3 print:hidden">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="sm">
            <Link href="/">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to Invoices
            </Link>
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <PrintButton />
          <InvoiceActions invoice={invoice} />
        </div>
      </div>

      {/* ── Printable invoice ── */}
      <div id="invoice-print" className="space-y-6">
        {/* Title row */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">INVOICE</h1>
            <p className="mt-1 text-lg font-medium text-muted-foreground">
              {invoice.invoice_number}
            </p>
          </div>
          <InvoiceStatusBadge status={invoice.status} />
        </div>

        <Separator />

        {/* Client + Dates */}
        <div className="grid gap-6 sm:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Bill To
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-semibold text-base">{invoice.client_name}</p>
              <p className="mt-1 text-sm text-muted-foreground whitespace-pre-line">
                {invoice.client_address}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Invoice Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Invoice Number</span>
                <span className="font-medium">{invoice.invoice_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Issue Date</span>
                <span>{formatDate(invoice.issue_date)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Due Date</span>
                <span>{formatDate(invoice.due_date)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <InvoiceStatusBadge status={invoice.status} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Items table */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-center">Qty</TableHead>
                    <TableHead className="text-right">Unit Price</TableHead>
                    <TableHead className="text-right">Line Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoice.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.description}</TableCell>
                      <TableCell className="text-center">
                        {item.quantity}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(item.unit_price)}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(item.line_total)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Totals */}
            <div className="mt-4 flex justify-end">
              <div className="w-full max-w-xs space-y-2">
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>{formatCurrency(invoice.total_amount)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground print:mt-8">
          Generated by Invoice Generator •{' '}
          {format(new Date(invoice.created_at), 'dd MMM yyyy HH:mm')}
        </p>
      </div>
    </div>
  );
}
