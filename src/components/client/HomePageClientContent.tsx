

'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Heart } from 'lucide-react';
import type { Video, Gallery } from '@/lib/types';
import { ContentCard } from '../shared/ContentCard';
import { useAuth } from '@/lib/auth';
import { recommend } from '@/ai/flows/recommend';
import { getFavoriteDetails } from '@/ai/flows/get-favorite-details';
import { collection, getDocs, where, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Skeleton } from '../ui/skeleton';

export const HomePageClientContent: React.FC = () => {
    const { currentUser } = useAuth();
    const [recommendations, setRecommendations] = useState<(Video | Gallery)[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchRecommendations = async () => {
            if (!currentUser) {
                setIsLoading(false);
                return;
            }

            try {
                // Fetch user's favorites
                const favoritesResponse = await getFavoriteDetails({ 
                    userId: currentUser.id,
                    favorites: currentUser.favorites || [] 
                });
                const favoriteContent = [...favoritesResponse.videos, ...favoritesResponse.galleries];

                if (favoriteContent.length === 0) {
                    setIsLoading(false);
                    return;
                }
                
                // Fetch all published content for the AI to choose from
                const videosQuery = query(collection(db, 'videos'), where('status', '==', 'Published'));
                const galleriesQuery = query(collection(db, 'galleries'), where('status', '==', 'Published'));

                const [videosSnap, galleriesSnap] = await Promise.all([
                    getDocs(videosQuery),
                    getDocs(galleriesQuery),
                ]);

                const allPublishedContentForAI = [
                    ...videosSnap.docs.map(d => ({...d.data(), id: d.id, description: d.data().description || ''} as Video)),
                    ...galleriesSnap.docs.map(d => ({...d.data(), id: d.id, description: d.data().description || ''} as Gallery)),
                ];
                
                const favoriteContentForAI = favoriteContent.map(c => ({ ...c, description: c.description || ''}));

                const recommendedIds = await recommend({
                    favorites: favoriteContentForAI,
                    allContent: allPublishedContentForAI,
                });

                if (recommendedIds.length > 0) {
                    const recommendedItems = recommendedIds
                        .map(id => {
                            const item = allPublishedContentForAI.find(content => content.id === id);
                            if (!item) return null;
                            const type = 'videoUrl' in item ? 'video' : 'gallery';
                            return { ...item, type };
                        })
                        .filter((item): item is (Video & {type: 'video'}) | (Gallery & {type: 'gallery'}) => item !== null);

                    setRecommendations(recommendedItems);
                }

            } catch(e) {
                console.error("Failed to fetch recommendations", e);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRecommendations();

    }, [currentUser]);

    if (!currentUser) {
        return null; // Don't show this section for logged-out users
    }

    if (isLoading) {
        return (
            <section className="py-12 md:py-20 px-4 container mx-auto">
                <h2 className="text-3xl font-bold mb-8 text-center flex items-center justify-center gap-3 uppercase tracking-widest">
                    <Sparkles className="text-accent" /> For You
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {Array.from({length: 3}).map((_, i) => <Skeleton key={i} className="aspect-video" />)}
                </div>
            </section>
        );
    }
    
    if (recommendations.length === 0 && (currentUser.favorites || []).length > 0) {
        return (
            <section className="py-12 md:py-20 px-4 container mx-auto">
                <h2 className="text-3xl font-bold mb-8 text-center flex items-center justify-center gap-3 uppercase tracking-widest">
                    <Sparkles className="text-accent" /> For You
                </h2>
                <div className="text-center bg-card border border-border rounded-lg p-8 max-w-2xl mx-auto">
                    <Sparkles className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-bold mb-2">No New Recommendations</h3>
                    <p className="text-muted-foreground">You've seen all the content related to your favorites. Discover something new!</p>
                </div>
            </section>
        )
    }

    if (recommendations.length === 0) {
        return (
            <section className="py-12 md:py-20 px-4 container mx-auto">
                <h2 className="text-3xl font-bold mb-8 text-center flex items-center justify-center gap-3 uppercase tracking-widest">
                    <Sparkles className="text-accent" /> For You
                </h2>
                <div className="text-center bg-card border border-border rounded-lg p-8 max-w-2xl mx-auto">
                    <Heart className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-bold mb-2">Your Recommendations Appear Here</h3>
                    <p className="text-muted-foreground">Favorite some videos or galleries to get your personalized feed.</p>
                </div>
            </section>
        )
    }

    return (
        <section className="py-12 md:py-20 px-4 container mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center flex items-center justify-center gap-3 uppercase tracking-widest">
                <Sparkles className="text-accent" /> For You
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {recommendations.map((item) => (
                    <ContentCard
                        key={item.id}
                        content={item}
                        type={item.type}
                    />
                ))}
            </div>
        </section>
    );
};
