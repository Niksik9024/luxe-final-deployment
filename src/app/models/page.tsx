'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { ModelCard } from '@/components/shared/ModelCard';
import { PaginationControls } from '@/components/shared/PaginationControls';
import { Skeleton } from '@/components/ui/skeleton';
import type { Model } from '@/lib/types';
import { getModels } from '@/lib/localStorage';
import { useSearchParams } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';

const MODELS_PER_PAGE = 18;

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

function ModelsListContent() {
    const searchParams = useSearchParams();
    const currentPage = Number(searchParams.get('page')) || 1;

    const [models, setModels] = useState<Model[]>([]);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const allModels = getModels();
        const total = allModels.length;
        const pages = Math.ceil(total / MODELS_PER_PAGE);
        const startIndex = (currentPage - 1) * MODELS_PER_PAGE;
        const endIndex = startIndex + MODELS_PER_PAGE;

        setModels(allModels.slice(startIndex, endIndex));
        setTotalPages(pages);
        setLoading(false);
    }, [currentPage]);

    if (loading) {
        return <ModelsGridSkeleton />;
    }

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


export default function ModelsPage() {
  const models = getModels();

  return (
    <div className="w-full-safe max-w-screen-safe">
      <div className="container mx-auto responsive-padding py-16">
        <div className="text-center mb-12 sm:mb-16">
          <Badge className="mb-4 bg-luxury-gradient text-black font-semibold text-sm px-4 py-2">
            <Users className="w-4 h-4 mr-2" />
            MEET OUR TALENT
          </Badge>
          <h1 className="mb-6">Exceptional Models</h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover the extraordinary individuals who bring our premium content to life
          </p>
        </div>

        <div className="responsive-grid gap-6 sm:gap-8">
          {models.map((model, index) => (
            <ModelCard key={model.id} model={model} priority={index < 6} />
          ))}
        </div>
      </div>
    </div>
  );
}