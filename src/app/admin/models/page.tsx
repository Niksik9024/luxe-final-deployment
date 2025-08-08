
'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle, MoreHorizontal, Trash2, Edit } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import Image from 'next/image';
import { useToast } from "@/hooks/use-toast";
import { getModels, setModels } from '@/lib/localStorage';
import type { Model } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function ManageModelsPage() {
  const [models, setLocalModels] = React.useState<Model[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { toast } = useToast();

  const fetchModels = React.useCallback(() => {
    setLoading(true);
    // Simulate loading delay for skeleton
    setTimeout(() => {
        const modelsData = getModels().sort((a,b) => a.name.localeCompare(b.name));
        setLocalModels(modelsData);
        setLoading(false);
    }, 500);
  }, []);

  React.useEffect(() => {
    fetchModels();
  }, [fetchModels]);


  const handleDelete = async (id: string) => {
    try {
        const currentModels = getModels();
        const updatedModels = currentModels.filter(m => m.id !== id);
        setModels(updatedModels);
        toast({
            title: "Model Deleted",
            description: "The model has been successfully deleted.",
        });
        fetchModels();
    } catch (error) {
         toast({
            title: "Error",
            description: "Could not delete the model.",
            variant: "destructive"
        });
    }
  };

  if (loading) {
    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <Skeleton className="h-10 w-64" />
                <Skeleton className="h-10 w-48" />
            </div>
            <div className="bg-card border border-border rounded-lg shadow-lg p-4 space-y-2">
               {Array.from({length: 5}).map((_, i) => (
                    <div key={i} className="flex items-center space-x-4 p-2">
                        <Skeleton className="h-16 w-12 rounded-md" />
                        <div className="flex-1">
                            <Skeleton className="h-5 w-1/3" />
                        </div>
                        <Skeleton className="h-8 w-8" />
                    </div>
                ))}
            </div>
        </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Models</h1>
        <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Link href="/admin/models/new">
            <PlusCircle className="mr-2" />
            Add New Model
          </Link>
        </Button>
      </div>
      <div className="bg-card border border-border rounded-lg shadow-lg">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-muted/50">
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="w-[100px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {models.map((model) => (
              <TableRow key={model.id} className="border-border hover:bg-muted/50">
                <TableCell>
                  <Image src={model.image} alt={model.name} width={50} height={70} className="rounded-md object-cover"/>
                </TableCell>
                <TableCell className="font-medium">{model.name}</TableCell>
                <TableCell className="text-right">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-card border-border text-card-foreground">
                      <DropdownMenuItem asChild>
                         <Link href={`/admin/models/edit/${model.id}`} className="flex items-center cursor-pointer"><Edit className="mr-2 h-4 w-4"/> Edit</Link>
                      </DropdownMenuItem>
                       <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button className='flex items-center w-full px-2 py-1.5 text-sm rounded-sm cursor-pointer text-destructive hover:bg-destructive hover:text-destructive-foreground'>
                              <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-card border-border text-card-foreground">
                              <AlertDialogHeader>
                                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                      This action cannot be undone. This will permanently delete this model and remove them from all associated content.
                                  </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDelete(model.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                              </AlertDialogFooter>
                          </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
