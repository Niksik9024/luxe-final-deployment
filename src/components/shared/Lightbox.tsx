

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut, Download, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Photo } from '@/lib/types';
import { useAuth } from '@/lib/auth';


interface LightboxProps {
  images: Photo[];
  startIndex: number;
  onClose: () => void;
}

const ActionButton = React.forwardRef<HTMLButtonElement, React.ComponentProps<typeof Button>>(({ className, children, ...props }, ref) => (
    <Button
        ref={ref}
        variant="ghost"
        size="icon"
        className={cn("text-white bg-black/50 hover:bg-white/20 rounded-full h-12 w-12 backdrop-blur-sm border border-white/10 transition-all hover:scale-105", className)}
        {...props}
    >
        {children}
    </Button>
));
ActionButton.displayName = 'ActionButton';

export const Lightbox: React.FC<LightboxProps> = ({ images, startIndex, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [isZoomed, setIsZoomed] = useState(false);
  const { currentUser, updateUserFavorites } = useAuth();
  
  const currentImage = images[currentIndex];
  const isFavorite = currentUser?.favorites?.some(fav => fav.id === currentImage?.id) || false;

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : images.length - 1));
    setIsZoomed(false);
  }, [images.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex < images.length - 1 ? prevIndex + 1 : 0));
    setIsZoomed(false);
  }, [images.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        goToNext();
      } else if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrevious, onClose]);

  const toggleZoom = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsZoomed(!isZoomed);
  };
  
  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = currentImage.image;
    link.download = `luxe-${currentImage.id}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUser) return;
    const favoriteData = { id: currentImage.id, type: 'photo' as const };
    await updateUserFavorites(favoriteData, !isFavorite);
  }

  if (!currentImage) return null;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="bg-black/90 border-none p-0 w-screen h-screen max-w-full flex flex-col items-center justify-center">
        {/* Close Button */}
        <ActionButton onClick={onClose} className="absolute top-4 right-4 z-50">
            <X size={24} />
        </ActionButton>
        
        {/* Main Image */}
        <div className="relative w-full h-full flex-grow flex items-center justify-center overflow-hidden" onClick={() => isZoomed && setIsZoomed(false)}>
          <div className="relative w-full h-full">
            <Image
              key={currentIndex}
              src={currentImage.image}
              alt={currentImage.title}
              fill
              className={cn(
                  "object-contain transition-transform duration-300",
                  isZoomed ? 'scale-125 cursor-zoom-out' : 'cursor-zoom-in'
              )}
              onClick={toggleZoom}
            />
          </div>
        </div>

        {/* Navigation Arrows */}
        <ActionButton
            className="absolute left-4 top-1/2 -translate-y-1/2"
            onClick={goToPrevious}
            aria-label="Previous image"
        >
            <ChevronLeft size={32} />
        </ActionButton>
        <ActionButton
            className="absolute right-4 top-1/2 -translate-y-1/2"
            onClick={goToNext}
            aria-label="Next image"
        >
            <ChevronRight size={32} />
        </ActionButton>

        {/* Bottom Toolbar */}
        <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex items-center gap-4">
          <ActionButton onClick={toggleZoom} aria-label={isZoomed ? 'Zoom out' : 'Zoom in'}>
            {isZoomed ? <ZoomOut /> : <ZoomIn />}
          </ActionButton>
           <ActionButton onClick={handleDownload} aria-label="Download image">
                <Download />
            </ActionButton>
             {currentUser && (
                <ActionButton onClick={handleFavoriteClick} aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}>
                    <Heart className={cn("h-6 w-6", isFavorite && "fill-accent text-accent")} />
                </ActionButton>
             )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
