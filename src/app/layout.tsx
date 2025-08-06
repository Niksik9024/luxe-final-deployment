

import type {Metadata} from 'next';
import { Playfair_Display, Poppins } from 'next/font/google';
import './globals.css';
import { Footer } from '@/components/shared/Footer';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { Providers } from '@/components/shared/Providers';
import { Header } from '@/components/shared/Header';

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '700'],
  display: 'swap',
})


export const metadata: Metadata = {
  title: 'LUXE',
  description: 'Luxury content platform',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn('antialiased bg-background font-body', poppins.variable, playfair.variable)}>
        <Providers>
            <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-grow">{children}</main>
                <Footer />
            </div>
            <Toaster />
        </Providers>
      </body>
    </html>
  );
}
