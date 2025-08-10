
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

  if (loading) {
    return <div className="flex justify-center items-center min-h-64">Loading...</div>;
  }

  return (
    <>
      <div className="flex justify-end mb-8">
        <Button asChild>
          <Link href="/admin/models/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Model
          </Link>
        </Button>
      </div>
      
      <Card className="bg-card border border-border rounded-lg shadow-lg overflow-hidden">
        <CardHeader>
          <CardTitle>Models</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {models.map((model) => (
              <div key={model.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <img 
                    src={model.image} 
                    alt={model.name}
                    className="w-16 h-16 object-cover rounded-full"
                  />
                  <div>
                    <h3 className="font-semibold">{model.name}</h3>
                    <p className="text-sm text-muted-foreground">{model.description}</p>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="secondary">{model.status}</Badge>
                      {model.isFeatured && (
                        <Badge variant="default" className="bg-luxury-gradient text-black">
                          <Crown className="w-3 h-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
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
            {models.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No models found. Create your first model to get started.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
