
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle, MoreHorizontal, Trash2, Edit, Eye } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import Image from 'next/image';
import { useToast } from "@/lib/use-toast";
import { Skeleton } from '@/components/ui/skeleton';
import type { ModelProfileWithImages } from '@/lib/hero-sample-data';

// Mock functions for localStorage - you can implement these
const getModelProfiles = (): ModelProfileWithImages[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('modelProfiles');
  return stored ? JSON.parse(stored) : [];
};

const setModelProfiles = (profiles: ModelProfileWithImages[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('modelProfiles', JSON.stringify(profiles));
};

const deleteModelProfile = (id: string) => {
  const profiles = getModelProfiles();
  const filtered = profiles.filter(profile => profile.id !== id);
  setModelProfiles(filtered);
};

export default function ModelProfilesPage() {
  const [profiles, setProfiles] = useState<ModelProfileWithImages[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    setProfiles(getModelProfiles());
    setLoading(false);
  }, []);

  const handleDelete = (profile: ModelProfileWithImages) => {
    deleteModelProfile(profile.id);
    setProfiles(getModelProfiles());
    toast({
      title: "Model Profile Deleted",
      description: `"${profile.name}" has been deleted.`,
    });
  };

  if (loading) {
    return (
      <div>
        <Skeleton className="h-8 w-1/2 mb-8" />
        <div className="bg-card border border-border rounded-lg shadow-lg">
          <div className="p-4">
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-headline font-bold">Model Profiles</h1>
        <Button asChild>
          <Link href="/admin/model-profiles/new">
            <PlusCircle className="mr-2" />
            Add New Profile
          </Link>
        </Button>
      </div>
      
      <div className="bg-card border border-border rounded-lg shadow-lg">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-muted/50">
              <TableHead className="w-[80px]">Preview</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Images</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="w-[100px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {profiles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No model profiles found. Create your first profile to get started.
                </TableCell>
              </TableRow>
            ) : (
              profiles.map((profile) => {
                const mainImage = profile.images.find(img => img.imageType === 'main');
                const imageCount = profile.images.length;
                
                return (
                  <TableRow key={profile.id} className="border-border hover:bg-muted/50">
                    <TableCell>
                      {mainImage ? (
                        <Image 
                          src={mainImage.imageUrl} 
                          alt={profile.name} 
                          width={50} 
                          height={70} 
                          className="rounded-md object-cover"
                        />
                      ) : (
                        <div className="w-[50px] h-[70px] bg-muted rounded-md flex items-center justify-center">
                          <span className="text-xs text-muted-foreground">No Image</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{profile.name}</TableCell>
                    <TableCell>{profile.category}</TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {imageCount} image{imageCount !== 1 ? 's' : ''}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {new Date(profile.updatedAt).toLocaleDateString()}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/model-profiles/edit/${profile.id}`}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/model-profiles/preview/${profile.id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              Preview
                            </Link>
                          </DropdownMenuItem>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Model Profile</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{profile.name}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(profile)}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
