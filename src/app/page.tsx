
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
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"


function HomePageSkeleton() {
    return (
        <div className="space-y-24 md:space-y-32">
            <Skeleton className="w-full h-[92vh]" />
            <div className="container mx-auto px-4">
                <Skeleton className="h-10 w-72 mx-auto mb-16" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Skeleton className="aspect-video" />
                    <div className="space-y-8">
                      <Skeleton className="aspect-video" />
                      <Skeleton className="aspect-video" />
                    </div>
                </div>
            </div>
             <div className="container mx-auto px-4">
                <Skeleton className="h-10 w-72 mx-auto mb-16" />
                <Skeleton className="h-72 w-full" />
            </div>
             <div className="container mx-auto px-4">
                <Skeleton className="h-10 w-72 mx-auto mb-16" />
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                   {Array.from({length: 6}).map((_, i) => <Skeleton key={i} className="aspect-[9/16]" />)}
                </div>
            </div>
             <div className="container mx-auto px-4">
                <Skeleton className="h-10 w-72 mx-auto mb-16" />
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                   {Array.from({length: 6}).map((_, i) => <Skeleton key={i} className="aspect-[9/16]" />)}
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
    
    const publishedVideos = allVideos.filter(v => v.status === 'Published');
    
    setFeaturedVideos(publishedVideos.filter(v => v.isFeatured));
    
    const nonFeaturedVideos = publishedVideos
        .filter(v => !v.isFeatured)
        .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    setTopVideos(nonFeaturedVideos.slice(0, 3));
    setLatestVideos(nonFeaturedVideos.slice(3, 10)); // fetch more for carousel
    setLatestGalleries(allGalleries.filter(g => g.status === 'Published').slice(0, 6));
    setTopModels(allModels.slice(0, 10)); // fetch more for carousel
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
    <main className="overflow-x-hidden">
      <HeroCarousel items={heroItems} />

      <div className="space-y-24 md:space-y-32 my-24 md:my-32">
        {topVideos.length > 0 && (
            <section className="container mx-auto px-4">
                <h2 className="mb-12 text-center">Top Videos</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div className="lg:col-span-1">
                    <ContentCard content={topVideos[0]} type="video" />
                  </div>
                  <div className="lg:col-span-1 grid grid-cols-1 gap-8">
                    {topVideos.slice(1).map((video) => (
                      <ContentCard key={video.id} content={video} type="video" />
                    ))}
                  </div>
                </div>
            </section>
        )}
        
        {latestGalleries.length > 0 && (
            <section className="container mx-auto px-4">
                <h2 className="mb-12 text-center">Galleries</h2>
                 <Carousel
                  opts={{
                    align: "start",
                    loop: true,
                  }}
                  className="w-full"
                >
                  <CarouselContent>
                    {latestGalleries.map((gallery, index) => (
                       <CarouselItem key={index} className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/6">
                        <ContentCard content={gallery} type="gallery"/>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="ml-14"/>
                  <CarouselNext className="mr-14"/>
                </Carousel>
                  <div className="flex justify-center mt-12">
                      <Button asChild variant="outline" size="lg">
                          <Link href="/galleries">View All Galleries</Link>
                      </Button>
                  </div>
            </section>      
        )}

        {topModels.length > 0 && (
            <section className="container mx-auto px-4">
                  <h2 className="mb-12 text-center">Models</h2>
                  <Carousel
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                    className="w-full"
                    >
                    <CarouselContent>
                        {topModels.map((model, index) => (
                        <CarouselItem key={index} className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/6">
                            <ModelCard model={model} />
                        </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="ml-14" />
                    <CarouselNext className="mr-14"/>
                    </Carousel>

                  <div className="flex justify-center mt-12">
                      <Button asChild variant="outline" size="lg">
                          <Link href="/models">View All Models</Link>
                      </Button>
                  </div>
            </section>
        )}

        {latestVideos.length > 0 && (
             <section className="container mx-auto px-4">
                <h2 className="mb-12 text-center">Latest Videos</h2>
                <Carousel
                  opts={{
                    align: "start",
                    loop: true,
                  }}
                  className="w-full"
                >
                  <CarouselContent>
                    {latestVideos.map((video, index) => (
                      <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                        <ContentCard content={video} type="video" />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="ml-14"/>
                  <CarouselNext className="mr-14"/>
                </Carousel>
                <div className="text-center mt-12">
                    <Button asChild variant="outline" size="lg">
                        <Link href="/videos">View All Videos</Link>
                    </Button>
                </div>
            </section>
        )}
      </div>
    </main>
  );
}
