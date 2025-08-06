

'use client';

import React, { useState } from 'react';
import { Lightbox } from '@/components/shared/Lightbox';
import { PhotoCard } from '@/components/shared/PhotoCard';
import type { Photo } from '@/lib/types';


export const GalleryClientPage = ({ albumPhotos }: { albumPhotos: Photo[] }) => {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxStartIndex, setLightboxStartIndex] = useState(0);

    const openLightbox = (index: number) => {
        setLightboxStartIndex(index);
        setLightboxOpen(true);
    };

    return (
        <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 gap-4 md:gap-6 max-w-7xl mx-auto">
                {albumPhotos.map((p, index) => (
                   <PhotoCard 
                    key={p.id} 
                    photo={p}
                    onImageClick={() => openLightbox(index)}
                   />
                ))}
            </div>

            {lightboxOpen && (
                <Lightbox
                  images={albumPhotos}
                  startIndex={lightboxStartIndex}
                  onClose={() => setLightboxOpen(false)}
                />
            )}
        </>
    )
}
