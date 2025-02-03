import { useState } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { z } from 'zod';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

import { Trash2Icon } from 'lucide-react';

import { getCategories } from '@/data/getCategories';
import { getTransaction } from '@/data/getTransaction';
import { updateTransaction } from '@/data/updateTransaction';
import { deleteTransaction } from '@/data/deleteTransaction';

import {
  TransactionForm,
  transactionFormSchema,
} from '@/components/transaction-form';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

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
  const [deleting, setDeleting] = useState(false);

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

  const handleDeleteConfirm = async () => {
    setDeleting(true);

    await deleteTransaction({
      data: {
        transactionId: transaction.id,
      },
    });

    toast({
      title: 'Success!',
      description: `Transaction with id ${transaction.id} deleted`,
      className: 'bg-green-500 text-white',
    });

    setDeleting(false);

    navigate({
      to: '/dashboard/transactions',
      search: {
        month: Number(transaction.transactionDate.split('-')[1]),
        year: Number(transaction.transactionDate.split('-')[0]),
      },
    });
  };

  return (
    <Card className="max-w-screen-md mt-4">
      <CardHeader>
        <CardTitle className="flex justify-between">
          <span>Edit Transaction</span>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="icon">
                <Trash2Icon />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This transaction will be
                  permanently deleted.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <Button
                  variant="destructive"
                  disabled={deleting}
                  onClick={handleDeleteConfirm}
                >
                  Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardTitle>
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
