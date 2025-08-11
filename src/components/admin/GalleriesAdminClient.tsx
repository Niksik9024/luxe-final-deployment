'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit, Eye, Plus } from 'lucide-react';
import Link from 'next/link';
import { Gallery } from '@/lib/types';
import { getGalleries, deleteGallery } from '@/lib/localStorage';
import { useToast } from '@/lib/use-toast';
import { Dialog, DialogContent, DialogTrigger, DialogClose, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

export function GalleriesAdminClient() {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadGalleries();
  }, []);

  const loadGalleries = async () => {
    try {
      const allGalleries = getGalleries();
      setGalleries(allGalleries);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load galleries",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this gallery?')) {
      try {
        deleteGallery(id);
        await loadGalleries();
        toast({
          title: "Success",
          description: "Gallery deleted successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete gallery",
          variant: "destructive",
        });
      }
    }
  };

  const handleCreate = async (formData: FormData) => {
    try {
      const newGallery: Gallery = {
        id: Date.now().toString(), // Simple ID generation
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        images: (formData.get('images') as string).split(',').map(url => ({ url: url.trim() })),
        coverImage: formData.get('image') as string,
        category: formData.get('category') as string,
        status: 'Draft', // Default status
        date: new Date().toISOString(),
      };
      // In a real app, you'd save this to a backend or more persistent storage
      // For this example, we'll simulate adding it locally if localStorage is used
      // For simplicity, this example doesn't persist the 'create' operation in localStorage.
      // A full implementation would involve an API call or local storage update.
      toast({
        title: "Success",
        description: "Gallery created successfully (simulated)",
      });
      // To actually see the created gallery, you might need to refresh or re-fetch
      // For now, we'll just show a success message.
      // await loadGalleries(); // Uncomment if create operation updates the list immediately
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create gallery",
        variant: "destructive",
      });
    }
  };


  if (loading) {
    return <div className="flex justify-center items-center min-h-64">Loading...</div>;
  }

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold">Galleries</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto touch-manipulation">
              <Plus className="mr-2 h-4 w-4" />
              Add Gallery
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Gallery</DialogTitle>
              <DialogDescription>
                Add a new gallery to your collection with images and details.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              handleCreate(formData);
            }} className="space-y-4">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="title">Title</Label>
                <Input type="text" id="title" name="title" required />
              </div>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" />
              </div>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="image">Cover Image URL</Label>
                <Input type="url" id="image" name="image" required />
              </div>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="images">Gallery Images (comma-separated URLs)</Label>
                <Textarea id="images" name="images" placeholder="https://image1.jpg, https://image2.jpg, ..." required />
              </div>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="category">Category</Label>
                <Select name="category" defaultValue="fashion" required>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fashion">Fashion</SelectItem>
                    <SelectItem value="lifestyle">Lifestyle</SelectItem>
                    <SelectItem value="portrait">Portrait</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">Create Gallery</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="w-full max-w-full overflow-hidden">
        <CardContent className="p-0 md:p-6 w-full overflow-x-auto">
          {/* Desktop Table View */}
          <div className="hidden md:block">
            <div className="grid gap-4 w-full">
              {galleries.map((gallery) => {
                const safeImages = Array.isArray(gallery.images) ? gallery.images : [];
                const hasValidImages = safeImages.length > 0 && safeImages[0] && safeImages[0].url;

                return (
                  <div key={gallery.id} className="flex items-center justify-between p-4 border rounded-lg w-full min-w-0">
                    <div className="flex items-center space-x-4 flex-1 min-w-0">
                      {hasValidImages && (
                        <img
                          src={safeImages[0].url}
                          alt={gallery.title || 'Gallery image'}
                          className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold truncate">{gallery.title || 'Untitled Gallery'}</h3>
                        <p className="text-sm text-muted-foreground text-truncate-2 max-w-md">{gallery.description || 'No description'}</p>
                        <div className="flex gap-2 mt-2 flex-wrap">
                          <Badge variant={gallery.status === 'Published' ? 'default' : 'secondary'} className="text-xs">
                            {gallery.status || 'Draft'}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {safeImages.length} images
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2 flex-shrink-0 ml-4">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/galleries/${gallery.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/galleries/edit/${gallery.id}`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDelete(gallery.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4 p-4 w-full">
            {galleries.map((gallery) => {
              const safeImages = Array.isArray(gallery.images) ? gallery.images : [];
              const hasValidImages = safeImages.length > 0 && safeImages[0] && safeImages[0].url;

              return (
                <div key={gallery.id} className="mobile-card w-full">
                  <div className="mobile-card-header">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      {hasValidImages && (
                        <img
                          src={safeImages[0].url}
                          alt={gallery.title || 'Gallery image'}
                          className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <h3 className="mobile-card-title">{gallery.title || 'Untitled Gallery'}</h3>
                      </div>
                    </div>
                    <div className="mobile-card-actions">
                      <Button variant="outline" size="sm" asChild className="touch-manipulation min-w-[44px] min-h-[44px]">
                        <Link href={`/galleries/${gallery.id}`}>
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild className="touch-manipulation min-w-[44px] min-h-[44px]">
                        <Link href={`/admin/galleries/edit/${gallery.id}`}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Link>
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDelete(gallery.id)}
                        className="touch-manipulation min-w-[44px] min-h-[44px]"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </div>

                  <div className="mobile-card-content">
                    <div className="mobile-card-row">
                      <span className="mobile-card-label">Description:</span>
                      <span className="mobile-card-value text-truncate-2">{gallery.description || 'No description'}</span>
                    </div>
                    <div className="mobile-card-row">
                      <span className="mobile-card-label">Status:</span>
                      <span className="mobile-card-value">
                        <Badge variant={gallery.status === 'Published' ? 'default' : 'secondary'} className="text-xs">
                          {gallery.status || 'Draft'}
                        </Badge>
                      </span>
                    </div>
                    <div className="mobile-card-row">
                      <span className="mobile-card-label">Images:</span>
                      <span className="mobile-card-value">
                        <Badge variant="outline" className="text-xs">
                          {safeImages.length} images
                        </Badge>
                      </span>
                    </div>
                    <div className="mobile-card-row">
                      <span className="mobile-card-label">Created:</span>
                      <span className="mobile-card-value text-xs">
                        {new Date(gallery.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {galleries.length === 0 && (
            <div className="text-center py-8 text-muted-foreground px-4">
              No galleries found. Create your first gallery to get started.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}