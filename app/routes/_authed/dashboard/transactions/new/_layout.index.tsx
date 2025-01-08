import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authed/dashboard/transactions/new/_layout/',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authed/dashboard/transactions/new/"!</div>
}
