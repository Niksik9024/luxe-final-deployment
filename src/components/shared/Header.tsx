
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, Search, UserCog, X, Film, ImageIcon, Users, LogOut, Heart, History, User, Image as ImageIconLucide, Settings, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuGroup } from '../ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Skeleton } from '../ui/skeleton';
import { useAuth } from '@/lib/auth';
import { AuthModal } from './AuthModal';
import { ChangeImageModal } from './ChangeImageModal';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { useDataSaver } from '@/contexts/DataSaverContext';

const Logo = () => (
  <Link href="/" className="flex items-center gap-2">
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M12 2L2 7V17L12 22L22 17V7L12 2ZM4 8.236L12 13L20 8.236V16L12 20L4 16V8.236Z" fill="currentColor"/>
    </svg>
    <span className="font-bold text-xl uppercase font-headline">LUXE</span>
  </Link>
);

const NavLinks = ({ onLinkClick }: { onLinkClick?: () => void }) => (
  <nav className="flex flex-col md:flex-row items-start md:items-center gap-6 text-sm font-medium tracking-wider">
    <Link href="/models" className="text-muted-foreground hover:text-foreground transition-colors" onClick={onLinkClick}>MODELS</Link>
    <Link href="/videos" className="text-muted-foreground hover:text-foreground transition-colors" onClick={onLinkClick}>VIDEOS</Link>
    <Link href="/galleries" className="text-muted-foreground hover:text-foreground transition-colors" onClick={onLinkClick}>GALLERIES</Link>
  </nav>
);

const UserMenu = () => {
    const { currentUser, isAdmin, logout } = useAuth();
    const [changeImageOpen, setChangeImageOpen] = useState(false);
    const { isDataSaver, toggleDataSaver } = useDataSaver();

    if (!currentUser) return null;

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src={currentUser.image} alt={currentUser.name} />
                            <AvatarFallback>{currentUser.name?.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 bg-card border-border" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">{currentUser.name}</p>
                            <p className="text-xs leading-none text-muted-foreground">{currentUser.email}</p>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <DropdownMenuItem asChild className="cursor-pointer">
                            <Link href="/favorites"><Heart className="mr-2 h-4 w-4" /><span>Favorites</span></Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="cursor-pointer">
                            <Link href="/history"><History className="mr-2 h-4 w-4" /><span>Watch History</span></Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => setChangeImageOpen(true)} className="cursor-pointer">
                           <ImageIconLucide className="mr-2 h-4 w-4" /> <span>Change Avatar</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="flex items-center justify-between cursor-pointer">
                             <Label htmlFor="data-saver-mode" className="flex items-center gap-2"><Settings className="h-4 w-4"/> <span>Data Saver</span></Label>
                             <Switch id="data-saver-mode" checked={isDataSaver} onCheckedChange={toggleDataSaver} />
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                     {isAdmin && (
                        <>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem asChild className="cursor-pointer">
                                <Link href="/admin"><UserCog className="mr-2 h-4 w-4" /><span>Admin Panel</span></Link>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="text-destructive focus:bg-destructive focus:text-destructive-foreground cursor-pointer">
                       <LogOut className="mr-2 h-4 w-4" /> Sign Out
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <ChangeImageModal open={changeImageOpen} onOpenChange={setChangeImageOpen} />
        </>
    )
}

const AuthElement = () => {
    const { currentUser, loading } = useAuth();
    const [authModalOpen, setAuthModalOpen] = useState(false);

    if (loading) {
        return <Skeleton className="h-10 w-24" />
    }
    
    return (
        <>
            {currentUser ? <UserMenu /> : (
                <Button onClick={() => setAuthModalOpen(true)} variant="outline">
                    Sign In
                </Button>
            )}
            <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
        </>
    )
}

const SearchBar = ({ onSearch, onBlur }: { onSearch: (query: string) => void, onBlur?: () => void }) => {
    const [query, setQuery] = useState('');
  
    const handleSearch = (e: React.FormEvent) => {
      e.preventDefault();
      onSearch(query);
    };
  
    return (
      <form onSubmit={handleSearch} className="w-full max-w-md relative">
        <Input 
          placeholder="Search..." 
          className="bg-muted border-border pr-10" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onBlur={onBlur}
        />
        <Button type="submit" variant="ghost" size="icon" className="absolute right-0 top-0 text-muted-foreground hover:bg-transparent">
          <Search className="h-5 w-5" />
        </Button>
      </form>
    );
  };
  

export const Header = () => {
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  const handleSearch = (query: string) => {
    router.push(`/search?q=${encodeURIComponent(query)}`);
    setIsMobileSearchOpen(false);
  };
  
  const handleCloseMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-sm h-[60px] md:h-[65px] border-b border-border">
      <div className="container mx-auto flex h-full items-center justify-between px-4">
        {/* Desktop View */}
        <div className="hidden md:flex items-center gap-8">
          <Logo />
          <NavLinks />
        </div>
        
        <div className="hidden md:flex items-center gap-4">
            <div className="w-full max-w-xs">
                <SearchBar onSearch={handleSearch} />
            </div>
            <AuthElement />
        </div>

        {/* Mobile View */}
        <div className="flex md:hidden items-center justify-between w-full">
           <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
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
                <div className="flex flex-col h-full p-4 space-y-4 text-lg">
                    <NavLinks onLinkClick={handleCloseMobileMenu} />
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
