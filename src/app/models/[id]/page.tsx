
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, notFound } from 'next/navigation';
import Image from 'next/image';
import { Instagram, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Model, Video, Gallery } from '@/lib/types';
import { ModelPortfolio } from '@/components/client/ModelPortfolio';
import { Card, CardContent } from '@/components/ui/card';
import DOMPurify from 'isomorphic-dompurify';
import { getModelById, getVideos, getGalleries } from '@/lib/localStorage';
import { Skeleton } from '@/components/ui/skeleton';

function ModelPageSkeleton() {
    return (
        <div className="flex flex-col relative bg-background">
            <div className="relative w-full h-[70vh] min-h-[400px] max-h-[700px]">
                <Skeleton className="w-full h-full" />
                 <div className="absolute bottom-0 left-0 p-4 md:p-8">
                    <Skeleton className="h-16 w-96" />
                </div>
            </div>
            <div className="container mx-auto px-4 py-12 z-10 relative">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                    <div className="lg:col-span-1 space-y-6">
                        <Skeleton className="h-32 w-full" />
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-24 w-full" />
                    </div>
                    <div className="lg:col-span-2">
                         <Skeleton className="h-96 w-full" />
                    </div>
                </div>
            </div>
        </div>
    );
}


const MeasurementCard = ({model}: {model: Model}) => {
    const hasMeasurements = model.height || model.bust || model.waist || model.hips;
    if (!hasMeasurements) return null;
    
    return (
        <Card className="bg-card border-border">
            <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-4">
                    {model.height && <div><p className="text-sm text-muted-foreground">Height</p><p className="text-lg font-semibold">{model.height}</p></div>}
                    {model.bust && <div><p className="text-sm text-muted-foreground">Bust</p><p className="text-lg font-semibold">{model.bust}</p></div>}
                    {model.waist && <div><p className="text-sm text-muted-foreground">Waist</p><p className="text-lg font-semibold">{model.waist}</p></div>}
                    {model.hips && <div><p className="text-sm text-muted-foreground">Hips</p><p className="text-lg font-semibold">{model.hips}</p></div>}
                </div>
            </CardContent>
        </Card>
    );
}

export default function ModelPage() {
    const params = useParams();
    const id = params.id as string;
    
    const [model, setModel] = useState<Model | null>(null);
    const [modelVideos, setModelVideos] = useState<Video[]>([]);
    const [modelGalleries, setModelGalleries] = useState<Gallery[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        const modelData = getModelById(id);
        if (!modelData) {
            setLoading(false);
            return;
        }

        const allVideos = getVideos();
        const allGalleries = getGalleries();
        
        const videosForModel = allVideos
            .filter(v => v.models.includes(modelData.name) && v.status === 'Published')
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
        const galleriesForModel = allGalleries
            .filter(g => g.models.includes(modelData.name) && g.status === 'Published')
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            
        setModel(modelData);
        setModelVideos(videosForModel);
        setModelGalleries(galleriesForModel);
        setLoading(false);
    }, [id]);
    
    if (loading) {
        return <ModelPageSkeleton />;
    }

    if (!model) {
        notFound();
    }
  
  const cleanDescription = model.description ? DOMPurify.sanitize(model.description) : '';
  const cleanFamousFor = model.famousFor ? DOMPurify.sanitize(model.famousFor) : '';

  return (
    <div className="flex flex-col relative bg-background">
      <div className="relative w-full h-[70vh] min-h-[400px] max-h-[700px]">
        <Image
          src={model.image}
          alt={`Hero image for ${model.name}`}
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-background/20 to-transparent" />
        <div className="absolute bottom-0 left-0 p-4 md:p-8">
            <h1 className="text-4xl md:text-6xl lg:text-8xl text-white font-headline font-bold [text-shadow:0_2px_10px_rgba(0,0,0,0.5)]">{model.name}</h1>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12 z-10 relative">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            
            <div className="lg:col-span-1 space-y-6">
                 {cleanDescription && <p className="text-muted-foreground text-lg" dangerouslySetInnerHTML={{ __html: cleanDescription }} />}
                 <div className="flex gap-2">
                    {model.instagram && (
                        <Button variant="ghost" size="icon" asChild>
                            <a href={`https://instagram.com/${model.instagram}`} target="_blank" rel="noopener noreferrer" aria-label={`${model.name}'s Instagram`}><Instagram/></a>
                        </Button>
                    )}
                     {model.twitter && (
                        <Button variant="ghost" size="icon" asChild>
                             <a href={`https://twitter.com/${model.twitter}`} target="_blank" rel="noopener noreferrer" aria-label={`${model.name}'s Twitter`}><Twitter/></a>
                        </Button>
                    )}
                </div>

                <MeasurementCard model={model} />

                {cleanFamousFor && (
                    <section>
                        <h3 className="text-2xl font-semibold mb-2">Famous For</h3>
                        <p className="text-muted-foreground" dangerouslySetInnerHTML={{ __html: cleanFamousFor }}/>
                    </section>
                )}
            </div>

            <div className="lg:col-span-2">
                <ModelPortfolio videos={modelVideos} galleries={modelGalleries} />
            </div>

          </div>
      </div>
    </div>
  );
}
