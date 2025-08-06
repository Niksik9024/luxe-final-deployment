
import React, { Suspense } from 'react';
import { ModelCard } from '@/components/shared/ModelCard';
import { PaginationControls } from '@/components/shared/PaginationControls';
import { Skeleton } from '@/components/ui/skeleton';
import { adminDb } from '@/lib/firebase-admin';
import type { Model } from '@/lib/types';

// Revalidate this page every 5 minutes
export const revalidate = 300;

const MODELS_PER_PAGE = 18;

async function getModels(page: number): Promise<{ models: Model[], totalPages: number}> {
    const modelsRef = adminDb.collection("models");
    
    // Optimized Count Query
    const countSnap = await modelsRef.count().get();
    const totalCount = countSnap.data().count;
    const totalPages = Math.ceil(totalCount / MODELS_PER_PAGE);

    // Optimized Data Query with pagination
    const modelsSnap = await modelsRef
        .orderBy("name")
        .limit(MODELS_PER_PAGE)
        .offset((page - 1) * MODELS_PER_PAGE)
        .get();

    const models = modelsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Model));
    
    return { models, totalPages };
}

function ModelsGridSkeleton() {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-12 min-h-[500px]">
            {Array.from({ length: 12 }).map((_, i) => (
                 <div key={i} className="overflow-hidden group relative bg-card rounded-lg">
                    <Skeleton className="w-full aspect-[9/16]" />
                    <div className="absolute bottom-0 left-0 w-full p-4">
                        <Skeleton className="h-6 w-3/4" />
                    </div>
                </div>
            ))}
        </div>
    );
}

async function ModelsList({ currentPage }: { currentPage: number }) {
  const { models, totalPages } = await getModels(currentPage);
  
  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-12 min-h-[500px]">
        {models.map((model, index) => (
          <ModelCard key={model.id} model={model} priority={index < 6} />
        ))}
      </div>
      <PaginationControls currentPage={currentPage} totalPages={totalPages} basePath="/models" />
    </>
  );
}


export default async function ModelsPage({ searchParams }: { searchParams?: { page?: string } }) {
  const currentPage = Number(searchParams?.page) || 1;
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-8 text-center">Models</h1>
      <Suspense fallback={<ModelsGridSkeleton />}>
        <ModelsList currentPage={currentPage} />
      </Suspense>
    </div>
  );
}
