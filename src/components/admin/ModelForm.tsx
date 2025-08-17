'use client'

import React from 'react'
import { useFormContext } from "react-hook-form"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Switch } from '../ui/switch'

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
                    <FormLabel>Name</FormLabel>
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
                            <Textarea placeholder='A brief bio for the model.' {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </CardContent>
        </Card>

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
      </div>
      <div className="space-y-8">
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
