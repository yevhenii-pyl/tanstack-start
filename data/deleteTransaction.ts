import { createServerFn } from '@tanstack/start';
import { z } from 'zod';
import { and, eq } from 'drizzle-orm';

import authMiddleware from '@/authMiddleware';
import { db } from '@/db';
import { transactionsTable } from '@/db/schema';

const schema = z.object({
  transactionId: z.number(),
});

export const deleteTransaction = createServerFn({
  method: 'POST',
})
  .middleware([authMiddleware])
  .validator((data: z.infer<typeof schema>) => schema.parse(data))
  .handler(async ({ context, data }) => {
    await db
      .delete(transactionsTable)
      .where(
        and(
          eq(transactionsTable.id, data.transactionId),
          eq(transactionsTable.userId, context.userId)
        )
      );
  });
