
'use client';

import React, { useState, useEffect } from 'react';
import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { Footer } from '@/components/shared/Footer';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { Providers } from '@/components/shared/Providers';
import { Header } from '@/components/shared/Header';
import LandingPage from '@/components/client/LandingPage';

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

const metadata: Metadata = {
  title: 'LUXE',
  description: 'Luxury content platform',
};

const ACCESS_KEY = 'luxe_access_granted';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isAccessGranted, setIsAccessGranted] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const hasAccess = localStorage.getItem(ACCESS_KEY) === 'true';
    if (hasAccess) {
      setIsAccessGranted(true);
    }
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

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn('antialiased bg-background font-body', inter.variable, playfair.variable)}>
        <Providers>
          {isClient ? (
            isAccessGranted ? AppContent : <LandingPage onAccessGranted={handleAccessGranted} />
          ) : (
            null
          )}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
