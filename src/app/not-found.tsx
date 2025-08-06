
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="container mx-auto py-20 px-4 flex flex-col items-center justify-center text-center min-h-[calc(100vh-125px)]">
        <div className="bg-card border border-border p-8 rounded-full mb-6">
            <Search className="h-16 w-16 text-accent" />
        </div>
        <h1 className="text-4xl mb-4">404 - Page Not Found</h1>
        <p className="text-muted-foreground max-w-md mb-8">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
            <Link href="/">Return to Homepage</Link>
        </Button>
    </div>
  )
}
