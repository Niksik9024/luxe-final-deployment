'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit, Eye, Plus, Play } from 'lucide-react';
import Link from 'next/link';
import { Video } from '@/lib/types';
import { getVideos, deleteVideo } from '@/lib/localStorage';
import { useToast } from '@/lib/use-toast';

export function VideosAdminClient() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      const allVideos = getVideos();
      setVideos(allVideos);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load videos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this video?')) {
      try {
        deleteVideo(id);
        await loadVideos();
        toast({
          title: "Success",
          description: "Video deleted successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete video",
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
        <h2 className="text-xl font-semibold md:hidden">Videos</h2>
        <Button asChild className="w-full sm:w-auto touch-manipulation">
          <Link href="/admin/videos/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Video
          </Link>
        </Button>
      </div>

      <Card className="w-full max-w-full overflow-hidden">
        <CardHeader className="hidden md:block">
          <CardTitle>Videos</CardTitle>
        </CardHeader>
        <CardContent className="p-0 md:p-6 w-full overflow-x-auto">
          {/* Desktop Table View */}
          <div className="hidden md:block">
            <div className="grid gap-4 w-full">
              {videos.map((video) => (
                <div key={video.id} className="flex items-center justify-between p-4 border rounded-lg w-full min-w-0">
                  <div className="flex items-center space-x-4 flex-1 min-w-0">
                    <div className="relative w-16 h-16 bg-black rounded overflow-hidden flex-shrink-0">
                      <img 
                        src={video.thumbnail} 
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <Play className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold truncate">{video.title}</h3>
                      <p className="text-sm text-muted-foreground text-truncate-2 max-w-md">{video.description}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="secondary" className="text-xs">{video.status}</Badge>
                        <Badge variant="outline" className="text-xs">{video.duration}</Badge>
                        {video.isFeatured && <Badge variant="default" className="text-xs">Featured</Badge>}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2 flex-shrink-0 ml-4">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/videos/${video.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/videos/edit/${video.id}`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleDelete(video.id)}
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
            {videos.map((video) => (
              <div key={video.id} className="mobile-card w-full">
                <div className="mobile-card-header">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className="relative w-12 h-12 bg-black rounded overflow-hidden flex-shrink-0">
                      <img 
                        src={video.thumbnail} 
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <Play className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="mobile-card-title">{video.title}</h3>
                    </div>
                  </div>
                  <div className="mobile-card-actions">
                    <Button variant="outline" size="sm" asChild className="touch-manipulation min-w-[44px] min-h-[44px]">
                      <Link href={`/videos/${video.id}`}>
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View</span>
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild className="touch-manipulation min-w-[44px] min-h-[44px]">
                      <Link href={`/admin/videos/edit/${video.id}`}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Link>
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleDelete(video.id)}
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
                    <span className="mobile-card-value text-truncate-2">{video.description}</span>
                  </div>
                  <div className="mobile-card-row">
                    <span className="mobile-card-label">Status:</span>
                    <span className="mobile-card-value">
                      <Badge variant="secondary" className="text-xs">{video.status}</Badge>
                    </span>
                  </div>
                  <div className="mobile-card-row">
                    <span className="mobile-card-label">Duration:</span>
                    <span className="mobile-card-value">
                      <Badge variant="outline" className="text-xs">{video.duration}</Badge>
                    </span>
                  </div>
                  {video.isFeatured && (
                    <div className="mobile-card-row">
                      <span className="mobile-card-label">Featured:</span>
                      <span className="mobile-card-value">
                        <Badge variant="default" className="text-xs">Featured</Badge>
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {videos.length === 0 && (
            <div className="text-center py-8 text-muted-foreground px-4">
              No videos found. Create your first video to get started.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}