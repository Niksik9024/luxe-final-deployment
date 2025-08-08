
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { getVideos, getGalleries, getModels } from '@/lib/localStorage';
import type { Video, Gallery, Model } from '@/lib/types';
import { FileVideo, ImageIcon, User, Filter, Sparkles, TrendingUp, Crown, Star, Diamond } from 'lucide-react';
import Image from 'next/image';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { DialogTitle, DialogDescription } from '@/components/ui/dialog';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';

interface SearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type SearchResult = (Video | Gallery | Model) & { 
  resultType: 'video' | 'gallery' | 'model';
  relevanceScore: number;
  matchType: 'exact' | 'fuzzy' | 'tag' | 'description';
};

const calculateRelevance = (item: any, query: string, type: 'video' | 'gallery' | 'model'): number => {
  if (!query || query.length < 1) return 0;
  
  const lowerQuery = query.toLowerCase().trim();
  let score = 0;
  
  try {
    if (type === 'model' && item.name?.toLowerCase().includes(lowerQuery)) {
      score += 100;
    } else if ((type === 'video' || type === 'gallery') && item.title?.toLowerCase().includes(lowerQuery)) {
      score += 100;
    }
    
    if (item.keywords && Array.isArray(item.keywords)) {
      if (item.keywords.some((k: string) => k?.toLowerCase().includes(lowerQuery))) {
        score += 80;
      }
    }
    
    if (item.description?.toLowerCase().includes(lowerQuery)) {
      score += 60;
    }
    
    if (type === 'model') {
      if (item.famousFor?.toLowerCase().includes(lowerQuery)) score += 70;
      if (item.instagram?.toLowerCase().includes(lowerQuery)) score += 30;
    }
    
    if (type === 'video' && item.isFeatured) {
      score += 20;
    }
    
    const words = lowerQuery.split(' ').filter(w => w.length > 0);
    words.forEach(word => {
      const itemText = (type === 'model' ? item.name : item.title)?.toLowerCase() || '';
      if (itemText.includes(word)) score += 10;
    });
    
  } catch (error) {
    console.error('Error calculating relevance:', error);
    return 0;
  }
  
  return score;
};

const getMatchType = (item: any, query: string, type: 'video' | 'gallery' | 'model'): SearchResult['matchType'] => {
  if (!query || !item) return 'fuzzy';
  
  try {
    const lowerQuery = query.toLowerCase().trim();
    
    if (type === 'model' && item.name?.toLowerCase() === lowerQuery) return 'exact';
    if ((type === 'video' || type === 'gallery') && item.title?.toLowerCase() === lowerQuery) return 'exact';
    if (item.keywords && Array.isArray(item.keywords) && item.keywords.some((k: string) => k?.toLowerCase() === lowerQuery)) return 'tag';
    if (item.description?.toLowerCase().includes(lowerQuery)) return 'description';
    return 'fuzzy';
  } catch (error) {
    console.error('Error determining match type:', error);
    return 'fuzzy';
  }
};

export function SearchModal({ open, onOpenChange }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();

  const popularSearches = [
    { term: 'Fashion Week', icon: <Crown className="w-3 h-3" /> },
    { term: 'Editorial', icon: <Star className="w-3 h-3" /> },
    { term: 'Luxury', icon: <Diamond className="w-3 h-3" /> },
    { term: 'Haute Couture', icon: <Sparkles className="w-3 h-3" /> },
    { term: 'Runway', icon: <TrendingUp className="w-3 h-3" /> }
  ];

  const searchResults = useMemo(() => {
    if (query.length < 1) return [];
    
    setIsSearching(true);
    
    try {
      const allVideos = getVideos().filter(v => v && v.status === 'Published');
      const allGalleries = getGalleries().filter(g => g && g.status === 'Published');
      const allModels = getModels().filter(m => m);

      const searchableItems: SearchResult[] = [];

      allModels.forEach(model => {
        if (!model) return;
        const relevance = calculateRelevance(model, query, 'model');
        if (relevance > 0) {
          searchableItems.push({
            ...model,
            resultType: 'model',
            relevanceScore: relevance,
            matchType: getMatchType(model, query, 'model')
          });
        }
      });

      allVideos.forEach(video => {
        if (!video) return;
        const relevance = calculateRelevance(video, query, 'video');
        if (relevance > 0) {
          searchableItems.push({
            ...video,
            resultType: 'video',
            relevanceScore: relevance,
            matchType: getMatchType(video, query, 'video')
          });
        }
      });

      allGalleries.forEach(gallery => {
        if (!gallery) return;
        const relevance = calculateRelevance(gallery, query, 'gallery');
        if (relevance > 0) {
          searchableItems.push({
            ...gallery,
            resultType: 'gallery',
            relevanceScore: relevance,
            matchType: getMatchType(gallery, query, 'gallery')
          });
        }
      });

      const sorted = searchableItems
        .sort((a, b) => b.relevanceScore - a.relevanceScore)
        .slice(0, 15);
      
      setTimeout(() => setIsSearching(false), 200);
      return sorted;
    } catch (error) {
      console.error('Search error:', error);
      setIsSearching(false);
      return [];
    }
  }, [query]);

  useEffect(() => {
    setResults(searchResults);
  }, [searchResults]);

  const handleSelect = (url: string) => {
    router.push(url);
    onOpenChange(false);
    setQuery('');
  };

  const handleViewAllResults = () => {
    router.push(`/search?q=${encodeURIComponent(query)}`);
    onOpenChange(false);
    setQuery('');
  };

  const getResultIcon = (type: SearchResult['resultType']) => {
    switch (type) {
      case 'model': return <User className="h-4 w-4" />;
      case 'video': return <FileVideo className="h-4 w-4" />;
      case 'gallery': return <ImageIcon className="h-4 w-4" />;
    }
  };

  const getMatchBadgeStyle = (matchType: SearchResult['matchType']) => {
    switch (matchType) {
      case 'exact': return 'bg-luxury-gradient text-black font-bold border-0';
      case 'tag': return 'bg-gradient-to-r from-purple-500 to-pink-600 text-white border-0';
      case 'description': return 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0';
      default: return 'bg-gradient-to-r from-gray-600 to-gray-700 text-white border-0';
    }
  };

  return (
    <CommandDialog 
      open={open} 
      onOpenChange={onOpenChange}
      className="bg-black/98 backdrop-blur-xl border-2 border-primary/30 shadow-luxury max-w-2xl"
    >
      <VisuallyHidden.Root>
        <DialogTitle>Search Luxury Content</DialogTitle>
        <DialogDescription>
          Search for models, videos, galleries and luxury fashion content
        </DialogDescription>
      </VisuallyHidden.Root>
      
      <div className="relative border-b border-primary/20 bg-luxury-dark-gradient">
        <CommandInput 
          placeholder="Search for luxury content, elite models, premium collections..."
          value={query}
          onValueChange={setQuery}
          className="text-white placeholder:text-gray-400 border-0 bg-transparent text-lg py-8 px-8 focus:placeholder:text-gray-500 transition-colors font-medium"
        />
        
        {isSearching && (
          <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
            <div className="relative">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary/30 border-t-primary"></div>
              <div className="absolute inset-0 animate-ping rounded-full h-6 w-6 border-2 border-primary/20"></div>
            </div>
          </div>
        )}
      </div>
      
      <CommandList className="bg-luxury-dark-gradient backdrop-blur-sm max-h-[400px]">
        <CommandEmpty className="py-16 text-center">
          {query.length > 1 ? (
            <div className="space-y-6">
              <div className="text-gray-300">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-luxury-gradient flex items-center justify-center">
                  <Sparkles className="h-10 w-10 text-black" />
                </div>
                <h3 className="text-xl font-semibold mb-3">No matches found</h3>
                <p className="text-lg mb-2">for "{query}"</p>
                <p className="text-sm text-gray-500 max-w-md mx-auto">
                  Try refining your search terms or explore our curated collections below
                </p>
              </div>
              
              <div className="flex justify-center">
                <button 
                  onClick={handleViewAllResults}
                  className="btn-luxury px-6 py-2 text-sm"
                >
                  Advanced Search
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="text-gray-300">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-luxury-gradient flex items-center justify-center">
                  <Filter className="h-10 w-10 text-black" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Discover Premium Content</h3>
                <p className="text-lg mb-2">Search our exclusive collection</p>
                <p className="text-sm text-gray-500 max-w-md mx-auto">
                  Find models, videos, galleries, and luxury fashion content
                </p>
              </div>
              
              {popularSearches.length > 0 && (
                <div>
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-primary">Popular Searches</span>
                  </div>
                  <div className="flex flex-wrap gap-3 justify-center">
                    {popularSearches.map(({ term, icon }) => (
                      <Badge 
                        key={term}
                        variant="outline" 
                        className="cursor-pointer hover:bg-primary/20 border-primary/40 text-primary/90 hover:text-primary transition-all duration-300 hover:scale-105 px-4 py-2 text-sm font-medium"
                        onClick={() => setQuery(term)}
                      >
                        {icon}
                        <span className="ml-2">{term}</span>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CommandEmpty>
        
        {results.length > 0 && (
          <CommandGroup 
            heading={
              <div className="flex items-center justify-between px-4 py-3 bg-primary/10 border-b border-primary/20">
                <div className="flex items-center gap-2">
                  <Crown className="w-4 h-4 text-primary" />
                  <span className="text-primary font-semibold">Search Results</span>
                </div>
                <button 
                  onClick={handleViewAllResults}
                  className="text-xs text-gray-400 hover:text-primary transition-colors font-medium"
                >
                  View All ({results.length})
                </button>
              </div>
            }
          >
            {results.map(item => {
              const url = item.resultType === 'model' 
                ? `/models/${item.id}` 
                : `/${item.resultType}s/${item.id}`;
              
              return (
                <CommandItem 
                  key={`${item.resultType}-${item.id}`} 
                  onSelect={() => handleSelect(url)}
                  className="px-6 py-4 hover:bg-primary/10 cursor-pointer group transition-all duration-300 border-b border-gray-800/30 last:border-0"
                >
                  <div className="flex items-center space-x-4 w-full">
                    <div className="relative flex-shrink-0">
                      {item.resultType === 'model' ? (
                        <Avatar className="w-14 h-14 border-2 border-primary/40 group-hover:border-primary/70 transition-all duration-300 ring-2 ring-transparent group-hover:ring-primary/20">
                          <AvatarImage src={item.image} className="object-cover" />
                          <AvatarFallback className="bg-luxury-gradient text-black font-semibold">
                            <User className="h-6 w-6" />
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className="relative w-14 h-14 rounded-xl overflow-hidden border-2 border-primary/40 group-hover:border-primary/70 transition-all duration-300">
                          <Image 
                            src={item.image} 
                            alt={item.title || item.name} 
                            width={56} 
                            height={56} 
                            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300" 
                          />
                        </div>
                      )}
                      
                      <div className="absolute -bottom-1 -right-1 bg-luxury-gradient rounded-full p-1.5 border-2 border-black">
                        {getResultIcon(item.resultType)}
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-white truncate group-hover:text-primary transition-colors text-lg">
                          {item.resultType === 'model' ? item.name : item.title}
                        </h4>
                        <Badge 
                          className={`text-xs px-3 py-1 font-semibold ${getMatchBadgeStyle(item.matchType)}`}
                        >
                          {item.matchType === 'exact' ? 'PERFECT' : 
                           item.matchType === 'tag' ? 'TAG' : 
                           item.matchType === 'description' ? 'DESC' : 'MATCH'}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-gray-400 truncate mb-2 leading-relaxed">
                        {item.description || (item.resultType === 'model' ? item.famousFor : 'Premium luxury content')}
                      </p>
                      
                      <div className="flex items-center gap-3 text-xs">
                        <span className="capitalize font-semibold text-primary bg-primary/10 px-2 py-1 rounded-md">
                          {item.resultType}
                        </span>
                        {item.keywords && item.keywords.length > 0 && (
                          <>
                            <Separator orientation="vertical" className="h-4 bg-gray-600" />
                            <span className="truncate text-gray-500">
                              {item.keywords.slice(0, 2).join(', ')}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-luxury-gradient rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
                    </div>
                  </div>
                </CommandItem>
              );
            })}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}
