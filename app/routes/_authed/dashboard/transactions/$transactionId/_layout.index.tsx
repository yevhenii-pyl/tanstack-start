import { createFileRoute } from '@tanstack/react-router';

import { getCategories } from '@/data/getCategories';

import { TransactionForm } from '@/components/transaction-form';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { getTransaction } from '@/data/getTransaction';

export const Route = createFileRoute(
  '/_authed/dashboard/transactions/$transactionId/_layout/'
)({
  component: RouteComponent,
  loader: async ({ params }) => {
    const { transactionId } = params;
    const [categories, transaction] = await Promise.all([
      getCategories(),
      getTransaction({
        data: { transactionId: Number(transactionId) },
      }),
    ]);

    return {
      transaction,
      categories,
    };
  },
});

function RouteComponent() {
  const { transaction, categories } = Route.useLoaderData();
  const { amount, description, categoryId, transactionDate } = transaction;

  const handleSubmit = async () => {};

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
