import { createServerFn } from "@tanstack/start";

import { db } from "@/db";
import { categoriesTable } from "@/db/schema";

export const getCategories = createServerFn({
    method: 'GET',
}).handler(async () => {
    const categories = await db.select().from(categoriesTable);
    return categories;
});