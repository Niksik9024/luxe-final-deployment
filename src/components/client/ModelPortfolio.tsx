
'use client'

import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ContentCard } from '@/components/shared/ContentCard';
import type { Video, Gallery } from '@/lib/types';
import { Film, ImageIcon, Grid3x3 } from 'lucide-react';
import { PhotoCard } from '../shared/PhotoCard';

interface ModelPortfolioProps {
    videos: Video[];
    galleries: Gallery[];
}

export function ModelPortfolio({ videos, galleries }: ModelPortfolioProps) {

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
