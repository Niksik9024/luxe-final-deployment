
import React from 'react';
import { adminDb } from '@/lib/firebase-admin';
import type { Model, Video, Gallery } from '@/lib/types';
import { HeroCarousel } from '@/components/client/HeroCarousel';
import { ContentCard } from '@/components/shared/ContentCard';
import { ModelCard } from '@/components/shared/ModelCard';
import { HomePageClientContent } from '@/components/client/HomePageClientContent';
import { Separator } from '@/components/ui/separator';

// Revalidate this page every 5 minutes to fetch fresh content
export const revalidate = 300; 

async function getHomePageData() {
    // If adminDb isn't initialized, return empty arrays to prevent crashing
    if (!adminDb) {
        return {
            featuredVideos: [],
            latestVideos: [],
            latestGalleries: [],
            topModels: []
        };
    }

    try {
        // Fetch all published videos and models in parallel
        const [videosSnap, modelsSnap, galleriesSnap] = await Promise.all([
            adminDb.collection('videos').where('status', '==', 'Published').orderBy('date', 'desc').get(),
            adminDb.collection('models').get(),
            adminDb.collection('galleries').where('status', '==', 'Published').orderBy('date', 'desc').limit(6).get()
        ]);

        const allVideos = videosSnap.docs.map(doc => ({ ...doc.data(), id: doc.id } as Video));
        const allModels = modelsSnap.docs.map(doc => ({ ...doc.data(), id: doc.id } as Model));
        const latestGalleries = galleriesSnap.docs.map(doc => ({ ...doc.data(), id: doc.id } as Gallery));

        // Separate featured videos from the rest
        const featuredVideos = allVideos.filter(v => v.isFeatured);
        const latestVideos = allVideos.filter(v => !v.isFeatured).slice(0, 3);
        
        return {
            featuredVideos,
            latestVideos,
            latestGalleries,
            topModels: allModels.slice(0, 10), // Example: first 10 models as "top"
        };
    } catch (error) {
        console.error("Error fetching homepage data:", error);
        // In case of an error, return empty arrays to prevent a crash
        return {
            featuredVideos: [],
            latestVideos: [],
            latestGalleries: [],
            topModels: []
        };
    }
}

export default async function Home() {
  const { featuredVideos, latestVideos, latestGalleries, topModels } = await getHomePageData();
  
  // Determine the source for the hero carousel
  const heroContentSource = featuredVideos.length > 0 
    ? featuredVideos.map(v => ({ id: v.id, image: v.image, name: v.title })) 
    : topModels.slice(0, 5).map(m => ({ id: m.id, image: m.image, name: m.name }));

  // Create a pseudo-model list for the carousel from videos if needed
  const heroModels: Model[] = heroContentSource.map(item => ({
      id: item.id,
      name: item.name,
      image: item.image,
      description: '', // Not needed for carousel
  }));

  return (
    <main>
      <HeroCarousel models={heroModels} />

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
                        {topModels.slice(0, 5).map((model) => (
                            <ModelCard key={model.id} model={model} />
                        ))}
                    </div>
                </div>
           </section>
      )}
    </main>
  );
}
