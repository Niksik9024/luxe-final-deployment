

'use client'

import React, { useState } from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import type { Photo } from '@/lib/types';
import { Eye } from 'lucide-react';

interface PhotoCardProps {
  photo: Photo;
  onImageClick?: () => void;
}

export const PhotoCard = ({ photo, onImageClick }: PhotoCardProps) => {

  const handleCardClick = (e: React.MouseEvent) => {
      e.preventDefault();
      if(onImageClick) {
        onImageClick();
      }
  }

  return (
    <Card 
        className="overflow-hidden group relative shadow-lg rounded-lg transition-all duration-300 hover:shadow-2xl bg-card border-border aspect-[2/3]"
        onClick={handleCardClick}
    >
      <div className="block cursor-pointer">
        <Image
            src={photo.image}
            alt={photo.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer">
            <Eye className="text-white" size={32} />
        </div>
      </div>
    </Card>
  );
};


