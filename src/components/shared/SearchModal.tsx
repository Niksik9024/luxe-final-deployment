'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { getVideos, getGalleries, getModels } from '@/lib/localStorage';
import type { Video, Gallery, Model } from '@/lib/types';
import { FileVideo, ImageIcon, User, Filter, Sparkles, TrendingUp, Crown, Star, Diamond, Search, ArrowDown, ArrowUp, CornerDownLeft, X } from 'lucide-react';
import Image from 'next/image';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import debounce from 'lodash.debounce';

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
    const title = item?.title || '';
    const name = item?.name || '';
    const description = item?.description || '';
    const keywords = Array.isArray(item?.keywords) ? item.keywords : [];
    const famousFor = item?.famousFor || '';
    const instagram = item?.instagram || '';

    // Primary matches (highest score)
    if (type === 'model' && name.toLowerCase().includes(lowerQuery)) {
      score += 100;
    } else if ((type === 'video' || type === 'gallery') && title.toLowerCase().includes(lowerQuery)) {
      score += 100;
    }

    // Keyword matches
    if (keywords.length > 0) {
      const keywordMatch = keywords.some((k: string) => {
        return k && typeof k === 'string' && k.toLowerCase().includes(lowerQuery);
      });
      if (keywordMatch) score += 80;
    }

    // Description matches
    if (description && description.toLowerCase().includes(lowerQuery)) {
      score += 60;
    }

    // Model-specific matches
    if (type === 'model') {
      if (famousFor && famousFor.toLowerCase().includes(lowerQuery)) score += 70;
      if (instagram && instagram.toLowerCase().includes(lowerQuery)) score += 30;
    }

    // Featured content bonus
    if (type === 'video' && item?.isFeatured) {
      score += 20;
    }

    // Word-based matching
    const words = lowerQuery.split(' ').filter(w => w.length > 0);
    words.forEach(word => {
      const itemText = (type === 'model' ? name : title).toLowerCase();
      if (itemText.includes(word)) score += 10;
    });

  } catch (error) {
    console.error('Error calculating relevance for item:', item?.id, error);
    return 0;
  }

  return score;
};

const getMatchType = (item: any, query: string, type: 'video' | 'gallery' | 'model'): SearchResult['matchType'] => {
  if (!query || !item) return 'fuzzy';

  try {
    const lowerQuery = query.toLowerCase().trim();
    const title = item?.title || '';
    const name = item?.name || '';
    const keywords = Array.isArray(item?.keywords) ? item.keywords : [];
    const description = item?.description || '';

    // Exact matches
    if (type === 'model' && name.toLowerCase() === lowerQuery) return 'exact';
    if ((type === 'video' || type === 'gallery') && title.toLowerCase() === lowerQuery) return 'exact';

    // Keyword matches
    if (keywords.some((k: string) => k && k.toLowerCase() === lowerQuery)) return 'tag';

    // Description matches
    if (description && description.toLowerCase().includes(lowerQuery)) return 'description';

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
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showResults, setShowResults] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  const popularSearches = [
    { term: 'Fashion Week', icon: <Crown className="w-3 h-3" /> },
    { term: 'Editorial', icon: <Star className="w-3 h-3" /> },
    { term: 'Luxury', icon: <Diamond className="w-3 h-3" /> },
    { term: 'Haute Couture', icon: <Sparkles className="w-3 h-3" /> },
    { term: 'Runway', icon: <TrendingUp className="w-3 h-3" /> }
  ];

  // Debounced search function
  const performSearch = useCallback((searchQuery: string) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      if (searchQuery.length < 1) {
        setResults([]);
        setShowResults(false);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      setShowResults(true);

      try {
        const allVideos = (getVideos() || []).filter(v => v && v.id && v.status === 'Published');
        const allGalleries = (getGalleries() || []).filter(g => g && g.id && g.status === 'Published');
        const allModels = (getModels() || []).filter(m => m && m.id);

        const searchableItems: SearchResult[] = [];

        // Process models safely
        allModels.forEach(model => {
          if (!model || !model.id) return;
          try {
            const relevance = calculateRelevance(model, searchQuery, 'model');
            if (relevance > 0) {
              searchableItems.push({
                ...model,
                resultType: 'model',
                relevanceScore: relevance,
                matchType: getMatchType(model, searchQuery, 'model')
              });
            }
          } catch (error) {
            console.error('Error processing model:', model.id, error);
          }
        });

        // Process videos safely
        allVideos.forEach(video => {
          if (!video || !video.id) return;
          try {
            const relevance = calculateRelevance(video, searchQuery, 'video');
            if (relevance > 0) {
              searchableItems.push({
                ...video,
                resultType: 'video',
                relevanceScore: relevance,
                matchType: getMatchType(video, searchQuery, 'video')
              });
            }
          } catch (error) {
            console.error('Error processing video:', video.id, error);
          }
        });

        // Process galleries safely
        allGalleries.forEach(gallery => {
          if (!gallery || !gallery.id) return;
          try {
            const relevance = calculateRelevance(gallery, searchQuery, 'gallery');
            if (relevance > 0) {
              searchableItems.push({
                ...gallery,
                resultType: 'gallery',
                relevanceScore: relevance,
                matchType: getMatchType(gallery, searchQuery, 'gallery')
              });
            }
          } catch (error) {
            console.error('Error processing gallery:', gallery.id, error);
          }
        });

        const sorted = searchableItems
          .sort((a, b) => b.relevanceScore - a.relevanceScore)
          .slice(0, 8); // Limit to 8 results for better UX

        setResults(sorted);
        setSelectedIndex(-1);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300); // 300ms debounce
  }, []);

  // Handle input change with debounced search
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    performSearch(value);
  }, [performSearch]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!showResults || results.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < results.length) {
          const selectedResult = results[selectedIndex];
          handleSelect(selectedResult);
        }
        break;
      case 'Escape':
        e.preventDefault();
        handleClose();
        break;
    }
  }, [showResults, results, selectedIndex]);

  const handleSelect = useCallback((result: SearchResult) => {
    const url = result.resultType === 'model' 
      ? `/models/${result.id}` 
      : `/${result.resultType}s/${result.id}`;

    router.push(url);
    handleClose();
  }, [router]);

  const handleClose = useCallback(() => {
    onOpenChange(false);
    setQuery('');
    setResults([]);
    setShowResults(false);
    setSelectedIndex(-1);
    setIsSearching(false);
  }, [onOpenChange]);

  const handlePopularSearch = useCallback((term: string) => {
    setQuery(term);
    performSearch(term);
    inputRef.current?.focus();
  }, [performSearch]);

  // Focus input when modal opens
  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[96vw] max-w-2xl h-[90vh] max-h-[700px] p-0 gap-0 flex flex-col top-[5%] translate-y-0 max-sm:top-4">
        <DialogTitle className="sr-only">Search</DialogTitle>
        <div className="relative border-b border-primary/20 bg-luxury-dark-gradient flex-shrink-0">
          <div className="flex items-center px-4 sm:px-6 py-3 sm:py-4 gap-3">
            <Search className="h-5 w-5 text-primary flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search luxury content, models..."
              value={query}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent text-white placeholder:text-gray-400 border-0 outline-none text-base sm:text-lg font-medium min-w-0"
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
            />

            {/* Search Status */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              {isSearching && (
                <div className="flex items-center gap-2 text-primary">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary/30 border-t-primary"></div>
                  <span className="text-sm hidden sm:inline">Searching...</span>
                </div>
              )}

              {/* Keyboard Hints */}
              {showResults && results.length > 0 && (
                <div className="hidden lg:flex items-center gap-2 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <ArrowUp className="h-3 w-3" />
                    <ArrowDown className="h-3 w-3" />
                    <span>navigate</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CornerDownLeft className="h-3 w-3" />
                    <span>select</span>
                  </div>
                </div>
              )}

              <button
                onClick={handleClose}
                className="p-1.5 hover:bg-primary/10 rounded-md transition-colors touch-manipulation"
              >
                <X className="h-4 w-4 text-gray-400 hover:text-primary" />
              </button>
            </div>
          </div>
        </div>

        {/* Results Container */}
        <div 
          ref={resultsRef}
          className="flex-1 overflow-hidden min-h-0"
        >
          <div className="h-full overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-primary/30">
            {/* Show popular searches when no query */}
            {!query && !showResults && (
              <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                <div className="text-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 rounded-full bg-luxury-gradient flex items-center justify-center">
                    <Filter className="h-6 w-6 sm:h-8 sm:w-8 text-black" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-2 text-white">Discover Premium Content</h3>
                  <p className="text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base px-2">
                    Search our exclusive collection of models, videos, and galleries
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-primary">Popular Searches</span>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center px-2">
                    {popularSearches.map(({ term, icon }) => (
                      <button
                        key={term}
                        onClick={() => handlePopularSearch(term)}
                        className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-primary/10 hover:bg-primary/20 border border-primary/40 rounded-lg text-primary/90 hover:text-primary transition-all duration-300 hover:scale-105 text-xs sm:text-sm font-medium touch-manipulation"
                      >
                        {icon}
                        <span>{term}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* No results */}
            {showResults && !isSearching && results.length === 0 && query && (
              <div className="p-4 sm:p-6 text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 rounded-full bg-luxury-gradient flex items-center justify-center">
                  <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-black" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold mb-2 text-white">No matches found</h3>
                <p className="text-gray-400 mb-4 text-sm">
                  for "{query}"
                </p>
                <p className="text-xs sm:text-sm text-gray-500">
                  Try refining your search terms or explore our collections
                </p>
              </div>
            )}

            {/* Search Results */}
            {showResults && results.length > 0 && (
              <div>
                <div className="px-3 sm:px-4 py-2 border-b border-primary/20 flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <Crown className="w-4 h-4 text-primary" />
                    <span className="text-primary font-semibold text-sm">Search Results</span>
                    <Badge className="bg-primary/20 text-primary border-0 text-xs">
                      {results.length}
                    </Badge>
                  </div>
                </div>

                <div className="overflow-y-auto">
                  {results.map((item, index) => {
                    const isSelected = index === selectedIndex;

                    return (
                      <button
                        key={`${item.resultType}-${item.id}-${index}`}
                        onClick={() => handleSelect(item)}
                        className={`w-full px-3 sm:px-4 py-3 text-left hover:bg-primary/10 transition-all duration-200 border-b border-gray-800/30 last:border-0 touch-manipulation ${
                          isSelected ? 'bg-primary/15 border-primary/30' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3 w-full min-w-0">
                          <div className="relative flex-shrink-0">
                            {item.resultType === 'model' ? (
                              <Avatar className="w-10 h-10 sm:w-12 sm:h-12 border-2 border-primary/40">
                                <AvatarImage 
                                  src={item.image} 
                                  className="object-cover" 
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = '/api/placeholder/48/48';
                                  }}
                                />
                                <AvatarFallback className="bg-luxury-gradient text-black font-semibold">
                                  <User className="h-5 w-5 sm:h-6 sm:w-6" />
                                </AvatarFallback>
                              </Avatar>
                            ) : (
                              <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden border-2 border-primary/40">
                                <Image 
                                  src={item.image} 
                                  alt={item.title || item.name || 'Content'} 
                                  width={48} 
                                  height={48} 
                                  className="object-cover w-full h-full"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = '/api/placeholder/48/48';
                                  }}
                                />
                              </div>
                            )}

                            <div className="absolute -bottom-1 -right-1 bg-luxury-gradient rounded-full p-1 border-2 border-black">
                              {getResultIcon(item.resultType)}
                            </div>
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start gap-2 mb-1 flex-wrap sm:flex-nowrap">
                              <h4 className="font-semibold text-white text-sm leading-tight min-w-0 flex-1">
                                <span className="block sm:truncate">
                                  {item.resultType === 'model' ? item.name : item.title}
                                </span>
                              </h4>
                              <Badge 
                                className={`text-xs px-2 py-0.5 font-semibold flex-shrink-0 ${getMatchBadgeStyle(item.matchType)}`}
                              >
                                {item.matchType === 'exact' ? 'PERFECT' : 
                                 item.matchType === 'tag' ? 'TAG' : 
                                 item.matchType === 'description' ? 'DESC' : 'MATCH'}
                              </Badge>
                            </div>

                            <p className="text-xs text-gray-400 leading-relaxed line-clamp-2 mb-1">
                              {item.description || (item.resultType === 'model' ? item.famousFor : 'Premium luxury content')}
                            </p>

                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="capitalize text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded flex-shrink-0">
                                {item.resultType}
                              </span>
                              {item.keywords && Array.isArray(item.keywords) && item.keywords.length > 0 && (
                                <>
                                  <Separator orientation="vertical" className="h-3 bg-gray-600 hidden sm:block" />
                                  <span className="truncate text-xs text-gray-500 max-w-[120px] sm:max-w-none">
                                    {item.keywords.slice(0, 2).join(', ')}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center flex-shrink-0">
                            <div className={`w-2 h-2 bg-luxury-gradient rounded-full transition-opacity duration-300 ${
                              isSelected ? 'opacity-100 animate-pulse' : 'opacity-0'
                            }`}></div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}