'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
import { Play, Image as ImageIcon, Crown, Eye } from 'lucide-react';

function HomePageSkeleton() {
    return (
        <div className="space-y-16 md:space-y-24">
            <Skeleton className="w-full h-[92vh]" />
            <div className="container mx-auto px-4">
                <Skeleton className="h-8 w-48 mx-auto mb-12" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({length: 6}).map((_, i) => 
                        <Skeleton key={i} className="aspect-video" />
                    )}
                </div>
            </div>
            <div className="container mx-auto px-4">
                <Skeleton className="h-8 w-48 mx-auto mb-12" />
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                   {Array.from({length: 6}).map((_, i) => 
                       <Skeleton key={i} className="aspect-[3/4]" />
                   )}
                </div>
            </div>
        </div>
    )
}

// Simplified Featured Content Section
const FeaturedContent = ({ videos }: { videos: Video[] }) => {
  if (!videos.length) return null;

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <Badge className="mb-4 bg-luxury-gradient text-black font-semibold px-4 py-2">
          <Play className="w-4 h-4 mr-2" />
          FEATURED
        </Badge>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Premium Content</h2>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          Discover our curated selection of exclusive content
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.slice(0, 6).map((video) => (
          <ContentCard key={video.id} content={video} type="video" />
        ))}
      </div>

      <div className="text-center mt-12">
        <Button asChild className="btn-luxury px-8 py-3">
          <Link href="/videos">View All Videos</Link>
        </Button>
      </div>
    </section>
  );
};

// Simplified Models Showcase
const ModelsShowcase = ({ models }: { models: Model[] }) => {
  if (!models.length) return null;

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <Badge className="mb-4 bg-luxury-gradient text-black font-semibold px-4 py-2">
          <Crown className="w-4 h-4 mr-2" />
          MODELS
        </Badge>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Elite Portfolio</h2>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          Meet our exclusive roster of professional models
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {models.slice(0, 12).map((model) => (
          <Card key={model.id} className="luxury-card group overflow-hidden aspect-[3/4] relative">
            <Link href={`/models/${model.id}`} className="block w-full h-full">
              <div className="relative w-full h-full">
                <img
                  src={model.image}
                  alt={model.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 w-full p-3">
                  <h3 className="font-semibold text-white text-sm">{model.name}</h3>
                </div>
                <div className="absolute top-3 right-3 bg-luxury-gradient rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Eye className="w-3 h-3 text-black" />
                </div>
              </div>
            </Link>
          </Card>
        ))}
      </div>

      <div className="text-center mt-12">
        <Button asChild className="btn-luxury px-8 py-3">
          <Link href="/models">Discover All Models</Link>
        </Button>
      </div>
    </section>
  );
};

// Simplified Galleries Section
const GalleriesSection = ({ galleries }: { galleries: Gallery[] }) => {
  if (!galleries.length) return null;

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <Badge className="mb-4 bg-luxury-gradient text-black font-semibold px-4 py-2">
          <ImageIcon className="w-4 h-4 mr-2" />
          GALLERIES
        </Badge>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Photo Collections</h2>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          Explore stunning photography from our artists
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
          {galleries.map((gallery) => (
            <CarouselItem key={gallery.id} className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5">
              <ContentCard content={gallery} type="gallery"/>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="ml-12 luxury-glow"/>
        <CarouselNext className="mr-12 luxury-glow"/>
      </Carousel>

      <div className="text-center mt-12">
        <Button asChild className="btn-luxury px-8 py-3">
          <Link href="/galleries">View All Galleries</Link>
        </Button>
      </div>
    </section>
  );
};

export default function Home() {
  const [featuredVideos, setFeaturedVideos] = useState<Video[]>([]);
  const [topVideos, setTopVideos] = useState<Video[]>([]);
  const [latestGalleries, setLatestGalleries] = useState<Gallery[]>([]);
  const [topModels, setTopModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);

  // Generate dynamic hero content that changes on refresh - moved before any conditional logic
  const heroContentSource = useMemo(() => {
    if (!topModels || topModels.length === 0) return [];
    const shuffledForHero = [...topModels].sort(() => Math.random() - 0.5);
    return shuffledForHero.slice(0, 5).map(m => ({ 
      id: m.id, 
      name: m.name, 
      image: m.image, 
      description: m.description 
    }));
  }, [topModels]);

  useEffect(() => {
    // Generate dynamic seed based on current time for true randomization on each refresh
    const generateDynamicSeed = () => {
      return Math.floor(Date.now() / 1000) + Math.random() * 1000;
    };

    const shuffleArray = <T,>(array: T[], seed?: number): T[] => {
        const shuffled = [...array];
        const actualSeed = seed || generateDynamicSeed();
        let random = actualSeed;
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

    // Dynamic shuffling with different seeds for each section
    const shuffledModels = shuffleArray(allModels, generateDynamicSeed());
    const shuffledGalleries = shuffleArray(allGalleries.filter(g => g.status === 'Published'), generateDynamicSeed());

    const publishedVideos = allVideos.filter(v => v.status === 'Published');

    // Shuffle featured videos for dynamic display
    const featuredVideos = shuffleArray(publishedVideos.filter(v => v.isFeatured), generateDynamicSeed());
    setFeaturedVideos(featuredVideos);

    // Shuffle non-featured videos and mix with some featured ones for variety
    const nonFeaturedVideos = shuffleArray(publishedVideos.filter(v => !v.isFeatured), generateDynamicSeed());

    setTopVideos(nonFeaturedVideos.slice(0, 6));
    setLatestGalleries(shuffledGalleries.slice(0, 12));
    setTopModels(shuffledModels.slice(0, 12)); 
    setLoading(false);
  }, []);

  if (loading) {
    return <HomePageSkeleton />;
  }

  const heroItems = heroContentSource.map(item => ({
      id: item.id,
      img: item.image,
      modelName: item.name,
      profileUrl: `/models/${item.id}`,
      thumbImg: item.image,
  }));

  return (
    <main className="overflow-x-hidden bg-background">
      <HeroCarousel items={heroItems} />

      <div className="space-y-16 md:space-y-24 py-8">
        {/* Featured Content Section */}
        <FeaturedContent videos={[...featuredVideos, ...topVideos]} />

        {/* Models Showcase */}
        <ModelsShowcase models={topModels} />

        {/* Galleries Section */}
        <GalleriesSection galleries={latestGalleries} />
      </div>
    </main>
  );
}