
'use client';

import React, { useState, useEffect } from 'react';
import type { Model, Video, Gallery } from '@/lib/types';
import Link from 'next/link';
import { HeroCarousel } from '@/components/client/HeroCarousel';
import { getVideos, getGalleries, getModels } from '@/lib/localStorage';
import { Skeleton } from '@/components/ui/skeleton';
import { ContentCard } from '@/components/shared/ContentCard';
import { ModelCard } from '@/components/shared/ModelCard';
import { Button } from '@/components/ui/button';

function HomePageSkeleton() {
    return (
        <div>
            <Skeleton className="w-full h-[92vh]" />
            <div className="py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <Skeleton className="h-10 w-72 mx-auto mb-12" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <Skeleton className="aspect-video" />
                        <Skeleton className="aspect-video" />
                        <Skeleton className="aspect-video" />
                    </div>
                </div>
            </div>
             <div className="py-16 md:py-24 bg-card">
                <div className="container mx-auto px-4">
                    <Skeleton className="h-10 w-72 mx-auto mb-12" />
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
  const [topVideos, setTopVideos] = useState<Video[]>([]);
  const [latestVideos, setLatestVideos] = useState<Video[]>([]);
  const [latestGalleries, setLatestGalleries] = useState<Gallery[]>([]);
  const [topModels, setTopModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const allVideos = getVideos();
    const allModels = getModels();
    const allGalleries = getGalleries();
    
    setFeaturedVideos(allVideos.filter(v => v.isFeatured && v.status === 'Published'));
    
    const nonFeaturedVideos = allVideos
        .filter(v => !v.isFeatured && v.status === 'Published')
        .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    setTopVideos(nonFeaturedVideos.slice(0, 3));
    setLatestVideos(nonFeaturedVideos.slice(3, 8));
    setLatestGalleries(allGalleries.filter(g => g.status === 'Published').slice(0, 6));
    setTopModels(allModels.slice(0, 6));
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

      {topVideos.length > 0 && (
          <section className="py-16 md:py-24 bg-background">
              <div className="container mx-auto px-4">
                  <h2 className="text-4xl font-bold mb-12 text-center uppercase tracking-widest">Top Videos</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {topVideos.map((video) => (
                      <ContentCard key={video.id} content={video} type="video" />
                    ))}
                  </div>
              </div>
          </section>
      )}

      {latestVideos.length > 0 && (
          <section className="py-16 md:py-24 bg-card">
              <div className="container mx-auto px-4">
                  <h2 className="text-4xl font-bold mb-12 text-center uppercase tracking-widest">Latest Videos</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
                    {latestVideos.map((video) => (
                      <ContentCard key={video.id} content={video} type="video" />
                    ))}
                  </div>
                   <div className="flex justify-center mt-12">
                        <Button asChild variant="outline" size="lg">
                            <Link href="/videos">View All Videos</Link>
                        </Button>
                    </div>
              </div>
          </section>
      )}
      
      {latestGalleries.length > 0 && (
          <section className="py-16 md:py-24 bg-background">
              <div className="container mx-auto px-4">
                  <h2 className="text-4xl font-bold mb-12 text-center uppercase tracking-widest">Galleries</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {latestGalleries.map((gallery) => (
                          <ContentCard key={gallery.id} content={gallery} type="gallery"/>
                      ))}
                  </div>
                   <div className="flex justify-center mt-12">
                        <Button asChild variant="outline" size="lg">
                            <Link href="/galleries">View All Galleries</Link>
                        </Button>
                    </div>
              </div>
          </section>      
      )}

      {topModels.length > 0 && (
           <section className="py-16 md:py-24 bg-card">
                <div className="container mx-auto px-4">
                     <h2 className="text-4xl font-bold mb-12 text-center uppercase tracking-widest">Models</h2>
                     <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {topModels.map((model) => (
                            <ModelCard key={model.id} model={model} />
                        ))}
                    </div>
                    <div className="flex justify-center mt-12">
                        <Button asChild variant="outline" size="lg">
                            <Link href="/models">View All Models</Link>
                        </Button>
                    </div>
                </div>
           </section>
      )}
    </main>
  );
}
