
'use client';

import React, { Suspense, useState, useEffect } from 'react';
import type { Gallery } from '@/lib/types';
import { GalleriesList } from './GalleriesList';
import { Skeleton } from '@/components/ui/skeleton';
import { getGalleries } from '@/lib/localStorage';
import { useSearchParams } from 'next/navigation';

const GALLERIES_PER_PAGE = 18;

function GalleriesPageSkeleton() {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-12 min-h-[600px]">
            {Array.from({ length: 18 }).map((_, i) => (
                <Skeleton key={i} className="aspect-[2/3] w-full h-full rounded-lg" />
            ))}
        </div>
    );
}

function GalleriesContent() {
    const searchParams = useSearchParams();
    const currentPage = Number(searchParams.get('page')) || 1;

    const [galleries, setGalleries] = useState<Gallery[]>([]);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        setLoading(true);
        const allPublishedGalleries = getGalleries().filter(g => g.status === 'Published');
        const total = allPublishedGalleries.length;
        const pages = Math.ceil(total / GALLERIES_PER_PAGE);
        const startIndex = (currentPage - 1) * GALLERIES_PER_PAGE;
        const endIndex = startIndex + GALLERIES_PER_PAGE;

        setGalleries(allPublishedGalleries.slice(startIndex, endIndex));
        setTotalPages(pages);
        setLoading(false);
    }, [currentPage]);
    
    if (loading) {
        return <GalleriesPageSkeleton />;
    }

    return <GalleriesList galleries={galleries} totalPages={totalPages} currentPage={currentPage} />;
}

export default function GalleriesPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-4xl mb-8 text-center">Galleries</h1>
      <Suspense fallback={<GalleriesPageSkeleton />}>
        <GalleriesContent />
      </Suspense>
    </div>
  );
}
