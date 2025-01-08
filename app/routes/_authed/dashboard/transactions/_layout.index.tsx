import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authed/dashboard/transactions/_layout/',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authed/dashboard/transactions/"!</div>
}
