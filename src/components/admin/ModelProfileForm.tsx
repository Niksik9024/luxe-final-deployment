
'use client';

import React, { useState } from 'react';
import { useFormContext, useFieldArray } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2, Plus, Link } from 'lucide-react';
import Image from 'next/image';
import { getModels, getGalleries } from '@/lib/localStorage';
import { populateCarouselFromGallery } from '@/lib/model-profile-storage';

export const ModelProfileForm: React.FC = () => {
  const { control, watch, setValue } = useFormContext();
  const [selectedModel, setSelectedModel] = useState<string>("");

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "carouselImages"
  });

  const backgroundImage = watch('backgroundImage');
  const mainImage = watch('mainImage');
  
  const models = getModels();
  const galleries = getGalleries();

  const handlePopulateFromGallery = () => {
    if (!selectedModel) return;
    
    const carouselImages = populateCarouselFromGallery(selectedModel);
    const formattedImages = carouselImages.map(img => ({
      url: img.imageUrl,
      position: img.imagePosition
    }));
    
    replace(formattedImages);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Model Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Sophia Martinez" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Fashion, Commercial, Portrait" {...field} />
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
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Brief description of the model..." {...field} />
                  </FormControl>
                  <FormDescription>
                    This will be displayed in the hero section.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hero Section Images</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={control}
              name="backgroundImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Background Image</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/background.jpg" {...field} />
                  </FormControl>
                  <FormDescription>
                    Large background image for the hero section.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="mainImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Main Model Image</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/main-image.jpg" {...field} />
                  </FormControl>
                  <FormDescription>
                    Primary model image displayed in the hero section.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Carousel Images (Max 10)</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="manual" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="manual">Manual Upload</TabsTrigger>
                <TabsTrigger value="gallery">From Gallery</TabsTrigger>
              </TabsList>
              
              <TabsContent value="manual" className="space-y-4 mt-6">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className="flex-1 space-y-4">
                      <FormField
                        control={control}
                        name={`carouselImages.${index}.url`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Image URL</FormLabel>
                            <FormControl>
                              <Input placeholder="https://example.com/carousel-image.jpg" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={control}
                        name={`carouselImages.${index}.position`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Position (1-10)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                min="1" 
                                max="10" 
                                placeholder="1" 
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => remove(index)}
                      className="mt-8"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ))}
                
                {fields.length < 10 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => append({ url: "", position: fields.length + 1 })}
                    className="w-full"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Carousel Image
                  </Button>
                )}
              </TabsContent>
              
              <TabsContent value="gallery" className="space-y-4 mt-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Select Model</label>
                    <Select onValueChange={setSelectedModel}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a model to link gallery images" />
                      </SelectTrigger>
                      <SelectContent>
                        {models.map((model) => (
                          <SelectItem key={model.id} value={model.id}>
                            {model.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button
                    type="button"
                    onClick={handlePopulateFromGallery}
                    disabled={!selectedModel}
                    className="w-full"
                  >
                    <Link className="mr-2 h-4 w-4" />
                    Populate Carousel from Gallery
                  </Button>
                  
                  <p className="text-sm text-muted-foreground">
                    This will automatically populate the carousel with up to 10 images from the selected model's galleries.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="mt-4">
              <FormDescription>
                Add up to 10 images for the 3D carousel. Position determines the order (1-10).
              </FormDescription>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        {backgroundImage && (
          <Card>
            <CardHeader>
              <CardTitle>Background Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <Image 
                src={backgroundImage} 
                alt="Background Preview" 
                width={300} 
                height={200} 
                className="rounded-md object-cover w-full aspect-[3/2]" 
              />
            </CardContent>
          </Card>
        )}
        
        {mainImage && (
          <Card>
            <CardHeader>
              <CardTitle>Main Image Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <Image 
                src={mainImage} 
                alt="Main Image Preview" 
                width={300} 
                height={400} 
                className="rounded-md object-cover w-full aspect-[3/4]" 
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
