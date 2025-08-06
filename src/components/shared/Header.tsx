

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, Search, UserCog, X, Film, ImageIcon, Users, LogOut, Heart, History, User, Image as ImageIconLucide } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { useDataSaver } from '@/contexts/DataSaverContext';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/auth';
import { AuthModal } from '@/components/shared/AuthModal';
import { useRouter } from 'next/navigation';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { ChangeImageModal } from './ChangeImageModal';
import { Skeleton } from '../ui/skeleton';

const Logo = () => (
  <Link href="/" className="flex items-center gap-2">
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M12 2L2 7V17L12 22L22 17V7L12 2ZM4 8.236L12 13L20 8.236V16L12 20L4 16V8.236Z" fill="currentColor"/>
    </svg>
    <span className="font-bold text-xl uppercase">LUXE</span>
  </Link>
);

const NavLinks = ({ isLoggedIn }: { isLoggedIn: boolean }) => (
  <nav className="flex items-center gap-6 text-sm font-medium">
    <Link href="/models" className="text-muted-foreground hover:text-foreground transition-colors">MODELS</Link>
    <Link href="/videos" className="text-muted-foreground hover:text-foreground transition-colors">VIDEOS</Link>
    <Link href="/galleries" className="text-muted-foreground hover:text-foreground transition-colors">GALLERIES</Link>
    {isLoggedIn && (
        <Link href="/favorites" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
            <Heart className="w-4 h-4"/>FAVORITES
        </Link>
    )}
  </nav>
);

const DataSaverToggle = () => {
  const { isDataSaver, toggleDataSaver } = useDataSaver();
  return (
    <div className="flex items-center space-x-2">
      <Switch id="data-saver" checked={isDataSaver} onCheckedChange={toggleDataSaver} />
      <Label htmlFor="data-saver" className="text-muted-foreground text-sm">Data Saver</Label>
    </div>
  );
};


const AuthElement = () => {
    const { currentUser, isAdmin, logout, loading } = useAuth();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isChangeImageModalOpen, setIsChangeImageModalOpen] = useState(false);

    if (loading) {
        return <Skeleton className="h-10 w-24" />;
    }

    if (currentUser) {
        return (
            <>
             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                        <Avatar className="h-10 w-10 border-2 border-transparent hover:border-accent transition-colors">
                            <AvatarImage src={currentUser.image} alt={currentUser.name} />
                            <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-card border-border" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">{currentUser.name}</p>
                            <p className="text-xs leading-none text-muted-foreground">{currentUser.email}</p>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {isAdmin && (
                        <DropdownMenuItem asChild>
                            <Link href="/admin" className="cursor-pointer"><UserCog className="mr-2 h-4 w-4" />Admin Panel</Link>
                        </DropdownMenuItem>
                    )}
                     <DropdownMenuItem asChild>
                       <Link href="/favorites" className="cursor-pointer"><Heart className="mr-2 h-4 w-4" />Favorites</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                       <Link href="/history" className="cursor-pointer"><History className="mr-2 h-4 w-4" />Watch History</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setIsChangeImageModalOpen(true)} className="cursor-pointer">
                        <ImageIconLucide className="mr-2 h-4 w-4" /> Change Picture
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="cursor-pointer text-destructive focus:bg-destructive focus:text-destructive-foreground">
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <ChangeImageModal open={isChangeImageModalOpen} onOpenChange={setIsChangeImageModalOpen} />
           </>
        )
    }

    return (
        <>
            <Button onClick={() => setIsAuthModalOpen(true)} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Sign In
            </Button>
            <AuthModal open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen} />
        </>
    )
}

const SearchBar = ({ onSearch, onBlur }: { onSearch: (query: string) => void, onBlur?: () => void }) => {
    const [query, setQuery] = useState('');
  
    const handleSearch = (e: React.FormEvent) => {
      e.preventDefault();
      if (query.trim()) {
        onSearch(query);
      }
    };
  
    return (
      <form onSubmit={handleSearch} className="w-full max-w-md relative">
        <Input 
          placeholder="Search videos, models, galleries..." 
          className="bg-muted border-border pr-10" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onBlur={onBlur}
          autoFocus
        />
        <Button type="submit" variant="ghost" size="icon" className="absolute right-0 top-0 text-muted-foreground hover:bg-transparent">
          <Search className="h-5 w-5" />
        </Button>
      </form>
    );
  };
  

export const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const { currentUser } = useAuth();
  const router = useRouter();

  const handleSearch = (query: string) => {
    router.push(`/search?q=${encodeURIComponent(query)}`);
    setIsSearchOpen(false);
    setIsMobileSearchOpen(false); // Close mobile search sheet on search
  };


  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-sm h-[60px] md:h-[65px] border-b border-border">
      <div className="container mx-auto flex h-full items-center justify-between px-4">
        {/* Desktop View */}
        <div className="hidden md:flex items-center gap-8">
          <Logo />
        </div>
        <div className="hidden md:flex flex-1 items-center justify-center">
            {isSearchOpen ? (
               <div className="w-full max-w-md relative flex items-center gap-2">
                <SearchBar onSearch={handleSearch} onBlur={() => setIsSearchOpen(false)} />
              </div>
            ) : (
               <NavLinks isLoggedIn={!!currentUser} />
            )}
        </div>
        <div className="hidden md:flex items-center gap-4">
          <DataSaverToggle />
          {!isSearchOpen && (
            <Button variant="ghost" size="icon" className="hover:bg-muted" onClick={() => setIsSearchOpen(true)}>
                <Search className="h-5 w-5" />
            </Button>
          )}
          <AuthElement />
        </div>

        {/* Mobile View */}
        <div className="flex md:hidden items-center justify-between w-full">
           <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                </Button>
            </SheetTrigger>
             <SheetContent side="left" className="bg-card w-full p-0">
                <SheetHeader className="p-4 border-b border-border flex flex-row items-center justify-between">
                    <SheetTitle>
                        <Logo />
                    </SheetTitle>
                    <SheetClose asChild>
                        <Button variant="ghost" size="icon">
                            <X className="h-6 w-6" />
                        </Button>
                    </SheetClose>
                </SheetHeader>
                <div className="flex flex-col h-full">
                    <nav className="flex flex-col p-4 space-y-4 text-lg">
                        <SheetClose asChild><Link href="/models" className="flex items-center gap-4 py-2"><Users />MODELS</Link></SheetClose>
                        <SheetClose asChild><Link href="/videos" className="flex items-center gap-4 py-2"><Film />VIDEOS</Link></SheetClose>
                        <SheetClose asChild><Link href="/galleries" className="flex items-center gap-4 py-2"><ImageIcon />GALLERIES</Link></SheetClose>
                        {currentUser && <>
                            <SheetClose asChild><Link href="/favorites" className="flex items-center gap-4 py-2"><Heart />FAVORITES</Link></SheetClose>
                            <SheetClose asChild><Link href="/history" className="flex items-center gap-4 py-2"><History />WATCH HISTORY</Link></SheetClose>
                        </>}
                    </nav>
                    <Separator />
                    <div className="p-4 space-y-4">
                        <DataSaverToggle />
                    </div>
                </div>
             </SheetContent>
           </Sheet>

          <div className="md:hidden"><Logo /></div>

          <div className="flex items-center gap-2">
            <Sheet open={isMobileSearchOpen} onOpenChange={setIsMobileSearchOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Search className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="top" className="bg-card p-4">
                  <SearchBar onSearch={handleSearch} />
              </SheetContent>
            </Sheet>
            <div className="md:hidden"><AuthElement/></div>
          </div>
        </div>
      </div>
    </header>
  );
};
