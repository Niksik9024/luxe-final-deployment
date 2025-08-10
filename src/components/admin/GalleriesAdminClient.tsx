
'use client';

import { useState, useEffect } from 'react';
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
    <>
      <div className="flex justify-end mb-8">
        <Button asChild>
          <Link href="/admin/galleries/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Gallery
          </Link>
        </Button>
      </div>
      
      <Card className="bg-card border border-border rounded-lg shadow-lg overflow-hidden">
        <CardHeader>
          <CardTitle>Galleries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {galleries.map((gallery) => (
              <div key={gallery.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <img 
                    src={gallery.image} 
                    alt={gallery.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <h3 className="font-semibold">{gallery.title}</h3>
                    <p className="text-sm text-muted-foreground">{gallery.description}</p>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="secondary">{gallery.status}</Badge>
                      <Badge variant="outline">{gallery.album?.length || 0} photos</Badge>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
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
            ))}
            {galleries.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No galleries found. Create your first gallery to get started.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
