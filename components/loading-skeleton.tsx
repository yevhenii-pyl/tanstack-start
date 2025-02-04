import { Skeleton } from './ui/skeleton';

export default function LoadingSkeleton() {
  console.log('!!! LOADING STATE');
  return <Skeleton className="h-40 w-full rounded-lg" />;
}
