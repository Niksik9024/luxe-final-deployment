'use client';

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, Calendar, Image as ImageIcon, Video as VideoIcon, FolderOpen } from 'lucide-react';
import Link from 'next/link';
import type { Video, Gallery } from '@/lib/types';

interface ModelPortfolioProps {
  videos: Video[];
  galleries: Gallery[];
}

export function ModelPortfolio({ videos, galleries }: ModelPortfolioProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'videos' | 'photos' | 'galleries'>('all');

  const allContent = useMemo(() => {
    try {
      const safeVideos = Array.isArray(videos) ? videos.filter(v => v && v.id && v.date) : [];
      const safeGalleries = Array.isArray(galleries) ? galleries.filter(g => g && g.id && g.date) : [];

      const videoContent = safeVideos.map(video => ({
        ...video,
        type: 'video' as const,
        date: new Date(video.date),
        thumbnail: video.thumbnail || '/default-avatar.png'
      }));

      const photoContent = safeGalleries.flatMap(gallery => {
        const images = Array.isArray(gallery.images) ? gallery.images : [];
        return images.filter(img => img && img.id && img.url).map(image => ({
          id: `${gallery.id}-${image.id}`,
          title: image.title || gallery.title || 'Untitled',
          thumbnail: image.url,
          type: 'photo' as const,
          date: new Date(gallery.date),
          galleryId: gallery.id,
          galleryTitle: gallery.title || 'Untitled Gallery'
        }));
      });

      const galleryContent = safeGalleries.map(gallery => ({
        ...gallery,
        type: 'gallery' as const,
        date: new Date(gallery.date),
        thumbnail: (gallery.images && gallery.images.length > 0) ? gallery.images[0].url : '/default-avatar.png',
        title: gallery.title || 'Untitled Gallery'
      }));

      return [...videoContent, ...photoContent, ...galleryContent].sort((a, b) => b.date.getTime() - a.date.getTime());
    } catch (error) {
      console.error('Error processing content for ModelPortfolio:', error);
      return [];
    }
  }, [videos, galleries]);

  const filteredContent = useMemo(() => {
    switch (activeTab) {
      case 'videos':
        return allContent.filter(item => item.type === 'video');
      case 'photos':
        return allContent.filter(item => item.type === 'photo');
      case 'galleries':
        return allContent.filter(item => item.type === 'gallery');
      default:
        return allContent;
    }
  }, [allContent, activeTab]);

  return (
    <div className="space-y-6 w-full">
      {/* Filter Tabs */}
      <div className="w-full">
        <div className="flex flex-wrap gap-2 border-b border-border overflow-x-auto pb-2">
          <Button
            variant={activeTab === 'all' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('all')}
            className="rounded-b-none whitespace-nowrap"
            size="sm"
          >
            ALL
          </Button>
          <Button
            variant={activeTab === 'videos' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('videos')}
            className="rounded-b-none whitespace-nowrap"
            size="sm"
          >
            <VideoIcon className="mr-2 h-4 w-4" />
            VIDEOS
          </Button>
          <Button
            variant={activeTab === 'photos' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('photos')}
            className="rounded-b-none whitespace-nowrap"
            size="sm"
          >
            <ImageIcon className="mr-2 h-4 w-4" />
            PHOTOS
          </Button>
          <Button
            variant={activeTab === 'galleries' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('galleries')}
            className="rounded-b-none whitespace-nowrap"
            size="sm"
          >
            <FolderOpen className="mr-2 h-4 w-4" />
            GALLERIES
          </Button>
        </div>
      </div>

      {/* Content Grid */}
      <div className="w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredContent.map((item) => (
            <Card key={item.id} className="group overflow-hidden hover:shadow-lg transition-shadow w-full">
              <div className="relative aspect-video w-full">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                {item.type === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="h-8 w-8 md:h-12 md:w-12 text-white" />
                  </div>
                )}
                {item.type === 'gallery' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                    <div className="text-center">
                      <FolderOpen className="h-8 w-8 md:h-12 md:w-12 text-white mx-auto mb-1" />
                      <span className="text-white text-sm font-medium">
                        {(item as any).images?.length || 0} photos
                      </span>
                    </div>
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <Badge variant={
                    item.type === 'video' ? 'default' : 
                    item.type === 'gallery' ? 'secondary' : 
                    'outline'
                  } className="text-xs">
                    {item.type === 'video' ? 'Video' : 
                     item.type === 'gallery' ? 'Gallery' : 'Photo'}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-3 md:p-4">
                <h3 className="font-semibold mb-2 line-clamp-1 text-sm md:text-base">{item.title}</h3>
                <div className="flex items-center text-xs md:text-sm text-muted-foreground mb-2">
                  <Calendar className="mr-1 h-3 w-3" />
                  {item.date.toLocaleDateString()}
                </div>
                {item.type === 'photo' && (
                  <p className="text-xs text-muted-foreground mb-2">
                    From: {(item as any).galleryTitle}
                  </p>
                )}
                {item.type === 'gallery' && (
                  <p className="text-xs text-muted-foreground mb-2">
                    {(item as any).images?.length || 0} images
                  </p>
                )}
                <Link 
                  href={
                    item.type === 'video' ? `/videos/${item.id}` : 
                    item.type === 'gallery' ? `/galleries/${item.id}` :
                    `/galleries/${(item as any).galleryId}`
                  }
                  className="block w-full"
                >
                  <Button variant="outline" size="sm" className="w-full text-xs md:text-sm">
                    View {
                      item.type === 'video' ? 'Video' : 
                      item.type === 'gallery' ? 'Gallery' : 'Photo'
                    }
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {filteredContent.length === 0 && (
        <div className="text-center py-8 md:py-12 text-muted-foreground">
          <div className="mb-4">
            {activeTab === 'videos' && <VideoIcon className="mx-auto h-8 w-8 md:h-12 md:w-12 opacity-50" />}
            {activeTab === 'photos' && <ImageIcon className="mx-auto h-8 w-8 md:h-12 md:w-12 opacity-50" />}
            {activeTab === 'galleries' && <FolderOpen className="mx-auto h-8 w-8 md:h-12 md:w-12 opacity-50" />}
            {activeTab === 'all' && <ImageIcon className="mx-auto h-8 w-8 md:h-12 md:w-12 opacity-50" />}
          </div>
          <p className="text-sm md:text-base">No {activeTab === 'all' ? 'content' : activeTab} available for this model.</p>
        </div>
      )}
    </div>
  );
}