import { Badge } from '@/components/ui/badge';
import type { InvoiceStatus } from '@/entity/Invoice';

const statusConfig: Record<
  InvoiceStatus,
  { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }
> = {
  Draft: { label: 'Draft', variant: 'secondary' },
  Sent: { label: 'Sent', variant: 'default' },
  Paid: { label: 'Paid', variant: 'outline' },
  Cancelled: { label: 'Cancelled', variant: 'destructive' },
};

interface InvoiceStatusBadgeProps {
  status: InvoiceStatus;
}

export function InvoiceStatusBadge({ status }: InvoiceStatusBadgeProps) {
  const config = statusConfig[status] ?? statusConfig.Draft;
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
