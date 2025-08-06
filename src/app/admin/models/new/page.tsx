
'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Instagram, Twitter } from 'lucide-react'
import Image from 'next/image'
import { AIAvatarGenerator } from '@/components/admin/AIAvatarGenerator'
import { collection, addDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export const modelSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters."),
    image: z.string().min(1, { message: "Image URL is required." }).url("Please provide a valid image URL."),
    description: z.string().optional(),
    instagram: z.string().optional(),
    twitter: z.string().optional(),
    height: z.string().optional(),
    bust: z.string().optional(),
    waist: z.string().optional(),
    hips: z.string().optional(),
    famousFor: z.string().optional(),
});
  
export default function NewModelPage() {
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof modelSchema>>({
    resolver: zodResolver(modelSchema),
    defaultValues: {
      name: "",
      image: "",
      description: "",
      instagram: "",
      twitter: "",
      height: "",
      bust: "",
      waist: "",
      hips: "",
      famousFor: "",
    },
  })

  async function onSubmit(values: z.infer<typeof modelSchema>) {
    try {
        await addDoc(collection(db, "models"), values);
        toast({
          title: "Model Created",
          description: `The new model "${values.name}" has been successfully created.`,
        })
        router.push('/admin/models')
        router.refresh()
    } catch (error) {
        toast({
            title: "Error Creating Model",
            description: "An unknown error occurred.",
            variant: "destructive"
        })
    }
  }
  
  const imageUrl = form.watch('image');

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Add New Model</h1>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-8">
                    <Card className="bg-card border-border">
                        <CardContent className="p-6 space-y-6">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Model Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., Jane Doe" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Model Bio</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="A brief bio for the model." {...field} rows={5}/>
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="famousFor"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Famous For</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="e.g., Featured in Vogue Italia, known for..." {...field} rows={3}/>
                                    </FormControl>
                                     <FormDescription>A short summary of their notable work or features.</FormDescription>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    <Card className="bg-card border-border">
                         <CardHeader>
                            <CardTitle>Measurements</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <FormField control={form.control} name="height" render={({ field }) => (
                                <FormItem><FormLabel>Height</FormLabel><FormControl><Input placeholder="e.g., 5'10&quot;" {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                             <FormField control={form.control} name="bust" render={({ field }) => (
                                <FormItem><FormLabel>Bust</FormLabel><FormControl><Input placeholder="e.g., 34B" {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                             <FormField control={form.control} name="waist" render={({ field }) => (
                                <FormItem><FormLabel>Waist</FormLabel><FormControl><Input placeholder="e.g., 24&quot;" {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                            <FormField control={form.control} name="hips" render={({ field }) => (
                                <FormItem><FormLabel>Hips</FormLabel><FormControl><Input placeholder="e.g., 35&quot;" {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                        </CardContent>
                    </Card>

                     <Card className="bg-card border-border">
                         <CardHeader>
                            <CardTitle>Social Media</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="instagram"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Instagram Handle</FormLabel>
                                        <div className="relative">
                                            <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <FormControl>
                                                <Input placeholder="username" {...field} className="pl-9"/>
                                            </FormControl>
                                        </div>
                                        <FormDescription>Just the username, not the full URL.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="twitter"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>X (Twitter) Handle</FormLabel>
                                        <div className="relative">
                                            <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <FormControl>
                                                <Input placeholder="username" {...field} className="pl-9"/>
                                            </FormControl>
                                        </div>
                                        <FormDescription>Just the username, not the full URL.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                     </Card>
                </div>
                 <div className="md:col-span-1 space-y-6">
                    <Card className="bg-card border-border">
                        <CardContent className="p-6 space-y-4">
                            <FormField
                                control={form.control}
                                name="image"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Profile Image Link</FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://example.com/image.png" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <AIAvatarGenerator onAvatarGenerated={(url) => form.setValue('image', url, { shouldValidate: true, shouldDirty: true })} />
                        </CardContent>
                    </Card>
                    {imageUrl && (
                        <Card className="bg-card border-border">
                            <CardContent className="p-4">
                                <p className="text-sm text-muted-foreground mb-4">Image Preview</p>
                                <Image src={imageUrl} alt="Model Preview" width={300} height={400} className="rounded-md object-cover w-full aspect-[9/16]" />
                            </CardContent>
                        </Card>
                    )}
                 </div>
            </div>
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
            <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground">Create Model</Button>
          </div>
        </form>
      </FormProvider>
    </div>
  )
}
