
'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle, MoreHorizontal, Trash2, Edit, Copy } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import Image from 'next/image';
import { useToast } from "@/hooks/use-toast";
import { getGalleries, setGalleries, getTags, setTags } from '@/lib/localStorage';
import type { Gallery } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export function GalleriesAdminClient() {
    const [galleries, setLocalGalleries] = React.useState<Gallery[]>([]);
    const [loading, setLoading] = React.useState(true);
    const { toast } = useToast();

    const fetchGalleries = React.useCallback(() => {
        setLoading(true);
        const galleriesData = getGalleries().sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setLocalGalleries(galleriesData);
        setLoading(false);
    }, []);

    React.useEffect(() => {
        fetchGalleries();
    }, [fetchGalleries]);

    const handleDelete = async (id: string) => {
        const galleryToDelete = galleries.find(g => g.id === id);
        if (!galleryToDelete) return;

        try {
            const currentGalleries = getGalleries();
            const updatedGalleries = currentGalleries.filter(g => g.id !== id);
            setGalleries(updatedGalleries);
            
            // Update tags count
            const tags = galleryToDelete.tags || [];
            if (tags.length > 0) {
                const allTags = getTags();
                tags.forEach(tag => {
                    if (allTags[tag]) {
                        allTags[tag] -= 1;
                        if (allTags[tag] === 0) {
                            delete allTags[tag];
                        }
                    }
                });
                setTags(allTags);
            }

            toast({
                title: "Gallery Deleted",
                description: "The gallery has been permanently deleted.",
                variant: "destructive"
            });
            fetchGalleries();
        } catch (error) {
            console.error("Error deleting gallery:", error);
            toast({
                title: "Error",
                description: "Could not delete the gallery.",
                variant: "destructive"
            });
        }
    };
    
    const handleDuplicate = async (id: string) => {
        const original = galleries.find(p => p.id === id);
        if (original) {
            try {
                const { id: _, ...duplicateData } = original;
                const newId = `gallery_${Date.now()}`;
                const duplicate: Gallery = {
                   ...duplicateData,
                   id: newId,
                   title: `Copy of ${original.title}`,
                   status: 'Draft',
                   date: new Date().toISOString(),
                };
                
                const currentGalleries = getGalleries();
                setGalleries([...currentGalleries, duplicate]);

                const tagsToUpdate = original.tags || [];
                if (tagsToUpdate.length > 0) {
                    const allTags = getTags();
                    tagsToUpdate.forEach(tag => {
                        allTags[tag] = (allTags[tag] || 0) + 1;
                    });
                    setTags(allTags);
                }
                
                toast({
                    title: "Gallery Duplicated",
                    description: `"${original.title}" has been duplicated. The copy is now in drafts.`,
                });
                fetchGalleries();
            } catch (error) {
                 toast({
                    title: "Error Duplicating",
                    description: "Could not duplicate the gallery.",
                    variant: "destructive"
                });
            }
        }
    };
    
  return (
    <>
        <div className="flex justify-end mb-8">
            <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link href="/admin/galleries/new">
                <PlusCircle className="mr-2" />
                Add New Gallery
              </Link>
            </Button>
        </div>
       <div className="bg-card border border-border rounded-lg shadow-lg">
        {loading ? (
            <div className="p-4 space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
            </div>
        ) : (
            <Table>
            <TableHeader>
                <TableRow className="hover:bg-muted/50">
                <TableHead className="w-[120px] hidden sm:table-cell">Cover</TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="hidden md:table-cell">Models</TableHead>
                <TableHead className="hidden lg:table-cell">Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {galleries.map((gallery) => (
                <TableRow key={gallery.id} className="border-border hover:bg-muted/50">
                    <TableCell className="hidden sm:table-cell">
                        <Image src={gallery.image} alt={gallery.title} width={100} height={56} className="rounded-md object-cover"/>
                    </TableCell>
                    <TableCell className="font-medium">{gallery.title}</TableCell>
                    <TableCell className="hidden md:table-cell">{gallery.models.join(', ')}</TableCell>
                    <TableCell className="hidden lg:table-cell">{new Date(gallery.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                    <Badge variant={gallery.status === 'Published' ? 'default' : 'secondary'} className={cn(gallery.status === 'Published' ? 'bg-green-700 hover:bg-green-700/80' : 'bg-gray-600 hover:bg-gray-600/80', "text-white")}>{gallery.status}</Badge>
                    </TableCell>
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
                                <Link href={`/admin/galleries/edit/${gallery.id}`} className="flex items-center cursor-pointer"><Edit className="mr-2 h-4 w-4"/> Edit</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer" onClick={() => handleDuplicate(gallery.id)}>
                                <Copy className="mr-2 h-4 w-4"/> Duplicate
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
                                            This action cannot be undone. This will permanently delete this gallery.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleDelete(gallery.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
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
        )}
      </div>
    </>
  );
}
