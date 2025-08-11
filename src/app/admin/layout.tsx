'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { BarChart, Video as VideoIcon, ImageIcon, Users, PanelLeft, Home, UserCog, Tags, DatabaseZap, Crown, LogOut, BarChart3, Image, CheckCircle, FileText, TestTube, Database } from 'lucide-react';
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
    { href: '/admin/videos', label: 'Videos', icon: VideoIcon },
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
    { href: '/admin/crud-test', label: 'CRUD Test', icon: TestTube },
]

const AdminSidebar = () => {
    const pathname = usePathname();

    return (
        <aside className="hidden md:flex flex-col w-64 bg-card text-card-foreground border-r border-border h-screen sticky top-0 z-20">
            <div className="p-4 border-b border-border flex-shrink-0">
                <Logo />
            </div>
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto min-h-0">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                        'flex items-center p-3 rounded-lg transition-all duration-200 w-full font-medium',
                        pathname === item.href
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground hover:shadow-sm'
                      )}
                    >
                      <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                      <span className="truncate">{item.label}</span>
                  </Link>
                ))}
                {process.env.NODE_ENV === 'development' && (
                    <>
                        <div className="px-3 pt-4 pb-2 text-xs uppercase text-muted-foreground font-semibold tracking-wider">Development Tools</div>
                        {devNavItems.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'flex items-center p-3 rounded-lg transition-all duration-200 w-full font-medium',
                                pathname === item.href
                                  ? 'bg-primary text-primary-foreground shadow-sm'
                                  : 'text-muted-foreground hover:bg-muted hover:text-foreground hover:shadow-sm'
                              )}
                            >
                              <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                              <span className="truncate">{item.label}</span>
                          </Link>
                        ))}
                    </>
                )}
            </nav>
            <div className="p-4 border-t border-border flex-shrink-0">
                 <Link href="/" className="flex items-center p-3 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200 font-medium">
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
    { name: 'Videos', href: '/admin/videos', icon: VideoIcon },
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
        <Button variant="ghost" size="icon" className="md:hidden touch-manipulation h-10 w-10">
          <PanelLeft className="h-5 w-5" />
          <span className="sr-only">Open navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full max-w-xs p-0 flex flex-col bg-card/98 backdrop-blur-xl border-primary/20 z-50">
        <div className="p-4 border-b border-primary/20 flex-shrink-0">
          <Link href="/admin" className="flex items-center gap-3" onClick={handleLinkClick}>
            <div className="relative">
              <div className="w-8 h-8 bg-luxury-gradient rounded-xl flex items-center justify-center shadow-lg">
                <Crown className="h-4 w-4 text-black" />
              </div>
            </div>
            <span className="font-headline font-black text-lg tracking-wider bg-luxury-gradient bg-clip-text text-transparent">
              LUXE
            </span>
          </Link>
        </div>

        <nav className="flex-1 p-3 overflow-y-auto">
          <ul className="space-y-2">
            {navigationItems.map((item) => (
            <li key={item.href}>
                <SheetClose asChild>
                    <Link
                        href={item.href}
                        className={cn(
                            'flex items-center gap-3 py-4 px-4 rounded-xl transition-all duration-300 text-sm font-medium min-h-[56px] touch-manipulation w-full',
                            pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/admin')
                              ? 'bg-primary text-primary-foreground shadow-lg scale-[0.98] border border-primary/20'
                              : 'text-muted-foreground hover:text-primary hover:bg-primary/10 hover:scale-[0.98] active:scale-95'
                        )}
                    >
                        <item.icon className="h-5 w-5 flex-shrink-0" />
                        <span className="truncate font-medium">{item.name}</span>
                    </Link>
                </SheetClose>
            </li>
            ))}
            {process.env.NODE_ENV === 'development' && (
                <>
                    <div className="px-4 pt-6 pb-3 text-xs uppercase text-primary tracking-wider font-bold opacity-80">Development Tools</div>
                    {devNavItems.map((item) => (
                        <li key={item.href}>
                            <SheetClose asChild>
                                <Link
                                    href={item.href}
                                    className={cn(
                                        'flex items-center gap-3 py-4 px-4 rounded-xl transition-all duration-300 text-sm font-medium min-h-[56px] touch-manipulation w-full',
                                        pathname === item.href
                                          ? 'bg-primary text-primary-foreground shadow-lg scale-[0.98] border border-primary/20'
                                          : 'text-muted-foreground hover:text-primary hover:bg-primary/10 hover:scale-[0.98] active:scale-95'
                                    )}
                                >
                                    <item.icon className="h-5 w-5 flex-shrink-0" />
                                    <span className="truncate font-medium">{item.name}</span>
                                </Link>
                            </SheetClose>
                        </li>
                    ))}
                </>
            )}
          </ul>
        </nav>

        <div className="p-4 border-t border-primary/20 flex-shrink-0 safe-area-inset-bottom">
          <SheetClose asChild>
              <Link
                href="/"
                className="flex items-center gap-3 py-4 px-4 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300 text-sm font-medium min-h-[56px] touch-manipulation w-full hover:scale-[0.98] active:scale-95"
              >
                  <Home className="h-5 w-5 flex-shrink-0" />
                  <span className="truncate font-medium">View Site</span>
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
            <header className="sticky top-0 z-40 bg-card/90 backdrop-blur-md border-b border-border flex-shrink-0 md:z-30">
                <div className="flex h-14 md:h-16 items-center justify-between px-3 md:px-4 w-full max-w-full overflow-hidden">
                    <div className="flex items-center min-w-0 gap-2 md:gap-3">
                        <MobileAdminSidebar />
                        <div className="md:hidden">
                          <Logo />
                        </div>
                    </div>
                    <div className="flex items-center space-x-1 md:space-x-4 flex-shrink-0">
                        <Badge variant="secondary" className="bg-luxury-gradient text-black font-semibold text-xs hidden sm:inline-flex">
                            Admin
                        </Badge>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10 hover:text-primary transition-all duration-300 touch-manipulation h-10 w-10">
                                    <UserCog className="h-4 w-4 md:h-5 md:w-5" />
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
            <main className="flex-1 p-3 md:p-6 lg:p-8 admin-content pb-20 md:pb-6 overflow-x-hidden">
              <div className="w-full max-w-full">
                {children}
              </div>
            </main>

            {/* Mobile Bottom Navigation */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-md border-t border-border z-50 safe-area-inset-bottom">
              <div className="grid grid-cols-6 gap-1 p-2">
                <Button variant="ghost" size="sm" asChild className="flex flex-col items-center justify-center p-1.5 min-h-[52px] touch-manipulation rounded-lg">
                  <Link href="/admin" className="text-center w-full">
                    <BarChart3 className="h-4 w-4 mx-auto mb-1 flex-shrink-0" />
                    <span className="text-[9px] leading-tight font-medium">Dashboard</span>
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild className="flex flex-col items-center justify-center p-1.5 min-h-[52px] touch-manipulation rounded-lg">
                  <Link href="/admin/models" className="text-center w-full">
                    <Users className="h-4 w-4 mx-auto mb-1 flex-shrink-0" />
                    <span className="text-[9px] leading-tight font-medium">Models</span>
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild className="flex flex-col items-center justify-center p-1.5 min-h-[52px] touch-manipulation rounded-lg">
                  <Link href="/admin/videos" className="text-center w-full">
                    <VideoIcon className="h-4 w-4 mx-auto mb-1 flex-shrink-0" />
                    <span className="text-[9px] leading-tight font-medium">Videos</span>
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild className="flex flex-col items-center justify-center p-1.5 min-h-[52px] touch-manipulation rounded-lg">
                  <Link href="/admin/galleries" className="text-center w-full">
                    <Image className="h-4 w-4 mx-auto mb-1 flex-shrink-0" />
                    <span className="text-[9px] leading-tight font-medium">Galleries</span>
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild className="flex flex-col items-center justify-center p-1.5 min-h-[52px] touch-manipulation rounded-lg">
                  <Link href="/admin/model-profiles" className="text-center w-full">
                    <Crown className="h-4 w-4 mx-auto mb-1 flex-shrink-0" />
                    <span className="text-[9px] leading-tight font-medium">Profiles</span>
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild className="flex flex-col items-center justify-center p-1.5 min-h-[52px] touch-manipulation rounded-lg">
                  <Link href="/admin/crud-test" className="text-center w-full">
                    <Database className="h-4 w-4 mx-auto mb-1 flex-shrink-0" />
                    <span className="text-[9px] leading-tight font-medium">Test</span>
                  </Link>
                </Button>
              </div>
            </nav>
        </div>
    </div>
  );
}