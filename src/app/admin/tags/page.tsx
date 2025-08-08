

'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Edit, GitMerge } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { useToast } from '@/lib/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getTags, setTags, getVideos, setVideos, getGalleries, setGalleries } from '@/lib/localStorage'
import type { Video, Gallery } from '@/lib/types'
import { Skeleton } from '@/components/ui/skeleton'

export default function TagsPage() {
  const { toast } = useToast();
  const [allTags, setLocalTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // State for Rename Dialog
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [tagToRename, setTagToRename] = useState('');
  const [newTagName, setNewTagName] = useState('');

  // State for Merge Dialog
  const [isMergeDialogOpen, setIsMergeDialogOpen] = useState(false);
  const [tagToMerge, setTagToMerge] = useState('');
  const [mergeTargetTag, setMergeTargetTag] = useState('');

  const fetchTags = useCallback(() => {
    setLoading(true);
    // Simulate loading
    setTimeout(() => {
        try {
            const tagsData = getTags();
            const uniqueTags = Object.keys(tagsData).sort((a,b) => a.localeCompare(b));
            setLocalTags(uniqueTags);
        } catch(error) {
            console.error("Error fetching tags:", error);
            toast({ title: 'Error', description: 'Could not fetch tags.', variant: 'destructive'})
        }
        setLoading(false);
    }, 500);
  }, [toast]);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  const handleRenameClick = (tag: string) => {
    setTagToRename(tag);
    setNewTagName(tag);
    setIsRenameDialogOpen(true);
  };
  
  const updateDocumentsWithTag = (oldName: string, newName: string, operation: 'rename' | 'delete' | 'merge', targetTag?: string) => {
      const allVideos = getVideos();
      const allGalleries = getGalleries();
      
      const updateContent = (content: (Video | Gallery)[]) => {
          return content.map(item => {
              if (!item.tags?.includes(oldName)) {
                  return item;
              }

              let newTags = [...item.tags];
              let newKeywords = [...item.keywords];

              if (operation === 'delete') {
                  newTags = newTags.filter(t => t !== oldName);
                  newKeywords = newKeywords.filter(k => k !== oldName);
              } else if (operation === 'rename') {
                  const tagIndex = newTags.indexOf(oldName);
                  if(tagIndex > -1) newTags[tagIndex] = newName;

                  const keywordIndex = newKeywords.indexOf(oldName);
                  if(keywordIndex > -1) newKeywords[keywordIndex] = newName;
              } else if (operation === 'merge' && targetTag) {
                  newTags = newTags.filter(t => t !== oldName);
                  if (!newTags.includes(targetTag)) newTags.push(targetTag);
                  
                  newKeywords = newKeywords.filter(k => k !== oldName);
                  if (!newKeywords.includes(targetTag)) newKeywords.push(targetTag);
              }
              
              return { ...item, tags: [...new Set(newTags)], keywords: [...new Set(newKeywords)] };
          });
      };
      
      setVideos(updateContent(allVideos) as Video[]);
      setGalleries(updateContent(allGalleries) as Gallery[]);

      // Update the central tags collection
      const tagsData = getTags();
      
      if (operation === 'rename') {
        if (tagsData[oldName] && oldName !== newName) {
          const count = tagsData[oldName];
          tagsData[newName] = (tagsData[newName] || 0) + count;
          delete tagsData[oldName];
        }
      } else if (operation === 'delete') {
        delete tagsData[oldName];
      } else if (operation === 'merge' && targetTag) {
          if(tagsData[oldName]) {
              const count = tagsData[oldName];
              tagsData[targetTag] = (tagsData[targetTag] || 0) + count;
              delete tagsData[oldName];
          }
      }
      setTags(tagsData);

      fetchTags();
  };


  const executeRename = async () => {
    if (!tagToRename || !newTagName || tagToRename === newTagName) {
        toast({ title: 'Rename Cancelled', description: 'No changes were made.', variant: 'default' });
        setIsRenameDialogOpen(false);
        return;
    }
    const finalNewName = newTagName.trim().toLowerCase();
    updateDocumentsWithTag(tagToRename, finalNewName, 'rename');
    toast({ title: 'Tag Renamed', description: `"${tagToRename}" has been renamed to "${finalNewName}".` });
    setIsRenameDialogOpen(false);
    setTagToRename('');
    setNewTagName('');
  };

  const executeDelete = async (tag: string) => {
    updateDocumentsWithTag(tag, '', 'delete');
    toast({ title: 'Tag Deleted', description: `The tag "${tag}" has been deleted from all content.`, variant: 'destructive' });
  };
  
  const executeMerge = async () => {
    if (!tagToMerge || !mergeTargetTag || tagToMerge === mergeTargetTag) {
        toast({ title: 'Merge Cancelled', description: 'Cannot merge a tag into itself.', variant: 'default' });
        setIsMergeDialogOpen(false);
        return;
    }
    updateDocumentsWithTag(tagToMerge, '', 'merge', mergeTargetTag);
    toast({ title: 'Tags Merged', description: `Successfully merged "${tagToMerge}" into "${mergeTargetTag}".` });
    setIsMergeDialogOpen(false);
    setTagToMerge('');
    setMergeTargetTag('');
  };
  
  if (loading) {
      return (
        <div>
            <h1 className="text-3xl font-headline font-bold mb-8">Manage Tags</h1>
            <Card className="bg-card border-border shadow-lg">
                <CardHeader>
                    <Skeleton className="h-6 w-32 mb-2" />
                    <Skeleton className="h-4 w-48" />
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                     <Skeleton className="h-8 w-24 rounded-full" />
                     <Skeleton className="h-8 w-32 rounded-full" />
                     <Skeleton className="h-8 w-20 rounded-full" />
                     <Skeleton className="h-8 w-28 rounded-full" />
                     <Skeleton className="h-8 w-24 rounded-full" />
                     <Skeleton className="h-8 w-32 rounded-full" />
                </CardContent>
            </Card>
        </div>
      )
  }

  return (
    <div>
      <h1 className="text-3xl font-headline font-bold mb-8">Manage Tags</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-3">
          <Card className="bg-card border-border shadow-lg">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle>All Tags ({allTags.length})</CardTitle>
                  <CardDescription>View, rename, merge, or delete tags sitewide.</CardDescription>
                </div>
                 <Dialog open={isMergeDialogOpen} onOpenChange={setIsMergeDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="w-full sm:w-auto bg-muted hover:bg-muted/80 text-foreground"><GitMerge className="mr-2"/> Open Merge Tool</Button>
                    </DialogTrigger>
                    <DialogContent className="bg-card border-border text-card-foreground">
                        <DialogHeader>
                            <DialogTitle>Merge Tags</DialogTitle>
                            <DialogDescription>
                                Combine two tags. All content using the first tag will be updated to use the second tag.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div>
                                <label className="text-sm font-medium">Tag to merge from</label>
                                <Select onValueChange={setTagToMerge} value={tagToMerge}>
                                <SelectTrigger className="w-full mt-1"><SelectValue placeholder="Select a tag" /></SelectTrigger>
                                <SelectContent>
                                    {allTags.filter(t => t !== mergeTargetTag).map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="text-sm font-medium">Merge into tag</label>
                                <Select onValueChange={setMergeTargetTag} value={mergeTargetTag}>
                                <SelectTrigger className="w-full mt-1"><SelectValue placeholder="Select a tag" /></SelectTrigger>
                                <SelectContent>
                                    {allTags.filter(t => t !== tagToMerge).map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                            <Button onClick={executeMerge} className="bg-accent hover:bg-accent/90" disabled={!tagToMerge || !mergeTargetTag || tagToMerge === mergeTargetTag}>Merge Tags</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {allTags.map(tag => (
                <div key={tag} className="flex items-center bg-muted rounded-full transition-colors hover:bg-muted/80">
                    <Badge variant="secondary" className="text-sm bg-transparent border-none cursor-default">{tag}</Badge>
                    <button onClick={() => handleRenameClick(tag)} className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-black/20 rounded-full"><Edit size={14}/></button>
                    
                     <AlertDialog>
                        <AlertDialogTrigger asChild>
                           <button className="p-1.5 text-muted-foreground rounded-full mr-1 hover:text-white hover:bg-destructive"><Trash2 size={14}/></button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-card border-border text-card-foreground">
                            <AlertDialogHeader>
                                <AlertDialogTitle>Delete Tag "{tag}"?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently remove the tag "{tag}" from all videos and galleries.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => executeDelete(tag)} className="bg-destructive hover:bg-destructive/90">Confirm Delete</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
              ))}
               {allTags.length === 0 && <p className="text-muted-foreground">No tags found. Add tags to your videos and galleries to see them here.</p>}
            </CardContent>
          </Card>
        </div>
      </div>

       {/* Rename Dialog */}
      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <DialogContent className="bg-card border-border text-card-foreground">
            <DialogHeader>
                <DialogTitle>Rename Tag</DialogTitle>
                <DialogDescription>
                    You are renaming the tag "{tagToRename}". This will update it across all content.
                </DialogDescription>
            </DialogHeader>
            <div className="py-4">
                <label htmlFor="new-tag-name" className="text-sm font-medium">New tag name</label>
                <Input 
                    id="new-tag-name"
                    value={newTagName} 
                    onChange={(e) => setNewTagName(e.target.value)} 
                    className="mt-1"
                    autoFocus
                />
            </div>
            <DialogFooter>
                <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                <Button onClick={executeRename} className="bg-accent hover:bg-accent/90">Save Changes</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

    
