'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { useToast } from "@/lib/use-toast"
import { getModelById, updateModel } from '@/lib/localStorage'
import type { Model } from '@/lib/types'
import { modelFormSchema } from '@/app/admin/schemas/content'
import { ModelForm } from '@/components/admin/ModelForm'
import { Skeleton } from '@/components/ui/skeleton'

export default function EditModelPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  
  const modelId = params.id as string
  const [loading, setLoading] = useState(true);

  const form = useForm<z.infer<typeof modelFormSchema>>({
    resolver: zodResolver(modelFormSchema),
  });

  useEffect(() => {
    if (modelId) {
      const model = getModelById(modelId);
      if (model) {
        form.reset(model);
      }
      setLoading(false);
    }
  }, [modelId, form]);

  async function onSubmit(values: z.infer<typeof modelFormSchema>) {
    try {
        updateModel(modelId, values);

        toast({
          title: "Model Updated",
          description: `The model "${values.name}" has been successfully updated.`,
        })
        router.push('/admin/models')
    } catch (error) {
         toast({
            title: "Error Updating Model",
            description: "An unknown error occurred.",
            variant: "destructive"
        })
        console.error("Update error:", error);
    }
  }

  if (loading) {
    return (
        <div>
            <Skeleton className="h-8 w-1/2 mb-8" />
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                    <Skeleton className="h-full w-full min-h-[300px]" />
                </div>
                <div className="md:col-span-1 space-y-6">
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-96 w-full" />
                </div>
            </div>
        </div>
    )
  }
  
  const currentName = form.watch('name');

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Edit Model: {currentName}</h1>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <ModelForm />
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
            <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground">Save Changes</Button>
          </div>
        </form>
      </FormProvider>
    </div>
  )
}
