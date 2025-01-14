import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

import { AllTransactions } from './-all-transactions';

const today = new Date();

const searchSchema = z.object({
  month: z
    .number()
    .min(1)
    .max(12)
    .catch(today.getMonth() + 1)
    .optional(),
  year: z
    .number()
    .min(today.getFullYear() - 100)
    .max(today.getFullYear())
    .catch(today.getFullYear())
    .optional(),
});

export const Route = createFileRoute(
  '/_authed/dashboard/transactions/_layout/'
)({
  component: RouteComponent,
  validateSearch: searchSchema,
  loaderDeps: ({ search }) => {
    const { year, month } = search;
    const today = new Date();

    return {
      year: year ?? today.getFullYear(),
      month: month ?? today.getMonth() + 1,
    };
  },
  loader: async ({ deps }) => {
    const { year, month } = deps;

    return {
      year,
      month,
    };
  },
});

function RouteComponent() {
  const { year, month } = Route.useLoaderData();

  return <AllTransactions month={month} year={year} />;
}
