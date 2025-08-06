
'use client';

import React from 'react';
import { ContentCard } from '@/components/shared/ContentCard';
import { PaginationControls } from '@/components/shared/PaginationControls';
import { Skeleton } from '@/components/ui/skeleton';
import type { Gallery } from '@/lib/types';

function GalleriesGridSkeleton() {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-12 min-h-[600px]">
            {Array.from({ length: 18 }).map((_, i) => (
                <Skeleton key={i} className="aspect-[2/3] w-full h-full rounded-lg" />
            ))}
        </div>
    );
}

export function GalleriesList({ galleries, totalPages, currentPage }: { galleries: Gallery[], totalPages: number, currentPage: number }) {
  
  if (!galleries) {
    return <GalleriesGridSkeleton />;
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-12 min-h-[600px]">
        {galleries.map((gallery, index) => (
          <ContentCard 
            key={gallery.id} 
            content={gallery} 
            type="gallery"
            priority={index < 6}
          />
        ))}
      </div>
      <PaginationControls currentPage={currentPage} totalPages={totalPages} basePath="/galleries" />
    </>
  );
}
