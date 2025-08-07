
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, notFound, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Photo, Gallery, Model } from '@/lib/types';
import { GalleryClientPage } from '@/components/client/GalleryClientPage';
import { getGalleryById, getModelById, getGalleries } from '@/lib/localStorage';
import { Skeleton } from '@/components/ui/skeleton';

function GalleryPageSkeleton() {
    return (
        <main>
            <div className="relative h-[60vh] w-full flex flex-col justify-end">
                <Skeleton className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
                <div className="relative z-10 px-4 pb-12 text-center">
                    <Skeleton className="h-16 w-3/4 mx-auto mb-2" />
                    <Skeleton className="h-8 w-1/2 mx-auto mt-1" />
                    <Skeleton className="h-5 w-full max-w-md mx-auto mt-3" />
                </div>
            </div>
            <div className="px-4 py-16">
                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 gap-4 md:gap-6 max-w-7xl mx-auto">
                    {Array.from({ length: 12 }).map((_, i) => (
                        <Skeleton key={i} className="aspect-[2/3]" />
                    ))}
                 </div>
            </div>
        </main>
    );
}

export default function GalleryPage() {
    const params = useParams();
    const id = params.id as string;

    const [gallery, setGallery] = useState<Gallery | null>(null);
    const [models, setModels] = useState<Model[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        const galleryData = getGalleryById(id);
        if (!galleryData || galleryData.status !== 'Published') {
            setLoading(false);
            return;
        }

        const allModels = getModelById('all') as any; // This needs to be fixed to fetch all models
        const modelData = galleryData.models
            .map(name => allModels.find((m: Model) => m.name === name))
            .filter((m): m is Model => !!m);
        
        setGallery(galleryData);
        setModels(modelData);
        setLoading(false);
    }, [id]);

    if (loading) {
        return <GalleryPageSkeleton />;
    }

    if (!gallery) {
        notFound();
    }
  
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

      <div className="px-4 py-16">
          <GalleryClientPage albumPhotos={albumPhotos} />
      </div>
    </main>
  );
}
