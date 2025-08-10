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
  const [isFavorited, setIsFavorited] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
      setIsFavorited(currentUser?.favorites?.some(fav => fav.id === content.id) || false);
  }, [currentUser?.favorites, content.id]);

  const canPlay = !isDataSaver;
  const isVideo = type === 'video' && 'videoUrl' in content;

  const handleMouseEnter = () => {
    if (!canPlay || !isVideo || !videoRef.current) return;
    setIsHovering(true);
    playPromiseRef.current = videoRef.current.play().catch(err => {});
  };

  const handleMouseLeave = () => {
    if (!canPlay || !isVideo || !videoRef.current) return;
    setIsHovering(false);

    if (playPromiseRef.current) {
        playPromiseRef.current.then(() => {
            if (videoRef.current) {
                videoRef.current.pause();
                videoRef.current.currentTime = 0;
            }
        }).catch(() => {
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

    setAnimate(true);
    setTimeout(() => setAnimate(false), 300);

    setIsFavoriteLoading(true);
    const favoriteData = { id: content.id, type: type };
    await updateUserFavorites(favoriteData, !isFavorited);
    setIsFavoriteLoading(false);
  }

  const cardAspectRatio = isVideo ? 'aspect-[16/9]' : 'aspect-[2/3]';
  const pluralType = type === 'gallery' ? 'galleries' : 'videos';
  const linkUrl = `/${pluralType}/${content.id}`;
  const editLinkUrl = `/admin/${pluralType}/edit/${content.id}`;

  return (
    <Card 
      className={cn(
        "overflow-hidden group relative shadow-lg rounded-lg transition-transform duration-300",
        "md:hover:scale-105 md:hover:shadow-2xl", // Desktop hover effects
        "w-full", // Full width by default
        cardAspectRatio
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
        <div className="absolute top-2 left-2 z-20 sm:top-3 sm:left-3">
            {isAdmin && (
            <Button asChild size="sm" className="bg-background/70 text-foreground hover:bg-accent hover:text-accent-foreground px-2 py-1 text-xs sm:px-3 sm:py-2 sm:text-sm">
                <Link href={editLinkUrl}>
                <Edit className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" /> <span className="hidden sm:inline">Edit</span>
                </Link>
            </Button>
            )}
        </div>
        <div className="absolute top-2 right-2 z-20 sm:top-3 sm:right-3">
            {currentUser && (
            <Button size="icon" variant="ghost" className="bg-background/50 hover:bg-accent/80 rounded-full h-8 w-8 sm:h-10 sm:w-10" onClick={handleFavoriteClick} disabled={isFavoriteLoading}>
                <Heart className={cn("w-4 h-4 text-foreground transition-all duration-300", isFavorited && "fill-accent text-accent", animate && "scale-150")} />
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
            loading="lazy"
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
              {!isHovering && <PlayCircle className="text-foreground/80 w-12 h-12 sm:w-16 sm:h-16" />}
            </div>
          )}

          <div className="absolute bottom-0 left-0 w-full p-3 sm:p-4 bg-gradient-to-t from-black/80 to-transparent">
            <h3 className="font-bold text-sm sm:text-lg truncate shadow-black/50 [text-shadow:0_1px_4px_var(--tw-shadow-color)]">{content.title}</h3>
            <p className="text-xs sm:text-sm text-foreground/90 truncate shadow-black/50 [text-shadow:0_1px_4px_var(--tw-shadow-color)]">{content.models.join(', ')}</p>
          </div>
        </div>
      </Link>
    </Card>
  );
};