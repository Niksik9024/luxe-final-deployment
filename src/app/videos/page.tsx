
import React, { Suspense } from 'react';
import type { Video } from '@/lib/types';
import { adminDb } from '@/lib/firebase-admin';
import { VideosList } from './VideosList';
import { Skeleton } from '@/components/ui/skeleton';

// Revalidate this page every 5 minutes
export const revalidate = 300;

const VIDEOS_PER_PAGE = 12;

async function getVideos(page: number): Promise<{ videos: Video[], totalPages: number }> {
    const videosRef = adminDb.collection("videos");

    // Optimized Query: Filter by status in Firestore
    const publishedQuery = videosRef.where('status', '==', 'Published');
    
    // Get total count for pagination
    const countSnapshot = await publishedQuery.count().get();
    const totalCount = countSnapshot.data().count;
    const totalPages = Math.ceil(totalCount / VIDEOS_PER_PAGE);

    // Fetch only the documents for the current page
    const querySnapshot = await publishedQuery
        .orderBy('date', 'desc')
        .limit(VIDEOS_PER_PAGE)
        .offset((page - 1) * VIDEOS_PER_PAGE)
        .get();

    const videos = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return { 
            id: doc.id, 
            ...data,
            date: (data.date.toDate ? data.date.toDate() : new Date(data.date)).toISOString(),
        } as Video;
    });
    
    return { videos, totalPages };
}

function VideosPageSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 min-h-[800px]">
            {Array.from({ length: 12 }).map((_, i) => (
                <Skeleton key={i} className="aspect-video w-full h-full rounded-lg" />
            ))}
        </div>
    );
}

async function Videos({ currentPage }: { currentPage: number }) {
    const { videos, totalPages } = await getVideos(currentPage);
    return <VideosList videos={videos} totalPages={totalPages} currentPage={currentPage} />
}

export default async function VideosPage({ searchParams }: { searchParams?: { page?: string } }) {
  const currentPage = Number(searchParams?.page) || 1;

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-4xl mb-8 text-center">Videos</h1>
      <Suspense fallback={<VideosPageSkeleton/>}>
        <Videos currentPage={currentPage} />
      </Suspense>
    </div>
  );
}
