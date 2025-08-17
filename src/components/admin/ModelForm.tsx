'use client'

import React from 'react'
import { useFormContext } from "react-hook-form"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Switch } from '../ui/switch'
import { Instagram, Twitter } from 'lucide-react'

export const ModelForm: React.FC = () => {
  const { control } = useFormContext()

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <Card>
            <CardHeader>
                <CardTitle>Model Profile</CardTitle>
                <CardDescription>The main information for this model.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <FormField
                    control={control}
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
                    control={control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                         <FormLabel>Bio / Description</FormLabel>
                        <FormControl>
                            <Textarea placeholder='A brief bio for the model.' {...field} rows={5}/>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={control}
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

        <Card>
            <CardHeader>
                <CardTitle>Measurements</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <FormField control={control} name="height" render={({ field }) => (
                    <FormItem><FormLabel>Height</FormLabel><FormControl><Input placeholder="e.g., 5'10&quot;" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={control} name="bust" render={({ field }) => (
                    <FormItem><FormLabel>Bust</FormLabel><FormControl><Input placeholder="e.g., 34B" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={control} name="waist" render={({ field }) => (
                    <FormItem><FormLabel>Waist</FormLabel><FormControl><Input placeholder="e.g., 24&quot;" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={control} name="hips" render={({ field }) => (
                    <FormItem><FormLabel>Hips</FormLabel><FormControl><Input placeholder="e.g., 35&quot;" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Social Media</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                    control={control}
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
                    control={control}
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
      <div className="space-y-8">
        <Card>
            <CardHeader>
                <CardTitle>Media</CardTitle>
                <CardDescription>Profile image for the model.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                 <FormField
                    control={control}
                    name="image"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Profile Image URL</FormLabel>
                        <FormControl>
                            <Input placeholder="https://example.com/image.png" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Settings</CardTitle>
                <CardDescription>Manage the visibility and status of this model.</CardDescription>
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
                   <FormField
                    control={control}
                    name="isFeatured"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                            <FormLabel>Feature on Homepage</FormLabel>
                            <FormDescription>
                            Show this model in the featured models section.
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
            </CardContent>
        </Card>
      </div>
    </div>
  )
}
