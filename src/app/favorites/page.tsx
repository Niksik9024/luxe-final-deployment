
'use client';

import React, { useState, useEffect } from 'react';
import { ContentCard } from '@/components/shared/ContentCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart } from 'lucide-react';
import type { Photo, Video, Gallery } from '@/lib/types';
import { Lightbox } from '@/components/shared/Lightbox';
import { useAuth } from '@/lib/auth';
import { Skeleton } from '@/components/ui/skeleton';
import { PhotoCard } from '@/components/shared/PhotoCard';
import { getVideos, getGalleries } from '@/lib/localStorage';

export default function FavoritesPage() {
    const { currentUser } = useAuth();
    const [favoriteVideos, setFavoriteVideos] = useState<Video[]>([]);
    const [favoriteGalleries, setFavoriteGalleries] = useState<Gallery[]>([]);
    const [favoritePhotos, setFavoritePhotos] = useState<Photo[]>([]);
    const [loading, setLoading] = useState(true);

    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxStartIndex, setLightboxStartIndex] = useState(0);

    useEffect(() => {
        if (!currentUser) {
            setLoading(false);
            return;
        }
        setLoading(true);
        
        const favoriteIds = currentUser.favorites || [];
        if (favoriteIds.length > 0) {
            const allVideos = getVideos();
            const allGalleries = getGalleries();
            const allPhotosFromGalleries = allGalleries.flatMap(g => 
                (g.album || []).map((url, i) => ({
                    id: `${g.id}-photo-${i}`,
                    image: url,
                    title: `${g.title} - Photo ${i+1}`,
                    galleryId: g.id,
                    galleryTitle: g.title,
                }))
            );

            setFavoriteVideos(allVideos.filter(v => favoriteIds.some(f => f.id === v.id && f.type === 'video')));
            setFavoriteGalleries(allGalleries.filter(g => favoriteIds.some(f => f.id === g.id && f.type === 'gallery')));
            setFavoritePhotos(allPhotosFromGalleries.filter(p => favoriteIds.some(f => f.id === p.id && f.type === 'photo')));
        } else {
            setFavoriteVideos([]);
            setFavoriteGalleries([]);
            setFavoritePhotos([]);
        }

        setLoading(false);
    }, [currentUser]);

    const openLightbox = (index: number) => {
        setLightboxStartIndex(index);
        setLightboxOpen(true);
    };
    
    const allContentFavorites = [
        ...favoriteVideos.map(v => ({...v, type: 'video' as const})), 
        ...favoriteGalleries.map(g => ({...g, type: 'gallery' as const})),
    ];
    
    const totalFavorites = allContentFavorites.length + favoritePhotos.length;

    if (loading) {
        return (
            <div className="container mx-auto py-12 px-4">
                <Skeleton className="h-10 w-48 mx-auto mb-4" />
                <Skeleton className="h-10 w-96 mx-auto mb-8" />
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {Array.from({length: 8}).map((_, i) => <Skeleton key={i} className="aspect-[2/3]" />)}
                </div>
            </div>
        )
    }

    if (!currentUser || totalFavorites === 0) {
        return (
            <div className="flex flex-col items-center justify-center text-center py-20 min-h-[60vh]">
                <div className="bg-card border border-border p-8 rounded-full mb-6">
                    <Heart className="h-16 w-16 text-accent" />
                </div>
                <h1 className="text-4xl mb-4">Your Favorites are Empty</h1>
                <p className="text-muted-foreground max-w-md">You haven't added any favorites yet. Click the heart icon on any video, gallery, or photo to save it here for later.</p>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-12 px-4">
            <h1 className="text-4xl mb-8 text-center">Favorites</h1>
            <Tabs defaultValue="all" className="w-full">
                <div className="flex justify-center mb-8">
                    <TabsList>
                        <TabsTrigger value="all">All ({totalFavorites})</TabsTrigger>
                        <TabsTrigger value="videos">Videos ({favoriteVideos.length})</TabsTrigger>
                        <TabsTrigger value="galleries">Galleries ({favoriteGalleries.length})</TabsTrigger>
                        <TabsTrigger value="photos">Photos ({favoritePhotos.length})</TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="all">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {allContentFavorites.map((item) => (
                            <ContentCard 
                                key={item.id} 
                                content={item} 
                                type={item.type}
                            />
                        ))}
                         {favoritePhotos.map((photo, index) => (
                             <PhotoCard 
                                key={photo.id} 
                                photo={photo} 
                                onImageClick={() => openLightbox(index)}
                             />
                        ))}
                    </div>
                </TabsContent>
                <TabsContent value="videos">
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {favoriteVideos.map((video) => (
                            <ContentCard key={video.id} content={video} type="video" />
                        ))}
                    </div>
                </TabsContent>
                <TabsContent value="galleries">
                     <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {favoriteGalleries.map((gallery) => (
                            <ContentCard key={gallery.id} content={gallery} type="gallery" />
                        ))}
                    </div>
                </TabsContent>
                <TabsContent value="photos">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {favoritePhotos.map((photo, index) => (
                             <PhotoCard 
                                key={photo.id} 
                                photo={photo} 
                                onImageClick={() => openLightbox(index)}
                             />
                        ))}
                    </div>
                </TabsContent>
            </Tabs>

            {lightboxOpen && (
                <Lightbox
                    images={favoritePhotos}
                    startIndex={lightboxStartIndex}
                    onClose={() => setLightboxOpen(false)}
                />
            )}
        </div>
    );
}
