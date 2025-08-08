
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
import { Search, Filter, Star, Crown, Sparkles, X, SlidersHorizontal } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type SearchResult = (Video | Gallery | Model) & { 
  resultType: 'video' | 'gallery' | 'model';
  relevanceScore: number;
};

const calculateRelevance = (item: any, query: string, type: 'video' | 'gallery' | 'model'): number => {
  if (!query) return 0;
  
  const lowerQuery = query.toLowerCase();
  let score = 0;
  
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
  }
  
  if (type === 'video' && item.isFeatured) {
    score += 20;
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

  const performSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    
    try {
      const allVideos = getVideos().filter(v => v && v.status === 'Published');
      const allGalleries = getGalleries().filter(g => g && g.status === 'Published');
      const allModels = getModels().filter(m => m);

      const searchableItems: SearchResult[] = [];

      // Search models
      allModels.forEach(model => {
        const relevance = calculateRelevance(model, searchQuery, 'model');
        if (relevance > 0) {
          searchableItems.push({
            ...model,
            resultType: 'model',
            relevanceScore: relevance
          });
        }
      });

      // Search videos
      allVideos.forEach(video => {
        const relevance = calculateRelevance(video, searchQuery, 'video');
        if (relevance > 0) {
          searchableItems.push({
            ...video,
            resultType: 'video',
            relevanceScore: relevance
          });
        }
      });

      // Search galleries
      allGalleries.forEach(gallery => {
        const relevance = calculateRelevance(gallery, searchQuery, 'gallery');
        if (relevance > 0) {
          searchableItems.push({
            ...gallery,
            resultType: 'gallery',
            relevanceScore: relevance
          });
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
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Crown className="w-6 h-6 text-primary" />
            <Badge className="bg-luxury-gradient text-black font-semibold text-sm px-4 py-2">
              LUXURY SEARCH
            </Badge>
          </div>
          <h1 className="mb-6">Discover Premium Content</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Search through our exclusive collection of models, videos, and galleries
          </p>
        </div>

        {/* Enhanced Search Bar */}
        <Card className="luxury-card mb-8 max-w-4xl mx-auto">
          <CardContent className="p-6">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search for luxury content, elite models, premium collections..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-12 pr-4 py-4 text-lg bg-background/50 border-primary/30 focus:border-primary transition-colors"
                />
              </div>
              
              <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Sort by:</span>
                  </div>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-40 bg-background/50 border-primary/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">Relevance</SelectItem>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="alphabetical">A-Z</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button type="submit" className="btn-luxury px-6" disabled={loading}>
                  {loading ? 'Searching...' : 'Search'}
                </Button>
              </div>

              {/* Applied Filters */}
              {appliedFilters.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm text-muted-foreground">Active filters:</span>
                  {appliedFilters.map(filter => (
                    <Badge 
                      key={filter} 
                      variant="secondary" 
                      className="cursor-pointer hover:bg-destructive/20"
                      onClick={() => removeFilter(filter)}
                    >
                      {filter} <X className="w-3 h-3 ml-1" />
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
              <p className="text-lg text-muted-foreground">
                {loading ? 'Searching...' : `Found ${results.length} result${results.length !== 1 ? 's' : ''} for "${query}"`}
              </p>
            </div>
          )}

          {results.length > 0 && (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-8 bg-card/50 border border-primary/20">
                <TabsTrigger value="all" className="data-[state=active]:bg-luxury-gradient data-[state=active]:text-black">
                  All ({resultCounts.all})
                </TabsTrigger>
                <TabsTrigger value="video" className="data-[state=active]:bg-luxury-gradient data-[state=active]:text-black">
                  Videos ({resultCounts.video})
                </TabsTrigger>
                <TabsTrigger value="gallery" className="data-[state=active]:bg-luxury-gradient data-[state=active]:text-black">
                  Galleries ({resultCounts.gallery})
                </TabsTrigger>
                <TabsTrigger value="model" className="data-[state=active]:bg-luxury-gradient data-[state=active]:text-black">
                  Models ({resultCounts.model})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredResults.filter(r => r.resultType === 'video').map((result, index) => (
                    <div key={`video-${result.id}-${index}`} className="luxury-fade-in">
                      <ContentCard content={result as Video} type="video" />
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="gallery" className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredResults.filter(r => r.resultType === 'gallery').map((result, index) => (
                    <div key={`gallery-${result.id}-${index}`} className="luxury-fade-in">
                      <ContentCard content={result as Gallery} type="gallery" />
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="model" className="space-y-8">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
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
            <Card className="luxury-card text-center py-16">
              <CardContent>
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-luxury-gradient flex items-center justify-center">
                  <Sparkles className="h-10 w-10 text-black" />
                </div>
                <h3 className="text-2xl font-bold mb-4">No results found</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  We couldn't find any content matching "{query}". Try adjusting your search terms.
                </p>
                <Button onClick={() => setQuery('')} className="btn-luxury">
                  Clear Search
                </Button>
              </CardContent>
            </Card>
          )}

          {!query && (
            <Card className="luxury-card text-center py-16">
              <CardContent>
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-luxury-gradient flex items-center justify-center">
                  <Search className="h-10 w-10 text-black" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Start Your Search</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Enter a search term above to discover our premium content, elite models, and exclusive collections.
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
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-luxury-gradient flex items-center justify-center">
            <Search className="h-10 w-10 text-black animate-pulse" />
          </div>
          <p className="text-xl">Loading search...</p>
        </div>
      </div>
    }>
      <SearchResultsContent />
    </Suspense>
  );
}
