'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { BarChart, Video, ImageIcon, Users, PanelLeft, Home, UserCog, Tags, DatabaseZap, Crown, LogOut, BarChart3, Image, CheckCircle, FileText, TestTube, Database } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
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
    { href: '/admin/model-profiles', label: 'Model Profiles', icon: Users },
    { href: '/admin/users', label: 'Users', icon: UserCog },
    { href: '/admin/tags', label: 'Tags', icon: Tags },
];

const devNavItems = [
    { href: '/admin/seed', label: 'Seed Data', icon: DatabaseZap },
    { href: '/admin/qa-testing', label: 'QA Testing', icon: CheckCircle },
    { href: '/admin/qa-report', label: 'QA Report', icon: FileText },
]

const AdminSidebar = () => {
    const pathname = usePathname();

    return (
        <aside className="hidden md:flex flex-col w-64 bg-card text-card-foreground border-r border-border h-full">
            <div className="p-4 border-b border-border">
                <Logo />
            </div>
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                        'flex items-center p-2 rounded-md transition-colors w-full',
                        pathname === item.href
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      )}
                    >
                      <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                      <span className="truncate">{item.label}</span>
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
                                'flex items-center p-2 rounded-md transition-colors w-full',
                                pathname === item.href
                                  ? 'bg-primary text-primary-foreground'
                                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                              )}
                            >
                              <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                              <span className="truncate">{item.label}</span>
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
    const [isOpen, setIsOpen] = React.useState(false);

  const navigationItems = [
    { name: 'Dashboard', href: '/admin', icon: BarChart },
    { name: 'Videos', href: '/admin/videos', icon: Video },
    { name: 'Galleries', href: '/admin/galleries', icon: ImageIcon },
    { name: 'Models', href: '/admin/models', icon: Users },
    { name: 'Model Profiles', href: '/admin/model-profiles', icon: Users },
    { name: 'Users', href: '/admin/users', icon: UserCog },
    { name: 'Tags', href: '/admin/tags', icon: Tags },
  ];

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden touch-manipulation">
          <PanelLeft className="h-5 w-5" />
          <span className="sr-only">Open navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full max-w-xs p-0 flex flex-col bg-card/95 backdrop-blur-xl border-primary/20">
        <div className="p-6 border-b border-primary/20 flex-shrink-0">
          <Link href="/admin" className="flex items-center gap-3" onClick={handleLinkClick}>
            <div className="relative">
              <div className="w-8 h-8 bg-luxury-gradient rounded-xl flex items-center justify-center shadow-lg">
                <Crown className="h-4 w-4 text-black" />
              </div>
            </div>
            <span className="font-headline font-black text-xl tracking-wider bg-luxury-gradient bg-clip-text text-transparent">
              LUXE
            </span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <ul className="space-y-1">
            {navigationItems.map((item) => (
            <li key={item.href}>
                <SheetClose asChild>
                    <Link
                        href={item.href}
                        className={cn(
                            'flex items-center gap-3 py-3 px-4 rounded-lg transition-all duration-300 text-sm font-medium min-h-[44px] touch-manipulation w-full',
                            pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/admin')
                              ? 'bg-primary text-primary-foreground border-l-4 border-primary'
                              : 'text-muted-foreground hover:text-primary hover:bg-primary/10 border-l-4 border-transparent hover:border-primary'
                        )}
                    >
                        <item.icon className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{item.name}</span>
                    </Link>
                </SheetClose>
            </li>
            ))}
            {process.env.NODE_ENV === 'development' && (
                <>
                    <div className="px-4 pt-4 pb-2 text-xs uppercase text-primary tracking-wider font-semibold">Development</div>
                    {devNavItems.map((item) => (
                        <li key={item.href}>
                            <SheetClose asChild>
                                <Link
                                    href={item.href}
                                    className={cn(
                                        'flex items-center gap-3 py-3 px-4 rounded-lg transition-all duration-300 text-sm font-medium min-h-[44px] touch-manipulation w-full',
                                        pathname === item.href
                                          ? 'bg-primary text-primary-foreground border-l-4 border-primary'
                                          : 'text-muted-foreground hover:text-primary hover:bg-primary/10 border-l-4 border-transparent hover:border-primary'
                                    )}
                                >
                                    <item.icon className="h-4 w-4 flex-shrink-0" />
                                    <span className="truncate">{item.name}</span>
                                </Link>
                            </SheetClose>
                        </li>
                    ))}
                </>
            )}
          </ul>
        </nav>

        <div className="p-4 border-t border-primary/20 flex-shrink-0">
          <SheetClose asChild>
              <Link
                href="/"
                className="flex items-center gap-3 py-3 px-4 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300 border-l-4 border-transparent hover:border-primary text-sm font-medium min-h-[44px] touch-manipulation w-full"
              >
                  <Home className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">View Site</span>
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
  }, [isAdmin, loading, router]);

  if (loading) {
    return (
        <div className="flex items-center justify-center min-h-screen p-4">
            <div className="space-y-4 w-full max-w-md">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
            </div>
        </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground w-full overflow-x-hidden">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0">
            <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-sm border-b border-border flex-shrink-0">
                <div className="flex h-16 items-center justify-between px-4 w-full max-w-full overflow-hidden">
                    <div className="flex items-center min-w-0">
                        <MobileAdminSidebar />
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
                        <Badge variant="secondary" className="bg-luxury-gradient text-black font-semibold text-xs sm:text-sm hidden sm:inline-flex">
                            Admin Panel
                        </Badge>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10 hover:text-primary transition-all duration-300 touch-manipulation">
                                    <UserCog className="h-5 w-5" />
                                    <span className="sr-only">Open user menu</span>
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

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-6 lg:p-8 admin-content pb-20 md:pb-6">
              {children}
            </main>

            {/* Mobile Navigation */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50 px-2 py-2">
              <div className="flex justify-around items-center">
                <Button variant="ghost" size="sm" asChild className="flex flex-col items-center justify-center p-2 min-h-[60px] touch-manipulation">
                  <Link href="/admin" className="text-center">
                    <BarChart3 className="h-4 w-4 mx-auto mb-1" />
                    <span className="text-[10px] leading-tight">Dashboard</span>
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild className="flex flex-col items-center justify-center p-2 min-h-[60px] touch-manipulation">
                  <Link href="/admin/models" className="text-center">
                    <Users className="h-4 w-4 mx-auto mb-1" />
                    <span className="text-[10px] leading-tight">Models</span>
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild className="flex flex-col items-center justify-center p-2 min-h-[60px] touch-manipulation">
                  <Link href="/admin/videos" className="text-center">
                    <Video className="h-4 w-4 mx-auto mb-1" />
                    <span className="text-[10px] leading-tight">Videos</span>
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild className="flex flex-col items-center justify-center p-2 min-h-[60px] touch-manipulation">
                  <Link href="/admin/galleries" className="text-center">
                    <Image className="h-4 w-4 mx-auto mb-1" />
                    <span className="text-[10px] leading-tight">Galleries</span>
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild className="flex flex-col items-center justify-center p-2 min-h-[60px] touch-manipulation">
                  <Link href="/admin/model-profiles" className="text-center">
                    <Crown className="h-4 w-4 mx-auto mb-1" />
                    <span className="text-[10px] leading-tight">Profiles</span>
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild className="flex flex-col items-center justify-center p-2 min-h-[60px] touch-manipulation">
                  <Link href="/admin/crud-test" className="text-center">
                    <Database className="h-4 w-4 mx-auto mb-1" />
                    <span className="text-[10px] leading-tight">CRUD</span>
                  </Link>
                </Button>
              </div>
            </nav>
        </div>
    </div>
  );
}