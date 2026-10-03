import { atom } from 'jotai';
import type { InvoiceListDto } from '@/dtos/invoice.dto';

// Search term for the invoice list
export const invoiceSearchAtom = atom<string>('');

// Currently selected invoice id (for highlighting)
export const selectedInvoiceIdAtom = atom<string | null>(null);

// Optimistic loading state for create action
export const isCreatingInvoiceAtom = atom<boolean>(false);
