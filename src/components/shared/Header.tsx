
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, Search, UserCog, X, Film, ImageIcon, Users, LogOut, Heart, History, User, Image as ImageIconLucide, Settings, ShieldCheck, Crown, Diamond } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from '@/components/ui/sheet';
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
  <Link href="/" className="flex items-center gap-2 lg:gap-3 group touch-manipulation">
    <div className="relative">
      <div className="w-8 h-8 lg:w-10 lg:h-10 bg-luxury-gradient rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-luxury transition-all duration-300 group-hover:scale-105">
        <Crown className="h-4 w-4 lg:h-6 lg:w-6 text-black" />
      </div>
      <div className="absolute -top-1 -right-1 w-2 h-2 lg:w-3 lg:h-3 bg-primary rounded-full animate-pulse"></div>
    </div>
    <div className="flex flex-col">
      <span className="font-headline font-black text-lg sm:text-xl lg:text-2xl tracking-wider bg-luxury-gradient bg-clip-text text-transparent">
        LUXE
      </span>
      <span className="hidden lg:block text-[10px] text-muted-foreground font-medium tracking-[0.2em] uppercase -mt-1">
        Premium Collection
      </span>
    </div>
  </Link>
);

const NavLinks = ({ onLinkClick, isMobile = false }: { onLinkClick?: () => void; isMobile?: boolean }) => (
  <nav className={cn(
    "flex items-center text-sm font-medium tracking-wider uppercase",
    isMobile ? "flex-col items-stretch gap-1 w-full" : "flex-row gap-4 xl:gap-8"
  )}>
    {[
      { href: "/models", label: "Models", icon: <Users className="w-5 h-5" /> },
      { href: "/videos", label: "Videos", icon: <Film className="w-5 h-5" /> },
      { href: "/galleries", label: "Galleries", icon: <ImageIcon className="w-5 h-5" /> },
      { href: "/about", label: "About", icon: <Diamond className="w-5 h-5" /> }
    ].map((item) => (
      <Link
        key={item.href}
        href={item.href}
        className={cn(
          "relative group flex items-center transition-all duration-300 touch-manipulation",
          "text-muted-foreground hover:text-primary focus:text-primary",
          isMobile 
            ? "gap-4 py-4 px-6 w-full text-base sm:text-lg font-semibold rounded-xl hover:bg-primary/10 border-l-4 border-transparent hover:border-primary focus:border-primary min-h-[60px]" 
            : "gap-2 py-3 px-3 lg:px-4 rounded-lg hover:bg-primary/5 focus:bg-primary/5 min-h-[44px] before:absolute before:bottom-0 before:left-0 before:w-0 before:h-0.5 before:bg-luxury-gradient before:transition-all before:duration-300 hover:before:w-full focus:before:w-full"
        )}
        onClick={onLinkClick}
      >
        {isMobile && item.icon}
        <span className="relative z-10">{item.label}</span>
        {!isMobile && <div className="absolute inset-0 rounded-lg bg-luxury-gradient opacity-0 group-hover:opacity-10 group-focus:opacity-10 transition-opacity duration-300" />}
      </Link>
    ))}
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
                    <Button variant="ghost" className="relative h-10 w-10 sm:h-12 sm:w-12 rounded-full hover:ring-2 hover:ring-primary/30 transition-all duration-300 touch-manipulation min-h-[44px] min-w-[44px]">
                        <Avatar className="h-10 w-10 sm:h-12 sm:w-12 border-2 border-primary/40 hover:border-primary transition-colors">
                            <AvatarImage src={currentUser.image} alt={currentUser.name} />
                            <AvatarFallback className="bg-luxury-gradient text-black font-bold text-sm sm:text-lg">
                                {currentUser.name?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-primary rounded-full flex items-center justify-center">
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-black rounded-full"></div>
                        </div>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                    className="w-72 bg-card/95 backdrop-blur-xl border-primary/20 shadow-luxury" 
                    align="end" 
                    forceMount
                    sideOffset={8}
                >
                    <DropdownMenuLabel className="font-normal p-4">
                        <div className="flex flex-col space-y-2">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 bg-luxury-gradient rounded-full"></div>
                                <p className="text-sm font-bold text-primary">Premium Member</p>
                            </div>
                            <p className="text-base sm:text-lg font-semibold leading-none truncate">{currentUser.name}</p>
                            <p className="text-sm leading-none text-muted-foreground truncate">{currentUser.email}</p>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-primary/20" />
                    <DropdownMenuGroup>
                        <DropdownMenuItem asChild className="cursor-pointer hover:bg-primary/10 focus:bg-primary/10 py-3 touch-manipulation min-h-[44px]">
                            <Link href="/favorites" className="flex items-center">
                                <Heart className="mr-3 h-5 w-5 text-pink-500" />
                                <span className="font-medium">Favorites</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="cursor-pointer hover:bg-primary/10 focus:bg-primary/10 py-3 touch-manipulation min-h-[44px]">
                            <Link href="/history" className="flex items-center">
                                <History className="mr-3 h-5 w-5 text-blue-500" />
                                <span className="font-medium">Watch History</span>
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator className="bg-primary/20" />
                    <DropdownMenuGroup>
                        <DropdownMenuItem 
                            onSelect={() => setChangeImageOpen(true)} 
                            className="cursor-pointer hover:bg-primary/10 focus:bg-primary/10 py-3 touch-manipulation min-h-[44px]"
                        >
                            <ImageIconLucide className="mr-3 h-5 w-5 text-green-500" />
                            <span className="font-medium">Change Avatar</span>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    {isAdmin && (
                        <>
                            <DropdownMenuSeparator className="bg-primary/20" />
                            <DropdownMenuGroup>
                                <DropdownMenuItem asChild className="cursor-pointer hover:bg-primary/10 focus:bg-primary/10 py-3 touch-manipulation min-h-[44px]">
                                    <Link href="/admin" className="flex items-center">
                                        <ShieldCheck className="mr-3 h-5 w-5 text-primary" />
                                        <span className="font-medium">Admin Panel</span>
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </>
                    )}
                    <DropdownMenuSeparator className="bg-primary/20" />
                    <DropdownMenuItem 
                        onClick={logout} 
                        className="text-red-400 focus:bg-red-500/10 hover:bg-red-500/10 cursor-pointer py-3 touch-manipulation min-h-[44px]"
                    >
                        <LogOut className="mr-3 h-5 w-5" />
                        <span className="font-medium">Sign Out</span>
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
        return <Skeleton className="h-10 w-20 sm:h-12 sm:w-28" />
    }
    
    return (
        <>
            {currentUser ? <UserMenu /> : (
                <Button 
                    onClick={() => setAuthModalOpen(true)} 
                    className="btn-luxury px-4 py-2 sm:px-6 sm:py-3 font-bold tracking-wider hover:shadow-luxury transition-all duration-300 text-sm sm:text-base min-h-[44px] touch-manipulation"
                >
                    <User className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">SIGN IN</span>
                    <span className="sm:hidden">SIGN IN</span>
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
      <header className="sticky top-0 z-50 w-full bg-black/90 backdrop-blur-xl border-b border-primary/20 shadow-luxury">
        <div className="absolute inset-0 bg-luxury-dark-gradient opacity-30"></div>
        <div className="relative container mx-auto flex h-16 sm:h-18 lg:h-20 items-center justify-between px-4 sm:px-6">
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8 xl:gap-12">
            <Logo />
            <NavLinks />
          </div>
          
          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-4 xl:gap-6">
            <Button 
              variant="outline" 
              className="h-10 xl:h-12 px-4 xl:px-6 border-primary/40 hover:border-primary hover:bg-primary/10 transition-all duration-300 group min-h-[44px] touch-manipulation"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="h-4 w-4 xl:h-5 xl:w-5 mr-2 xl:mr-3 text-primary group-hover:scale-110 transition-transform" />
              <span className="font-medium text-sm xl:text-base">Search</span>
              <kbd className="pointer-events-none ml-2 xl:ml-4 inline-flex h-5 xl:h-6 select-none items-center gap-1 rounded-md border border-primary/40 bg-primary/10 px-1.5 xl:px-2 font-mono text-xs font-medium text-primary">
                ⌘K
              </kbd>
            </Button>
            
            {currentUser && (
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/5 border border-primary/20">
                <Switch 
                  id="data-saver-mode" 
                  checked={isDataSaver} 
                  onCheckedChange={toggleDataSaver}
                  className="data-[state=checked]:bg-primary"
                />
                <Label htmlFor="data-saver-mode" className="text-xs font-medium text-primary cursor-pointer whitespace-nowrap">
                  DATA SAVER
                </Label>
              </div>
            )}
            
            <AuthElement />
          </div>

          {/* Mobile Navigation */}
          <div className="flex lg:hidden items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-10 w-10 hover:bg-primary/10 transition-colors touch-manipulation min-h-[44px] min-w-[44px]">
                    <Menu className="h-5 w-5 text-primary" />
                    <span className="sr-only">Open navigation menu</span>
                  </Button>
                </SheetTrigger>
              <SheetContent 
                side="left" 
                className="w-full sm:w-80 bg-black/95 backdrop-blur-xl border-primary/20 p-0"
              >
                <div className="absolute inset-0 bg-luxury-dark-gradient opacity-50"></div>
                <div className="relative h-full flex flex-col">
                  <SheetHeader className="p-6 border-b border-primary/20">
                    <div className="flex items-center justify-between">
                      <SheetTitle asChild>
                        <Logo />
                      </SheetTitle>
                      <SheetClose asChild>
                        <Button variant="ghost" size="icon" className="h-10 w-10 hover:bg-primary/10 touch-manipulation min-h-[44px] min-w-[44px]">
                          <X className="h-6 w-6 text-primary" />
                          <span className="sr-only">Close navigation menu</span>
                        </Button>
                      </SheetClose>
                    </div>
                  </SheetHeader>
                  
                  <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                      <NavLinks onLinkClick={handleCloseMobileMenu} isMobile />
                      
                      {currentUser && (
                        <>
                          <div className="border-t border-primary/30 my-6 pt-6">
                            <h4 className="text-sm font-semibold text-primary uppercase tracking-wider mb-4">Account</h4>
                            <div className="space-y-1">
                              <Link 
                                href="/favorites" 
                                className="flex items-center gap-4 py-4 px-6 text-base sm:text-lg text-muted-foreground hover:text-primary transition-colors rounded-xl hover:bg-primary/10 border-l-4 border-transparent hover:border-primary font-medium touch-manipulation min-h-[60px]"
                                onClick={handleCloseMobileMenu}
                              >
                                <Heart className="h-5 w-5" />
                                Favorites
                              </Link>
                              <Link 
                                href="/history" 
                                className="flex items-center gap-4 py-4 px-6 text-base sm:text-lg text-muted-foreground hover:text-primary transition-colors rounded-xl hover:bg-primary/10 border-l-4 border-transparent hover:border-primary font-medium touch-manipulation min-h-[60px]"
                                onClick={handleCloseMobileMenu}
                              >
                                <History className="h-5 w-5" />
                                Watch History
                              </Link>
                            </div>
                          </div>
                          
                          <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                            <div className="flex items-center justify-between">
                              <Label htmlFor="data-saver-mode-mobile" className="text-base font-medium text-primary">
                                Data Saver Mode
                              </Label>
                              <Switch 
                                id="data-saver-mode-mobile" 
                                checked={isDataSaver} 
                                onCheckedChange={toggleDataSaver}
                                className="data-[state=checked]:bg-primary"
                              />
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <Logo />
            </div>

            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-10 w-10 hover:bg-primary/10 transition-colors group touch-manipulation min-h-[44px] min-w-[44px]"
                onClick={() => setIsSearchOpen(true)}
              >
                <Search className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                <span className="sr-only">Open search</span>
              </Button>
              <AuthElement />
            </div>
          </div>
        </div>
      </header>
      <SearchModal open={isSearchOpen} onOpenChange={setIsSearchOpen} />
    </>
  );
};
