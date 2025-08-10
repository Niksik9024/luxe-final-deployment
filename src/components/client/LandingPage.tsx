'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import SecretCodeModal from "@/components/shared/SecretCodeModal";
import { Video, Images, Star, Sparkles, Film, Camera, Crown } from 'lucide-react';
import { HeroCarousel } from './HeroCarousel';
import { FreeFeaturesBanner } from '../shared/FreeFeaturesBanner';

interface LandingPageProps {
  onAccessGranted?: () => void;
}

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
    <Card className="bg-card/80 border-border/50 backdrop-blur-sm transform hover:-translate-y-2 transition-transform duration-300">
        <CardContent className="p-8 text-center">
        <div className="w-16 h-16 bg-accent/10 border border-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
            {icon}
        </div>
        <h3 className="text-white text-xl font-bold mb-4 uppercase tracking-wider">{title}</h3>
        <p className="text-muted-foreground">
            {description}
        </p>
        </CardContent>
    </Card>
);


export default function LandingPage({ onAccessGranted }: LandingPageProps) {
  const [isSecretModalOpen, setIsSecretModalOpen] = useState(false);

  const handleAccessGranted = () => {
    setIsSecretModalOpen(false);
    if (onAccessGranted) {
      onAccessGranted();
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-luxury-dark-gradient opacity-80"></div>
        <div className="absolute inset-0">
          <HeroCarousel />
        </div>
        <div className="relative z-10 text-center mobile-friendly-padding max-w-6xl mx-auto">
          <div className="luxury-fade-in">
            <h1 className="mb-6 sm:mb-8 leading-tight">
              Premium Visual
              <br />
              <span className="text-primary">Experience</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed">
              Discover the world's most captivating models and exclusive content in our luxury digital collection
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
              <Button size="lg" className="btn-luxury w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-bold tracking-wider touch-friendly">
                <Sparkles className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                EXPLORE COLLECTION
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-medium border-primary/50 hover:border-primary hover:bg-primary/10 touch-friendly">
                <Film className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                WATCH VIDEOS
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Free Features Banner */}
      <FreeFeaturesBanner />

      {/* Features Section */}
      <div className="py-20 px-4 bg-background">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl lg:text-5xl font-bold text-center mb-12 tracking-wide uppercase">
            Premium Features
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <FeatureCard
                icon={<Video className="w-8 h-8 text-accent"/>}
                title="Premium Videos"
                description="Exclusive high-quality video content with advanced streaming technology."
            />
            <FeatureCard
                icon={<Images className="w-8 h-8 text-accent"/>}
                title="Photo Galleries"
                description="Stunning photo collections and professional photography portfolios."
            />
            <FeatureCard
                icon={<Star className="w-8 h-8 text-accent"/>}
                title="Featured Models"
                description="Exclusive access to featured models and their premium content."
            />
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <section className="py-16 sm:py-20 bg-card relative overflow-hidden">
        <div className="absolute inset-0 bg-luxury-dark-gradient opacity-40"></div>
        <div className="relative container mx-auto mobile-friendly-padding text-center">
          <div className="luxury-scale-in">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-foreground">
              Ready to Explore?
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join our exclusive community and discover the finest collection of luxury visual content
            </p>
            <Button size="lg" className="btn-luxury w-full sm:w-auto px-8 sm:px-12 py-3 sm:py-4 text-base sm:text-lg font-bold tracking-wider touch-friendly">
              <Crown className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              START EXPLORING
            </Button>
          </div>
        </div>
      </section>

      {/* Secret Code Modal */}
      <SecretCodeModal
        isOpen={isSecretModalOpen}
        onClose={() => setIsSecretModalOpen(false)}
        onSuccess={handleAccessGranted}
      />
    </div>
  );
}