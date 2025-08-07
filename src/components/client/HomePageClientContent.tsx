
'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Heart } from 'lucide-react';
import type { Video, Gallery } from '@/lib/types';
import { ContentCard } from '../shared/ContentCard';
import { useAuth } from '@/lib/auth';
import { Skeleton } from '../ui/skeleton';
import { getVideos, getGalleries } from '@/lib/localStorage';

export const HomePageClientContent: React.FC = () => {
    const { currentUser } = useAuth();
    const [recommendations, setRecommendations] = useState<(Video | Gallery)[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchRecommendations = () => {
            if (!currentUser || !currentUser.favorites || currentUser.favorites.length === 0) {
                setIsLoading(false);
                return;
            }
            setIsLoading(true);

            const allVideos = getVideos();
            const allGalleries = getGalleries();
            const allContent = [...allVideos, ...allGalleries];
            
            // Simple recommendation logic: find content with shared tags from favorites
            const favoriteTags = new Set<string>();
            currentUser.favorites.forEach(fav => {
                const item = fav.type === 'video' 
                    ? allVideos.find(v => v.id === fav.id)
                    : allGalleries.find(g => g.id === fav.id);
                item?.tags.forEach(tag => favoriteTags.add(tag));
            });
            
            const favoriteIds = new Set(currentUser.favorites.map(f => f.id));

            const recommendedContent = allContent
                .filter(item => !favoriteIds.has(item.id)) // Exclude already favorited items
                .map(item => ({
                    item,
                    score: item.tags.reduce((acc, tag) => favoriteTags.has(tag) ? acc + 1 : acc, 0)
                }))
                .filter(scoredItem => scoredItem.score > 0)
                .sort((a, b) => b.score - a.score)
                .map(scoredItem => ({...scoredItem.item, type: 'videoUrl' in scoredItem.item ? 'video' : 'gallery'} as Video | Gallery))
                .slice(0, 3);
            
            setRecommendations(recommendedContent);
            setIsLoading(false);
        };

        fetchRecommendations();

    }, [currentUser]);

    if (!currentUser) {
        return null;
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
                        type={'videoUrl' in item ? 'video' : 'gallery'}
                    />
                ))}
            </div>
        </section>
    );
};
