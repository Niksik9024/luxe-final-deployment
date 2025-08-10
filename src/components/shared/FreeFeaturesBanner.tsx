
import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart, Star, Gift, Crown } from 'lucide-react';

export const FreeFeaturesBanner = () => {
  return (
    <section className="relative py-16 sm:py-20 bg-card border-t border-b border-primary/20">
      <div className="absolute inset-0 bg-luxury-dark-gradient opacity-30"></div>
      <div className="relative container mx-auto mobile-friendly-padding text-center">
        <div className="luxury-fade-in">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-luxury-gradient rounded-full">
              <Gift className="h-8 w-8 text-black" />
            </div>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-foreground">
            100% Free Platform
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Enjoy unlimited access to premium content, create favorites, and explore our luxury collection without any subscription fees
          </p>
          <div className="mobile-grid-3 max-w-4xl mx-auto">
            <div className="flex flex-col items-center p-4 sm:p-6 luxury-card-mobile rounded-lg">
              <Star className="h-8 w-8 sm:h-10 sm:w-10 text-primary mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Unlimited Access</h3>
              <p className="mobile-text-scale text-muted-foreground text-center">
                Browse all content without restrictions
              </p>
            </div>
            <div className="flex flex-col items-center p-4 sm:p-6 luxury-card-mobile rounded-lg">
              <Heart className="h-8 w-8 sm:h-10 sm:w-10 text-primary mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Save Favorites</h3>
              <p className="mobile-text-scale text-muted-foreground text-center">
                Create your personal collection
              </p>
            </div>
            <div className="flex flex-col items-center p-4 sm:p-6 luxury-card-mobile rounded-lg col-span-2 sm:col-span-1">
              <Crown className="h-8 w-8 sm:h-10 sm:w-10 text-primary mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Premium Quality</h3>
              <p className="mobile-text-scale text-muted-foreground text-center">
                High-resolution content always free
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
