import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { z } from 'zod';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

import { getCategories } from '@/data/getCategories';
import { getTransaction } from '@/data/getTransaction';
import { updateTransaction } from '@/data/updateTransaction';

import {
  TransactionForm,
  transactionFormSchema,
} from '@/components/transaction-form';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export const Route = createFileRoute(
  '/_authed/dashboard/transactions/$transactionId/_layout/'
)({
  component: RouteComponent,
  errorComponent: () => {
    return (
      <div className="text-3xl text-muted-foreground">
        Oops! Transaction not found.
      </div>
    );
  },
  loader: async ({ params }) => {
    const { transactionId } = params;
    const [categories, transaction] = await Promise.all([
      getCategories(),
      getTransaction({
        data: { transactionId: Number(transactionId) },
      }),
    ]);

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    return {
      transaction,
      categories,
    };
  },
});

function RouteComponent() {
  const { toast } = useToast();
  const navigate = useNavigate();

  const { transaction, categories } = Route.useLoaderData();
  const { amount, description, categoryId, transactionDate } = transaction;

  const handleSubmit = async (data: z.infer<typeof transactionFormSchema>) => {
    await updateTransaction({
      data: {
        id: transaction.id,
        amount: data.amount,
        transactionDate: format(data.transactionDate, 'yyyy-MM-dd'),
        categoryId: data.categoryId,
        description: data.description,
      },
    });

    toast({
      title: 'Success!',
      description: `Transaction with id ${transaction.id} udapted`,
      className: 'bg-green-500 text-white',
    });

    navigate({
      to: '/dashboard/transactions',
      search: {
        month: data.transactionDate.getMonth() + 1,
        year: data.transactionDate.getFullYear(),
      },
    });
  };

  return (
    <Card className="max-w-screen-md mt-4">
      <CardHeader>
        <CardTitle>Edit Transaction</CardTitle>
      </CardHeader>
      <CardContent>
        <TransactionForm
          categories={categories}
          onSubmit={handleSubmit}
          defaultValues={{
            amount: Number(amount),
            categoryId,
            description,
            transactionType:
              categories.find((category) => category.id === categoryId)?.type ||
              'income',
            transactionDate: new Date(transactionDate),
          }}
        />
      </CardContent>
    </Card>
  );
}
