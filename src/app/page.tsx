
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ContentCard } from '@/components/shared/ContentCard';
import { ModelCard } from '@/components/shared/ModelCard';
import { ArrowRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { Video, Gallery, Model } from '@/lib/types';
import { adminDb } from '@/lib/firebase-admin';
import { HomePageClientContent } from '@/components/client/HomePageClientContent';
import { Card, CardContent } from '@/components/ui/card';
import { HeroCarousel } from '@/components/client/HeroCarousel';

// Revalidate this page every 5 minutes
export const revalidate = 300;

// Fisher-Yates shuffle algorithm
function shuffle(array: any[]) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}


async function getHomePageData() {
    if (!adminDb) {
        return { 
            topVideos: [],
            latestVideos: [],
            promoImage: null,
            upcomingVideo: null,
            models: [],
            randomizedImages: [],
        };
    }
    try {
        // Fetch published videos, ordered by date
        const videosQuery = adminDb.collection('videos')
            .where('status', '==', 'Published')
            .orderBy('date', 'desc');
        
        // Fetch published galleries, ordered by date
        const galleriesQuery = adminDb.collection('galleries')
            .where('status', '==', 'Published')
            .orderBy('date', 'desc');

        const modelsQuery = adminDb.collection('models').get();

        const [
          videosSnap,
          galleriesSnap,
          modelsSnap,
        ] = await Promise.all([
            videosQuery.get(),
            galleriesQuery.get(),
            modelsQuery,
        ]);

        const allPublishedVideos = videosSnap.docs
            .map(doc => ({ id: doc.id, ...doc.data() } as Video));
            
        const allPublishedGalleries = galleriesSnap.docs
            .map(doc => ({ id: doc.id, ...doc.data() } as Gallery));
        
        const topVideos = allPublishedVideos.slice(0, 3);
        const latestVideos = allPublishedVideos.slice(0, 6);
        
        const promoImage = allPublishedGalleries.length > 0 ? allPublishedGalleries[0] : null;
        const randomizedImages = allPublishedGalleries.slice(0, 6);
        
        const upcomingVideo = allPublishedVideos.find(v => v.id !== (allPublishedVideos.find(v => v.isFeatured) || allPublishedVideos[0])?.id) || (allPublishedVideos.length > 1 ? allPublishedVideos[1] : null);
        
        // Fetch and shuffle all models
        const allModels = modelsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Model));
        const randomizedModels = shuffle(allModels);

        return { 
            topVideos,
            latestVideos,
            promoImage,
            upcomingVideo,
            models: randomizedModels, // Pass the shuffled array
            randomizedImages,
        };
    } catch (error) {
        console.error("Error fetching homepage data:", error);
        // Return empty state to prevent crashing the page
        return { 
            topVideos: [],
            latestVideos: [],
            promoImage: null,
            upcomingVideo: null,
            models: [],
            randomizedImages: [],
        };
    }
}

const PlaceholderCard = ({ text, hint }: { text: string, hint: string }) => (
    <Card className="aspect-video w-full flex items-center justify-center bg-muted/50 border-2 border-dashed border-border">
        <div className="text-center text-muted-foreground">
            <p className="font-bold">{text}</p>
            <p className="text-sm">{hint}</p>
        </div>
    </Card>
);

const GalleryPlaceholderCard = ({ text, hint }: { text: string, hint: string }) => (
    <Card className="aspect-[2/3] w-full flex items-center justify-center bg-muted/50 border-2 border-dashed border-border">
        <div className="text-center text-muted-foreground p-2">
            <p className="font-bold text-sm">{text}</p>
            <p className="text-xs">{hint}</p>
        </div>
    </Card>
);

export default async function Home() {
  
  const { 
      topVideos,
      latestVideos,
      promoImage,
      models, 
      randomizedImages,
    } = await getHomePageData();
  

  return (
    <div className="flex flex-col pt-0 mt-0">
      {/* Hero Carousel Section */}
      <HeroCarousel models={models.slice(0, 6)} />


      {/* Top Videos Section */}
      <section className="bg-background py-12 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center uppercase tracking-widest">Top Videos</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {topVideos.length === 0 ? 
                Array.from({length: 3}).map((_, i) => <PlaceholderCard key={i} text="Top Video Slot" hint="Add published videos" />) 
                : topVideos.map((video) => (
                    <ContentCard 
                        key={video.id} 
                        content={video} 
                        type="video" 
                    />
                ))}
          </div>
        </div>
      </section>
      
      {/* For You Section - Handled on Client */}
      <HomePageClientContent />

      {/* Promotional Banner Section */}
      <section className="relative w-full h-[411px] md:h-[600px] bg-card">
         {!promoImage ? (
             <div className="w-full h-full flex items-center justify-center bg-muted/30 border-2 border-dashed border-border">
                <div className="text-center text-muted-foreground">
                    <h2 className="text-3xl md:text-4xl font-bold mb-2">Promotional Banner</h2>
                    <p className="text-foreground/90 mb-6">Add a published gallery to display a banner.</p>
                </div>
            </div>
         ) : (
            <Link href={`/galleries/${promoImage.id}`} className="block w-full h-full group">
                <Image
                src={promoImage.image || 'https://placehold.co/1200x600/000000/FFFFFF/png?text=Luxe'}
                alt={promoImage.title || 'Promotional banner'}
                fill
                className="object-cover"
                data-ai-hint="luxury product"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-end p-8 bg-gradient-to-t from-background/60 to-transparent">
                    <h2 className="text-3xl md:text-4xl font-bold mb-2 [text-shadow:0_2px_4px_rgba(0,0,0,0.7)]">Explore The New Collection</h2>
                    <p className="text-foreground/90 mb-6 [text-shadow:0_1px_4px_rgba(0,0,0,0.7)]">A fusion of art and elegance.</p>
                    <Button size="lg" variant="secondary" className="group-hover:scale-105 transition-transform">
                        Explore Gallery
                    </Button>
                </div>
            </Link>
         )}
      </section>

      {/* Featured Images Section */}
      <section className="py-12 md:py-20 px-4 container mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center uppercase tracking-widest">Featured Images</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {randomizedImages.length === 0 ? 
            Array.from({ length: 6}).map((_, i) => <GalleryPlaceholderCard key={i} text="Image Slot" hint="Add a gallery"/>)
           : (
            randomizedImages.map((gallery) => (
             <ContentCard 
                key={gallery.id} 
                content={gallery} 
                type="gallery"
             />
            ))
          )}
        </div>
      </section>
      
      {/* Latest Videos Section */}
      <section className="bg-muted/30 py-12 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center uppercase tracking-widest">Latest Videos</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestVideos.length === 0 ? 
                Array.from({length: 6}).map((_, i) => <PlaceholderCard key={i} text="Latest Video Slot" hint="Add published videos" />) 
                : latestVideos.map((video) => (
                    <ContentCard 
                        key={video.id} 
                        content={video} 
                        type="video" 
                    />
                ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/videos">
                <Button size="lg" variant="outline">
                    Show All Videos
                </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Models Section */}
      <section className="w-full py-12 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center uppercase tracking-widest">Featured Models</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
              {models.slice(6, 12).length === 0 ? 
                Array.from({ length: 6 }).map((_, i) => <ModelCard.Skeleton key={i} />)
               : (
                models.slice(6, 12).map((model) => (
                  <ModelCard key={model.id} model={model} />
                ))
              )}
          </div>
          <div className="text-center mt-12">
            <Link href="/models">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                    View All Models
                </Button>
            </Link>
          </div>
        </div>
      </section>
      
    </div>
  );
}
