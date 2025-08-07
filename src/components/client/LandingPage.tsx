
'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import SecretCodeModal from "@/components/shared/SecretCodeModal";
import { Video, Images, Star } from 'lucide-react';

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
      <div className="relative h-screen flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1536510344834-4347b744b11e?q=80&w=1920&h=1080&auto=format&fit=crop')",
          }}
          data-ai-hint="luxury dark interior"
        >
          <div className="absolute inset-0 bg-black/70" />
        </div>
        
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <h1 className="text-5xl lg:text-8xl font-headline font-bold mb-6 tracking-wide [text-shadow:0_4px_15px_rgba(0,0,0,0.5)]">
            LUXE
          </h1>
          <p className="text-xl lg:text-2xl mb-8 opacity-90 max-w-2xl mx-auto">
            The premier destination for exclusive, high-fashion visual content.
          </p>
          <Button
            onClick={() => setIsSecretModalOpen(true)}
            size="lg"
            className="bg-accent text-accent-foreground px-8 py-4 h-14 text-lg font-bold hover:bg-accent/90 transition-transform hover:scale-105"
          >
            GET STARTED
          </Button>
        </div>
      </div>

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

      {/* Secret Code Modal */}
      <SecretCodeModal 
        isOpen={isSecretModalOpen}
        onClose={() => setIsSecretModalOpen(false)}
        onSuccess={handleAccessGranted}
      />
    </div>
  );
}
