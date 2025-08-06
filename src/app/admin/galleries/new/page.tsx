
'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { ContentForm } from '@/components/admin/ContentForm'
import { collection, addDoc, doc, runTransaction } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { galleryFormSchema } from '@/app/admin/schemas/content'

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

        await addDoc(collection(db, 'galleries'), {
          ...values,
          tags: tagsArray,
          keywords: keywords,
          album: values.album ? values.album.map(item => item.value) : [],
          date: new Date().toISOString(),
        });
        
        if (tagsArray.length > 0) {
            const tagsDocRef = doc(db, 'tags', '--all--');
            await runTransaction(db, async (transaction) => {
                const tagsDoc = await transaction.get(tagsDocRef);
                const tagsData = tagsDoc.exists() ? tagsDoc.data() : {};
                tagsArray.forEach(tag => {
                    tagsData[tag] = (tagsData[tag] || 0) + 1;
                });
                transaction.set(tagsDocRef, tagsData);
            });
        }

        toast({
          title: "Gallery Created",
          description: `The new gallery "${values.title}" has been successfully created.`,
        })
        router.push('/admin/galleries')
        router.refresh()
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
