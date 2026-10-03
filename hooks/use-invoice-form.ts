import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { createInvoiceSchema, type CreateInvoiceDto } from '@/dtos/invoice.dto';
import { createInvoiceAction } from '@/actions/invoice.action';
import { useAtom } from 'jotai';
import { isCreatingInvoiceAtom } from '@/atoms/invoice.atom';

export function useInvoiceForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useAtom(isCreatingInvoiceAtom);

  const form = useForm<CreateInvoiceDto>({
    resolver: zodResolver(createInvoiceSchema),
    defaultValues: {
      client_name: '',
      client_address: '',
      issue_date: new Date().toISOString().slice(0, 10),
      due_date: '',
      status: 'Draft',
      items: [{ description: '', quantity: 1, unit_price: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items',
  });

  const watchedItems = form.watch('items');

  const subtotals = watchedItems.map(
    (item) => (Number(item.quantity) || 0) * (Number(item.unit_price) || 0),
  );
  const total = subtotals.reduce((sum, v) => sum + v, 0);

  const addItem = () =>
    append({ description: '', quantity: 1, unit_price: 0 });

  const removeItem = (index: number) => {
    if (fields.length > 1) remove(index);
  };

  const onSubmit = async (values: CreateInvoiceDto) => {
    setIsCreating(true);
    try {
      const result = await createInvoiceAction(values);
      if (result.success) {
        toast({
          title: 'Invoice created!',
          description: `Invoice has been saved successfully.`,
        });
        router.push('/');
        router.refresh();
      } else {
        toast({
          title: 'Failed to create invoice',
          description: result.error,
          variant: 'destructive',
        });
      }
    } finally {
      setIsCreating(false);
    }
  };

  const onError = () => {
    toast({
      title: 'Please fix the errors',
      description: 'Some required fields are missing or invalid.',
      variant: 'destructive',
    });
  };

  return {
    form,
    fields,
    addItem,
    removeItem,
    subtotals,
    total,
    isCreating,
    onSubmit,
    onError,
  };
}
