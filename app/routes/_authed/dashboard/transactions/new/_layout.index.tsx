import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { z } from 'zod';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  TransactionForm,
  transactionFormSchema,
} from '@/components/transaction-form';

import { getCategories } from '@/data/getCategories';
import { createTransaction } from '@/data/createTransaction';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

export const Route = createFileRoute(
  '/_authed/dashboard/transactions/new/_layout/'
)({
  component: RouteComponent,
  loader: async () => {
    const categories = await getCategories();

    return {
      categories,
    };
  },
});

function RouteComponent() {
  const { categories } = Route.useLoaderData();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (data: z.infer<typeof transactionFormSchema>) => {
    const { amount, categoryId, transactionDate, description } = data;

    const transaction = await createTransaction({
      data: {
        amount,
        categoryId,
        transactionDate: format(transactionDate, 'yyyy-MM-dd'),
        description,
      },
    });

    toast({
      title: 'Success!',
      description: 'Transaction created',
      className: 'bg-green-500 text-white',
    });

    navigate({
      to: '/dashboard/transactions',
      search: {
        month: transactionDate.getMonth() + 1,
        year: transactionDate.getFullYear(),
      },
    });
  };

  return (
    <Card className="max-w-screen-md mt-4">
      <CardHeader>
        <CardTitle>New Transaction</CardTitle>
      </CardHeader>
      <CardContent>
        <TransactionForm categories={categories} onSubmit={handleSubmit} />
      </CardContent>
    </Card>
  );
}
