
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
import { getVideos, setVideos, getTags, setTags } from '@/lib/localStorage';
import type { Video } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export function VideosAdminClient() {
    const [videos, setLocalVideos] = React.useState<Video[]>([]);
    const [loading, setLoading] = React.useState(true);
    const { toast } = useToast();
    
    const fetchVideos = React.useCallback(() => {
        setLoading(true);
        const videosData = getVideos().sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setLocalVideos(videosData);
        setLoading(false);
    }, []);

    React.useEffect(() => {
        fetchVideos();
    }, [fetchVideos]);

    const handleDelete = async (id: string) => {
        const videoToDelete = videos.find(v => v.id === id);
        if (!videoToDelete) return;

        try {
            const currentVideos = getVideos();
            const updatedVideos = currentVideos.filter(v => v.id !== id);
            setVideos(updatedVideos);

            const tags = videoToDelete.tags || [];
            if (tags.length > 0) {
                const allTags = getTags();
                tags.forEach(tag => {
                    if (allTags[tag]) {
                        allTags[tag] -= 1;
                        if (allTags[tag] <= 0) {
                            delete allTags[tag];
                        }
                    }
                });
                setTags(allTags);
            }

            toast({
                title: "Video Deleted",
                description: "The video has been permanently deleted.",
                variant: "destructive"
            });
            fetchVideos(); // Refresh the list
        } catch (error) {
             console.error("Error deleting video:", error);
             toast({
                title: "Error",
                description: "Could not delete the video.",
                variant: "destructive"
            });
        }
    };

    const handleDuplicate = async (id: string) => {
        const original = videos.find(v => v.id === id);
        if (original) {
            try {
                const { id: _, ...duplicateData } = original; // remove original id
                const newId = `video_${Date.now()}`;
                const duplicate: Video = {
                   ...duplicateData,
                   id: newId,
                   title: `Copy of ${original.title}`,
                   status: 'Draft',
                   isFeatured: false, // Ensure duplicates are not featured
                   date: new Date().toISOString(),
                };
                
                const currentVideos = getVideos();
                setVideos([...currentVideos, duplicate]);

                 const tagsToUpdate = original.tags || [];
                 if (tagsToUpdate.length > 0) {
                     const allTags = getTags();
                     tagsToUpdate.forEach(tag => {
                         allTags[tag] = (allTags[tag] || 0) + 1;
                     });
                     setTags(allTags);
                 }

                toast({
                    title: "Video Duplicated",
                    description: `"${original.title}" has been duplicated. The copy is now in drafts.`,
                });
                fetchVideos(); // Refresh the list
            } catch (error) {
                 toast({
                    title: "Error Duplicating",
                    description: "Could not duplicate the video.",
                    variant: "destructive"
                });
            }
        }
    };
    
  return (
    <>
      <div className="flex justify-end mb-8">
        <Button asChild>
          <Link href="/admin/videos/new">
            <PlusCircle className="mr-2" />
            Add New Video
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
              <TableHead className="w-[120px] hidden sm:table-cell">Thumbnail</TableHead>
              <TableHead>Title</TableHead>
              <TableHead className="hidden md:table-cell">Models</TableHead>
              <TableHead className="hidden lg:table-cell">Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {videos.map((video) => (
              <TableRow key={video.id} className="border-border hover:bg-muted/50">
                <TableCell className="hidden sm:table-cell">
                  <Image src={video.image} alt={video.title} width={100} height={56} className="rounded-md object-cover" />
                </TableCell>
                <TableCell className="font-medium">{video.title}</TableCell>
                <TableCell className="hidden md:table-cell">{video.models.join(', ')}</TableCell>
                <TableCell className="hidden lg:table-cell">{new Date(video.date).toLocaleDateString()}</TableCell>
                <TableCell>
                   <Badge variant={video.status === 'Published' ? 'default' : 'secondary'} className={cn(video.status === 'Published' ? 'bg-primary' : '')}>{video.status}</Badge>
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
                            <Link href={`/admin/videos/edit/${video.id}`} className="flex items-center cursor-pointer"><Edit className="mr-2 h-4 w-4"/> Edit</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer" onClick={() => handleDuplicate(video.id)}>
                            <Copy className="mr-2 h-4 w-4"/> Duplicate
                        </DropdownMenuItem>
                       <AlertDialog>
                            <DropdownMenuItem asChild>
                               <AlertDialogTrigger className='flex items-center w-full px-2 py-1.5 text-sm rounded-sm cursor-pointer text-destructive hover:bg-destructive hover:text-destructive-foreground'>
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                               </AlertDialogTrigger>
                            </DropdownMenuItem>
                          <AlertDialogContent className="bg-card border-border text-card-foreground">
                              <AlertDialogHeader>
                                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                      This action cannot be undone. This will permanently delete this video.
                                  </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDelete(video.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
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
