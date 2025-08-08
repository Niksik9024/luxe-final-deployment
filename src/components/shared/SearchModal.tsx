
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { getVideos, getGalleries, getModels } from '@/lib/localStorage';
import type { Video, Gallery, Model } from '@/lib/types';
import { FileVideo, ImageIcon, User, Filter, Sparkles, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface SearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type SearchResult = (Video | Gallery | Model) & { 
  resultType: 'video' | 'gallery' | 'model';
  relevanceScore: number;
  matchType: 'exact' | 'fuzzy' | 'tag' | 'description';
};

// Advanced search algorithm with fuzzy matching and relevance scoring
const calculateRelevance = (item: any, query: string, type: 'video' | 'gallery' | 'model'): number => {
  const lowerQuery = query.toLowerCase();
  let score = 0;
  
  // Exact matches get highest priority
  if (type === 'model' && item.name?.toLowerCase().includes(lowerQuery)) {
    score += 100;
  } else if ((type === 'video' || type === 'gallery') && item.title?.toLowerCase().includes(lowerQuery)) {
    score += 100;
  }
  
  // Keyword/tag matches
  if (item.keywords?.some((k: string) => k.toLowerCase().includes(lowerQuery))) {
    score += 80;
  }
  
  // Description matches
  if (item.description?.toLowerCase().includes(lowerQuery)) {
    score += 60;
  }
  
  // Fuzzy matching for model attributes
  if (type === 'model') {
    if (item.famousFor?.toLowerCase().includes(lowerQuery)) score += 70;
    if (item.instagram?.toLowerCase().includes(lowerQuery)) score += 30;
  }
  
  // Bonus for featured content
  if (type === 'video' && item.isFeatured) {
    score += 20;
  }
  
  return score;
};

const getMatchType = (item: any, query: string, type: 'video' | 'gallery' | 'model'): SearchResult['matchType'] => {
  const lowerQuery = query.toLowerCase();
  
  if (type === 'model' && item.name?.toLowerCase() === lowerQuery) return 'exact';
  if ((type === 'video' || type === 'gallery') && item.title?.toLowerCase() === lowerQuery) return 'exact';
  if (item.keywords?.some((k: string) => k.toLowerCase() === lowerQuery)) return 'tag';
  if (item.description?.toLowerCase().includes(lowerQuery)) return 'description';
  return 'fuzzy';
};

export function SearchModal({ open, onOpenChange }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();

  // Popular search terms for suggestions
  const popularSearches = ['Fashion Week', 'Editorial', 'Luxury', 'Haute Couture', 'Runway'];

  const searchResults = useMemo(() => {
    if (query.length < 2) return [];
    
    setIsSearching(true);
    
    const allVideos = getVideos().filter(v => v.status === 'Published');
    const allGalleries = getGalleries().filter(g => g.status === 'Published');
    const allModels = getModels();

    const searchableItems: SearchResult[] = [];

    // Process models
    allModels.forEach(model => {
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

    // Process videos
    allVideos.forEach(video => {
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

    // Process galleries
    allGalleries.forEach(gallery => {
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

    // Sort by relevance score and limit results
    const sorted = searchableItems
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 12);
    
    setTimeout(() => setIsSearching(false), 200);
    return sorted;
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

  const getMatchBadgeColor = (matchType: SearchResult['matchType']) => {
    switch (matchType) {
      case 'exact': return 'bg-gradient-to-r from-amber-500 to-yellow-600';
      case 'tag': return 'bg-gradient-to-r from-purple-500 to-pink-600';
      case 'description': return 'bg-gradient-to-r from-blue-500 to-indigo-600';
      default: return 'bg-gradient-to-r from-gray-500 to-gray-600';
    }
  };

  return (
    <CommandDialog 
      open={open} 
      onOpenChange={onOpenChange}
      className="bg-black/95 backdrop-blur-xl border-amber-500/20 shadow-2xl shadow-amber-500/10"
    >
      <div className="relative">
        <CommandInput 
          placeholder="Search for luxury content, models, and collections..."
          value={query}
          onValueChange={setQuery}
          className="text-white placeholder:text-gray-400 border-0 bg-transparent text-lg py-6 px-6"
        />
        
        {isSearching && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-amber-500 border-t-transparent"></div>
          </div>
        )}
      </div>
      
      <CommandList className="bg-black/90 backdrop-blur-sm">
        <CommandEmpty className="py-12 text-center">
          {query.length > 1 ? (
            <div className="space-y-4">
              <div className="text-gray-300">
                <Sparkles className="h-12 w-12 mx-auto mb-4 text-amber-500/60" />
                <p className="text-lg mb-2">No results found for "{query}"</p>
                <p className="text-sm text-gray-500">Try refining your search or explore our collections</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-gray-300">
                <Filter className="h-12 w-12 mx-auto mb-4 text-amber-500/60" />
                <p className="text-lg mb-2">Discover Luxury Content</p>
                <p className="text-sm text-gray-500">Start typing to search our exclusive collection</p>
              </div>
              
              {popularSearches.length > 0 && (
                <div>
                  <p className="text-sm text-gray-400 mb-3 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Popular Searches
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {popularSearches.map(term => (
                      <Badge 
                        key={term}
                        variant="outline" 
                        className="cursor-pointer hover:bg-amber-500/20 border-amber-500/30 text-amber-200 transition-all duration-300 hover:scale-105"
                        onClick={() => setQuery(term)}
                      >
                        {term}
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
              <div className="flex items-center justify-between px-2">
                <span className="text-amber-500 font-medium">Search Results</span>
                <button 
                  onClick={handleViewAllResults}
                  className="text-xs text-gray-400 hover:text-amber-400 transition-colors"
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
                  className="px-4 py-3 hover:bg-amber-500/10 cursor-pointer group transition-all duration-300 border-b border-gray-800/50 last:border-0"
                >
                  <div className="flex items-center space-x-4 w-full">
                    <div className="relative flex-shrink-0">
                      {item.resultType === 'model' ? (
                        <Avatar className="w-12 h-12 border-2 border-amber-500/30 group-hover:border-amber-500/60 transition-all duration-300">
                          <AvatarImage src={item.image} className="object-cover" />
                          <AvatarFallback className="bg-gradient-to-br from-amber-500/20 to-yellow-600/20">
                            <User className="h-6 w-6 text-amber-500" />
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden border-2 border-amber-500/30 group-hover:border-amber-500/60 transition-all duration-300">
                          <Image 
                            src={item.image} 
                            alt={item.title || item.name} 
                            width={48} 
                            height={48} 
                            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300" 
                          />
                        </div>
                      )}
                      
                      <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-full p-1">
                        {getResultIcon(item.resultType)}
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-white truncate group-hover:text-amber-100 transition-colors">
                          {item.resultType === 'model' ? item.name : item.title}
                        </p>
                        <Badge 
                          className={`text-xs px-2 py-0.5 text-white border-0 ${getMatchBadgeColor(item.matchType)}`}
                        >
                          {item.matchType === 'exact' ? 'EXACT' : 
                           item.matchType === 'tag' ? 'TAG' : 
                           item.matchType === 'description' ? 'DESC' : 'MATCH'}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-gray-400 truncate mb-1">
                        {item.description || (item.resultType === 'model' ? item.famousFor : 'Luxury content')}
                      </p>
                      
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="capitalize font-medium text-amber-500/80">
                          {item.resultType}
                        </span>
                        {item.keywords && item.keywords.length > 0 && (
                          <>
                            <Separator orientation="vertical" className="h-3" />
                            <span className="truncate">
                              {item.keywords.slice(0, 2).join(', ')}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center text-xs text-gray-500">
                      <div className="w-2 h-2 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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
