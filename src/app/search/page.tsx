
'use client';

import React, { useEffect, useState, useTransition, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ContentCard } from '@/components/shared/ContentCard';
import { ModelCard } from '@/components/shared/ModelCard';
import { Search as SearchIcon, Loader2 } from 'lucide-react';
import type { Video, Gallery, Model } from '@/lib/types';
import { getVideos, getGalleries, getModels } from '@/lib/localStorage';
import { Separator } from '@/components/ui/separator';

type SearchResults = {
    videos: Video[];
    galleries: Gallery[];
    models: Model[];
}

function SearchPageComponent() {
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [searchResults, setSearchResults] = useState<SearchResults>({ videos: [], galleries: [], models: [] });

  const queryTerm = searchParams.get('q')?.toLowerCase() || '';

  useEffect(() => {
    startTransition(() => {
        if (!queryTerm) {
            setSearchResults({ videos: [], galleries: [], models: [] });
            return;
        }

      const allVideos = getVideos().filter(v => v.status === 'Published');
      const allGalleries = getGalleries().filter(g => g.status === 'Published');
      const allModels = getModels();

      const filteredVideos = allVideos.filter(v => v.keywords.some(k => k.includes(queryTerm)));
      const filteredGalleries = allGalleries.filter(g => g.keywords.some(k => k.includes(queryTerm)));
      const filteredModels = allModels.filter(m => m.name.toLowerCase().includes(queryTerm));

      setSearchResults({
          videos: filteredVideos,
          galleries: filteredGalleries,
          models: filteredModels,
      });
    });
  }, [queryTerm]);


  const { videos, galleries, models } = searchResults;
  const hasResults = videos.length > 0 || galleries.length > 0 || models.length > 0;

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
            <h1 className="text-4xl mb-2">Search Results</h1>
            <div className="text-muted-foreground flex items-center gap-2">
                {isPending 
                    ? <p>Searching for content...</p>
                    : queryTerm
                        ? <p>Showing results for <span className="font-bold text-white">"{searchParams.get('q')}"</span></p>
                        : <p>Please enter a search term.</p>
                }
            </div>
        </div>
      </div>
      <Separator className="mb-8" />
       
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
          <SearchIcon className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl mb-2">No Results Found</h2>
          <p className="text-muted-foreground">We couldn't find anything matching your search. Try a different query or adjust your filters.</p>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="h-12 w-12 text-accent animate-spin" /></div>}>
            <SearchPageComponent />
        </Suspense>
    )
}
