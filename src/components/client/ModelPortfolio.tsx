

'use client'

import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ContentCard } from '@/components/shared/ContentCard';
import type { Video, Gallery } from '@/lib/types';
import { Film, ImageIcon, Grid3x3 } from 'lucide-react';
import { PhotoCard } from '../shared/PhotoCard';

import React, { useState } from 'react';
import { Lightbox } from '@/components/shared/Lightbox';
import type { Video, Gallery, Photo } from '@/lib/types';
import { ContentCard } from '@/components/shared/ContentCard';

interface ModelPortfolioProps {
    videos: Video[];
    galleries: Gallery[];
}

export function ModelPortfolio({ videos, galleries }: ModelPortfolioProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxStartIndex, setLightboxStartIndex] = useState(0);

  const hasVideos = videos.length > 0;
  const hasGalleries = galleries.length > 0;
  
  const allPhotos = galleries.flatMap(gallery => 
    (gallery.album || []).map((url, i) => ({
      id: `${gallery.id}-photo-${i}`,
      image: url,
      title: `${gallery.title} - Photo ${i + 1}`,
      galleryId: gallery.id,
      galleryTitle: gallery.title,
    }))
  );
  const hasPhotos = allPhotos.length > 0;

  const handlePhotoClick = (photoIndex: number) => {
    setLightboxStartIndex(photoIndex);
    setLightboxOpen(true);
  };

  if (!hasVideos && !hasGalleries) {
    return (
        <div className="text-center py-16 text-muted-foreground bg-card rounded-lg">
            <p>This model has no content yet.</p>
        </div>
    )
  }

  const allContent = [
    ...videos.map(v => ({ ...v, type: 'video' as const })),
    ...galleries.map(g => ({ ...g, type: 'gallery' as const }))
  ].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-12">
      {/* Photos Section */}
      {hasPhotos && (
        <section>
          <h3 className="text-2xl font-bold mb-6 text-center">Photos</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {allPhotos.map((photo, index) => (
              <div 
                key={photo.id} 
                className="relative aspect-[3/4] overflow-hidden rounded-lg cursor-pointer group luxury-card"
                onClick={() => handlePhotoClick(index)}
              >
                <img
                  src={photo.image}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/api/placeholder/300/400';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-2 left-2 text-white text-sm font-medium">
                    {photo.galleryTitle}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Videos and Galleries Content */}
      {allContent.length > 0 && (
        <section>
          <h3 className="text-2xl font-bold mb-6 text-center">Content</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allContent.map((item) => (
              <div key={item.id} className="luxury-card p-4 rounded-lg">
                <div className="relative aspect-video mb-4 overflow-hidden rounded">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/api/placeholder/400/225';
                    }}
                  />
                  <div className="absolute top-2 right-2">
                    <span className="bg-luxury-gradient text-black px-2 py-1 rounded text-xs font-semibold uppercase">
                      {item.type}
                    </span>
                  </div>
                </div>
                <h4 className="font-semibold text-lg mb-2">{item.title}</h4>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{item.description}</p>
                <a 
                  href={`/${item.type}s/${item.id}`}
                  className="btn-luxury inline-block px-4 py-2 rounded text-center w-full text-sm"
                >
                  View {item.type === 'video' ? 'Video' : 'Gallery'}
                </a>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Lightbox */}
      {lightboxOpen && (
        <Lightbox
          images={allPhotos}
          startIndex={lightboxStartIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </div>
  );


  return (
    <Tabs defaultValue="all" className="w-full">
        <div className="border-b border-border mb-8">
            <TabsList className="bg-transparent p-0 rounded-none">
                <TabsTrigger value="all" className="data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                    <Grid3x3 className="mr-2 h-4 w-4" /> ALL ({allContent.length})
                </TabsTrigger>
                {hasVideos && (
                    <TabsTrigger value="videos" className="data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                        <Film className="mr-2 h-4 w-4" /> VIDEOS ({videos.length})
                    </TabsTrigger>
                )}
                {hasPhotos && (
                    <TabsTrigger value="photos" className="data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                        <ImageIcon className="mr-2 h-4 w-4" /> PHOTOS ({allPhotos.length})
                    </TabsTrigger>
                )}
            </TabsList>
        </div>

        <TabsContent value="all">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {allContent.map((item) => (
                    <ContentCard 
                        key={`${item.type}-${item.id}`}
                        content={item}
                        type={item.type}
                    />
                ))}
            </div>
        </TabsContent>

        {hasVideos && (
            <TabsContent value="videos">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {videos.map((video) => (
                        <ContentCard 
                            key={video.id} 
                            content={video} 
                            type="video" 
                        />
                    ))}
                </div>
            </TabsContent>
        )}

        {hasPhotos && (
            <TabsContent value="photos">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                     {allPhotos.map((photo) => (
                       <PhotoCard 
                        key={photo.id} 
                        photo={photo}
                       />
                    ))}
                </div>
            </TabsContent>
        )}
    </Tabs>
  )
}
