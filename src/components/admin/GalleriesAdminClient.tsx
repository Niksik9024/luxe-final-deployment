'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle, MoreHorizontal, Trash2, Edit, Copy } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import Image from 'next/image';
import { useToast } from "@/lib/use-toast";
import { getGalleries, setGalleries, getTags, setTags } from '@/lib/localStorage';
import type { Gallery } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

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
            <Button asChild>
              <Link href="/admin/galleries/new">
                <PlusCircle className="mr-2" />
                Add New Gallery
              </Link>
            </Button>
        </div>
        <Card className="bg-card border border-border rounded-lg shadow-lg overflow-hidden">
            <CardHeader>
                <CardTitle>Galleries</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="hidden md:block responsive-padding">
                <div className="table-to-cards">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-sm sm:text-base">Gallery</TableHead>
                      <TableHead className="hidden sm:table-cell text-sm sm:text-base">Model</TableHead>
                      <TableHead className="hidden md:table-cell text-sm sm:text-base">Images</TableHead>
                      <TableHead className="hidden lg:table-cell text-sm sm:text-base">Date</TableHead>
                      <TableHead className="text-sm sm:text-base">Status</TableHead>
                      <TableHead className="text-sm sm:text-base">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                        Array.from({ length: 5 }).map((_, index) => (
                            <TableRow key={index}>
                                <TableCell colSpan={6} className="px-4 py-6">
                                    <Skeleton className="h-20 w-full" />
                                </TableCell>
                            </TableRow>
                        ))
                    ) : galleries.length > 0 ? (
                        galleries.map((gallery) => (
                            <TableRow key={gallery.id} className="hover:bg-muted/50 transition-colors">
                                <TableCell className="flex items-center gap-3 py-4 px-4">
                                    <Image
                                        src={gallery.image}
                                        alt={gallery.title}
                                        width={80}
                                        height={80}
                                        className="rounded-md object-cover aspect-[16/9] w-20 h-20 flex-shrink-0"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <Link href={`/admin/galleries/edit/${gallery.id}`} className="font-semibold hover:underline truncate">{gallery.title}</Link>
                                        <div className="text-sm text-muted-foreground mt-1">
                                           Models: {gallery.models.join(', ') || 'N/A'}
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="hidden sm:table-cell py-4 px-4">{gallery.models.join(', ') || 'N/A'}</TableCell>
                                <TableCell className="hidden md:table-cell py-4 px-4">{gallery.imageCount}</TableCell>
                                <TableCell className="hidden lg:table-cell py-4 px-4">{new Date(gallery.date).toLocaleDateString()}</TableCell>
                                <TableCell className="py-4 px-4">
                                    <Badge variant={gallery.status === 'Published' ? 'default' : 'secondary'} className={cn(gallery.status === 'Published' ? 'bg-primary' : '')}>{gallery.status}</Badge>
                                </TableCell>
                                <TableCell className="py-4 px-4">
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
                                                    <DropdownMenuItem
                                                      onSelect={(e) => e.preventDefault()}
                                                      className='flex items-center w-full px-2 py-1.5 text-sm rounded-sm cursor-pointer text-destructive hover:bg-destructive hover:text-destructive-foreground'>
                                                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                    </DropdownMenuItem>
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
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                                No galleries found
                            </TableCell>
                        </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Cards View */}
              <div className="mobile-cards responsive-padding md:hidden">
                {loading ? (
                  Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="mobile-card animate-pulse">
                      <div className="mobile-card-header">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-16 h-16 bg-muted rounded-md"></div>
                          <div className="space-y-2 flex-1">
                            <div className="h-4 bg-muted rounded w-3/4"></div>
                            <div className="h-3 bg-muted rounded w-1/2"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : galleries.length > 0 ? (
                  galleries.map((gallery) => (
                    <div key={gallery.id} className="mobile-card">
                      <div className="mobile-card-header">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <Image
                            src={gallery.image}
                            alt={gallery.title}
                            width={64}
                            height={64}
                            className="w-16 h-16 rounded-md object-cover flex-shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="mobile-card-title">{gallery.title}</div>
                            <div className="text-sm text-muted-foreground truncate">{gallery.models.join(', ') || 'N/A'}</div>
                          </div>
                        </div>
                        <div className="mobile-card-actions">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-10 w-10 p-0 min-h-[44px] min-w-[44px] touch-manipulation">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href={`/admin/galleries/edit/${gallery.id}`}>Edit</Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDelete(gallery.id)}
                                className="text-destructive"
                              >
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      <div className="mobile-card-content">
                        <div className="mobile-card-row">
                          <span className="mobile-card-label">Images:</span>
                          <span className="mobile-card-value">{gallery.imageCount}</span>
                        </div>
                        <div className="mobile-card-row">
                          <span className="mobile-card-label">Date:</span>
                          <span className="mobile-card-value">{new Date(gallery.date).toLocaleDateString()}</span>
                        </div>
                        <div className="mobile-card-row">
                          <span className="mobile-card-label">Status:</span>
                          <Badge
                            variant={gallery.status === 'Published' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {gallery.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    No galleries found
                  </div>
                )}
              </div>
              )}
            </CardContent>
        </Card>
    </>
  );
}