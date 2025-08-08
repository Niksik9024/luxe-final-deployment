
'use client';

import React, { useEffect, useState, useTransition, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ContentCard } from '@/components/shared/ContentCard';
import { ModelCard } from '@/components/shared/ModelCard';
import { Search as SearchIcon, Loader2, Filter, SlidersHorizontal, Grid, List, Sparkles, TrendingUp } from 'lucide-react';
import type { Video, Gallery, Model } from '@/lib/types';
import { getVideos, getGalleries, getModels } from '@/lib/localStorage';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type SearchResults = {
  videos: Video[];
  galleries: Gallery[];
  models: Model[];
}

type SortOption = 'relevance' | 'date' | 'alphabetical' | 'featured';
type ViewMode = 'grid' | 'list';
type ContentFilter = 'all' | 'videos' | 'galleries' | 'models';

function SearchPageComponent() {
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  
  const [searchResults, setSearchResults] = useState<SearchResults>({ videos: [], galleries: [], models: [] });
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [contentFilter, setContentFilter] = useState<ContentFilter>('all');
  const [showFilters, setShowFilters] = useState(false);

  const queryTerm = searchParams.get('q')?.toLowerCase() || '';

  // Advanced search with relevance scoring
  const calculateRelevance = (item: any, query: string, type: string): number => {
    const lowerQuery = query.toLowerCase();
    let score = 0;
    
    // Exact matches get highest priority
    if (type === 'model' && item.name?.toLowerCase().includes(lowerQuery)) score += 100;
    else if (item.title?.toLowerCase().includes(lowerQuery)) score += 100;
    
    // Keyword/tag matches
    if (item.keywords?.some((k: string) => k.toLowerCase().includes(lowerQuery))) score += 80;
    
    // Description matches
    if (item.description?.toLowerCase().includes(lowerQuery)) score += 60;
    
    // Bonus for featured content
    if (type === 'video' && item.isFeatured) score += 20;
    
    return score;
  };

  useEffect(() => {
    startTransition(() => {
      if (!queryTerm) {
        setSearchResults({ videos: [], galleries: [], models: [] });
        return;
      }

      const allVideos = getVideos().filter(v => v.status === 'Published');
      const allGalleries = getGalleries().filter(g => g.status === 'Published');
      const allModels = getModels();

      // Advanced filtering with relevance scoring
      const filteredVideos = allVideos
        .map(v => ({ ...v, relevance: calculateRelevance(v, queryTerm, 'video') }))
        .filter(v => v.relevance > 0)
        .sort((a, b) => b.relevance - a.relevance);

      const filteredGalleries = allGalleries
        .map(g => ({ ...g, relevance: calculateRelevance(g, queryTerm, 'gallery') }))
        .filter(g => g.relevance > 0)
        .sort((a, b) => b.relevance - a.relevance);

      const filteredModels = allModels
        .map(m => ({ ...m, relevance: calculateRelevance(m, queryTerm, 'model') }))
        .filter(m => m.relevance > 0)
        .sort((a, b) => b.relevance - a.relevance);

      setSearchResults({
        videos: filteredVideos,
        galleries: filteredGalleries,
        models: filteredModels,
      });
    });
  }, [queryTerm]);

  // Sort results based on selected option
  const sortResults = (items: any[], type: string) => {
    switch (sortBy) {
      case 'date':
        return [...items].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      case 'alphabetical':
        return [...items].sort((a, b) => {
          const nameA = type === 'model' ? a.name : a.title;
          const nameB = type === 'model' ? b.name : b.title;
          return nameA.localeCompare(nameB);
        });
      case 'featured':
        return [...items].sort((a, b) => {
          if (type === 'video') {
            return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
          }
          return 0;
        });
      default:
        return items; // Already sorted by relevance
    }
  };

  const { videos, galleries, models } = searchResults;
  const sortedVideos = sortResults(videos, 'video');
  const sortedGalleries = sortResults(galleries, 'gallery');
  const sortedModels = sortResults(models, 'model');

  const totalResults = videos.length + galleries.length + models.length;
  const hasResults = totalResults > 0;

  const popularTags = ['Fashion Week', 'Editorial', 'Luxury', 'Haute Couture', 'Runway', 'Portrait'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Luxury Header Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-yellow-600/10"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.02"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
        
        <div className="container relative mx-auto py-16 px-4">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-yellow-600/20 backdrop-blur-sm border border-amber-500/30 rounded-full px-6 py-2 mb-4">
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span className="text-sm text-amber-200 font-medium">LUXURY SEARCH EXPERIENCE</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white via-amber-100 to-yellow-200 bg-clip-text text-transparent leading-tight">
              Search Results
            </h1>
            
            <div className="max-w-2xl mx-auto space-y-4">
              {isPending ? (
                <div className="flex items-center justify-center gap-3 text-amber-200">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <p className="text-lg">Searching our exclusive collection...</p>
                </div>
              ) : queryTerm ? (
                <div className="space-y-3">
                  <p className="text-xl text-gray-300">
                    Showing results for <span className="font-bold text-amber-300">"{searchParams.get('q')}"</span>
                  </p>
                  <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
                    <span>{totalResults} results found</span>
                    {totalResults > 0 && (
                      <>
                        <Separator orientation="vertical" className="h-4" />
                        <span>{models.length} models</span>
                        <span>{videos.length} videos</span>
                        <span>{galleries.length} galleries</span>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-xl text-gray-400">Enter a search term to discover luxury content</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-12">
        {/* Advanced Controls */}
        {hasResults && (
          <div className="bg-black/40 backdrop-blur-sm border border-amber-500/20 rounded-2xl p-6 mb-8 -mt-8 relative z-10">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
                  <SelectTrigger className="w-48 bg-black/50 border-amber-500/30 text-white">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-amber-500/30">
                    <SelectItem value="relevance">Most Relevant</SelectItem>
                    <SelectItem value="date">Latest First</SelectItem>
                    <SelectItem value="alphabetical">A-Z</SelectItem>
                    <SelectItem value="featured">Featured First</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex items-center gap-2 bg-black/30 rounded-lg p-1">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="text-white hover:text-amber-400"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="text-white hover:text-amber-400"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Tabs value={contentFilter} onValueChange={(value: ContentFilter) => setContentFilter(value)} className="w-auto">
                  <TabsList className="bg-black/50 border border-amber-500/30">
                    <TabsTrigger value="all" className="text-white data-[state=active]:bg-amber-500 data-[state=active]:text-black">All</TabsTrigger>
                    <TabsTrigger value="models" className="text-white data-[state=active]:bg-amber-500 data-[state=active]:text-black">Models</TabsTrigger>
                    <TabsTrigger value="videos" className="text-white data-[state=active]:bg-amber-500 data-[state=active]:text-black">Videos</TabsTrigger>
                    <TabsTrigger value="galleries" className="text-white data-[state=active]:bg-amber-500 data-[state=active]:text-black">Galleries</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
          </div>
        )}

        {/* Results Display */}
        {isPending ? (
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center space-y-4">
              <div className="relative">
                <div className="w-16 h-16 mx-auto border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 w-16 h-16 mx-auto border-4 border-transparent border-l-yellow-600 rounded-full animate-spin animation-delay-150"></div>
              </div>
              <p className="text-amber-200 text-lg">Curating luxury content...</p>
            </div>
          </div>
        ) : hasResults ? (
          <div className="space-y-12">
            {/* Models Section */}
            {sortedModels.length > 0 && (contentFilter === 'all' || contentFilter === 'models') && (
              <section>
                <div className="flex items-center gap-4 mb-8">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
                    Models
                  </h2>
                  <Badge variant="outline" className="bg-amber-500/20 border-amber-500/40 text-amber-200">
                    {sortedModels.length} found
                  </Badge>
                </div>
                <div className={`grid ${viewMode === 'grid' 
                  ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6' 
                  : 'grid-cols-1 gap-4'}`}>
                  {sortedModels.map(model => (
                    <div key={model.id} className="group hover:scale-105 transition-transform duration-300">
                      <ModelCard model={model} />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Videos Section */}
            {sortedVideos.length > 0 && (contentFilter === 'all' || contentFilter === 'videos') && (
              <section>
                <div className="flex items-center gap-4 mb-8">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
                    Videos
                  </h2>
                  <Badge variant="outline" className="bg-amber-500/20 border-amber-500/40 text-amber-200">
                    {sortedVideos.length} found
                  </Badge>
                </div>
                <div className={`grid ${viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' 
                  : 'grid-cols-1 gap-6'}`}>
                  {sortedVideos.map(video => (
                    <div key={video.id} className="group hover:scale-102 transition-transform duration-500">
                      <ContentCard content={video} type="video" />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Galleries Section */}
            {sortedGalleries.length > 0 && (contentFilter === 'all' || contentFilter === 'galleries') && (
              <section>
                <div className="flex items-center gap-4 mb-8">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
                    Galleries
                  </h2>
                  <Badge variant="outline" className="bg-amber-500/20 border-amber-500/40 text-amber-200">
                    {sortedGalleries.length} found
                  </Badge>
                </div>
                <div className={`grid ${viewMode === 'grid' 
                  ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6' 
                  : 'grid-cols-1 gap-4'}`}>
                  {sortedGalleries.map(gallery => (
                    <div key={gallery.id} className="group hover:scale-105 transition-transform duration-300">
                      <ContentCard content={gallery} type="gallery" />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        ) : (
          <div className="text-center py-20 min-h-[50vh] flex flex-col items-center justify-center">
            <Card className="bg-black/40 border-amber-500/20 backdrop-blur-sm max-w-2xl mx-auto">
              <CardContent className="p-12">
                <SearchIcon className="mx-auto h-20 w-20 text-amber-500/60 mb-8" />
                <h2 className="text-3xl font-bold text-white mb-4">No Results Found</h2>
                <p className="text-gray-400 mb-8 text-lg">
                  We couldn't find anything matching your search. Try exploring our curated collections.
                </p>
                
                {/* Popular Tags Suggestions */}
                <div className="space-y-4">
                  <p className="text-sm text-amber-400 flex items-center justify-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Popular Searches
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {popularTags.map(tag => (
                      <Badge 
                        key={tag}
                        variant="outline" 
                        className="cursor-pointer hover:bg-amber-500/20 border-amber-500/30 text-amber-200 transition-all duration-300 hover:scale-105"
                        onClick={() => window.location.href = `/search?q=${encodeURIComponent(tag)}`}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative">
            <Loader2 className="h-16 w-16 text-amber-500 animate-spin mx-auto" />
            <div className="absolute inset-0">
              <Sparkles className="h-16 w-16 text-yellow-400 animate-pulse mx-auto" />
            </div>
          </div>
          <p className="text-amber-200 text-xl">Loading luxury experience...</p>
        </div>
      </div>
    }>
      <SearchPageComponent />
    </Suspense>
  )
}
