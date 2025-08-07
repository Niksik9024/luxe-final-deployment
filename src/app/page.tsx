
'use client';

import React, { useState, useEffect } from 'react';
import type { Model, Video, Gallery } from '@/lib/types';
import { HeroCarousel } from '@/components/client/HeroCarousel';
import { ContentCard } from '@/components/shared/ContentCard';
import { ModelCard } from '@/components/shared/ModelCard';
import { HomePageClientContent } from '@/components/client/HomePageClientContent';
import { Separator } from '@/components/ui/separator';
import { getVideos, getGalleries, getModels } from '@/lib/localStorage';
import { Skeleton } from '@/components/ui/skeleton';

function HomePageSkeleton() {
    return (
        <div>
            <Skeleton className="w-full h-[92vh]" />
            <div className="py-12 md:py-20 bg-background">
                <div className="container mx-auto px-4">
                    <Skeleton className="h-8 w-64 mx-auto mb-8" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <Skeleton className="aspect-video" />
                        <Skeleton className="aspect-video" />
                        <Skeleton className="aspect-video" />
                    </div>
                </div>
            </div>
             <div className="py-12 md:py-20 bg-background">
                <div className="container mx-auto px-4">
                    <Skeleton className="h-8 w-64 mx-auto mb-8" />
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                       {Array.from({length: 6}).map((_, i) => <Skeleton key={i} className="aspect-[9/16]" />)}
                    </div>
                </div>
            </div>
        </div>
    )
}


export default function Home() {
  const [featuredVideos, setFeaturedVideos] = useState<Video[]>([]);
  const [latestVideos, setLatestVideos] = useState<Video[]>([]);
  const [latestGalleries, setLatestGalleries] = useState<Gallery[]>([]);
  const [topModels, setTopModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const allVideos = getVideos();
    const allModels = getModels();
    const allGalleries = getGalleries();
    
    setFeaturedVideos(allVideos.filter(v => v.isFeatured && v.status === 'Published'));
    setLatestVideos(allVideos.filter(v => !v.isFeatured && v.status === 'Published').slice(0, 3));
    setLatestGalleries(allGalleries.filter(g => g.status === 'Published').slice(0, 6));
    setTopModels(allModels.slice(0, 5));
    setLoading(false);
  }, []);

  if (loading) {
    return <HomePageSkeleton />;
  }

  const heroContentSource = featuredVideos.length > 0 
    ? featuredVideos.map(v => ({ id: v.id, image: v.image, name: v.title, type: 'video' as const })) 
    : topModels.slice(0, 5).map(m => ({ id: m.id, image: m.image, name: m.name, type: 'model' as const }));

  const heroItems = heroContentSource.map(item => ({
      id: item.id,
      img: item.image,
      modelName: item.name,
      profileUrl: `/${item.type === 'video' ? 'videos' : 'models'}/${item.id}`,
      thumbImg: item.image,
  }));

  return (
    <main>
      <HeroCarousel items={heroItems} />

      <HomePageClientContent />
      
      {latestVideos.length > 0 && (
          <section className="py-12 md:py-20 bg-background">
              <div className="container mx-auto px-4">
                  <h2 className="text-3xl font-bold mb-8 text-center uppercase tracking-widest">Latest Scenes</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {latestVideos.map((video) => (
                      <ContentCard key={video.id} content={video} type="video" />
                    ))}
                  </div>
              </div>
          </section>
      )}

      <Separator />
      
      {latestGalleries.length > 0 && (
          <section className="py-12 md:py-20 bg-background">
              <div className="container mx-auto px-4">
                  <h2 className="text-3xl font-bold mb-8 text-center uppercase tracking-widest">New Galleries</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {latestGalleries.map((gallery) => (
                          <ContentCard key={gallery.id} content={gallery} type="gallery"/>
                      ))}
                  </div>
              </div>
          </section>
      )}

       <Separator />

      {topModels.length > 0 && (
           <section className="py-12 md:py-20 bg-background">
                <div className="container mx-auto px-4">
                     <h2 className="text-3xl font-bold mb-8 text-center uppercase tracking-widest">Featured Models</h2>
                     <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {topModels.map((model) => (
                            <ModelCard key={model.id} model={model} />
                        ))}
                    </div>
                </div>
           </section>
      )}
    </main>
  );
}
