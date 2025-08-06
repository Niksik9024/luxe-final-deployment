
import React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Photo, Gallery, Model } from '@/lib/types';
import { adminDb } from '@/lib/firebase-admin';
import { GalleryClientPage } from '@/components/client/GalleryClientPage';
import type { Metadata } from 'next';


// Revalidate this page every 5 minutes
export const revalidate = 300;

async function getGalleryAndRelated(id: string): Promise<{ gallery: Gallery; models: Model[]; relatedGalleries: Gallery[] } | null> {
    const galleryRef = adminDb.collection('galleries').doc(id);
    const gallerySnap = await galleryRef.get();

    if (!gallerySnap.exists || gallerySnap.data()?.status !== 'Published') {
        return null;
    }

    const gallery = { id: gallerySnap.id, ...gallerySnap.data() } as Gallery;

    // Fetch all models and all galleries for in-code filtering
    const [modelsSnap, allGalleriesSnap] = await Promise.all([
        adminDb.collection('models').get(),
        adminDb.collection('galleries').where('status', '==', 'Published').get()
    ]);

    const allModels = modelsSnap.docs.map(d => ({ ...d.data(), id: d.id } as Model));
    const allPublishedGalleries = allGalleriesSnap.docs.map(d => ({ ...d.data(), id: d.id } as Gallery));

    // Find models for the current gallery, ensuring they still exist
    const models = allModels.filter(m => gallery.models.includes(m.name));

    // Find related galleries
    const relatedGalleries = allPublishedGalleries
        .filter(g => g.id !== id) // Exclude current gallery
        .filter(g => g.tags.some(tag => gallery.tags.includes(tag))) // Match by tag
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Sort by date
        .slice(0, 10); // Take top 10 for carousel
        
    // If not enough related by tag, fill with latest galleries
    if (relatedGalleries.length < 10) {
        const relatedIds = new Set(relatedGalleries.map(g => g.id));
        relatedIds.add(id);

        const latestGalleries = allPublishedGalleries
            .filter(g => !relatedIds.has(g.id))
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
        const needed = 10 - relatedGalleries.length;
        relatedGalleries.push(...latestGalleries.slice(0, needed));
    }


    return { gallery, models, relatedGalleries };
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const data = await getGalleryAndRelated(params.id);
  if (!data) {
    return {
      title: 'Gallery Not Found',
    }
  }
  return {
    title: `Gallery: ${data.gallery.title} | LUXE`,
    description: data.gallery.description || `View the gallery ${data.gallery.title} on LUXE.`,
  }
}


export default async function GalleryPage({ params }: { params: { id: string } }) {
  const data = await getGalleryAndRelated(params.id);

  if (!data) {
    notFound();
  }
  
  const { gallery, models } = data;
  
  const displayDate = new Date(gallery.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC',
  });

  const albumPhotos: Photo[] = (gallery.album || []).map((url, i) => ({
      id: `${gallery.id}-photo-${i}`, 
      image: url, 
      title: `${gallery.title} - Photo ${i+1}`,
      galleryId: gallery.id,
      galleryTitle: gallery.title,
    }));
  
  return (
    <main>
      {/* Hero Section */}
      <div className="relative h-[60vh] w-full flex flex-col justify-end">
          <Image
              src={gallery.image}
              alt={`Cover image for ${gallery.title}`}
              fill
              className="w-full h-full object-cover"
              priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
          <div className="relative z-10 px-4 pb-12">
              <div className="text-center">
                  <h1 className="font-headline text-5xl md:text-7xl font-bold text-white mb-2">{gallery.title}</h1>
                  <div className="text-lg text-accent font-medium mt-1">
                      {models.map((model, index) => (
                          <React.Fragment key={model.id}>
                              <Link href={`/models/${model.id}`} className="hover:underline">
                                  {model.name}
                              </Link>
                              {index < models.length - 1 && <span>, </span>}
                          </React.Fragment>
                      ))}
                  </div>
                  <p className="text-muted-foreground text-sm mt-3 max-w-md mx-auto">{gallery.description}</p>
              </div>
          </div>
      </div>

      {/* Page Content & Gallery Grid */}
      <div className="px-4 py-16">
          <GalleryClientPage albumPhotos={albumPhotos} />
      </div>
    </main>
  );
}
