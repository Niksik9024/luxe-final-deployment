
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft } from 'lucide-react';
import { ModelProfileForm } from '@/components/admin/ModelProfileForm';
import { getModelProfile, updateModelProfile } from '@/lib/model-profile-storage';
import { useToast } from "@/lib/use-toast";
import { Skeleton } from '@/components/ui/skeleton';
import type { ModelProfileWithImages } from '@/lib/hero-sample-data';

const modelProfileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  description: z.string().optional(),
  backgroundImage: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  mainImage: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  carouselImages: z.array(z.object({
    url: z.string().url("Must be a valid URL"),
    position: z.number().min(1).max(10)
  })).max(10, "Maximum 10 carousel images allowed")
});

type ModelProfileFormData = z.infer<typeof modelProfileSchema>;

export default function EditModelProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ModelProfileWithImages | null>(null);

  const form = useForm<ModelProfileFormData>({
    resolver: zodResolver(modelProfileSchema),
    defaultValues: {
      name: "",
      category: "",
      description: "",
      backgroundImage: "",
      mainImage: "",
      carouselImages: []
    }
  });

  useEffect(() => {
    const profileId = params.id as string;
    const existingProfile = getModelProfile(profileId);
    
    if (!existingProfile) {
      toast({
        title: "Profile Not Found",
        description: "The requested model profile could not be found.",
        variant: "destructive"
      });
      router.push('/admin/model-profiles');
      return;
    }

    setProfile(existingProfile);
    
    // Populate form with existing data
    const backgroundImage = existingProfile.images.find(img => img.imageType === 'background');
    const mainImage = existingProfile.images.find(img => img.imageType === 'main');
    const carouselImages = existingProfile.images
      .filter(img => img.imageType === 'carousel')
      .sort((a, b) => (a.imagePosition || 0) - (b.imagePosition || 0))
      .map(img => ({ url: img.imageUrl, position: img.imagePosition || 1 }));

    form.reset({
      name: existingProfile.name,
      category: existingProfile.category,
      description: existingProfile.description || "",
      backgroundImage: backgroundImage?.imageUrl || "",
      mainImage: mainImage?.imageUrl || "",
      carouselImages
    });
    
    setLoading(false);
  }, [params.id, form, router, toast]);

  const onSubmit = (data: ModelProfileFormData) => {
    if (!profile) return;

    const updatedProfile = updateModelProfile(profile.id, data);
    
    if (updatedProfile) {
      toast({
        title: "Profile Updated",
        description: `"${data.name}" has been updated successfully.`,
      });
      router.push('/admin/model-profiles');
    } else {
      toast({
        title: "Update Failed",
        description: "Failed to update the model profile.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div>
        <Skeleton className="h-8 w-1/2 mb-8" />
        <div className="bg-card border border-border rounded-lg shadow-lg p-8">
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-headline font-bold">Edit Model Profile</h1>
      </div>
      
      <div className="bg-card border border-border rounded-lg shadow-lg p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <ModelProfileForm />
            
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button type="submit">
                Update Profile
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
