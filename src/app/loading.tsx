
import { Loader2 } from 'lucide-react';

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-125px)]">
        <Loader2 className="h-16 w-16 text-accent animate-spin" />
    </div>
  )
}
