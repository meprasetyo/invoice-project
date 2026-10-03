import { invoiceRepository } from '@/repositories/invoice.repository';
import type { CreateInvoiceDto } from '@/dtos/invoice.dto';
import type { InvoiceStatus } from '@/entity/Invoice';

export class InvoiceService {
  async getInvoices(options?: {
    search?: string;
    page?: number;
    pageSize?: number;
  }) {
    return invoiceRepository.findAll(options);
  }

  async getInvoiceById(id: string) {
    const invoice = await invoiceRepository.findById(id);
    if (!invoice) {
      throw new Error(`Invoice with id "${id}" not found`);
    }
    return invoice;
  }

  async createInvoice(dto: CreateInvoiceDto) {
    if (!dto.items || dto.items.length === 0) {
      throw new Error('Invoice must have at least one item');
    }
    return invoiceRepository.create(dto);
  }

  async updateInvoiceStatus(id: string, status: InvoiceStatus) {
    const existing = await invoiceRepository.findById(id);
    if (!existing) {
      throw new Error(`Invoice with id "${id}" not found`);
    }
    return invoiceRepository.updateStatus(id, status);
  }

  async deleteInvoice(id: string) {
    const existing = await invoiceRepository.findById(id);
    if (!existing) {
      throw new Error(`Invoice with id "${id}" not found`);
    }
    return invoiceRepository.delete(id);
  }
}

// Singleton export
export const invoiceService = new InvoiceService();
