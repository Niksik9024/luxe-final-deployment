
'use client';

import React, { useState, useEffect, Suspense } from 'react';
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

type SearchResult = (Video | Gallery | Model) & { 
  resultType: 'video' | 'gallery' | 'model';
  relevanceScore: number;
};

const calculateRelevance = (item: any, query: string, type: 'video' | 'gallery' | 'model'): number => {
  if (!query) return 0;
  
  const lowerQuery = query.toLowerCase();
  let score = 0;
  
  try {
    // Safe property access
    const title = item?.title || '';
    const name = item?.name || '';
    const description = item?.description || '';
    const keywords = Array.isArray(item?.keywords) ? item.keywords : [];
    const famousFor = item?.famousFor || '';

    // Primary title/name matches
    if (type === 'model' && name.toLowerCase().includes(lowerQuery)) {
      score += 100;
    } else if ((type === 'video' || type === 'gallery') && title.toLowerCase().includes(lowerQuery)) {
      score += 100;
    }
    
    // Keyword matches
    if (keywords.length > 0) {
      const keywordMatch = keywords.some((k: string) => 
        k && typeof k === 'string' && k.toLowerCase().includes(lowerQuery)
      );
      if (keywordMatch) score += 80;
    }
    
    // Description matches
    if (description && description.toLowerCase().includes(lowerQuery)) {
      score += 60;
    }
    
    // Model-specific matches
    if (type === 'model' && famousFor && famousFor.toLowerCase().includes(lowerQuery)) {
      score += 70;
    }
    
    // Featured content bonus
    if (type === 'video' && item?.isFeatured) {
      score += 20;
    }
  } catch (error) {
    console.error('Error calculating relevance:', error);
    return 0;
  }
  
  return score;
};

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [sortBy, setSortBy] = useState('relevance');
  const [appliedFilters, setAppliedFilters] = useState<string[]>([]);

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    
    try {
      // Add a small delay to prevent too rapid searching
      await new Promise(resolve => setTimeout(resolve, 200));

      const allVideos = getVideos().filter(v => v && v.status === 'Published');
      const allGalleries = getGalleries().filter(g => g && g.status === 'Published');
      const allModels = getModels().filter(m => m);

      const searchableItems: SearchResult[] = [];

      // Process each type safely
      allModels.forEach(model => {
        if (!model || !model.id) return;
        try {
          const relevance = calculateRelevance(model, searchQuery, 'model');
          if (relevance > 0) {
            searchableItems.push({
              ...model,
              resultType: 'model',
              relevanceScore: relevance
            });
          }
        } catch (error) {
          console.error('Error processing model:', model.id, error);
        }
      });

      allVideos.forEach(video => {
        if (!video || !video.id) return;
        try {
          const relevance = calculateRelevance(video, searchQuery, 'video');
          if (relevance > 0) {
            searchableItems.push({
              ...video,
              resultType: 'video',
              relevanceScore: relevance
            });
          }
        } catch (error) {
          console.error('Error processing video:', video.id, error);
        }
      });

      allGalleries.forEach(gallery => {
        if (!gallery || !gallery.id) return;
        try {
          const relevance = calculateRelevance(gallery, searchQuery, 'gallery');
          if (relevance > 0) {
            searchableItems.push({
              ...gallery,
              resultType: 'gallery',
              relevanceScore: relevance
            });
          }
        } catch (error) {
          console.error('Error processing gallery:', gallery.id, error);
        }
      });

      // Sort results
      let sortedResults = [...searchableItems];
      if (sortBy === 'relevance') {
        sortedResults.sort((a, b) => b.relevanceScore - a.relevanceScore);
      } else if (sortBy === 'newest') {
        sortedResults.sort((a, b) => {
          const dateA = new Date(a.date || '').getTime();
          const dateB = new Date(b.date || '').getTime();
          return dateB - dateA;
        });
      } else if (sortBy === 'alphabetical') {
        sortedResults.sort((a, b) => {
          const nameA = (a.resultType === 'model' ? a.name : a.title) || '';
          const nameB = (b.resultType === 'model' ? b.name : b.title) || '';
          return nameA.localeCompare(nameB);
        });
      }

      setResults(sortedResults);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    performSearch(query);
  }, [query, sortBy]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query);
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

  const removeFilter = (filter: string) => {
    setAppliedFilters(prev => prev.filter(f => f !== filter));
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
            <form onSubmit={handleSearch} className="space-y-6">
              <div className="relative">
                <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-primary w-6 h-6" />
                <Input
                  type="text"
                  placeholder="Search for luxury content, elite models, premium collections, haute couture..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
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
                  <Select value={sortBy} onValueChange={setSortBy} disabled={loading}>
                    <SelectTrigger className="w-48 h-12 bg-background/50 border-primary/30 focus:border-primary">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">Best Match</SelectItem>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="alphabetical">A-Z Order</SelectItem>
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

              {/* Applied Filters */}
              {appliedFilters.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-4 border-t border-primary/20">
                  <span className="text-sm font-medium text-primary">Active filters:</span>
                  {appliedFilters.map(filter => (
                    <Badge 
                      key={filter} 
                      variant="secondary" 
                      className="cursor-pointer hover:bg-destructive/20 transition-colors"
                      onClick={() => removeFilter(filter)}
                    >
                      {filter} <X className="w-3 h-3 ml-2" />
                    </Badge>
                  ))}
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Search Results */}
        <div className="max-w-7xl mx-auto">
          {query && (
            <div className="mb-8 text-center">
              <p className="text-xl font-medium">
                {loading ? (
                  <span className="flex items-center justify-center gap-3">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Searching our luxury collection...
                  </span>
                ) : (
                  `Found ${results.length} premium result${results.length !== 1 ? 's' : ''} for "${query}"`
                )}
              </p>
            </div>
          )}

          {results.length > 0 && !loading && (
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

          {query && !loading && results.length === 0 && (
            <Card className="luxury-card text-center py-20 max-w-2xl mx-auto">
              <CardContent>
                <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-luxury-gradient flex items-center justify-center">
                  <Sparkles className="h-12 w-12 text-black" />
                </div>
                <h3 className="text-3xl font-bold mb-6">No results found</h3>
                <p className="text-muted-foreground mb-8 text-lg max-w-md mx-auto">
                  We couldn't find any content matching "{query}". Try different keywords or browse our featured collections.
                </p>
                <div className="flex gap-4 justify-center">
                  <Button onClick={() => setQuery('')} className="btn-luxury">
                    Clear Search
                  </Button>
                  <Button variant="outline" onClick={() => window.location.href = '/'} className="border-primary/40 hover:bg-primary/10">
                    Browse Featured
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {!query && !loading && (
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
      <SearchResultsContent />
    </Suspense>
  );
}
