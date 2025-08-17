
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useToast } from "@/lib/use-toast";
import { ModelProfileForm } from '@/components/admin/ModelProfileForm';
import type { ModelProfileWithImages } from '@/lib/hero-sample-data';
import { saveModelProfile } from '@/lib/model-profile-storage';

const modelProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  backgroundImage: z.string().url("Please provide a valid background image URL.").optional(),
  mainImage: z.string().url("Please provide a valid main image URL.").optional(),
  carouselImages: z.array(z.object({
    url: z.string().url("Please provide a valid image URL."),
    position: z.number().min(1).max(10)
  })).max(10, "Maximum 10 carousel images allowed.")
});

export default function NewModelProfilePage() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof modelProfileSchema>>({
    resolver: zodResolver(modelProfileSchema),
    defaultValues: {
      name: "",
      backgroundImage: "",
      mainImage: "",
      carouselImages: []
    },
  });

  async function onSubmit(values: z.infer<typeof modelProfileSchema>) {
    try {
      const newProfile: ModelProfileWithImages = {
        id: `profile_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: values.name,
        category: "Hero", // Default category
        description: "", // Default description
        createdAt: new Date(),
        updatedAt: new Date(),
        images: [
          ...(values.backgroundImage ? [{
            id: `img_bg_${Date.now()}`,
            modelProfileId: '',
            imageType: 'background' as const,
            imagePosition: null,
            imageUrl: values.backgroundImage,
            createdAt: new Date()
          }] : []),
          ...(values.mainImage ? [{
            id: `img_main_${Date.now()}`,
            modelProfileId: '',
            imageType: 'main' as const,
            imagePosition: null,
            imageUrl: values.mainImage,
            createdAt: new Date()
          }] : []),
          ...values.carouselImages.map((img, index) => ({
            id: `img_carousel_${Date.now()}_${index}`,
            modelProfileId: '',
            imageType: 'carousel' as const,
            imagePosition: img.position,
            imageUrl: img.url,
            createdAt: new Date()
          }))
        ]
      };

      // Update modelProfileId for all images
      newProfile.images.forEach(img => {
        img.modelProfileId = newProfile.id;
      });

      saveModelProfile(newProfile);

      toast({
        title: "Model Profile Created",
        description: `"${values.name}" has been successfully created.`,
      });
      
      router.push('/admin/model-profiles');
    } catch (error) {
      toast({
        title: "Error Creating Profile",
        description: "An unknown error occurred.",
        variant: "destructive"
      });
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Create New Model Profile</h1>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <ModelProfileForm />
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground">
              Create Profile
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
