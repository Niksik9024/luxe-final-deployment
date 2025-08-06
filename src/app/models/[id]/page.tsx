
import React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Instagram, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { adminDb } from '@/lib/firebase-admin';
import type { Model, Video, Gallery } from '@/lib/types';
import { ModelPortfolio } from '@/components/client/ModelPortfolio';
import { Card, CardContent } from '@/components/ui/card';
import type { Metadata } from 'next';
import DOMPurify from 'isomorphic-dompurify';

// Revalidate this page every 5 minutes
export const revalidate = 300;

async function getModelAndContent(id: string): Promise<{ model: Model, videos: Video[], galleries: Gallery[] } | null> {
    if (!adminDb) return null;
    
    try {
        const modelRef = adminDb.collection('models').doc(id);
        const modelSnap = await modelRef.get();

        if (!modelSnap.exists) {
            return null;
        }

        const model = { id: modelSnap.id, ...modelSnap.data() } as Model;

        const videosQuery = adminDb.collection('videos')
            .where('models', 'array-contains', model.name)
            .where('status', '==', 'Published');
            
        const galleriesQuery = adminDb.collection('galleries')
            .where('models', 'array-contains', model.name)
            .where('status', '==', 'Published');

        const [videosSnap, galleriesSnap] = await Promise.all([
            videosQuery.get(),
            galleriesQuery.get(),
        ]);
        
        const videos = videosSnap.docs
            .map(d => ({ ...d.data(), id: d.id } as Video))
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        const galleries = galleriesSnap.docs
            .map(d => ({ ...d.data(), id: d.id } as Gallery))
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        return { model, videos, galleries };
    } catch(error) {
        console.error("Error fetching model data:", error);
        return null;
    }
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const data = await getModelAndContent(params.id);
  if (!data) {
    return {
      title: 'Model Not Found',
    }
  }
  return {
    title: `Model: ${data.model.name} | LUXE`,
    description: data.model.description || `View the portfolio for ${data.model.name}.`,
  }
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

export default async function ModelPage({ params }: { params: { id: string } }) {
  const data = await getModelAndContent(params.id);

  if (!data) {
    notFound();
  }
  
  const { model, videos: modelVideos, galleries: modelGalleries } = data;
  
  // Sanitize user-generated content before rendering
  const cleanDescription = model.description ? DOMPurify.sanitize(model.description) : '';
  const cleanFamousFor = model.famousFor ? DOMPurify.sanitize(model.famousFor) : '';

  return (
    <div className="flex flex-col relative bg-background">
      {/* Hero Section */}
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
      
      {/* Content Section */}
      <div className="container mx-auto px-4 py-12 z-10 relative">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            
            {/* Left Column: Bio & Socials */}
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

            {/* Right Column: Portfolio */}
            <div className="lg:col-span-2">
                <ModelPortfolio videos={modelVideos} galleries={modelGalleries} />
            </div>

          </div>
      </div>
    </div>
  );
}
