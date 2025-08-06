
'use client' // Error components must be Client Components
 
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])
 
  return (
    <div className="container mx-auto py-20 px-4 flex flex-col items-center justify-center text-center min-h-[calc(100vh-125px)]">
        <div className="bg-card border-2 border-destructive/50 p-8 rounded-full mb-6">
            <AlertTriangle className="h-16 w-16 text-destructive" />
        </div>
        <h1 className="text-4xl mb-4">Something went wrong!</h1>
        <p className="text-muted-foreground max-w-md mb-8">
            We're sorry, but an unexpected error occurred. Please try again. If the problem persists, please contact support.
        </p>
        <Button
            onClick={
            // Attempt to recover by trying to re-render the segment
            () => reset()
            }
            size="lg"
            className="bg-accent hover:bg-accent/90"
        >
            Try again
        </Button>
    </div>
  )
}
