
'use client';

import React, { Suspense, useState, useEffect } from 'react';
import type { Video } from '@/lib/types';
import { VideosList } from './VideosList';
import { Skeleton } from '@/components/ui/skeleton';
import { getVideos } from '@/lib/localStorage';
import { useSearchParams } from 'next/navigation';

const VIDEOS_PER_PAGE = 12;

function VideosPageSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 min-h-[800px]">
            {Array.from({ length: 12 }).map((_, i) => (
                <Skeleton key={i} className="aspect-video w-full h-full rounded-lg" />
            ))}
        </div>
    );
}

function VideosContent() {
    const searchParams = useSearchParams();
    const currentPage = Number(searchParams.get('page')) || 1;

    const [videos, setVideos] = useState<Video[]>([]);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const allPublishedVideos = getVideos().filter(v => v.status === 'Published');
        const total = allPublishedVideos.length;
        const pages = Math.ceil(total / VIDEOS_PER_PAGE);
        const startIndex = (currentPage - 1) * VIDEOS_PER_PAGE;
        const endIndex = startIndex + VIDEOS_PER_PAGE;
        
        setVideos(allPublishedVideos.slice(startIndex, endIndex));
        setTotalPages(pages);
        setLoading(false);
    }, [currentPage]);
    
    if (loading) {
        return <VideosPageSkeleton />;
    }

    return <VideosList videos={videos} totalPages={totalPages} currentPage={currentPage} />
}

export default function VideosPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-4xl mb-8 text-center">Videos</h1>
      <Suspense fallback={<VideosPageSkeleton/>}>
        <VideosContent />
      </Suspense>
    </div>
  );
}
