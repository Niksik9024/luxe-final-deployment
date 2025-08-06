
import React from 'react';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ContentCard } from '@/components/shared/ContentCard';
import { User, Calendar, Tag } from 'lucide-react';
import { adminDb } from '@/lib/firebase-admin';
import type { Video, Model } from '@/lib/types';
import { VideoPlayer } from '@/components/client/VideoPlayer';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import type { Metadata } from 'next';

// Revalidate this page every 5 minutes
export const revalidate = 300;

async function getVideoAndRelated(id: string): Promise<{ video: Video; models: Model[]; relatedVideos: Video[] } | null> {
    if (!adminDb) return null;

    try {
        const videoRef = adminDb.collection('videos').doc(id);
        const videoSnap = await videoRef.get();

        if (!videoSnap.exists || videoSnap.data()?.status !== 'Published') {
            return null;
        }

        let video = { id: videoSnap.id, ...videoSnap.data() } as Video;
        
        // Fetch all models and all videos for in-code filtering
        const [modelsSnap, allVideosSnap] = await Promise.all([
            adminDb.collection('models').get(),
            adminDb.collection('videos').where('status', '==', 'Published').get()
        ]);
        
        const allModels = modelsSnap.docs.map(d => ({ ...d.data(), id: d.id } as Model));
        const allPublishedVideos = allVideosSnap.docs.map(d => ({ ...d.data(), id: d.id } as Video));
        
        // Find the models for the current video, ensuring they still exist
        const models = allModels.filter(m => video.models.includes(m.name));

        // Find related videos by tag, excluding the current video
        let relatedVideos = allPublishedVideos
            .filter(v => v.id !== id)
            .filter(v => v.tags.some(tag => video.tags.includes(tag)))
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 3);
            
        // If not enough related videos by tag, fill with the latest videos
        if (relatedVideos.length < 3) {
            const existingIds = new Set(relatedVideos.map(v => v.id));
            existingIds.add(id);

            const latestVideos = allPublishedVideos
                .filter(v => !existingIds.has(v.id))
                .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            
            const needed = 3 - relatedVideos.length;
            relatedVideos.push(...latestVideos.slice(0, needed));
        }


        return { video, models, relatedVideos };
    } catch(error) {
        console.error("Error fetching video data:", error);
        return null;
    }
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const data = await getVideoAndRelated(params.id);
  if (!data) {
    return {
      title: 'Video Not Found',
    }
  }
  return {
    title: `Video: ${data.video.title} | LUXE`,
    description: data.video.description || `Watch ${data.video.title} on LUXE.`,
  }
}

export default async function VideoPage({ params }: { params: { id:string } }) {
  const data = await getVideoAndRelated(params.id);
  
  if (!data) {
    notFound();
  }

  const { video, models, relatedVideos } = data;
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
        
        {/* Metadata Block */}
        <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="text-4xl md:text-5xl mb-4 font-bold">{video.title}</h1>
            
            <div className="flex items-center justify-center gap-x-4 gap-y-2 text-muted-foreground mb-4 flex-wrap">
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
