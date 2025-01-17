import { asc, eq } from 'drizzle-orm';
import { createServerFn } from '@tanstack/start';

import { db } from '@/db';
import authMiddleware from '@/authMiddleware';
import { transactionsTable } from '@/db/schema';

export const getTransactionYearsRange = createServerFn({
  method: 'GET',
})
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const today = new Date();

    const [earliestTransaction] = await db
      .select()
      .from(transactionsTable)
      .where(eq(transactionsTable.userId, context.userId))
      .orderBy(asc(transactionsTable.transactionDate))
      .limit(1);

    const currentYear = today.getFullYear();

    const earliestYear = earliestTransaction
      ? new Date(earliestTransaction.transactionDate).getFullYear()
      : currentYear;

    const years = Array.from({ length: currentYear - earliestYear + 1 }).map(
      (_, i) => currentYear - i
    );

    return years;
  });
