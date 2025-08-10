
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

export default function ModelPage() {
  const params = useParams();
  const [model, setModel] = useState<Model | null>(null);
  const [modelVideos, setModelVideos] = useState<Video[]>([]);
  const [modelGalleries, setModelGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadModelData = async () => {
      try {
        if (!params.id || typeof params.id !== 'string') {
          notFound();
          return;
        }

        const foundModel = getModelById(params.id);
        if (!foundModel) {
          notFound();
          return;
        }

        setModel(foundModel);

        const allVideos = getVideos();
        const allGalleries = getGalleries();

        const filteredVideos = allVideos.filter(video => 
          video.models && video.models.includes(foundModel.name)
        );

        const filteredGalleries = allGalleries.filter(gallery => 
          gallery.models && gallery.models.includes(foundModel.name)
        );

        setModelVideos(filteredVideos);
        setModelGalleries(filteredGalleries);
      } catch (error) {
        console.error('Error loading model data:', error);
        notFound();
      } finally {
        setLoading(false);
      }
    };

    loadModelData();
  }, [params.id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 space-y-8">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!model) {
    notFound();
    return null;
  }

  const MeasurementCard = ({ model }: { model: Model }) => {
    const measurements = [
      { label: 'Height', value: model.height },
      { label: 'Weight', value: model.weight },
      { label: 'Eyes', value: model.eyes },
      { label: 'Hair', value: model.hair },
    ].filter(m => m.value);

    if (measurements.length === 0) return null;

    return (
      <Card className="w-full">
        <CardContent className="p-4 md:p-6">
          <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4">Measurements</h3>
          <div className="grid grid-cols-2 gap-4">
            {measurements.map((measurement, index) => (
              <div key={index} className="text-center">
                <div className="text-xs md:text-sm text-muted-foreground uppercase tracking-wider">
                  {measurement.label}
                </div>
                <div className="text-sm md:text-base font-medium mt-1">
                  {measurement.value}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  const cleanFamousFor = model.famousFor ? DOMPurify.sanitize(model.famousFor) : '';

  return (
    <div className="min-h-screen bg-background text-foreground w-full">
      <div className="relative w-full">
        <div className="relative h-[70vh] w-full">
          <Image
            src={model.image}
            alt={`${model.name} - Professional Model`}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-2 md:mb-4">
                {model.name}
              </h1>
              <div className="flex flex-wrap gap-2 md:gap-4 items-center">
                <span className="text-lg md:text-xl text-primary font-medium">
                  {model.category}
                </span>
                <span className="text-sm md:text-base text-muted-foreground">
                  Age: {model.age}
                </span>
                <span className="text-sm md:text-base text-muted-foreground">
                  {model.location}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            <div className="space-y-6 md:space-y-8 w-full">
                <section className="space-y-2 w-full">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-semibold">About</h3>
                    <p className="text-muted-foreground text-sm md:text-base leading-relaxed break-words">
                        {model.biography}
                    </p>
                </section>

                <div className="flex flex-wrap gap-3">
                    {model.socialMedia?.instagram && (
                        <Button variant="outline" size="sm" asChild>
                            <a href={model.socialMedia.instagram} target="_blank" rel="noopener noreferrer">
                                <Instagram className="w-4 h-4 mr-2" />
                                Instagram
                            </a>
                        </Button>
                    )}
                    {model.socialMedia?.twitter && (
                        <Button variant="outline" size="sm" asChild>
                            <a href={model.socialMedia.twitter} target="_blank" rel="noopener noreferrer">
                                <Twitter className="w-4 h-4 mr-2" />
                                Twitter
                            </a>
                        </Button>
                    )}
                </div>

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
    <div className="flex flex-col relative bg-background w-full overflow-x-hidden">
      <div className="relative w-full h-[60vh] sm:h-[70vh] min-h-[300px] sm:min-h-[400px] max-h-[700px]">
        <Image
          src={model.image}
          alt={`Hero image for ${model.name}`}
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/30 to-transparent" />
        <div className="absolute bottom-0 left-0 p-4 sm:p-6 md:p-8 w-full">
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-8xl text-white font-headline font-bold [text-shadow:0_2px_10px_rgba(0,0,0,0.7)] break-words">{model.name}</h1>
        </div>
      </div>
      
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12 z-10 relative max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-12 w-full">
            
            <div className="lg:col-span-1 space-y-4 md:space-y-6 w-full">
                 {cleanDescription && (
                   <div className="prose prose-sm md:prose-base max-w-none w-full">
                     <p className="text-muted-foreground text-sm md:text-base lg:text-lg break-words" dangerouslySetInnerHTML={{ __html: cleanDescription }} />
                   </div>
                 )}
                 
                 <div className="flex gap-2 flex-wrap">
                    {model.instagram && (
                        <Button variant="ghost" size="icon" asChild className="touch-manipulation">
                            <a href={`https://instagram.com/${model.instagram}`} target="_blank" rel="noopener noreferrer" aria-label={`${model.name}'s Instagram`}><Instagram className="h-5 w-5"/></a>
                        </Button>
                    )}
                     {model.twitter && (
                        <Button variant="ghost" size="icon" asChild className="touch-manipulation">
                             <a href={`https://twitter.com/${model.twitter}`} target="_blank" rel="noopener noreferrer" aria-label={`${model.name}'s Twitter`}><Twitter className="h-5 w-5"/></a>
                        </Button>
                    )}
                </div>

                <MeasurementCard model={model} />

                {cleanFamousFor && (
                    <section className="space-y-2 w-full">
                        <h3 className="text-lg sm:text-xl md:text-2xl font-semibold">Famous For</h3>
                        <div className="prose prose-sm md:prose-base max-w-none w-full">
                          <p className="text-muted-foreground text-sm md:text-base break-words" dangerouslySetInnerHTML={{ __html: cleanFamousFor }}/>
                        </div>
                    </section>
                )}
            </div>

            <div className="lg:col-span-2 w-full min-w-0">
                <ModelPortfolio videos={modelVideos} galleries={modelGalleries} />
            </div>

          </div>
      </div>
    </div>
  );
}
