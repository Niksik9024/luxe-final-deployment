
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
import { collection, getDocs, deleteDoc, addDoc, doc, runTransaction, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Video } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export function VideosAdminClient() {
    const [videos, setVideos] = React.useState<Video[]>([]);
    const [loading, setLoading] = React.useState(true);
    const { toast } = useToast();
    
    const fetchVideos = React.useCallback(async () => {
        setLoading(true);
        const q = query(collection(db, "videos"), orderBy("date", "desc"));
        const querySnapshot = await getDocs(q);
        const videosData = querySnapshot.docs.map(doc => { 
            const data = doc.data();
            return { 
                id: doc.id, 
                ...data,
                date: (data.date?.toDate ? data.date.toDate() : new Date(data.date)).toISOString(),
            } as Video
        });
        setVideos(videosData);
        setLoading(false);
    }, []);

    React.useEffect(() => {
        fetchVideos();
    }, [fetchVideos]);

    const handleDelete = async (id: string) => {
        const videoToDelete = videos.find(v => v.id === id);
        if (!videoToDelete) return;

        try {
            const videoRef = doc(db, "videos", id);
            
            // First, delete the document itself
            await deleteDoc(videoRef);

            // Then, update the tags count in a transaction
            const tags = videoToDelete.tags || [];
            if (tags.length > 0) {
                const tagsDocRef = doc(db, 'tags', '--all--');
                 await runTransaction(db, async (transaction) => {
                    const tagsDoc = await transaction.get(tagsDocRef);
                    if (!tagsDoc.exists()) { return; }

                    const tagsData = tagsDoc.data();
                    tags.forEach(tag => {
                        if (tagsData[tag] && tagsData[tag] > 0) {
                            tagsData[tag] -= 1;
                        }
                        if (tagsData[tag] === 0) {
                            delete tagsData[tag];
                        }
                    });
                    transaction.set(tagsDocRef, tagsData);
                });
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
                
                await addDoc(collection(db, "videos"), {
                   ...duplicateData,
                   title: `Copy of ${original.title}`,
                   status: 'Draft',
                   isFeatured: false, // Ensure duplicates are not featured
                   date: new Date().toISOString(),
                });

                 // After adding the doc, update the tag counts
                 const tagsToUpdate = original.tags || [];
                 if (tagsToUpdate.length > 0) {
                     const tagsDocRef = doc(db, 'tags', '--all--');
                     await runTransaction(db, async (transaction) => {
                         const tagsDoc = await transaction.get(tagsDocRef);
                         const tagsData = tagsDoc.exists() ? tagsDoc.data() : {};
                         tagsToUpdate.forEach(tag => {
                             tagsData[tag] = (tagsData[tag] || 0) + 1;
                         });
                         transaction.set(tagsDocRef, tagsData);
                     });
                 }

                toast({
                    title: "Video Duplicated",
                    description: `"${original.title}" has been duplicated. The copy is now in drafts.`,
                });
                fetchVideos(); // Refresh the list to show the new duplicate
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
        <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
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
                   <Badge variant={video.status === 'Published' ? 'default' : 'secondary'} className={cn(video.status === 'Published' ? 'bg-green-700 hover:bg-green-700/80' : 'bg-gray-600 hover:bg-gray-600/80', "text-white")}>{video.status}</Badge>
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
                          <AlertDialogTrigger asChild>
                           <button className='flex items-center w-full px-2 py-1.5 text-sm rounded-sm cursor-pointer text-destructive hover:bg-destructive hover:text-destructive-foreground'>
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                           </button>
                          </AlertDialogTrigger>
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
