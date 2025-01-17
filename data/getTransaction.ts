import { z } from 'zod';
import { createServerFn } from '@tanstack/start';
import { and, eq } from 'drizzle-orm';

import { db } from '@/db';
import authMiddleware from '@/authMiddleware';
import { transactionsTable } from '@/db/schema';

const schema = z.object({
  transactionId: z.number(),
});

export const getTransaction = createServerFn({
  method: 'GET',
})
  .middleware([authMiddleware])
  .validator((data: z.infer<typeof schema>) => schema.parse(data))
  .handler(async ({ data, context }) => {
    const [transaction] = await db
      .select()
      .from(transactionsTable)
      .where(
        and(
          eq(transactionsTable.id, data.transactionId),
          eq(transactionsTable.userId, context.userId)
        )
      );

    return transaction;
  });
