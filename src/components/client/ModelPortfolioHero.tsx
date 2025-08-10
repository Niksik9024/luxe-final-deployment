
'use client';

import React from 'react';

interface ModelProfile {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ModelImage {
  id: string;
  modelProfileId: string;
  imageType: 'background' | 'main' | 'carousel';
  imagePosition: number | null; // 1-10 for carousel
  imageUrl: string;
  createdAt: Date;
}

interface ModelProfileWithImages extends ModelProfile {
  images: ModelImage[];
}

interface ModelPortfolioHeroProps {
  modelProfile: ModelProfileWithImages;
  className?: string;
}

export default function ModelPortfolioHero({ modelProfile, className = "" }: ModelPortfolioHeroProps) {
  // Get images by type - EXACT SAME LOGIC
  const backgroundImage = modelProfile.images.find(img => img.imageType === 'background');
  const mainImage = modelProfile.images.find(img => img.imageType === 'main');
  const carouselImages = modelProfile.images
    .filter(img => img.imageType === 'carousel')
    .sort((a, b) => (a.imagePosition || 0) - (b.imagePosition || 0))
    .slice(0, 10); // Ensure max 10 images

  const bgImageUrl = backgroundImage?.imageUrl || '';
  const modelImageUrl = mainImage?.imageUrl || '';

  return (
    <div 
      className={`hero-body ${className}`}
      style={{
        '--bg-image': bgImageUrl ? `url(${bgImageUrl})` : 'none',
        '--model-image': modelImageUrl ? `url(${modelImageUrl})` : 'none',
      } as React.CSSProperties}
    >
      <div className="banner">
        <div className="slider" style={{ '--quantity': carouselImages.length } as React.CSSProperties}>
          {carouselImages.map((image, index) => (
            <div 
              key={image.id}
              className="item" 
              style={{ '--position': index + 1 } as React.CSSProperties}
            >
              <img 
                src={image.imageUrl} 
                alt={`${modelProfile.name} - Carousel ${index + 1}`}
              />
            </div>
          ))}
        </div>
        <div className="content">
          <h1 data-content={modelProfile.name.toUpperCase()}>
            {modelProfile.name.toUpperCase()}
          </h1>
          <div className="model"></div>
        </div>
      </div>
    </div>
  );
}
