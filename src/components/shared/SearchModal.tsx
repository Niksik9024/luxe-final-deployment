'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandList } from '@/components/ui/command';
import { getVideos, getGalleries, getModels } from '@/lib/localStorage';
import type { Video, Gallery, Model } from '@/lib/types';
import { FileVideo, ImageIcon, User, Filter, Sparkles, TrendingUp, Crown, Star, Diamond, Clock, Calendar, Hash } from 'lucide-react';
import Image from 'next/image';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { DialogTitle, DialogDescription } from '@/components/ui/dialog';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { Button } from '@/components/ui/button';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Advanced search scoring algorithm
function calculateRelevanceScore(item: any, query: string, type: string): number {
  const queryLower = query.toLowerCase().trim();
  let score = 0;

  // Exact title/name matches get highest priority
  const title = (item.title || item.name || '').toLowerCase();
  if (title === queryLower) score += 100;
  else if (title.startsWith(queryLower)) score += 80;
  else if (title.includes(queryLower)) score += 60;

  // Description matches
  const description = (item.description || '').toLowerCase();
  if (description.includes(queryLower)) score += 30;

  // Keywords and tags (for non-model content)
  if (type !== 'model' && item.keywords) {
    const keywordMatch = item.keywords.some((keyword: string) => 
      keyword.toLowerCase().includes(queryLower)
    );
    if (keywordMatch) score += 40;
  }

  if (type !== 'model' && item.tags) {
    const tagMatch = item.tags.some((tag: string) => 
      tag.toLowerCase().includes(queryLower)
    );
    if (tagMatch) score += 35;
  }

  // Fuzzy matching for typos
  const words = queryLower.split(/\s+/);
  words.forEach(word => {
    if (word.length > 2) {
      const titleWords = title.split(/\s+/);
      const fuzzyMatch = titleWords.some(titleWord => {
        return titleWord.includes(word) || word.includes(titleWord);
      });
      if (fuzzyMatch) score += 15;
    }
  });

  // Boost recent content
  if (type !== 'model' && item.date) {
    const daysSinceCreated = (Date.now() - new Date(item.date).getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceCreated < 30) score += 10;
  }

  // Featured content boost
  if (item.isFeatured) score += 20;

  return score;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const recent = localStorage.getItem('luxury_recent_searches');
      if (recent) {
        setRecentSearches(JSON.parse(recent));
      }
    }
  }, []);

  const saveRecentSearch = (searchQuery: string) => {
    if (typeof window !== 'undefined' || !searchQuery.trim()) return;

    const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('luxury_recent_searches', JSON.stringify(updated));
  };

  const allContent = useMemo(() => {
    const videos = getVideos().filter(v => v.status === 'Published').map(v => ({ ...v, type: 'video' as const }));
    const galleries = getGalleries().filter(g => g.status === 'Published').map(g => ({ ...g, type: 'gallery' as const }));
    const models = getModels().map(m => ({ ...m, type: 'model' as const }));
    return [...videos, ...galleries, ...models];
  }, []);

  const filteredContent = useMemo(() => {
    if (!query.trim()) return [];

    const queryLower = query.toLowerCase();

    // Score and sort results by relevance
    const scored = allContent
      .map(item => ({
        ...item,
        score: calculateRelevanceScore(item, queryLower, item.type)
      }))
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 20);

    return scored;
  }, [query, allContent]);

  const handleSelect = (item: any) => {
    saveRecentSearch(query);

    if (item.type === 'video') {
      router.push(`/videos/${item.id}`);
    } else if (item.type === 'gallery') {
      router.push(`/galleries/${item.id}`);
    } else if (item.type === 'model') {
      router.push(`/models/${item.id}`);
    }
    onClose();
  };

  const handleQuickSearch = (searchTerm: string) => {
    setQuery(searchTerm);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'video': return <FileVideo className="w-4 h-4 text-primary" />;
      case 'gallery': return <ImageIcon className="w-4 h-4 text-accent" />;
      case 'model': return <User className="w-4 h-4 text-secondary" />;
      default: return null;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video': return 'bg-primary/20 text-primary';
      case 'gallery': return 'bg-accent/20 text-accent';
      case 'model': return 'bg-secondary/20 text-secondary';
      default: return 'bg-muted';
    }
  };

  return (
    <CommandDialog open={isOpen} onOpenChange={onClose} className="luxury-modal max-w-2xl">
      <VisuallyHidden.Root>
        <DialogTitle>Luxury Content Search</DialogTitle>
        <DialogDescription>
          Advanced search through our exclusive collection of videos, galleries, and models
        </DialogDescription>
      </VisuallyHidden.Root>

      <div className="flex items-center border-b px-4 py-3 luxury-gradient-border">
        <div className="relative flex-1">
          <Sparkles className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <CommandInput
            placeholder="Search our luxury collection..."
            value={query}
            onValueChange={setQuery}
            className="pl-10 h-12 text-base bg-transparent border-none focus:ring-0 placeholder:text-muted-foreground/70"
          />
        </div>
        {query && (
          <Badge className="ml-2 bg-luxury-gradient text-black font-semibold">
            {filteredContent.length} results
          </Badge>
        )}
      </div>

      <CommandList className="max-h-[500px] overflow-y-auto">
        {query.trim() ? (
          <>
            {filteredContent.length === 0 ? (
              <CommandEmpty className="py-12 text-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center luxury-pulse">
                    <Sparkles className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-lg font-medium mb-2">No results found</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      No content matches "{query}". Try adjusting your search terms.
                    </p>
                    <div className="flex gap-2 justify-center">
                      <Button variant="outline" size="sm" onClick={() => setQuery('fashion')}>
                        Try "fashion"
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setQuery('editorial')}>
                        Try "editorial"
                      </Button>
                    </div>
                  </div>
                </div>
              </CommandEmpty>
            ) : (
              <div className="p-2">
                {['model', 'video', 'gallery'].map(type => {
                  const items = filteredContent.filter(item => item.type === type);
                  if (items.length === 0) return null;

                  return (
                    <CommandGroup key={type} heading={
                      <div className="flex items-center gap-3 px-2 py-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${getTypeColor(type)}`}>
                          {getIcon(type)}
                        </div>
                        <span className="text-sm font-semibold uppercase tracking-wider">
                          {type === 'video' ? 'Premium Videos' : type === 'gallery' ? 'Exclusive Galleries' : 'Elite Models'}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {items.length}
                        </Badge>
                        {items.some(item => item.score > 80) && (
                          <Badge className="text-xs bg-luxury-gradient text-black">
                            <Star className="w-3 h-3 mr-1" />
                            Top Matches
                          </Badge>
                        )}
                      </div>
                    }>
                      {items.map((item: any) => (
                        <CommandItem
                          key={`${item.type}-${item.id}`}
                          onSelect={() => handleSelect(item)}
                          className="flex items-center gap-4 p-4 rounded-xl cursor-pointer hover:bg-muted/60 transition-all duration-300 luxury-fade-in group"
                        >
                          <div className="relative">
                            {item.type === 'model' ? (
                              <Avatar className="w-14 h-14 ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all">
                                <AvatarImage src={item.image} alt={item.name} />
                                <AvatarFallback className="bg-luxury-gradient text-black font-bold">
                                  {item.name?.charAt(0) || 'M'}
                                </AvatarFallback>
                              </Avatar>
                            ) : (
                              <div className="w-14 h-14 relative rounded-lg overflow-hidden ring-2 ring-accent/20 group-hover:ring-accent/40 transition-all">
                                <Image
                                  src={item.image}
                                  alt={item.title || item.name || ''}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                                  sizes="56px"
                                />
                              </div>
                            )}
                            <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-background flex items-center justify-center ${getTypeColor(item.type)}`}>
                              {getIcon(item.type)}
                            </div>
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                                {item.type === 'model' ? item.name : item.title}
                              </p>
                              {item.score > 90 && (
                                <Badge className="bg-luxury-gradient text-black text-xs px-2">
                                  <Crown className="w-3 h-3 mr-1" />
                                  Perfect Match
                                </Badge>
                              )}
                              {item.isFeatured && (
                                <Star className="w-4 h-4 text-primary fill-primary" />
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground truncate mb-2">
                              {item.description}
                            </p>

                            {item.type !== 'model' && (
                              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                {item.date && (
                                  <div className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {new Date(item.date).toLocaleDateString()}
                                  </div>
                                )}
                                {item.keywords && (
                                  <div className="flex items-center gap-1">
                                    <Hash className="w-3 h-3" />
                                    {item.keywords.slice(0, 2).join(', ')}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          <div className="text-right">
                            {item.type === 'video' && item.duration && (
                              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                                <Clock className="w-3 h-3" />
                                {item.duration}m
                              </div>
                            )}
                            <div className="text-xs font-medium text-primary">
                              {Math.round(item.score)}% match
                            </div>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          <div className="p-8 text-center">
            <div className="flex flex-col items-center gap-6">
              <div className="w-24 h-24 bg-luxury-gradient rounded-full flex items-center justify-center luxury-pulse">
                <Sparkles className="w-10 h-10 text-black" />
              </div>

              <div>
                <h3 className="text-xl font-bold mb-2">Discover Luxury Content</h3>
                <p className="text-muted-foreground mb-6 max-w-md">
                  Search through our exclusive collection of premium videos, stunning galleries, and elite models
                </p>
              </div>

              <div className="space-y-4 w-full max-w-md">
                <div>
                  <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Popular Searches
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {['Fashion', 'Portrait', 'Editorial', 'Runway', 'Beauty', 'Couture'].map(term => (
                      <Button 
                        key={term}
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleQuickSearch(term.toLowerCase())}
                        className="justify-start hover:bg-luxury-gradient hover:text-black transition-all"
                      >
                        {term}
                      </Button>
                    ))}
                  </div>
                </div>

                {recentSearches.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Recent Searches
                    </h4>
                    <div className="space-y-1">
                      {recentSearches.slice(0, 3).map((search, idx) => (
                        <Button
                          key={idx}
                          variant="ghost"
                          size="sm"
                          onClick={() => setQuery(search)}
                          className="w-full justify-start text-muted-foreground hover:text-foreground"
                        >
                          <Clock className="w-3 h-3 mr-2" />
                          {search}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </CommandList>
    </CommandDialog>
  );
}