'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  isChunkError?: boolean;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; retry: () => void }>;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Check if this is a chunk loading error
    const isChunkError = error.name === 'ChunkLoadError' || 
                        error.message.includes('Loading chunk') ||
                        error.message.includes('timeout');

    return { hasError: true, error, isChunkError };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);

    // If it's a chunk error, attempt automatic reload after a short delay
    if (error.name === 'ChunkLoadError' || error.message.includes('Loading chunk')) {
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  }

  retry = () => {
    this.setState({ hasError: false, error: undefined, isChunkError: false });
  };

  render() {
    if (this.state.hasError) {
      // Special handling for chunk errors
      if (this.state.isChunkError) {
        return (
          <div className="min-h-screen flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <RefreshCw className="h-12 w-12 text-primary animate-spin" />
                </div>
                <CardTitle>Loading Application...</CardTitle>
                <CardDescription>
                  The application is updating. Please wait while we reload the page.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  If this takes too long, try refreshing manually.
                </p>
                <Button 
                  onClick={() => window.location.reload()}
                  className="w-full"
                >
                  Refresh Now
                </Button>
              </CardContent>
            </Card>
          </div>
        );
      }

      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} retry={this.retry} />;
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <AlertTriangle className="h-12 w-12 text-destructive" />
              </div>
              <CardTitle>Something went wrong</CardTitle>
              <CardDescription>
                An unexpected error occurred. Please try refreshing the page.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button onClick={this.retry} className="w-full mb-2">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.location.reload()}
                className="w-full"
              >
                Refresh Page
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;