

'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import type { Video, Gallery } from '@/lib/types';
import { cn } from '@/lib/utils';
import { PlayCircle, Edit, Heart } from 'lucide-react';
import { useDataSaver } from '@/contexts/DataSaverContext';
import { Button } from '../ui/button';
import { useAuth } from '@/lib/auth';

interface ContentCardProps {
  content: Video | Gallery;
  type: 'video' | 'gallery';
  priority?: boolean;
}

export const ContentCard = ({ 
  content, 
  type,
  priority = false,
}: ContentCardProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playPromiseRef = useRef<Promise<void>>();
  const [isHovering, setIsHovering] = useState(false);
  const { isDataSaver } = useDataSaver();
  const { currentUser, isAdmin, loading, updateUserFavorites } = useAuth();
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);
  
  const isFavorite = currentUser?.favorites?.some(fav => fav.id === content.id) || false;

  const canPlay = !isDataSaver;
  const isVideo = type === 'video' && 'videoUrl' in content;

  const handleMouseEnter = () => {
    if (!canPlay || !isVideo || !videoRef.current) return;
    setIsHovering(true);
    playPromiseRef.current = videoRef.current.play().catch(err => {
        // We catch the error here to prevent it from bubbling up as an uncaught promise rejection.
        // The error itself is often a benign race condition, so we don't need to log it.
    });
  };

  const handleMouseLeave = () => {
    if (!canPlay || !isVideo || !videoRef.current) return;
    setIsHovering(false);
    
    // Wait for the play promise to resolve before pausing
    if (playPromiseRef.current) {
        playPromiseRef.current.then(() => {
            if (videoRef.current) {
                videoRef.current.pause();
                videoRef.current.currentTime = 0;
            }
        }).catch(() => {
            // If play() was interrupted, the promise will reject. 
            // We can safely ignore this and ensure the video is paused.
            if (videoRef.current) {
                videoRef.current.pause();
                videoRef.current.currentTime = 0;
            }
        });
    }
  };
  
  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!currentUser || isFavoriteLoading) return;

    setIsFavoriteLoading(true);
    const favoriteData = { id: content.id, type: type };
    await updateUserFavorites(favoriteData, !isFavorite);
    setIsFavoriteLoading(false);
  }

  const cardAspectRatio = isVideo ? 'aspect-[16/9]' : 'aspect-[2/3]';
  const pluralType = type === 'gallery' ? 'galleries' : 'videos';
  const linkUrl = `/${pluralType}/${content.id}`;
  const editLinkUrl = `/admin/${pluralType}/edit/${content.id}`;

  return (
    <Card 
      className={cn(
        "overflow-hidden group relative shadow-lg rounded-lg md:hover:scale-105 md:hover:shadow-2xl w-full bg-card border-border transition-transform duration-300",
        cardAspectRatio
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
        <div className="absolute top-2 left-2 z-20">
            {isAdmin && (
            <Button asChild size="sm" className="bg-background/70 text-foreground hover:bg-accent hover:text-accent-foreground">
                <Link href={editLinkUrl}>
                <Edit className="mr-2 h-4 w-4" /> Edit
                </Link>
            </Button>
            )}
        </div>
        <div className="absolute top-2 right-2 z-20">
            {currentUser && (
            <Button size="icon" variant="ghost" className="bg-background/50 hover:bg-accent/80 rounded-full h-8 w-8" onClick={handleFavoriteClick} disabled={isFavoriteLoading}>
                <Heart className={cn("w-4 h-4 text-foreground", isFavorite && "fill-accent text-accent")} />
            </Button>
            )}
        </div>
      <Link href={linkUrl} className="block w-full h-full" aria-label={`View details for ${content.title}`}>
        <div className="relative w-full h-full">
          <Image
            src={content.image}
            alt={content.title}
            fill
            className={cn(
              "object-cover w-full h-full transition-opacity duration-300",
              isVideo && canPlay && isHovering ? 'opacity-0' : 'opacity-100'
            )}
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            priority={priority}
          />

          {isVideo && canPlay && (content as Video).videoUrl && (
            <video
              ref={videoRef}
              src={(content as Video).videoUrl}
              muted
              loop
              playsInline
              className={cn(
                "absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-300",
                isHovering ? 'opacity-100' : 'opacity-0'
              )}
            />
          )}
          
          {isVideo && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              {!isHovering && <PlayCircle className="text-foreground/80" size={48} />}
            </div>
          )}

          <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent">
            <h3 className="font-bold text-lg truncate shadow-black/50 [text-shadow:0_1px_4px_var(--tw-shadow-color)]">{content.title}</h3>
            <p className="text-sm text-foreground/90 truncate shadow-black/50 [text-shadow:0_1px_4px_var(--tw-shadow-color)]">{content.models.join(', ')}</p>
          </div>
        </div>
      </Link>
    </Card>
  );
};
