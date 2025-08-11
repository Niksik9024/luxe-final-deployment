
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

  if (loading) {
    return <div className="flex justify-center items-center min-h-64">Loading...</div>;
  }

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold">Galleries</h2>
        <Button asChild className="w-full sm:w-auto touch-manipulation">
          <Link href="/admin/galleries/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Gallery
          </Link>
        </Button>
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
                    <Button variant="outline" size="sm" asChild className="touch-manipulation">
                      <Link href={`/galleries/${gallery.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild className="touch-manipulation">
                      <Link href={`/admin/galleries/edit/${gallery.id}`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleDelete(gallery.id)}
                      className="touch-manipulation"
                    >
                      <Trash2 className="h-4 w-4" />
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
