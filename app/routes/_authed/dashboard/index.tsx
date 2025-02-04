import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

import { getRecentTransactions } from '@/data/getRecentTransactions';
import { getAnnualCashflow } from '@/data/getAnnualCashflow';

import { RecentTransactions } from './-recent-transactions';
import { getTransactionYearsRange } from '@/data/getTransactionYearsRange';
import { Cashflow } from './-cashflow';
import LoadingSkeleton from '@/components/loading-skeleton';

const today = new Date();

const searchSchema = z.object({
  cfyear: z
    .number()
    .min(today.getFullYear() - 100)
    .max(today.getFullYear())
    .catch(today.getFullYear())
    .optional(),
});

export const Route = createFileRoute('/_authed/dashboard/')({
  validateSearch: searchSchema,
  loaderDeps: ({ search }) => ({
    cfyear: search.cfyear,
  }),
  loader: async ({ deps }) => {
    const [transactions, annualCashflow, yearsRange] = await Promise.all([
      getRecentTransactions(),
      getAnnualCashflow({
        data: {
          year: deps.cfyear ?? today.getFullYear(),
        },
      }),
      getTransactionYearsRange(),
    ]);

    return {
      annualCashflow,
      transactions,
      yearsRange,
      cfyear: deps.cfyear ?? today.getFullYear(),
    };
  },
  wrapInSuspense: true,
  pendingComponent: () => {
    return (
      <div className="max-w-screen-xl mx-auto py-5">
        <h1 className="text-4xl font-semibold pb-5">Dashboard</h1>
        <LoadingSkeleton />
      </div>
    );
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { transactions, annualCashflow, yearsRange, cfyear } =
    Route.useLoaderData();

  return (
    <div className="max-w-screen-xl mx-auto py-5">
      <h1 className="text-4xl font-semibold pb-5">Dashboard</h1>
      <Cashflow
        yearsRange={yearsRange}
        cashflow={annualCashflow}
        year={cfyear}
      />
      <RecentTransactions transactions={transactions} />
    </div>
  );
}
