
'use server';
/**
 * @fileOverview A server-side flow for securely fetching the details of a user's favorited items.
 *
 * - getFavoriteDetails - The main function to execute the fetch.
 * - GetFavoriteDetailsInput - The input type for the function.
 * - FavoriteDetails - The return type for the function.
 */
import { ai } from '@/ai/genkit';
import { adminDb } from '@/lib/firebase-admin';
import type { Favorite, Video, Gallery, Photo } from '@/lib/types';
import { z } from 'genkit';
import type { GetFavoriteDetailsInput, FavoriteDetails } from '@/ai/schemas/description';
import { GetFavoriteDetailsInputSchema, FavoriteDetailsSchema } from '@/ai/schemas/description';


export async function getFavoriteDetails(input: GetFavoriteDetailsInput): Promise<FavoriteDetails> {
  return getFavoriteDetailsFlow(input);
}


const getFavoriteDetailsFlow = ai.defineFlow(
    {
        name: 'getFavoriteDetailsFlow',
        inputSchema: GetFavoriteDetailsInputSchema,
        outputSchema: FavoriteDetailsSchema,
    },
    async ({ userId, favorites }) => {
        if (!userId || !favorites || favorites.length === 0) {
            return { videos: [], galleries: [], photos: [] };
        }

        const videoIds = favorites.filter(f => f.type === 'video').map(f => f.id);
        const galleryIds = favorites.filter(f => f.type === 'gallery').map(f => f.id);
        const photoIds = favorites.filter(f => f.type === 'photo').map(f => f.id);
        
        let favVideos: Video[] = [];
        if (videoIds.length > 0) {
            const videoRefs = videoIds.map(id => adminDb.collection('videos').doc(id));
            const videoSnapshots = await adminDb.getAll(...videoRefs);
            favVideos = videoSnapshots.map(snap => ({ ...snap.data(), id: snap.id } as Video)).filter(v => v.title);
        }

        let favGalleries: Gallery[] = [];
        if (galleryIds.length > 0) {
            const galleryRefs = galleryIds.map(id => adminDb.collection('galleries').doc(id));
            const gallerySnapshots = await adminDb.getAll(...galleryRefs);
            favGalleries = gallerySnapshots.map(snap => ({ ...snap.data(), id: snap.id } as Gallery)).filter(g => g.title);
        }
        
        let favPhotos: Photo[] = [];
        if (photoIds.length > 0) {
            // Add robust filtering to ensure we only process valid photo IDs
            const photoGalleryIds = [...new Set(photoIds
                .filter((id): id is string => typeof id === 'string' && id.includes('-photo-'))
                .map(id => id.split('-photo-')[0]))
            ];
            
            if (photoGalleryIds.length > 0) {
                const galleryRefs = photoGalleryIds.map(id => adminDb.collection('galleries').doc(id));
                const gallerySnapshots = await adminDb.getAll(...galleryRefs);
                
                const galleriesForPhotos = gallerySnapshots.map(snap => ({ ...snap.data(), id: snap.id } as Gallery)).filter(g => g.title);
    
                galleriesForPhotos.forEach(gallery => {
                    (gallery.album || []).forEach((url, i) => {
                        const photoId = `${gallery.id}-photo-${i}`;
                        if (photoIds.includes(photoId)) {
                            favPhotos.push({
                                id: photoId,
                                image: url,
                                title: `${gallery.title} - Photo ${i + 1}`,
                                galleryId: gallery.id,
                                galleryTitle: gallery.title,
                            });
                        }
                    });
                });
            }
        }
        
        // **CLEANUP LOGIC**
        // After fetching, check for dangling references and clean them up.
        const validIds = new Set([
            ...favVideos.map(v => v.id),
            ...favGalleries.map(g => g.id),
            ...favPhotos.map(p => p.id)
        ]);
        
        const currentValidFavorites = favorites.filter(f => validIds.has(f.id));

        // Only write to the database if a cleanup is actually needed
        if (currentValidFavorites.length < favorites.length) {
            const userRef = adminDb.collection('users').doc(userId);
            // Run this in the background, don't hold up the response
            userRef.update({ favorites: currentValidFavorites }).catch(err => {
                console.error(`Failed to cleanup favorites for user ${userId}:`, err);
            });
        }
        
        return {
            videos: favVideos,
            galleries: favGalleries,
            photos: favPhotos,
        }
    }
);
