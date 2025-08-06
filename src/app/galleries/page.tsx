
import React, { Suspense } from 'react';
import { adminDb } from '@/lib/firebase-admin';
import type { Gallery } from '@/lib/types';
import { GalleriesList } from './GalleriesList';
import { Skeleton } from '@/components/ui/skeleton';

// Revalidate this page every 5 minutes
export const revalidate = 300;

const GALLERIES_PER_PAGE = 18;

async function getGalleries(page: number): Promise<{ galleries: Gallery[], totalPages: number }> {
    if (!adminDb) return { galleries: [], totalPages: 0 };
    try {
        const galleriesRef = adminDb.collection("galleries");
        
        // Optimized Query: Filter by status in Firestore
        const publishedQuery = galleriesRef.where('status', '==', 'Published');

        // Get the total count for pagination
        const countSnapshot = await publishedQuery.count().get();
        const totalCount = countSnapshot.data().count;
        const totalPages = Math.ceil(totalCount / GALLERIES_PER_PAGE);

        // Fetch only the documents for the current page
        const querySnapshot = await publishedQuery
            .orderBy('date', 'desc')
            .limit(GALLERIES_PER_PAGE)
            .offset((page - 1) * GALLERIES_PER_PAGE)
            .get();

        const galleries = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return { 
                id: doc.id, 
                ...data,
                date: (data.date?.toDate ? data.date.toDate() : new Date(data.date)).toISOString(),
            } as Gallery
        });

        return { galleries, totalPages };
    } catch(error) {
        console.error("Error fetching galleries:", error);
        return { galleries: [], totalPages: 0 };
    }
}

function GalleriesPageSkeleton() {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-12 min-h-[600px]">
            {Array.from({ length: 18 }).map((_, i) => (
                <Skeleton key={i} className="aspect-[2/3] w-full h-full rounded-lg" />
            ))}
        </div>
    );
}

async function Galleries({ currentPage }: { currentPage: number }) {
  const { galleries, totalPages } = await getGalleries(currentPage);
  return <GalleriesList galleries={galleries} totalPages={totalPages} currentPage={currentPage} />
}

export default async function GalleriesPage({ searchParams }: { searchParams?: { page?: string } }) {
  const currentPage = Number(searchParams?.page) || 1;
  
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-4xl mb-8 text-center">Galleries</h1>
      <Suspense fallback={<GalleriesPageSkeleton />}>
        <Galleries currentPage={currentPage} />
      </Suspense>
    </div>
  );
}
