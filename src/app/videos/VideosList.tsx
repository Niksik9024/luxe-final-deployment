

'use client';

import React from 'react';
import { ContentCard } from '@/components/shared/ContentCard';
import { PaginationControls } from '@/components/shared/PaginationControls';
import { Skeleton } from '@/components/ui/skeleton';
import type { Video } from '@/lib/types';


function VideosGridSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 min-h-[800px]">
            {Array.from({ length: 12 }).map((_, i) => (
                <Skeleton key={i} className="aspect-video w-full h-full rounded-lg" />
            ))}
        </div>
    );
}

export function VideosList({ videos, totalPages, currentPage }: { videos: Video[], totalPages: number, currentPage: number }) {

  if (!videos) {
    return <VideosGridSkeleton />;
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 min-h-[800px]">
        {videos.map((video, index) => (
          <ContentCard 
            key={video.id} 
            content={video} 
            type="video" 
            priority={index < 3}
          />
        ))}
      </div>
      <PaginationControls currentPage={currentPage} totalPages={totalPages} basePath="/videos" />
    </>
  );
}
