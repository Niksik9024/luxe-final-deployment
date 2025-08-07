
'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { ContentForm } from '@/components/admin/ContentForm'
import { getGalleries, setGalleries, getTags, setTags } from '@/lib/localStorage'
import { galleryFormSchema } from '@/app/admin/schemas/content'
import type { Gallery } from '@/lib/types'

export default function NewGalleryPage() {
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof galleryFormSchema>>({
    resolver: zodResolver(galleryFormSchema),
    defaultValues: {
      title: "",
      description: "",
      image: "",
      models: [],
      tags: "",
      status: 'Draft',
      album: [],
    },
  })

  async function onSubmit(values: z.infer<typeof galleryFormSchema>) {
    try {
        const tagsArray = values.tags ? values.tags.split(',').map(tag => tag.trim().toLowerCase()).filter(Boolean) : [];
        const keywords = Array.from(new Set([
            ...values.title.toLowerCase().split(' ').filter(Boolean),
            ...values.models.map(m => m.toLowerCase()),
            ...tagsArray
        ]));

        const newGallery: Gallery = {
          id: `gallery_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          ...values,
          tags: tagsArray,
          keywords: keywords,
          album: values.album ? values.album.map(item => item.value) : [],
          date: new Date().toISOString(),
        };

        const galleries = getGalleries();
        setGalleries([...galleries, newGallery]);
        
        if (tagsArray.length > 0) {
            const allTags = getTags();
            tagsArray.forEach(tag => {
                allTags[tag] = (allTags[tag] || 0) + 1;
            });
            setTags(allTags);
        }

        toast({
          title: "Gallery Created",
          description: `The new gallery "${values.title}" has been successfully created.`,
        })
        router.push('/admin/galleries')
    } catch(error) {
        toast({
            title: "Error Creating Gallery",
            description: "An unexpected error occurred.",
            variant: 'destructive'
        });
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Add New Gallery</h1>
       <FormProvider {...form}>
         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <ContentForm type="gallery" />
             <div className="flex justify-end gap-4">
                 <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground">Create Gallery</Button>
            </div>
         </form>
       </FormProvider>
    </div>
  )
}
