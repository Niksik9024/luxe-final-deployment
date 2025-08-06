
'use client';

import React, { useEffect, useState, useTransition } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { ContentCard } from '@/components/shared/ContentCard';
import { ModelCard } from '@/components/shared/ModelCard';
import { Search, Sparkles, AlertTriangle, SlidersHorizontal, Loader2 } from 'lucide-react';
import type { Video, Gallery, Model } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { performSearch, PerformSearchOutput } from '@/ai/flows/perform-search';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from '@/components/ui/separator';

const categories = ["all", "fashion", "nature", "urban", "art", "cinematic", "lifestyle", "technology", "monochrome"];

export default function SearchPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [searchResults, setSearchResults] = useState<PerformSearchOutput>({ videos: [], galleries: [], models: [] });
  const [error, setError] = useState<string | null>(null);

  const queryTerm = searchParams.get('q') || '';
  const typeFilter = searchParams.get('type') || 'all';
  const categoryFilter = searchParams.get('category') || 'all';

  useEffect(() => {
    startTransition(async () => {
      setError(null);
      try {
        const results = await performSearch({ 
            query: queryTerm,
            type: typeFilter as any,
            category: categoryFilter,
         });
        setSearchResults(results);
      } catch (e) {
        setError("An error occurred while searching. Please try again.");
        console.error("Search failed:", e);
        setSearchResults({ videos: [], galleries: [], models: [] });
      }
    });
  }, [queryTerm, typeFilter, categoryFilter]);

  const handleFilterChange = (value: string, filterType: 'type' | 'category') => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    if (value === 'all') {
      current.delete(filterType);
    } else {
      current.set(filterType, value);
    }
    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.push(`${pathname}${query}`);
  };

  const { videos, galleries, models } = searchResults;
  const hasResults = videos.length > 0 || galleries.length > 0 || models.length > 0;
  const totalResults = videos.length + galleries.length + models.length;

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
            <h1 className="text-4xl mb-2">Search</h1>
            <div className="text-muted-foreground flex items-center gap-2">
                {isPending 
                    ? <p>Searching for content...</p>
                    : queryTerm
                        ? <p>Results for <span className="font-bold text-white">"{queryTerm}"</span></p>
                        : <p>Explore all content</p>
                }
            </div>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
            <SlidersHorizontal className="text-muted-foreground" />
             <Select value={typeFilter} onValueChange={(value) => handleFilterChange(value, 'type')}>
                <SelectTrigger className="w-full md:w-[180px] bg-card border-border">
                    <SelectValue placeholder="Filter by Type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="videos">Videos</SelectItem>
                    <SelectItem value="galleries">Galleries</SelectItem>
                    <SelectItem value="models">Models</SelectItem>
                </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={(value) => handleFilterChange(value, 'category')}>
                <SelectTrigger className="w-full md:w-[180px] bg-card border-border">
                    <SelectValue placeholder="Filter by Category" />
                </SelectTrigger>
                <SelectContent>
                    {categories.map(cat => (
                        <SelectItem key={cat} value={cat} className="capitalize">{cat}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
      </div>
      <Separator className="mb-8" />
       
      {error && (
        <Alert variant="destructive" className="mb-8">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Search Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isPending ? (
        <div className="flex items-center justify-center min-h-[40vh]">
            <Loader2 className="h-12 w-12 text-accent animate-spin" />
        </div>
      ) : hasResults ? (
        <div className="space-y-12">
          {models.length > 0 && (
            <section>
              <h2 className="text-2xl mb-6 font-headline">Models</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {models.map(model => (
                  <ModelCard key={model.id} model={model} />
                ))}
              </div>
            </section>
          )}

          {videos.length > 0 && (
            <section>
              <h2 className="text-2xl mb-6 font-headline">Videos</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {videos.map(video => (
                  <ContentCard key={video.id} content={video} type="video" />
                ))}
              </div>
            </section>
          )}

          {galleries.length > 0 && (
            <section>
              <h2 className="text-2xl mb-6 font-headline">Galleries</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {galleries.map(gallery => (
                  <ContentCard key={gallery.id} content={gallery} type="gallery" />
                ))}
              </div>
            </section>
          )}

        </div>
      ) : (
        <div className="text-center py-20 min-h-[40vh] flex flex-col items-center justify-center bg-card border border-dashed border-border rounded-lg">
          <Search className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl mb-2">No Results Found</h2>
          <p className="text-muted-foreground">We couldn't find anything matching your search. Try a different query or adjust your filters.</p>
        </div>
      )}
    </div>
  );
}
