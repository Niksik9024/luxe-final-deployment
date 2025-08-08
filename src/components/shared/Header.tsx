
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, Search, UserCog, X, Film, ImageIcon, Users, LogOut, Heart, History, User, Image as ImageIconLucide, Settings, ShieldCheck, Command } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuGroup } from '../ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Skeleton } from '../ui/skeleton';
import { useAuth } from '@/lib/auth';
import { AuthModal } from './AuthModal';
import { ChangeImageModal } from './ChangeImageModal';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { useDataSaver } from '@/contexts/DataSaverContext';
import { SearchModal } from './SearchModal';

const Logo = () => (
  <Link href="/" className="flex items-center gap-2">
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M12 2L2 7V17L12 22L22 17V7L12 2ZM4 8.236L12 13L20 8.236V16L12 20L4 16V8.236Z" fill="currentColor"/>
    </svg>
    <span className="font-bold text-xl uppercase font-headline">LUXE</span>
  </Link>
);

const NavLinks = ({ onLinkClick }: { onLinkClick?: () => void }) => (
  <nav className="flex flex-col md:flex-row items-start md:items-center gap-6 text-sm font-medium tracking-wider uppercase">
    <Link href="/models" className="text-muted-foreground hover:text-foreground transition-colors" onClick={onLinkClick}>Models</Link>
    <Link href="/videos" className="text-muted-foreground hover:text-foreground transition-colors" onClick={onLinkClick}>Videos</Link>
    <Link href="/galleries" className="text-muted-foreground hover:text-foreground transition-colors" onClick={onLinkClick}>Galleries</Link>
    <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors" onClick={onLinkClick}>About</Link>
  </nav>
);

const UserMenu = () => {
    const { currentUser, isAdmin, logout } = useAuth();
    const [changeImageOpen, setChangeImageOpen] = useState(false);
    
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
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <DropdownMenuItem onSelect={() => setChangeImageOpen(true)} className="cursor-pointer">
                           <ImageIconLucide className="mr-2 h-4 w-4" /> <span>Change Avatar</span>
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
  

export const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { currentUser } = useAuth();
  const { isDataSaver, toggleDataSaver } = useDataSaver();
  
  const handleCloseMobileMenu = () => setIsMobileMenuOpen(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setIsSearchOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return (
    <>
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-sm h-[60px] md:h-[65px] border-b border-border">
      <div className="container mx-auto flex h-full items-center justify-between px-4">
        {/* Desktop View */}
        <div className="hidden md:flex items-center gap-8">
          <Logo />
          <NavLinks />
        </div>
        
        <div className="hidden md:flex items-center gap-4">
            <Button variant="outline" className="h-9" onClick={() => setIsSearchOpen(true)}>
                <Search className="h-4 w-4 mr-2" />
                Search...
                <kbd className="pointer-events-none ml-4 inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                    <span className="text-xs">⌘</span>K
                </kbd>
            </Button>
             {currentUser && (
                <div className="flex items-center gap-2">
                    <Switch id="data-saver-mode" checked={isDataSaver} onCheckedChange={toggleDataSaver} />
                    <Label htmlFor="data-saver-mode" className="text-xs text-muted-foreground">DATA SAVER</Label>
                </div>
            )}
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
                    {currentUser && (
                        <>
                            <Separator />
                            <Link href="/favorites" className="text-muted-foreground hover:text-foreground transition-colors" onClick={handleCloseMobileMenu}>Favorites</Link>
                            <Link href="/history" className="text-muted-foreground hover:text-foreground transition-colors" onClick={handleCloseMobileMenu}>Watch History</Link>
                            <div className="flex items-center justify-between pt-4">
                               <Label htmlFor="data-saver-mode-mobile" className="text-base font-medium tracking-wider uppercase text-muted-foreground">Data Saver</Label>
                               <Switch id="data-saver-mode-mobile" checked={isDataSaver} onCheckedChange={toggleDataSaver} />
                            </div>
                        </>
                    )}
                </div>
             </SheetContent>
           </Sheet>

          <div className="md:hidden"><Logo /></div>

          <div className="flex items-center gap-2">
             <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)}>
                <Search className="h-6 w-6" />
            </Button>
            <div className="md:hidden"><AuthElement/></div>
          </div>
        </div>
      </div>
    </header>
    <SearchModal open={isSearchOpen} onOpenChange={setIsSearchOpen} />
    </>
  );
};
