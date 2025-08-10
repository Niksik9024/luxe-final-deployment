
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import ModelPortfolioHero from '@/components/client/ModelPortfolioHero';
import type { ModelProfileWithImages } from '@/lib/hero-sample-data';
import { Skeleton } from '@/components/ui/skeleton';

const getModelProfileById = (id: string): ModelProfileWithImages | null => {
  if (typeof window === 'undefined') return null;
  const profiles = JSON.parse(localStorage.getItem('modelProfiles') || '[]');
  return profiles.find((profile: ModelProfileWithImages) => profile.id === id) || null;
};

export default function PreviewModelProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [profile, setProfile] = useState<ModelProfileWithImages | null>(null);
  const [loading, setLoading] = useState(true);

  const profileId = params.id as string;

  useEffect(() => {
    if (profileId) {
      const foundProfile = getModelProfileById(profileId);
      setProfile(foundProfile);
      setLoading(false);
    }
  }, [profileId]);

  if (loading) {
    return (
      <div>
        <div className="flex items-center gap-4 mb-8">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-8 w-48" />
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-16">
        <h1 className="text-2xl font-bold mb-4">Profile Not Found</h1>
        <p className="text-muted-foreground mb-8">The requested model profile could not be found.</p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">Preview: {profile.name}</h1>
      </div>
      
      <div className="border rounded-lg overflow-hidden">
        <ModelPortfolioHero 
          modelProfile={profile}
          className="w-full"
        />
      </div>
      
      <div className="mt-8 p-6 bg-muted rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Profile Details</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">Name:</span> {profile.name}
          </div>
          <div>
            <span className="font-medium">Category:</span> {profile.category}
          </div>
          <div>
            <span className="font-medium">Images:</span> {profile.images.length} total
          </div>
          <div>
            <span className="font-medium">Last Updated:</span> {new Date(profile.updatedAt).toLocaleDateString()}
          </div>
        </div>
        {profile.description && (
          <div className="mt-4">
            <span className="font-medium">Description:</span>
            <p className="mt-1">{profile.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}
