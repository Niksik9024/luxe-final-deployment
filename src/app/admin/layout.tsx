
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { BarChart, Video, ImageIcon, Users, PanelLeft, Home, UserCog, Tags, DatabaseZap, Crown } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';


const Logo = () => (
    <Link href="/admin" className="flex items-center gap-2 lg:gap-3 group">
      <div className="relative">
        <div className="w-8 h-8 lg:w-10 lg:h-10 bg-luxury-gradient rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-luxury transition-all duration-300 group-hover:scale-105">
          <Crown className="h-4 w-4 lg:h-6 lg:w-6 text-black" />
        </div>
        <div className="absolute -top-1 -right-1 w-2 h-2 lg:w-3 lg:h-3 bg-primary rounded-full animate-pulse"></div>
      </div>
      <div className="flex flex-col">
        <span className="font-headline font-black text-xl lg:text-2xl tracking-wider bg-luxury-gradient bg-clip-text text-transparent">
          LUXE
        </span>
        <span className="hidden lg:block text-[10px] text-muted-foreground font-medium tracking-[0.2em] uppercase -mt-1">
          Admin Panel
        </span>
      </div>
    </Link>
  );
  
const navItems = [
    { href: '/admin', label: 'Dashboard', icon: BarChart },
    { href: '/admin/videos', label: 'Videos', icon: Video },
    { href: '/admin/galleries', label: 'Galleries', icon: ImageIcon },
    { href: '/admin/models', label: 'Models', icon: Users },
    { href: '/admin/users', label: 'Users', icon: UserCog },
    { href: '/admin/tags', label: 'Tags', icon: Tags },
];

const devNavItems = [
    { href: '/admin/seed', label: 'Seed Data', icon: DatabaseZap },
]

const AdminSidebar = () => {
    const pathname = usePathname();
    
    return (
        <aside className="hidden md:flex flex-col w-64 bg-card text-card-foreground border-r border-border">
            <div className="p-4 border-b border-border">
                <Logo />
            </div>
            <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => (
                  <Link 
                    key={item.href} 
                    href={item.href} 
                    className={cn(
                        'flex items-center p-2 rounded-md transition-colors',
                        pathname === item.href
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      )}
                    >
                      <item.icon className="mr-3 h-5 w-5" />
                      <span>{item.label}</span>
                  </Link>
                ))}
                {process.env.NODE_ENV === 'development' && (
                    <>
                        <div className="px-2 pt-4 pb-2 text-xs uppercase text-muted-foreground">Development</div>
                        {devNavItems.map((item) => (
                          <Link 
                            key={item.href} 
                            href={item.href} 
                            className={cn(
                                'flex items-center p-2 rounded-md transition-colors',
                                pathname === item.href
                                  ? 'bg-primary text-primary-foreground'
                                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                              )}
                            >
                              <item.icon className="mr-3 h-5 w-5" />
                              <span>{item.label}</span>
                          </Link>
                        ))}
                    </>
                )}
            </nav>
            <div className="p-4 border-t border-border">
                 <Link href="/" className="flex items-center p-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground">
                    <Home className="mr-3 h-5 w-5" />
                    <span>View Site</span>
                </Link>
            </div>
        </aside>
    );
};
  

const MobileAdminSidebar = () => {
    const pathname = usePathname();
  
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <PanelLeft />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-black/95 backdrop-blur-xl border-primary/20 p-0 w-4/5">
                <div className="absolute inset-0 bg-luxury-dark-gradient opacity-50"></div>
                <div className="relative">
                  <div className="p-6 border-b border-primary/20">
                      <Logo />
                  </div>
                  <nav className="p-6">
                      <ul className="space-y-2">
                        {navItems.map((item) => (
                        <li key={item.href}>
                            <SheetClose asChild>
                                <Link 
                                    href={item.href}
                                    className={cn(
                                        'flex items-center gap-4 py-4 px-6 rounded-xl transition-all duration-300 text-lg font-medium',
                                        pathname === item.href 
                                          ? 'bg-primary text-primary-foreground border-l-4 border-primary' 
                                          : 'text-muted-foreground hover:text-primary hover:bg-primary/10 border-l-4 border-transparent hover:border-primary'
                                    )}
                                >
                                    <item.icon className="h-5 w-5" />
                                    {item.label}
                                </Link>
                            </SheetClose>
                        </li>
                        ))}
                        {process.env.NODE_ENV === 'development' && (
                        <>
                            <div className="px-6 pt-6 pb-3 text-xs uppercase text-primary tracking-wider font-semibold">Development</div>
                            {devNavItems.map((item) => (
                            <li key={item.href}>
                                <SheetClose asChild>
                                    <Link 
                                        href={item.href}
                                        className={cn(
                                            'flex items-center gap-4 py-4 px-6 rounded-xl transition-all duration-300 text-lg font-medium',
                                            pathname === item.href 
                                              ? 'bg-primary text-primary-foreground border-l-4 border-primary' 
                                              : 'text-muted-foreground hover:text-primary hover:bg-primary/10 border-l-4 border-transparent hover:border-primary'
                                        )}
                                    >
                                        <item.icon className="h-5 w-5" />
                                        {item.label}
                                    </Link>
                                </SheetClose>
                            </li>
                            ))}
                        </>
                    )}
                    </ul>
                  </nav>
                  <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-primary/20">
                      <SheetClose asChild>
                          <Link href="/" className="flex items-center gap-4 py-4 px-6 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300 border-l-4 border-transparent hover:border-primary text-lg font-medium">
                              <Home className="h-5 w-5" />
                              <span>View Site</span>
                          </Link>
                    </SheetClose>
                  </div>
                </div>
            </SheetContent>
        </Sheet>
    );
  };


export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { currentUser, isAdmin, loading, logout } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!loading && !isAdmin) {
      router.push('/');
    }
  }, [isAdmin, loading, router]);

  if (loading) {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="space-y-4 w-full max-w-md">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
            </div>
        </div>
    );
  }

  if (!isAdmin) {
    return null; // or a more friendly "access denied" page
  }
  
  return (
    <div className="flex min-h-screen bg-background text-foreground">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
            <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-sm border-b border-border">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
                <div className="flex items-center">
                    <MobileAdminSidebar />
                </div>
                
                <div className="flex items-center gap-4">
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10 hover:text-primary transition-all duration-300">
                            <UserCog className="h-5 w-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 bg-card/95 backdrop-blur-xl border-primary/20 shadow-luxury">
                          <DropdownMenuLabel className="text-primary font-semibold">{currentUser?.name || 'Admin'}</DropdownMenuLabel>
                          <DropdownMenuSeparator className="bg-primary/20" />
                          <DropdownMenuItem className="text-muted-foreground">{currentUser?.email}</DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-primary/20" />
                          <DropdownMenuItem onClick={logout} className="cursor-pointer text-destructive focus:bg-destructive/10 hover:bg-destructive/10 focus:text-destructive">
                            Sign Out
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                </div>
            </div>
            </header>
            <main className="flex-1 p-4 md:p-8 bg-muted/40 w-full max-w-full overflow-x-hidden">
                <div className="container mx-auto w-full max-w-full">
                    {children}
                </div>
            </main>
        </div>
    </div>
  );
}
