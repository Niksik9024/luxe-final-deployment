
'use client'

import React from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { ContentForm } from '@/components/admin/ContentForm'
import { doc, getDoc, updateDoc, runTransaction } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { Video } from '@/lib/types'
import { videoFormSchema } from '@/app/admin/schemas/content'
import { Skeleton } from '@/components/ui/skeleton'

export default function EditVideoPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  
  const videoId = params.id as string
  const [originalTags, setOriginalTags] = React.useState<string[]>([]);

  const form = useForm<z.infer<typeof videoFormSchema>>({
    resolver: zodResolver(videoFormSchema),
    defaultValues: async () => {
        if (!videoId) return {};
        const docRef = doc(db, 'videos', videoId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const video = docSnap.data() as Video;
            const tags = video.tags || [];
            setOriginalTags(tags);
            return {
                title: video.title || "",
                description: video.description || "",
                videoUrl: video.videoUrl || "",
                image: video.image || "",
                models: video.models || [],
                tags: tags.join(", "),
                status: video.status || 'Draft',
                isFeatured: video.isFeatured || false,
            }
        }
        return {};
    },
  })

  async function onSubmit(values: z.infer<typeof videoFormSchema>) {
    try {
        const videoRef = doc(db, 'videos', videoId);
        const newTagsArray = values.tags ? values.tags.split(',').map(tag => tag.trim().toLowerCase()).filter(Boolean) : [];
        const keywords = Array.from(new Set([
            ...values.title.toLowerCase().split(' ').filter(Boolean),
            ...values.models.map(m => m.toLowerCase()),
            ...newTagsArray
        ]));

        await updateDoc(videoRef, {
            ...values,
            tags: newTagsArray,
            keywords: keywords,
            isFeatured: values.isFeatured || false,
        });

        // Update central tags collection
        const tagsAdded = newTagsArray.filter(t => !originalTags.includes(t));
        const tagsRemoved = originalTags.filter(t => !newTagsArray.includes(t));

        if (tagsAdded.length > 0 || tagsRemoved.length > 0) {
            const tagsDocRef = doc(db, 'tags', '--all--');
            await runTransaction(db, async (transaction) => {
                const tagsDoc = await transaction.get(tagsDocRef);
                const tagsData = tagsDoc.exists() ? tagsDoc.data() : {};
                tagsAdded.forEach(tag => {
                    tagsData[tag] = (tagsData[tag] || 0) + 1;
                });
                tagsRemoved.forEach(tag => {
                    if (tagsData[tag]) {
                        tagsData[tag] -= 1;
                        if (tagsData[tag] <= 0) {
                            delete tagsData[tag];
                        }
                    }
                });
                if (tagsDoc.exists()) {
                    transaction.update(tagsDocRef, tagsData);
                } else {
                    transaction.set(tagsDocRef, tagsData);
                }
            });
        }


        toast({
          title: "Video Updated",
          description: `The video "${values.title}" has been successfully updated.`,
        })
        router.push('/admin/videos')
        router.refresh()

    } catch (error) {
         toast({
          title: "Error",
          description: "There was an error updating the video.",
          variant: "destructive"
        })
    }
  }

  if (form.formState.isLoading) {
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
  
  const title = form.getValues('title');

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Edit Video: {title}</h1>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <ContentForm type="video" />
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
            <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground">Save Changes</Button>
          </div>
        </form>
      </FormProvider>
    </div>
  )
}
