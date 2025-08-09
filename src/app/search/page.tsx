'use client';

import React, { useState, useEffect, Suspense, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { getVideos, getGalleries, getModels } from '@/lib/localStorage';
import type { Video, Gallery, Model } from '@/lib/types';
import { ContentCard } from '@/components/shared/ContentCard';
import { ModelCard } from '@/components/shared/ModelCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter, Star, Crown, Sparkles, X, SlidersHorizontal, Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AdvancedFilters, FilterOptions } from '@/components/shared/AdvancedFilters';

type SearchResult = (Video | Gallery | Model) & { 
  resultType: 'video' | 'gallery' | 'model';
  relevanceScore: number;
};

// Advanced scoring algorithm for search relevance
function calculateSearchScore(item: any, query: string, type: 'video' | 'gallery' | 'model'): number {
  const queryLower = query.toLowerCase().trim();
  let score = 0;

  // Title/Name exact matches get highest priority
  const title = (type === 'model' ? item.name : item.title || '').toLowerCase();
  if (title === queryLower) score += 100;
  else if (title.startsWith(queryLower)) score += 80;
  else if (title.includes(queryLower)) score += 60;

  // Description matches
  const description = (item.description || '').toLowerCase();
  if (description.includes(queryLower)) score += 30;

  // Keywords and tags (for non-model content)
  if (type !== 'model') {
    if (item.keywords?.some((k: string) => k.toLowerCase().includes(queryLower))) score += 40;
    if (item.tags?.some((t: string) => t.toLowerCase().includes(queryLower))) score += 35;
  }

  // Boost for recent content
  if (type !== 'model' && item.date) {
    const daysSinceCreated = (Date.now() - new Date(item.date).getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceCreated < 7) score += 15;
    else if (daysSinceCreated < 30) score += 10;
  }

  // Featured content boost
  if (item.isFeatured) score += 20;

  // Fuzzy matching for typos
  const words = queryLower.split(/\s+/);
  words.forEach(word => {
    if (word.length > 2) {
      const titleWords = title.split(/\s+/);
      const fuzzyMatch = titleWords.some(titleWord => {
        const editDistance = levenshteinDistance(word, titleWord);
        return editDistance <= Math.max(1, Math.floor(word.length * 0.2));
      });
      if (fuzzyMatch) score += 10;
    }
  });

  return score;
}

// Simple Levenshtein distance for fuzzy matching
function levenshteinDistance(str1: string, str2: string): number {
  const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));

  for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const substitutionCost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + substitutionCost
      );
    }
  }

  return matrix[str2.length][str1.length];
}

function SearchPageContent() {
  const searchParams = useSearchParams();
  const [results, setResults] = useState<SearchResults>({ videos: [], galleries: [], models: [], total: 0 });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [searchStats, setSearchStats] = useState({ searchTime: 0, suggestions: [] as string[] });
  const [filters, setFilters] = useState<FilterOptions>({
    query: '',
    type: 'all',
    category: '',
    tags: [],
    models: [],
    dateRange: { from: '', to: '' },
    featured: false,
    sortBy: 'relevance',
    sortOrder: 'desc',
    minRating: 0,
    hasKeywords: []
  });

  const query = searchParams?.get('q') || '';

  useEffect(() => {
    if (query) {
      setFilters(prev => ({ ...prev, query }));
    }
  }, [query]);

  const performSearch = useCallback(async (searchFilters: FilterOptions) => {
    setLoading(true);
    const startTime = performance.now();

    try {
      await new Promise(resolve => setTimeout(resolve, 200));

      const allVideos = getVideos().filter(v => v.status === 'Published');
      const allGalleries = getGalleries().filter(g => g.status === 'Published');
      const allModels = getModels();

      let filteredVideos = allVideos;
      let filteredGalleries = allGalleries;
      let filteredModels = allModels;

      // Apply query filter with advanced scoring
      if (searchFilters.query.trim()) {
        const queryLower = searchFilters.query.toLowerCase();

        // Score and filter videos
        const scoredVideos = filteredVideos
          .map(item => ({ ...item, searchScore: calculateSearchScore(item, queryLower, 'video') }))
          .filter(item => item.searchScore > 0)
          .sort((a, b) => b.searchScore - a.searchScore);

        // Score and filter galleries
        const scoredGalleries = filteredGalleries
          .map(item => ({ ...item, searchScore: calculateSearchScore(item, queryLower, 'gallery') }))
          .filter(item => item.searchScore > 0)
          .sort((a, b) => b.searchScore - a.searchScore);

        // Score and filter models
        const scoredModels = filteredModels
          .map(item => ({ ...item, searchScore: calculateSearchScore(item, queryLower, 'model') }))
          .filter(item => item.searchScore > 0)
          .sort((a, b) => b.searchScore - a.searchScore);

        filteredVideos = scoredVideos;
        filteredGalleries = scoredGalleries;
        filteredModels = scoredModels;

        // Generate search suggestions based on available content
        const suggestions = generateSearchSuggestions(queryLower, [...allVideos, ...allGalleries, ...allModels]);
        setSearchStats(prev => ({ ...prev, suggestions: suggestions.slice(0, 5) }));
      }

      // Apply type filter
      if (searchFilters.type !== 'all') {
        if (searchFilters.type === 'video') {
          filteredGalleries = [];
          filteredModels = [];
        } else if (searchFilters.type === 'gallery') {
          filteredVideos = [];
          filteredModels = [];
        } else if (searchFilters.type === 'model') {
          filteredVideos = [];
          filteredGalleries = [];
        }
      }

      // Apply featured filter
      if (searchFilters.featured) {
        filteredVideos = filteredVideos.filter(v => v.isFeatured);
      }

      // Apply category filter
      if (searchFilters.category) {
        filteredVideos = filteredVideos.filter(v => v.category?.toLowerCase() === searchFilters.category);
        filteredGalleries = filteredGalleries.filter(g => g.category?.toLowerCase() === searchFilters.category);
      }

      // Apply tags filter
      if (searchFilters.tags.length > 0) {
        filteredVideos = filteredVideos.filter(v => 
          searchFilters.tags.some(tag => v.tags?.includes(tag))
        );
        filteredGalleries = filteredGalleries.filter(g => 
          searchFilters.tags.some(tag => g.tags?.includes(tag))
        );
      }

      // Apply models filter
      if (searchFilters.models.length > 0) {
        filteredVideos = filteredVideos.filter(v => 
          searchFilters.models.some(modelId => v.models?.includes(modelId))
        );
        filteredGalleries = filteredGalleries.filter(g => 
          searchFilters.models.some(modelId => g.models?.includes(modelId))
        );
      }

      // Apply date range filter
      if (searchFilters.dateRange.from || searchFilters.dateRange.to) {
        const fromDate = searchFilters.dateRange.from ? new Date(searchFilters.dateRange.from) : null;
        const toDate = searchFilters.dateRange.to ? new Date(searchFilters.dateRange.to) : null;

        if (fromDate || toDate) {
          filteredVideos = filteredVideos.filter(v => {
            const date = new Date(v.date);
            return (!fromDate || date >= fromDate) && (!toDate || date <= toDate);
          });

          filteredGalleries = filteredGalleries.filter(g => {
            const date = new Date(g.date);
            return (!fromDate || date >= fromDate) && (!toDate || date <= toDate);
          });
        }
      }

      // Advanced sorting (only if not relevance-based)
      if (searchFilters.sortBy !== 'relevance') {
        const getSortValue = (item: any) => {
          switch (searchFilters.sortBy) {
            case 'date': return new Date(item.date || '').getTime();
            case 'title': return (item.title || item.name || '').toLowerCase();
            case 'popular': 
              // Enhanced popularity calculation
              return (item.isFeatured ? 1000 : 0) + 
                     (item.keywords?.length || 0) * 10 +
                     (item.tags?.length || 0) * 5;
            default: return item.searchScore || 0;
          }
        };

        const sortFn = (a: any, b: any) => {
          const aVal = getSortValue(a);
          const bVal = getSortValue(b);

          if (typeof aVal === 'string') {
            return searchFilters.sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
          } else {
            return searchFilters.sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
          }
        };

        filteredVideos.sort(sortFn);
        filteredGalleries.sort(sortFn);
        filteredModels.sort((a, b) => {
          const aVal = getSortValue(a);
          const bVal = getSortValue(b);
          if (typeof aVal === 'string') {
            return searchFilters.sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
          }
          return searchFilters.sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
        });
      }

      const total = filteredVideos.length + filteredGalleries.length + filteredModels.length;
      const endTime = performance.now();
      const searchTime = Math.round(endTime - startTime);

      setResults({
        videos: filteredVideos,
        galleries: filteredGalleries,
        models: filteredModels,
        total,
        searchTime
      });

      setSearchStats(prev => ({ ...prev, searchTime }));

    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Generate search suggestions based on content
  const generateSearchSuggestions = (query: string, content: any[]): string[] => {
    const suggestions = new Set<string>();
    const queryWords = query.split(/\s+/);

    content.forEach(item => {
      const title = item.title || item.name || '';
      const words = title.toLowerCase().split(/\s+/);

      words.forEach(word => {
        if (word.length > 3 && word.includes(query)) {
          suggestions.add(word);
        }
      });

      // Add partial matches
      queryWords.forEach(queryWord => {
        if (queryWord.length > 2) {
          words.forEach(word => {
            if (word.startsWith(queryWord) && word !== queryWord) {
              suggestions.add(word);
            }
          });
        }
      });
    });

    return Array.from(suggestions);
  };

  useEffect(() => {
    performSearch(filters);
  }, [filters, performSearch]);

  const handleFiltersChange = useCallback((newFilters: FilterOptions) => {
    setFilters(newFilters);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(filters);
  };

  const filteredResults = results.filter(result => {
    if (activeTab === 'all') return true;
    return result.resultType === activeTab;
  });

  const resultCounts = {
    all: results.length,
    video: results.filter(r => r.resultType === 'video').length,
    gallery: results.filter(r => r.resultType === 'gallery').length,
    model: results.filter(r => r.resultType === 'model').length,
  };

  return (
    <div className="min-h-screen bg-luxury-dark-gradient pt-20">
      <div className="container mx-auto px-4 py-12">
        {/* Search Header */}
        <div className="text-center mb-12 luxury-fade-in">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Crown className="w-8 h-8 text-primary animate-pulse" />
            <Badge className="bg-luxury-gradient text-black font-bold text-lg px-6 py-3">
              LUXURY SEARCH EXPERIENCE
            </Badge>
          </div>
          <h1 className="mb-6 luxury-slide-up">Discover Premium Content</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 luxury-fade-in">
            Search through our exclusive collection of elite models, premium videos, and luxury galleries
          </p>
        </div>

        {/* Enhanced Search Bar */}
        <Card className="luxury-card mb-12 max-w-5xl mx-auto luxury-glow">
          <CardContent className="p-8">
            <form onSubmit={handleSearchSubmit} className="space-y-6">
              <div className="relative">
                <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-primary w-6 h-6" />
                <Input
                  type="text"
                  placeholder="Search for luxury content, elite models, premium collections, haute couture..."
                  value={filters.query}
                  onChange={(e) => handleFiltersChange({ ...filters, query: e.target.value })}
                  className="pl-16 pr-6 py-6 text-xl bg-background/50 border-primary/30 focus:border-primary transition-all duration-300 rounded-xl"
                  disabled={loading}
                />
                {loading && (
                  <div className="absolute right-6 top-1/2 transform -translate-y-1/2">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-6 items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <SlidersHorizontal className="w-5 h-5 text-primary" />
                    <span className="text-base font-semibold text-primary">Sort by:</span>
                  </div>
                  <Select value={filters.sortBy} onValueChange={(value) => handleFiltersChange({ ...filters, sortBy: value as any, sortOrder: value === 'relevance' ? 'desc' : filters.sortOrder })} disabled={loading}>
                    <SelectTrigger className="w-48 h-12 bg-background/50 border-primary/30 focus:border-primary">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">Best Match</SelectItem>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="alphabetical">A-Z Order</SelectItem>
                      <SelectItem value="popular">Most Popular</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  type="submit" 
                  className="btn-luxury px-8 py-3 h-12 text-lg font-bold" 
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="mr-3 h-5 w-5" />
                      Search
                    </>
                  )}
                </Button>
              </div>

              {/* Advanced Filters Component */}
              <AdvancedFilters 
                filters={filters} 
                onFiltersChange={handleFiltersChange} 
                loading={loading} 
                searchStats={searchStats}
                contentOptions={{ allVideos, allGalleries, allModels }}
              />

              {/* Display applied filters as badges */}
              {filters.query && (
                <div className="flex flex-wrap gap-2 pt-4 border-t border-primary/20">
                  <span className="text-sm font-medium text-primary">Active query:</span>
                  <Badge variant="secondary" className="cursor-pointer hover:bg-destructive/20 transition-colors">
                    {filters.query} <X className="w-3 h-3 ml-2" />
                  </Badge>
                </div>
              )}
              {filters.type !== 'all' && (
                <div className="flex flex-wrap gap-2 pt-4 border-t border-primary/20">
                  <span className="text-sm font-medium text-primary">Active type:</span>
                  <Badge variant="secondary" className="cursor-pointer hover:bg-destructive/20 transition-colors">
                    {filters.type} <X className="w-3 h-3 ml-2" />
                  </Badge>
                </div>
              )}
              {filters.category && (
                <div className="flex flex-wrap gap-2 pt-4 border-t border-primary/20">
                  <span className="text-sm font-medium text-primary">Active category:</span>
                  <Badge variant="secondary" className="cursor-pointer hover:bg-destructive/20 transition-colors">
                    {filters.category} <X className="w-3 h-3 ml-2" />
                  </Badge>
                </div>
              )}
              {filters.featured && (
                <div className="flex flex-wrap gap-2 pt-4 border-t border-primary/20">
                  <span className="text-sm font-medium text-primary">Active filter:</span>
                  <Badge variant="secondary" className="cursor-pointer hover:bg-destructive/20 transition-colors">
                    Featured <X className="w-3 h-3 ml-2" />
                  </Badge>
                </div>
              )}
              {filters.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-4 border-t border-primary/20">
                  <span className="text-sm font-medium text-primary">Active tags:</span>
                  {filters.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="cursor-pointer hover:bg-destructive/20 transition-colors">
                      {tag} <X className="w-3 h-3 ml-2" />
                    </Badge>
                  ))}
                </div>
              )}
              {filters.models.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-4 border-t border-primary/20">
                  <span className="text-sm font-medium text-primary">Associated models:</span>
                  {filters.models.map(modelId => (
                    <Badge key={modelId} variant="secondary" className="cursor-pointer hover:bg-destructive/20 transition-colors">
                      Model {modelId.substring(0, 6)}... <X className="w-3 h-3 ml-2" />
                    </Badge>
                  ))}
                </div>
              )}
              {(filters.dateRange.from || filters.dateRange.to) && (
                <div className="flex flex-wrap gap-2 pt-4 border-t border-primary/20">
                  <span className="text-sm font-medium text-primary">Date range:</span>
                  <Badge variant="secondary" className="cursor-pointer hover:bg-destructive/20 transition-colors">
                    {filters.dateRange.from} - {filters.dateRange.to || 'Present'} <X className="w-3 h-3 ml-2" />
                  </Badge>
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Search Results */}
        <div className="max-w-7xl mx-auto">
          {filters.query && (
            <div className="mb-8 text-center">
              <p className="text-xl font-medium">
                {loading ? (
                  <span className="flex items-center justify-center gap-3">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Searching our luxury collection...
                  </span>
                ) : (
                  `Found ${results.total} premium result${results.total !== 1 ? 's' : ''} for "${filters.query}" ${results.searchTime ? `(${results.searchTime}ms)` : ''}`
                )}
              </p>
              {searchStats.suggestions.length > 0 && !loading && (
                <div className="mt-4 flex flex-wrap justify-center gap-3">
                  <span className="text-primary font-semibold">Did you mean:</span>
                  {searchStats.suggestions.map(suggestion => (
                    <Button
                      key={suggestion}
                      variant="outline"
                      className="border-primary/40 hover:bg-primary/10 text-primary px-3 py-1 h-auto text-sm rounded-full"
                      onClick={() => {
                        handleFiltersChange({ ...filters, query: suggestion });
                        setActiveTab('all');
                      }}
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          )}

          {results.total > 0 && !loading && (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-8 h-14 bg-card/50 border border-primary/20">
                <TabsTrigger 
                  value="all" 
                  className="data-[state=active]:bg-luxury-gradient data-[state=active]:text-black text-base font-semibold"
                >
                  All Results ({resultCounts.all})
                </TabsTrigger>
                <TabsTrigger 
                  value="video" 
                  className="data-[state=active]:bg-luxury-gradient data-[state=active]:text-black text-base font-semibold"
                >
                  Videos ({resultCounts.video})
                </TabsTrigger>
                <TabsTrigger 
                  value="gallery" 
                  className="data-[state=active]:bg-luxury-gradient data-[state=active]:text-black text-base font-semibold"
                >
                  Galleries ({resultCounts.gallery})
                </TabsTrigger>
                <TabsTrigger 
                  value="model" 
                  className="data-[state=active]:bg-luxury-gradient data-[state=active]:text-black text-base font-semibold"
                >
                  Models ({resultCounts.model})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {filteredResults.map((result, index) => (
                    <div key={`${result.resultType}-${result.id}-${index}`} className="luxury-fade-in">
                      {result.resultType === 'model' ? (
                        <ModelCard model={result as Model} />
                      ) : (
                        <ContentCard 
                          content={result as Video | Gallery} 
                          type={result.resultType as 'video' | 'gallery'} 
                        />
                      )}
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="video" className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredResults.filter(r => r.resultType === 'video').map((result, index) => (
                    <div key={`video-${result.id}-${index}`} className="luxury-fade-in">
                      <ContentCard content={result as Video} type="video" />
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="gallery" className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {filteredResults.filter(r => r.resultType === 'gallery').map((result, index) => (
                    <div key={`gallery-${result.id}-${index}`} className="luxury-fade-in">
                      <ContentCard content={result as Gallery} type="gallery" />
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="model" className="space-y-8">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8">
                  {filteredResults.filter(r => r.resultType === 'model').map((result, index) => (
                    <div key={`model-${result.id}-${index}`} className="luxury-fade-in">
                      <ModelCard model={result as Model} />
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          )}

          {filters.query && !loading && results.total === 0 && (
            <Card className="luxury-card text-center py-20 max-w-2xl mx-auto">
              <CardContent>
                <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-luxury-gradient flex items-center justify-center">
                  <Sparkles className="h-12 w-12 text-black" />
                </div>
                <h3 className="text-3xl font-bold mb-6">No results found</h3>
                <p className="text-muted-foreground mb-8 text-lg max-w-md mx-auto">
                  We couldn't find any content matching "{filters.query}". Try different keywords or browse our featured collections.
                </p>
                <div className="flex gap-4 justify-center">
                  <Button onClick={() => handleFiltersChange({ ...filters, query: '' })} className="btn-luxury">
                    Clear Search
                  </Button>
                  <Button variant="outline" onClick={() => window.location.href = '/'} className="border-primary/40 hover:bg-primary/10">
                    Browse Featured
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {!filters.query && !loading && results.total === 0 && (
            <Card className="luxury-card text-center py-20 max-w-2xl mx-auto">
              <CardContent>
                <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-luxury-gradient flex items-center justify-center">
                  <Search className="h-12 w-12 text-black" />
                </div>
                <h3 className="text-3xl font-bold mb-6">Begin Your Luxury Search</h3>
                <p className="text-muted-foreground mb-8 text-lg max-w-md mx-auto">
                  Enter a search term above to discover our premium content, elite models, and exclusive collections.
                </p>
                <p className="text-sm text-primary font-medium">
                  Try searching for: Fashion Week, Editorial, Haute Couture, Runway
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-luxury-dark-gradient pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-luxury-gradient flex items-center justify-center">
            <Loader2 className="h-12 w-12 text-black animate-spin" />
          </div>
          <p className="text-2xl font-semibold">Loading luxury search experience...</p>
        </div>
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  );
}