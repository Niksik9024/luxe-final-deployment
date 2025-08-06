

'use client'

import React, { useState, useEffect } from 'react';
import { ContentCard } from '@/components/shared/ContentCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart } from 'lucide-react';
import type { Photo, Video, Gallery } from '@/lib/types';
import { Lightbox } from '@/components/shared/Lightbox';
import { useAuth } from '@/lib/auth';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore'
import { Skeleton } from '@/components/ui/skeleton';
import { PhotoCard } from '@/components/shared/PhotoCard';
import { getFavoriteDetails } from '@/ai/flows/get-favorite-details';
import type { FavoriteDetails } from '@/ai/schemas/description';


export default function FavoritesPage() {
    const { currentUser } = useAuth();
    const [favorites, setFavorites] = useState<FavoriteDetails>({ videos: [], galleries: [], photos: [] });
    const [loading, setLoading] = useState(true);

    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxStartIndex, setLightboxStartIndex] = useState(0);

    useEffect(() => {
        const fetchFavorites = async () => {
            if (!currentUser) {
                setLoading(false);
                return;
            }
            setLoading(true);
            try {
                // The user object from useAuth is now the single source of truth.
                const favoriteIds = currentUser.favorites || [];

                if (favoriteIds.length > 0) {
                    // Pass the userId to the flow for potential cleanup
                    const favoriteDetails = await getFavoriteDetails({ 
                        userId: currentUser.id, 
                        favorites: favoriteIds 
                    });
                    setFavorites(favoriteDetails);
                } else {
                    setFavorites({ videos: [], galleries: [], photos: [] });
                }

            } catch (error) {
                console.error("Error fetching favorites:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFavorites();
    }, [currentUser]);

    const openLightbox = (index: number) => {
        setLightboxStartIndex(index);
        setLightboxOpen(true);
    };
    
    const allContentFavorites = [
        ...favorites.videos.map(v => ({...v, type: 'video' as const})), 
        ...favorites.galleries.map(g => ({...g, type: 'gallery' as const})),
    ];
    
    const totalFavorites = allContentFavorites.length + favorites.photos.length;

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
                        <TabsTrigger value="videos">Videos ({favorites.videos.length})</TabsTrigger>
                        <TabsTrigger value="galleries">Galleries ({favorites.galleries.length})</TabsTrigger>
                        <TabsTrigger value="photos">Photos ({favorites.photos.length})</TabsTrigger>
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
                         {favorites.photos.map((photo, index) => (
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
                        {favorites.videos.map((video) => (
                            <ContentCard key={video.id} content={video} type="video" />
                        ))}
                    </div>
                </TabsContent>
                <TabsContent value="galleries">
                     <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {favorites.galleries.map((gallery) => (
                            <ContentCard key={gallery.id} content={gallery} type="gallery" />
                        ))}
                    </div>
                </TabsContent>
                <TabsContent value="photos">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {favorites.photos.map((photo, index) => (
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
                    images={favorites.photos}
                    startIndex={lightboxStartIndex}
                    onClose={() => setLightboxOpen(false)}
                />
            )}
        </div>
    );
}
