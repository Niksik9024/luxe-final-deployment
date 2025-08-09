
'use client';

import React, { useState, useEffect } from 'react';
import type { Model, Video, Gallery } from '@/lib/types';
import Link from 'next/link';
import Image from 'next/image';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Crown, Star, Diamond, Sparkles, TrendingUp, Award, Eye, Heart, Play, Image as ImageIcon } from 'lucide-react';

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

const StatsCard = ({ icon, title, value, description }: { 
  icon: React.ReactNode, 
  title: string, 
  value: string, 
  description: string 
}) => (
  <Card className="luxury-card group">
    <CardContent className="p-6 text-center">
      <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-luxury-gradient">
        {icon}
      </div>
      <div className="text-3xl font-bold luxury-text-gradient mb-2">{value}</div>
      <h3 className="font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);



export default function Home() {
  const [featuredVideos, setFeaturedVideos] = useState<Video[]>([]);
  const [topVideos, setTopVideos] = useState<Video[]>([]);
  const [latestVideos, setLatestVideos] = useState<Video[]>([]);
  const [latestGalleries, setLatestGalleries] = useState<Gallery[]>([]);
  const [topModels, setTopModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const shuffleArray = <T,>(array: T[]): T[] => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };
    
    const allVideos = getVideos();
    const allModels = getModels();
    const allGalleries = getGalleries();
    
    const shuffledModels = shuffleArray(allModels);
    const shuffledGalleries = shuffleArray(allGalleries.filter(g => g.status === 'Published'));

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

      {/* Luxury Stats Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-luxury-gradient text-black font-semibold text-sm px-4 py-2">
            EXCLUSIVE PLATFORM
          </Badge>
          <h2 className="mb-6">Platform Excellence</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join the world's most exclusive fashion and modeling platform
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <StatsCard 
            icon={<Crown className="w-8 h-8 text-black" />}
            title="Elite Models"
            value={`${topModels.length}+`}
            description="Verified professionals"
          />
          <StatsCard 
            icon={<Play className="w-8 h-8 text-black" />}
            title="Premium Videos"
            value={`${featuredVideos.length + latestVideos.length}+`}
            description="High-quality content"
          />
          <StatsCard 
            icon={<ImageIcon className="w-8 h-8 text-black" />}
            title="Exclusive Galleries"
            value={`${latestGalleries.length}+`}
            description="Curated collections"
          />
          <StatsCard 
            icon={<Award className="w-8 h-8 text-black" />}
            title="Premium Features"
            value="100%"
            description="Luxury experience"
          />
        </div>
      </section>

      <div className="space-y-32 my-32">
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

        {/* Promotional Showcase Section */}
        <section className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-luxury-gradient text-black font-semibold text-sm px-4 py-2">
              <Sparkles className="w-4 h-4 mr-2" />
              FEATURED SHOWCASE
            </Badge>
            <h2 className="mb-6">Luxury Experience</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Immerse yourself in our world of exclusive content and elite talent
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[600px]">
            {/* Large Featured Model Promo */}
            <div className="lg:col-span-8 relative overflow-hidden rounded-2xl luxury-glow group">
              {topModels[0] && (
                <>
                  <Image
                    src={topModels[0].image}
                    alt={topModels[0].name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <Badge className="mb-4 bg-luxury-gradient text-black font-bold">
                      <Crown className="w-4 h-4 mr-2" />
                      FEATURED MODEL
                    </Badge>
                    <h3 className="text-4xl font-bold text-white mb-2">{topModels[0].name}</h3>
                    <p className="text-xl text-white/80 mb-6">Elite Fashion Model</p>
                    <Button asChild className="btn-luxury">
                      <Link href={`/models/${topModels[0].id}`}>
                        View Portfolio
                      </Link>
                    </Button>
                  </div>
                </>
              )}
            </div>

            {/* Right Side - Video and Gallery Promos */}
            <div className="lg:col-span-4 space-y-8">
              {/* Premium Video Promo */}
              {topVideos[0] && (
                <div className="relative h-[280px] overflow-hidden rounded-2xl luxury-glow group">
                  <Image
                    src={topVideos[0].thumbnail}
                    alt={topVideos[0].title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-luxury-gradient flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play className="w-8 h-8 text-black ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <Badge className="mb-2 bg-red-600 text-white font-bold text-xs">
                      <Play className="w-3 h-3 mr-1" />
                      PREMIUM VIDEO
                    </Badge>
                    <h4 className="text-lg font-bold text-white leading-tight">{topVideos[0].title}</h4>
                  </div>
                  <Link href={`/videos/${topVideos[0].id}`} className="absolute inset-0" />
                </div>
              )}

              {/* Gallery Collection Promo */}
              {latestGalleries[0] && (
                <div className="relative h-[280px] overflow-hidden rounded-2xl luxury-glow group">
                  <Image
                    src={latestGalleries[0].image}
                    alt={latestGalleries[0].title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                      <ImageIcon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <Badge className="mb-2 bg-purple-600 text-white font-bold text-xs">
                      <ImageIcon className="w-3 h-3 mr-1" />
                      GALLERY COLLECTION
                    </Badge>
                    <h4 className="text-lg font-bold text-white leading-tight">{latestGalleries[0].title}</h4>
                    <p className="text-sm text-white/70">{latestGalleries[0].album?.length || 0} Photos</p>
                  </div>
                  <Link href={`/galleries/${latestGalleries[0].id}`} className="absolute inset-0" />
                </div>
              )}
            </div>
          </div>

          {/* Bottom CTA Banner */}
          <div className="mt-16 relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 border border-primary/30">
            <div className="absolute inset-0 bg-luxury-gradient opacity-5" />
            <div className="relative z-10 p-8 md:p-12 text-center">
              <Crown className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-3xl font-bold mb-4">Experience Luxury Like Never Before</h3>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of members who trust us for premium fashion content and exclusive model portfolios
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button asChild className="btn-luxury text-lg px-8 py-3">
                  <Link href="/models">Explore Models</Link>
                </Button>
                <Button asChild variant="outline" className="border-primary/40 hover:bg-primary/10 text-lg px-8 py-3">
                  <Link href="/videos">Watch Videos</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        
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
