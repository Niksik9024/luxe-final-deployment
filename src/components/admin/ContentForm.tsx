

'use client'

import React, { useState, useEffect } from 'react'
import { useFormContext, Controller, useFieldArray } from "react-hook-form"
import { z } from "zod"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Button } from '@/components/ui/button'
import { Trash2, Sparkles, Check, ChevronsUpDown } from 'lucide-react'
import { Switch } from '../ui/switch'
import { generateDescription } from '@/ai/flows/generate-description'
import { useToast } from '@/hooks/use-toast'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { cn } from '@/lib/utils'
import type { videoFormSchema, galleryFormSchema } from '@/app/admin/schemas/content'
import type { Model } from '@/lib/types'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'


interface ContentFormProps {
  type: 'video' | 'gallery';
}

const MultiSelectModels: React.FC = () => {
    const { control } = useFormContext<z.infer<typeof videoFormSchema | typeof galleryFormSchema>>()
    const [models, setModels] = useState<Model[]>([]);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const fetchModels = async () => {
            const querySnapshot = await getDocs(collection(db, "models"));
            const modelsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Model));
            setModels(modelsData);
        };
        fetchModels();
    }, [])

    return (
      <FormField
        control={control}
        name="models"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Associated Models</FormLabel>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                      "w-full justify-between",
                      !field.value?.length && "text-muted-foreground"
                    )}
                  >
                    {field.value?.length > 0
                      ? `${field.value.length} model(s) selected`
                      : "Select models"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <Command>
                  <CommandInput placeholder="Search models..." />
                  <CommandList>
                    <CommandEmpty>No models found.</CommandEmpty>
                    <CommandGroup>
                      {models.map((model) => (
                        <CommandItem
                          key={model.id}
                          onSelect={() => {
                            const selected = field.value || [];
                            const newSelection = selected.includes(model.name)
                              ? selected.filter((name) => name !== model.name)
                              : [...selected, model.name];
                            field.onChange(newSelection);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              (field.value || []).includes(model.name)
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {model.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <FormDescription>
              You can select multiple models for this content.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    );
};


export const ContentForm: React.FC<ContentFormProps> = ({ type }) => {
  const { control, getValues, setValue, watch } = useFormContext()
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const titleValue = watch('title');
  const imageUrlValue = watch('image');

  const { fields, append, remove } = useFieldArray({
    control,
    name: "album"
  });

  const titleLabel = type === 'video' ? 'Video Title' : 'Gallery Title'
  const imageLabel = 'Cover/Thumbnail Image Link'
  
  const handleGenerateDescription = async () => {
    setIsGenerating(true);
    const { title, models, tags, image } = getValues();
    
    // This check remains as a fallback, but the button will be disabled
    if (!title || !image) {
        toast({
            title: "Missing Information",
            description: "Please provide a title and image URL before generating a description.",
            variant: "destructive"
        })
        setIsGenerating(false);
        return;
    }

    try {
        const result = await generateDescription({
            title,
            models,
            tags: tags || '',
            imageUrl: image,
        });
        if (result.description) {
            setValue('description', result.description, { shouldValidate: true, shouldDirty: true });
            toast({
                title: "Description Generated!",
                description: "The AI-generated description has been added.",
            })
        }
    } catch (error) {
        toast({
            title: "Generation Failed",
            description: "There was an error generating the description. Please try again.",
            variant: "destructive"
        })
    } finally {
        setIsGenerating(false);
    }
  }
  
  const isGeneratorDisabled = isGenerating || !titleValue || !imageUrlValue;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <Card>
            <CardHeader>
                <CardTitle>Core Details</CardTitle>
                <CardDescription>The main information for this piece of content.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <FormField
                control={control}
                name="title"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>{titleLabel}</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., Cinematic Scene 20" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                
                <FormField
                    control={control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                         <div className="flex items-center justify-between">
                           <FormLabel>Description</FormLabel>
                           <Button type="button" size="sm" variant="outline" onClick={handleGenerateDescription} disabled={isGeneratorDisabled} aria-label="Generate description with AI">
                             <Sparkles className="mr-2 h-4 w-4" />
                             {isGenerating ? 'Generating...' : 'AI Generate'}
                           </Button>
                         </div>
                        <FormControl>
                            <Textarea placeholder='A brief description of the content.' {...field} />
                        </FormControl>
                         <FormDescription>
                            Provide a title and image URL to enable AI generation.
                         </FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Media</CardTitle>
                <CardDescription>Links to the visual assets for this content.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                 <FormField
                    control={control}
                    name="image"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>{imageLabel}</FormLabel>
                        <FormControl>
                            <Input placeholder="https://example.com/image.png" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />

                {type === 'video' && (
                    <FormField
                        control={control}
                        name="videoUrl"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Video Source Link</FormLabel>
                            <FormControl>
                                <Input placeholder="https://example.com/video.mp4" {...field} />
                            </FormControl>
                            <FormDescription>Paste a direct link to the video file.</FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                )}
                {type === 'gallery' && (
                    <div className="space-y-4">
                        <FormLabel>Gallery Album Images</FormLabel>
                        {fields.map((field, index) => (
                          <FormField
                            key={field.id}
                            control={control}
                            name={`album.${index}.value`}
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center gap-2">
                                <FormControl>
                                  <Input {...field} placeholder="https://example.com/photo.png" />
                                </FormControl>
                                <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} aria-label="Remove image URL">
                                  <Trash2 className="h-4 w-4 text-red-500"/>
                                </Button>
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => append({ value: "" })}
                        >
                          Add Image URL
                        </Button>
                        <FormDescription>
                           Add or remove image links for the gallery album.
                        </FormDescription>
                    </div>
                )}
            </CardContent>
        </Card>

      </div>
      <div className="space-y-8">
        <Card>
            <CardHeader>
                <CardTitle>Settings</CardTitle>
                <CardDescription>Manage the visibility of this content.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                 <FormField
                    control={control}
                    name="status"
                    render={({ field }) => (
                        <FormItem className="space-y-3">
                        <FormLabel>Status</FormLabel>
                        <FormControl>
                            <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                            >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                <RadioGroupItem value="Published" id="status-published" />
                                </FormControl>
                                <FormLabel htmlFor="status-published" className="font-normal">Published</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                <RadioGroupItem value="Draft" id="status-draft" />
                                </FormControl>
                                <FormLabel htmlFor="status-draft" className="font-normal">Draft</FormLabel>
                            </FormItem>
                            </RadioGroup>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                     {type === 'video' && (
                       <FormField
                        control={control}
                        name="isFeatured"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                                <FormLabel>Feature on Homepage</FormLabel>
                                <FormDescription>
                                Show this video in the main hero section.
                                </FormDescription>
                            </div>
                            <FormControl>
                                <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            </FormItem>
                        )}
                       />
                    )}
            </CardContent>
        </Card>
        <Card>
             <CardHeader>
                <CardTitle>Organization</CardTitle>
                <CardDescription>Categorize this content to make it discoverable.</CardDescription>
             </CardHeader>
             <CardContent className="space-y-6">
                <MultiSelectModels />
                <FormField
                    control={control}
                    name="tags"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Tags</FormLabel>
                        <FormControl>
                            <Input placeholder="portrait, studio, editorial" {...field} />
                        </FormControl>
                        <FormDescription>Enter tags separated by commas.</FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
             </CardContent>
        </Card>
      </div>
    </div>
  )
}
