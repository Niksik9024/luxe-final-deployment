
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import { ContentCard } from '@/components/shared/ContentCard';
import { Calendar } from 'lucide-react';
import type { Video, Model } from '@/lib/types';
import { VideoPlayer } from '@/components/client/VideoPlayer';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { getVideoById, getModels, getVideos } from '@/lib/localStorage';
import { Skeleton } from '@/components/ui/skeleton';

function VideoPageSkeleton() {
    return (
        <div className="bg-background">
            <Skeleton className="w-full aspect-video bg-muted" />
            <div className="container mx-auto py-12 px-4">
                <div className="max-w-4xl mx-auto text-center mb-12">
                    <Skeleton className="h-12 w-3/4 mx-auto mb-4" />
                    <Skeleton className="h-6 w-1/2 mx-auto mb-4" />
                    <Skeleton className="h-16 w-full mx-auto mb-6" />
                    <div className="flex flex-wrap items-center justify-center gap-2">
                        <Skeleton className="h-6 w-20" />
                        <Skeleton className="h-6 w-24" />
                        <Skeleton className="h-6 w-16" />
                    </div>
                </div>
                <Separator className="my-16" />
                <div className="mt-12">
                     <Skeleton className="h-8 w-56 mx-auto mb-8" />
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <Skeleton className="aspect-video" />
                        <Skeleton className="aspect-video" />
                        <Skeleton className="aspect-video" />
                     </div>
                </div>
            </div>
        </div>
    )
}

export default function VideoPage() {
  const params = useParams();
  const id = params.id as string;
  
  const [video, setVideo] = useState<Video | null>(null);
  const [models, setModels] = useState<Model[]>([]);
  const [relatedVideos, setRelatedVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    
    const videoData = getVideoById(id);
    if (!videoData || videoData.status !== 'Published') {
        setLoading(false);
        return;
    }
    
    const allModels = getModels();
    const modelData = videoData.models.map(name => {
        return allModels.find(m => m.name === name);
    }).filter((m): m is Model => !!m);

    const allVideos = getVideos();
    let related = allVideos
      .filter(v => v.id !== id && v.status === 'Published')
      .filter(v => v.tags.some(tag => videoData.tags.includes(tag)))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3);

    if (related.length < 3) {
      const existingIds = new Set(related.map(v => v.id));
      existingIds.add(id);
      const latest = allVideos
        .filter(v => !existingIds.has(v.id) && v.status === 'Published')
        .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      related.push(...latest.slice(0, 3 - related.length));
    }

    setVideo(videoData);
    setModels(modelData);
    setRelatedVideos(related);
    setLoading(false);
  }, [id]);

  if (loading) {
    return <VideoPageSkeleton />;
  }

  if (!video) {
    notFound();
  }

  const displayDate = new Date(video.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC',
  });

  return (
    <div className="bg-background">
      <VideoPlayer video={video} />

      <div className="container mx-auto py-12 px-4 text-white">
        
        <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="text-4xl md:text-5xl mb-4 font-bold">{video.title}</h1>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-x-4 gap-y-2 text-muted-foreground mb-4 flex-wrap">
                <div className="flex items-center gap-2">
                    {models.map((model, index) => (
                        <React.Fragment key={model.id}>
                            <Link href={`/models/${model.id}`} className="hover:text-accent transition-colors font-semibold">
                                {model.name}
                            </Link>
                            {index < models.length - 1 && <span>&bull;</span>}
                        </React.Fragment>
                    ))}
                </div>
                <div className="hidden md:block text-muted-foreground/50">|</div>
                <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{displayDate}</span>
                </div>
            </div>

            <p className="text-lg text-muted-foreground max-w-prose mx-auto mb-6">{video.description}</p>
            
            {video.tags.length > 0 && (
                <div className="flex flex-wrap items-center justify-center gap-2">
                    {video.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-sm">{tag}</Badge>
                    ))}
                </div>
            )}
        </div>


        <Separator className="my-16" />

        <div className="mt-12">
          <h2 className="text-3xl mb-8 text-center uppercase tracking-widest">Related Scenes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedVideos.map((related) => (
              <ContentCard key={related.id} content={related} type="video" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
