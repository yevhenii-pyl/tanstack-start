import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';

export function AllTransactions({
  month,
  year,
}: {
  month: number;
  year: number;
}) {
  const selectedDate = new Date(year, month - 1, 1);

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>{format(selectedDate, 'MMM yyyy')} Transactions</CardTitle>
      </CardHeader>
    </Card>
  );
}
