
'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { ContentForm } from '@/components/admin/ContentForm'
import { getGalleryById, setGalleries, getGalleries, getTags, setTags } from '@/lib/localStorage'
import type { Gallery } from '@/lib/types'
import { galleryFormSchema } from '@/app/admin/schemas/content'
import { Skeleton } from '@/components/ui/skeleton'

export default function EditGalleryPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  
  const galleryId = params.id as string
  const [originalTags, setOriginalTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const form = useForm<z.infer<typeof galleryFormSchema>>({
    resolver: zodResolver(galleryFormSchema),
  })

  useEffect(() => {
    if (galleryId) {
      const gallery = getGalleryById(galleryId);
      if (gallery) {
        const tags = gallery.tags || [];
        setOriginalTags(tags);
        form.reset({
          title: gallery.title || "",
          description: gallery.description || "",
          image: gallery.image || "",
          models: gallery.models || [],
          tags: tags.join(", "),
          status: gallery.status || 'Draft',
          album: (gallery.album || []).map(url => ({ value: url })),
        });
      }
      setLoading(false);
    }
  }, [galleryId, form]);

  async function onSubmit(values: z.infer<typeof galleryFormSchema>) {
    try {
        const galleries = getGalleries();
        const galleryIndex = galleries.findIndex(g => g.id === galleryId);
        if (galleryIndex === -1) {
            toast({ title: "Error", description: "Gallery not found.", variant: "destructive" });
            return;
        }

        const newTagsArray = values.tags ? values.tags.split(',').map(tag => tag.trim().toLowerCase()).filter(Boolean) : [];
        const keywords = Array.from(new Set([
            ...values.title.toLowerCase().split(' ').filter(Boolean),
            ...values.models.map(m => m.toLowerCase()),
            ...newTagsArray
        ]));

        const updatedGallery: Gallery = {
            ...galleries[galleryIndex],
            ...values,
            tags: newTagsArray,
            keywords: keywords,
            album: values.album ? values.album.map(item => item.value) : [],
        };
        
        galleries[galleryIndex] = updatedGallery;
        setGalleries(galleries);

        // Update central tags collection
        const allTags = getTags();
        const tagsAdded = newTagsArray.filter(t => !originalTags.includes(t));
        const tagsRemoved = originalTags.filter(t => !newTagsArray.includes(t));

        tagsAdded.forEach(tag => {
            allTags[tag] = (allTags[tag] || 0) + 1;
        });
        tagsRemoved.forEach(tag => {
            if (allTags[tag]) {
                allTags[tag] -= 1;
                if (allTags[tag] <= 0) {
                    delete allTags[tag];
                }
            }
        });
        setTags(allTags);
        
        toast({
          title: "Gallery Updated",
          description: `The gallery "${values.title}" has been successfully updated.`,
        })
        router.push('/admin/galleries')
    } catch (error) {
         toast({
          title: "Error",
          description: "There was an error updating the gallery.",
          variant: "destructive"
        })
    }
  }

  if (loading) {
    return (
        <div>
            <Skeleton className="h-8 w-1/2 mb-8" />
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <Skeleton className="h-64 w-full" />
                    <Skeleton className="h-80 w-full" />
                </div>
                <div className="space-y-8">
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-64 w-full" />
                </div>
            </div>
        </div>
    )
  }
  
  const title = form.watch('title');

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Edit Gallery: {title}</h1>
       <FormProvider {...form}>
         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <ContentForm type="gallery" />
             <div className="flex justify-end gap-4">
                 <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground">Save Changes</Button>
            </div>
         </form>
       </FormProvider>
    </div>
  )
}
