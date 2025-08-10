
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
import { Badge } from '@/components/ui/badge';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from '@/components/ui/card';
import { Star, Play, Image as ImageIcon, Crown, Eye, Heart, Sparkles } from 'lucide-react';

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
        </div>
    )
}

// Dynamic Model Showcase Component
const DynamicModelShowcase = ({ models }: { models: Model[] }) => {
  const [featuredModels, setFeaturedModels] = useState<Model[]>([]);

  useEffect(() => {
    // Randomize and select models for showcase
    const shuffled = [...models].sort(() => Math.random() - 0.5);
    setFeaturedModels(shuffled.slice(0, 8));
  }, [models]);

  return (
    <section className="container mx-auto px-4 py-20">
      <div className="text-center mb-16">
        <Badge className="mb-4 bg-luxury-gradient text-black font-semibold text-sm px-4 py-2">
          <Crown className="w-4 h-4 mr-2" />
          FEATURED MODELS
        </Badge>
        <h2 className="mb-6">Elite Showcase</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover our handpicked selection of world-class models
        </p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6 mb-12">
        {featuredModels.map((model, index) => (
          <Card key={model.id} className="luxury-card group overflow-hidden aspect-[3/4] relative">
            <Link href={`/models/${model.id}`} className="block w-full h-full">
              <div className="relative w-full h-full">
                <img
                  src={model.image}
                  alt={model.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 w-full p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="font-bold text-lg text-white mb-1">{model.name}</h3>
                  <p className="text-sm text-white/80">View Portfolio</p>
                </div>
                <div className="absolute top-4 right-4 bg-luxury-gradient rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Eye className="w-4 h-4 text-black" />
                </div>
              </div>
            </Link>
          </Card>
        ))}
      </div>
      
      <div className="text-center">
        <Button asChild className="btn-luxury px-8 py-3 text-lg">
          <Link href="/models">Discover All Models</Link>
        </Button>
      </div>
    </section>
  );
};



// Video Wall Component
const VideoWall = ({ videos }: { videos: Video[] }) => {
  const [featuredVideos, setFeaturedVideos] = useState<Video[]>([]);

  useEffect(() => {
    // Select recent high-quality videos for the wall
    const publishedVideos = videos.filter(v => v.status === 'Published');
    const shuffled = publishedVideos.sort(() => Math.random() - 0.5);
    setFeaturedVideos(shuffled.slice(0, 6));
  }, [videos]);

  return (
    <section className="container mx-auto px-4 py-20">
      <div className="text-center mb-16">
        <Badge className="mb-4 bg-luxury-gradient text-black font-semibold text-sm px-4 py-2">
          <Play className="w-4 h-4 mr-2" />
          VIDEO WALL
        </Badge>
        <h2 className="mb-6">Motion Gallery</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Experience our premium video collection in motion
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {featuredVideos.map((video, index) => (
          <Card key={video.id} className="luxury-card group overflow-hidden aspect-video relative">
            <Link href={`/videos/${video.id}`} className="block w-full h-full">
              <div className="relative w-full h-full">
                <video
                  src={video.videoUrl}
                  poster={video.image}
                  muted
                  loop
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onMouseEnter={(e) => e.currentTarget.play().catch(() => {})}
                  onMouseLeave={(e) => {
                    e.currentTarget.pause();
                    e.currentTarget.currentTime = 0;
                  }}
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors duration-300" />
                <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/80 to-transparent">
                  <h3 className="font-bold text-xl text-white mb-2">{video.title}</h3>
                  <p className="text-white/80">{video.models.join(', ')}</p>
                </div>
                <div className="absolute center-0 inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-luxury-gradient rounded-full p-4">
                    <Play className="w-8 h-8 text-black fill-black" />
                  </div>
                </div>
              </div>
            </Link>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <Button asChild className="btn-luxury px-8 py-3 text-lg">
          <Link href="/videos">View Full Collection</Link>
        </Button>
      </div>
    </section>
  );
};

export default function Home() {
  const [featuredVideos, setFeaturedVideos] = useState<Video[]>([]);
  const [topVideos, setTopVideos] = useState<Video[]>([]);
  const [latestVideos, setLatestVideos] = useState<Video[]>([]);
  const [latestGalleries, setLatestGalleries] = useState<Gallery[]>([]);
  const [topModels, setTopModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Use a consistent seed for initial render to prevent hydration mismatches
    const shuffleArray = <T,>(array: T[], seed: number = 42): T[] => {
        const shuffled = [...array];
        // Seeded random for consistent initial render
        let random = seed;
        for (let i = shuffled.length - 1; i > 0; i--) {
            random = (random * 9301 + 49297) % 233280;
            const j = Math.floor((random / 233280) * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };
    
    const allVideos = getVideos();
    const allModels = getModels();
    const allGalleries = getGalleries();
    
    const shuffledModels = shuffleArray(allModels, 42);
    const shuffledGalleries = shuffleArray(allGalleries.filter(g => g.status === 'Published'), 84);

    const publishedVideos = allVideos.filter(v => v.status === 'Published');
    
    setFeaturedVideos(publishedVideos.filter(v => v.isFeatured));
    
    const nonFeaturedVideos = publishedVideos
        .filter(v => !v.isFeatured)
        .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    setTopVideos(nonFeaturedVideos.slice(0, 3));
    setLatestVideos(nonFeaturedVideos.slice(3, 12)); 
    setLatestGalleries(shuffledGalleries.slice(0, 12));
    setTopModels(shuffledModels.slice(0, 12)); 
    setLoading(false);
  }, []);

  if (loading) {
    return <HomePageSkeleton />;
  }

  const heroContentSource = topModels.slice(0, 5).map(m => ({ id: m.id, image: m.image, name: m.name, type: 'model' as const }));

  const heroItems = heroContentSource.map(item => ({
      id: item.id,
      img: item.image,
      modelName: item.name,
      profileUrl: `/models/${item.id}`,
      thumbImg: item.image,
  }));

  return (
    <main className="overflow-x-hidden luxury-dark-gradient">
      <HeroCarousel items={heroItems} />

      {/* Dynamic Model Showcase - Replaces Stats Section */}
      <DynamicModelShowcase models={topModels} />

      <div className="space-y-16 sm:space-y-24 lg:space-y-32 my-16 sm:my-24 lg:my-32 w-full-safe max-w-screen-safe">
        {/* Featured Content Section */}
        {topVideos.length > 0 && (
            <section className="container mx-auto px-4">
                <div className="text-center mb-16">
                  <Badge className="mb-4 bg-luxury-gradient text-black font-semibold text-sm px-4 py-2">
                    <Star className="w-4 h-4 mr-2" />
                    FEATURED CONTENT
                  </Badge>
                  <h2 className="mb-6">Curated Excellence</h2>
                  <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Hand-picked premium content from our top creators
                  </p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div className="lg:col-span-1 luxury-fade-in">
                    {topVideos[0] && <ContentCard content={topVideos[0]} type="video" priority={true}/>}
                  </div>
                  <div className="lg:col-span-1 grid grid-cols-1 gap-8 luxury-slide-up">
                    {topVideos[1] && <ContentCard key={topVideos[1].id} content={topVideos[1]} type="video" />}
                    {topVideos[2] && <ContentCard key={topVideos[2].id} content={topVideos[2]} type="video" />}
                  </div>
                </div>
            </section>
        )}

        

        {/* Video Wall Section */}
        <VideoWall videos={[...featuredVideos, ...latestVideos]} />
        
        {/* Galleries Section */}
        {latestGalleries.length > 0 && (
            <section className="container mx-auto px-4">
                <div className="text-center mb-16">
                  <Badge className="mb-4 bg-luxury-gradient text-black font-semibold text-sm px-4 py-2">
                    <ImageIcon className="w-4 h-4 mr-2" />
                    PHOTO GALLERIES
                  </Badge>
                  <h2 className="mb-6">Visual Masterpieces</h2>
                  <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Explore our collection of stunning photography from world-class artists
                  </p>
                </div>
                
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
                  <CarouselPrevious className="ml-14 luxury-glow"/>
                  <CarouselNext className="mr-14 luxury-glow"/>
                </Carousel>
                
                  <div className="flex justify-center mt-12">
                      <Button asChild className="btn-luxury px-8 py-3 text-lg">
                          <Link href="/galleries">Explore All Galleries</Link>
                      </Button>
                  </div>
            </section>      
        )}

        {/* Models Section */}
        {topModels.length > 0 && (
            <section className="container mx-auto px-4">
                  <div className="text-center mb-16">
                    <Badge className="mb-4 bg-luxury-gradient text-black font-semibold text-sm px-4 py-2">
                      <Crown className="w-4 h-4 mr-2" />
                      ELITE MODELS
                    </Badge>
                    <h2 className="mb-6">World-Class Talent</h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                      Meet our exclusive roster of international models and fashion icons
                    </p>
                  </div>
                  
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
                            <ModelCard model={model} isHomepage={true}/>
                        </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="ml-14 luxury-glow" />
                    <CarouselNext className="mr-14 luxury-glow"/>
                    </Carousel>

                  <div className="flex justify-center mt-12">
                      <Button asChild className="btn-luxury px-8 py-3 text-lg">
                          <Link href="/models">Discover All Models</Link>
                      </Button>
                  </div>
            </section>
        )}

        {/* Latest Videos Section */}
        {latestVideos.length > 0 && (
             <section className="container mx-auto px-4">
                <div className="text-center mb-16">
                  <Badge className="mb-4 bg-luxury-gradient text-black font-semibold text-sm px-4 py-2">
                    <Play className="w-4 h-4 mr-2" />
                    LATEST RELEASES
                  </Badge>
                  <h2 className="mb-6">Fresh Content</h2>
                  <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    The newest additions to our premium video collection
                  </p>
                </div>
                
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
                  <CarouselPrevious className="ml-14 luxury-glow"/>
                  <CarouselNext className="mr-14 luxury-glow"/>
                </Carousel>
                
                <div className="text-center mt-12">
                    <Button asChild className="btn-luxury px-8 py-3 text-lg">
                        <Link href="/videos">View All Videos</Link>
                    </Button>
                </div>
            </section>
        )}
      </div>
    </main>
  );
}
