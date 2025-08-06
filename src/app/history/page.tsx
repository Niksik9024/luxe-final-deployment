

'use client'

import React, { useState, useEffect } from 'react';
import { ContentCard } from '@/components/shared/ContentCard';
import { History as HistoryIcon } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { collection, doc, getDoc, getDocs, query, where, documentId, orderBy } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { Video, HistoryItem } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function WatchHistoryPage() {
    const { currentUser } = useAuth();
    const [watchedVideos, setWatchedVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            if (!currentUser) {
                setLoading(false);
                return;
            }
            setLoading(true);

            const userDocRef = doc(db, 'users', currentUser.id);
            const userDoc = await getDoc(userDocRef);
            const historyItems = (userDoc.data()?.watchHistory || []) as HistoryItem[];
            
            if (historyItems.length === 0) {
                setWatchedVideos([]);
                setLoading(false);
                return;
            }

            const videoIds = historyItems.map(item => item.id);
            const videoQuery = query(collection(db, 'videos'), where(documentId(), 'in', videoIds));
            const videoSnap = await getDocs(videoQuery);
            const videosData = videoSnap.docs.map(d => ({ ...d.data(), id: d.id } as Video));
            
            // Sort videos according to history order
            const sortedVideos = historyItems.map(item => videosData.find(v => v.id === item.id)).filter((v): v is Video => !!v);

            setWatchedVideos(sortedVideos);
            setLoading(false);
        };

        fetchHistory();
    }, [currentUser]);

  if (loading) {
      return (
        <div className="container mx-auto py-12 px-4">
            <h1 className="text-4xl mb-8 text-center">Watch History</h1>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {Array.from({length: 4}).map((_, i) => <Skeleton key={i} className="aspect-video" />)}
            </div>
        </div>
      )
  }

  if (watchedVideos.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center text-center py-20 min-h-[60vh]">
            <div className="bg-card border border-border p-8 rounded-full mb-6">
                <HistoryIcon className="h-16 w-16 text-accent" />
            </div>
            <h1 className="text-4xl mb-4">Your Watch History is Empty</h1>
            <p className="text-muted-foreground max-w-md">You haven't watched any videos yet. Your history will appear here after you watch something.</p>
        </div>
    )
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-4xl mb-8 text-center">Watch History</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {watchedVideos.map((video) => (
          <ContentCard 
            key={video.id} 
            content={video} 
            type="video"
          />
        ))}
      </div>
    </div>
  );
}
