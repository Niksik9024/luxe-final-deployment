

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { BarChart, Video, ImageIcon, Users, PanelLeft, Home, UserCog, Tags, DatabaseZap } from 'lucide-react';
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
    <Link href="/admin" className="flex items-center gap-2 text-foreground">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <span className="font-bold text-xl uppercase font-headline">LUXE CMS</span>
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
            <SheetContent side="left" className="bg-card text-card-foreground p-0 w-3/4">
                <div className="p-4 border-b border-border">
                    <Logo />
                </div>
                <nav className="p-4">
                    <ul className="space-y-2">
                        {navItems.map((item) => (
                        <li key={item.href}>
                            <SheetClose asChild>
                                <Link 
                                    href={item.href}
                                    className={cn(
                                        'flex items-center p-2 rounded-md',
                                        pathname === item.href ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                                    )}
                                >
                                    <item.icon className="mr-3 h-5 w-5" />
                                    {item.label}
                                </Link>
                            </SheetClose>
                        </li>
                        ))}
                        {process.env.NODE_ENV === 'development' && (
                        <>
                            <div className="px-2 pt-4 pb-2 text-xs uppercase text-muted-foreground">Development</div>
                            {devNavItems.map((item) => (
                            <li key={item.href}>
                                <SheetClose asChild>
                                    <Link 
                                        href={item.href}
                                        className={cn(
                                            'flex items-center p-2 rounded-md',
                                            pathname === item.href ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                                        )}
                                    >
                                        <item.icon className="mr-3 h-5 w-5" />
                                        {item.label}
                                    </Link>
                                </SheetClose>
                            </li>
                            ))}
                        </>
                    )}
                    </ul>
                </nav>
                <div className="p-4 border-t border-border absolute bottom-0 w-full">
                    <SheetClose asChild>
                        <Link href="/" className="flex items-center p-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground">
                            <Home className="mr-3 h-5 w-5" />
                            <span>View Site</span>
                        </Link>
                    </SheetClose>
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
    // Add admin-body class to body for admin-specific theme
    document.body.classList.add('admin-body');
    return () => {
        document.body.classList.remove('admin-body');
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
                    <div className="hidden md:block">
                        <h1 className="text-xl font-bold font-headline">Admin Panel</h1>
                    </div>
                </div>
                
                <div className="flex items-center gap-4">
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted">
                            <UserCog className="h-5 w-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 bg-card border-border">
                          <DropdownMenuLabel>{currentUser?.name || 'Admin'}</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>{currentUser?.email}</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={logout} className="cursor-pointer text-destructive focus:bg-destructive focus:text-destructive-foreground">
                            Sign Out
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                </div>
            </div>
            </header>
            <main className="flex-1 p-4 md:p-8 bg-muted/40">
                <div className="container mx-auto">
                    {children}
                </div>
            </main>
        </div>
    </div>
  );
}
