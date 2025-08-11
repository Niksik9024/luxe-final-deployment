'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit, Eye, Plus, Crown } from 'lucide-react';
import Link from 'next/link';
import { Model } from '@/lib/types';
import { getModels, deleteModel } from '@/lib/localStorage';
import { useToast } from '@/lib/use-toast';
import { Dialog, DialogContent, DialogTrigger, DialogClose, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export function ModelsAdminClient() {
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadModels();
  }, []);

  const loadModels = async () => {
    try {
      const allModels = getModels();
      setModels(allModels);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load models",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this model?')) {
      try {
        deleteModel(id);
        await loadModels();
        toast({
          title: "Success",
          description: "Model deleted successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete model",
          variant: "destructive",
        });
      }
    }
  };

  // Dummy handleCreate function for the dialog form
  const handleCreate = (formData: FormData) => {
    // This function would typically handle creating a new model
    // For now, it just logs the data and closes the dialog
    console.log("Creating model with data:", formData);
    toast({
      title: "Model creation simulated",
      description: "New model data logged to console.",
    });
    // In a real app, you would add logic here to add the model,
    // then potentially call loadModels() and close the dialog.
  };


  if (loading) {
    return <div className="flex justify-center items-center min-h-64">Loading...</div>;
  }

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <h2 className="text-xl font-semibold md:hidden">Models</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto touch-manipulation">
              <Plus className="mr-2 h-4 w-4" />
              Add Model
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Model</DialogTitle>
              <DialogDescription>
                Add a new model to your roster with profile information and details.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              handleCreate(formData);
            }} className="space-y-4">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="name">Name</Label>
                <Input type="text" id="name" name="name" required />
              </div>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="bio">Bio</Label>
                <Textarea id="bio" name="bio" />
              </div>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="image">Profile Image URL</Label>
                <Input type="url" id="image" name="image" required />
              </div>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="location">Location</Label>
                <Input type="text" id="location" name="location" />
              </div>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="specialties">Specialties (comma-separated)</Label>
                <Input type="text" id="specialties" name="specialties" placeholder="Fashion, Portrait, Commercial" />
              </div>
              <div className="flex justify-end space-x-2">
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">Create Model</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="w-full max-w-full overflow-hidden">
        <CardHeader className="hidden md:block">
          <CardTitle>Models</CardTitle>
        </CardHeader>
        <CardContent className="p-0 md:p-6 w-full overflow-x-auto">
          {/* Desktop Table View */}
          <div className="hidden md:block">
            <div className="grid gap-4 w-full">
              {models.map((model) => (
                <div key={model.id} className="flex items-center justify-between p-4 border rounded-lg w-full min-w-0">
                  <div className="flex items-center space-x-4 flex-1 min-w-0">
                    <img 
                      src={model.image} 
                      alt={model.name}
                      className="w-16 h-16 object-cover rounded-full flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold truncate">{model.name}</h3>
                      <p className="text-sm text-muted-foreground text-truncate-2 max-w-md">{model.description}</p>
                      <div className="flex gap-2 mt-2 flex-wrap">
                        <Badge variant="secondary" className="text-xs">{model.status}</Badge>
                        {model.isFeatured && (
                          <Badge variant="default" className="bg-luxury-gradient text-black text-xs">
                            <Crown className="w-3 h-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2 flex-shrink-0 ml-4">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/models/${model.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/models/edit/${model.id}`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleDelete(model.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4 p-4 w-full">
            {models.map((model) => (
              <div key={model.id} className="mobile-card w-full">
                <div className="mobile-card-header">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <img 
                      src={model.image} 
                      alt={model.name}
                      className="w-12 h-12 object-cover rounded-full flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <h3 className="mobile-card-title">{model.name}</h3>
                    </div>
                  </div>
                  <div className="mobile-card-actions">
                    <Button variant="outline" size="sm" asChild className="touch-manipulation min-w-[44px] min-h-[44px]">
                      <Link href={`/models/${model.id}`}>
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View</span>
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild className="touch-manipulation min-w-[44px] min-h-[44px]">
                      <Link href={`/admin/models/edit/${model.id}`}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Link>
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleDelete(model.id)}
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
                    <span className="mobile-card-value text-truncate-2">{model.description}</span>
                  </div>
                  <div className="mobile-card-row">
                    <span className="mobile-card-label">Status:</span>
                    <span className="mobile-card-value">
                      <Badge variant="secondary" className="text-xs">{model.status}</Badge>
                    </span>
                  </div>
                  {model.isFeatured && (
                    <div className="mobile-card-row">
                      <span className="mobile-card-label">Featured:</span>
                      <span className="mobile-card-value">
                        <Badge variant="default" className="bg-luxury-gradient text-black text-xs">
                          <Crown className="w-3 h-3 mr-1" />
                          Featured
                        </Badge>
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {models.length === 0 && (
            <div className="text-center py-8 text-muted-foreground px-4">
              No models found. Create your first model to get started.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}