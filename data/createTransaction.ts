import { createServerFn } from '@tanstack/start';
import { addDays } from 'date-fns';
import { z } from 'zod';

import authMiddleware from '@/authMiddleware';
import { db } from '@/db';
import { transactionsTable } from '@/db/schema';

export const transactionSchema = z.object({
  categoryId: z.coerce.number().positive('Please select a category'),
  transactionDate: z.string().refine((value) => {
    const parsedDate = new Date(value);
    return !isNaN(parsedDate.getTime()) && parsedDate <= addDays(new Date(), 1);
  }),
  amount: z.coerce.number().positive('Amount must be greater than 0'),
  description: z
    .string()
    .min(3, 'Description must contain at least three characters')
    .max(300, 'Description must contain a maximum of 300 characters'),
});

export const createTransaction = createServerFn({
  method: 'POST',
})
  .middleware([authMiddleware])
  .validator((data: z.infer<typeof transactionSchema>) =>
    transactionSchema.parse(data)
  )
  .handler(async ({ data, context }) => {
    const userId = context.userId;

    const { amount, description, categoryId, transactionDate } = data;

    const transaction = await db
      .insert(transactionsTable)
      .values({
        userId,
        amount: amount.toString(),
        description,
        categoryId,
        transactionDate,
      })
      .returning();

    return transaction;
  });
