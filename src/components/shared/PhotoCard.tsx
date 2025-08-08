
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import type { Photo } from '@/lib/types';
import { Eye, Heart } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

interface PhotoCardProps {
  photo: Photo;
  onImageClick?: () => void;
}

export const PhotoCard = ({ photo, onImageClick }: PhotoCardProps) => {
  const { currentUser, updateUserFavorites } = useAuth();
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setIsFavorited(currentUser?.favorites?.some(fav => fav.id === photo.id) || false);
  }, [currentUser?.favorites, photo.id]);


  const handleCardClick = (e: React.MouseEvent) => {
      e.preventDefault();
      if(onImageClick) {
        onImageClick();
      }
  }

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!currentUser || isFavoriteLoading) return;

    setAnimate(true);
    setTimeout(() => setAnimate(false), 300);

    setIsFavoriteLoading(true);
    const favoriteData = { id: photo.id, type: 'photo' as const };
    await updateUserFavorites(favoriteData, !isFavorited);
    setIsFavoriteLoading(false);
  }

  return (
    <Card 
        className="overflow-hidden group relative shadow-lg rounded-lg transition-all duration-300 hover:shadow-2xl bg-card border-border aspect-[2/3]"
    >
      <div className="absolute top-2 right-2 z-20">
            {currentUser && (
            <Button size="icon" variant="ghost" className="bg-background/50 hover:bg-accent/80 rounded-full h-8 w-8" onClick={handleFavoriteClick} disabled={isFavoriteLoading}>
                <Heart className={cn("w-4 h-4 text-foreground transition-all duration-300", isFavorited && "fill-accent text-accent", animate && "scale-150")} />
            </Button>
            )}
        </div>
      <div className="block cursor-pointer" onClick={handleCardClick}>
        <Image
            src={photo.image}
            alt={photo.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <Eye className="text-white" size={32} />
        </div>
      </div>
    </Card>
  );
};
