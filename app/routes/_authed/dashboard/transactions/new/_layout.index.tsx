import { createFileRoute } from '@tanstack/react-router'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TransactionForm } from "@/components/transaction-form";

export const Route = createFileRoute(
  '/_authed/dashboard/transactions/new/_layout/',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Card className="max-w-screen-md mt-4">
      <CardHeader>
        <CardTitle>
          New Transaction
        </CardTitle>
      </CardHeader>
      <CardContent>
        <TransactionForm />
      </CardContent>
    </Card>
  )
}
