'use client';

import React, { useState, useEffect } from 'react';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { Footer } from '@/components/shared/Footer';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { Providers } from '@/components/shared/Providers';
import { Header } from '@/components/shared/Header';
import LandingPage from '@/components/client/LandingPage';
import { usePathname } from 'next/navigation';
import ErrorBoundary from '@/components/shared/ErrorBoundary';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '700'],
  display: 'swap',
});

const ACCESS_KEY = 'luxe_access_granted';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isAccessGranted, setIsAccessGranted] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsClient(true);
    const hasAccess = localStorage.getItem(ACCESS_KEY) === 'true';
    if (hasAccess) {
      setIsAccessGranted(true);
    }

    // Global error handler for chunk loading errors
    const handleGlobalError = (event: ErrorEvent) => {
      const error = event.error;
      if (error && (error.name === 'ChunkLoadError' || 
          error.message?.includes('Loading chunk') ||
          error.message?.includes('timeout'))) {
        console.log('Chunk loading error detected, reloading...');
        window.location.reload();
      }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const error = event.reason;
      if (error && typeof error === 'object' && 
          (error.name === 'ChunkLoadError' || 
           error.message?.includes('Loading chunk'))) {
        console.log('Chunk loading promise rejection detected, reloading...');
        window.location.reload();
      }
    };

    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  const handleAccessGranted = () => {
    localStorage.setItem(ACCESS_KEY, 'true');
    setIsAccessGranted(true);
  };

  const AppContent = (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </div>
  )

  const bodyClasses = cn(
    'antialiased bg-background font-body',
    inter.variable,
    playfair.variable,
    { 'admin-body': pathname.startsWith('/admin') }
  );

  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={bodyClasses}>
        <ErrorBoundary>
          <Providers>
            {isClient ? (
              isAccessGranted || pathname.startsWith('/admin') ? AppContent : <LandingPage onAccessGranted={handleAccessGranted} />
            ) : (
              // Render a basic skeleton or nothing on the server to avoid flash of unstyled content
              null
            )}
            <Toaster />
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}