'use client';
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Video, ImageIcon, Users, Calendar as CalendarIcon } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getVideos, getGalleries, getModels } from '@/lib/localStorage'
import { type Video as VideoType, type Gallery } from '@/lib/types'
import { Skeleton } from '@/components/ui/skeleton'

type ContentItem = (VideoType | Gallery) & { type: 'video' | 'gallery' };

const StatCard = ({ title, value, icon: Icon }: { title: string; value: string; icon: React.ElementType; }) => (
    <Card className="bg-card border-border shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="w-4 h-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );


export default function AdminDashboard() {
    const [stats, setStats] = React.useState({ videos: 0, galleries: 0, models: 0 });
    const [recentContent, setRecentContent] = React.useState<ContentItem[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        setLoading(true);
        try {
            const videos = getVideos().map(v => ({...v, type: 'video' as const}));
            const galleries = getGalleries().map(g => ({...g, type: 'gallery' as const}));
            const models = getModels();

            setStats({
                videos: videos.length,
                galleries: galleries.length,
                models: models.length,
            });

            const allContent: ContentItem[] = [...videos, ...galleries];
            allContent.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            setRecentContent(allContent.slice(0, 5));

        } catch (error) {
            console.error("Error fetching dashboard data: ", error);
        } finally {
            setLoading(false);
        }
    }, []);

    if (loading) {
        return (
             <div className="w-full max-w-full">
                <h1 className="text-2xl sm:text-3xl font-headline font-bold mb-6 sm:mb-8">Dashboard</h1>
                <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                   <Skeleton className="h-24 sm:h-28 w-full" />
                   <Skeleton className="h-24 sm:h-28 w-full" />
                   <Skeleton className="h-24 sm:h-28 w-full" />
                </div>
                 <div className="grid gap-6 sm:gap-8 mt-6 sm:mt-8 grid-cols-1 xl:grid-cols-3">
                    <div className="xl:col-span-2">
                        <Skeleton className="h-[300px] sm:h-[400px] w-full" />
                    </div>
                    <div className="xl:col-span-1">
                        <Skeleton className="h-[300px] sm:h-[400px] w-full" />
                    </div>
                 </div>
            </div>
        )
    }

  return (
    <div className="w-full max-w-full">
      <h1 className="text-2xl sm:text-3xl font-headline font-bold mb-6 sm:mb-8">Dashboard</h1>
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Total Videos" value={String(stats.videos)} icon={Video} />
        <StatCard title="Total Galleries" value={String(stats.galleries)} icon={ImageIcon} />
        <StatCard title="Total Models" value={String(stats.models)} icon={Users} />
      </div>
      <div className="grid gap-6 sm:gap-8 mt-6 sm:mt-8 grid-cols-1 xl:grid-cols-3">
        <div className="xl:col-span-2">
            <Card className="bg-card border-border shadow-lg h-full w-full max-w-full">
                <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="text-lg sm:text-xl font-headline">Recent Content</CardTitle>
                    <CardDescription className="text-sm sm:text-base">The latest videos and galleries added.</CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                   <div className="space-y-3 sm:space-y-4 w-full max-w-full">
                        {loading ? (
                            Array.from({ length: 3 }).map((_, index) => (
                                <div key={index} className="flex items-center gap-3 sm:gap-4 animate-pulse w-full">
                                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-muted rounded-md flex-shrink-0"></div>
                                    <div className="flex-1 min-w-0 space-y-2">
                                        <div className="h-4 bg-muted rounded w-3/4"></div>
                                        <div className="h-3 bg-muted rounded w-1/2"></div>
                                        <div className="h-3 bg-muted rounded w-1/3"></div>
                                    </div>
                                    <div className="h-8 w-12 sm:w-16 bg-muted rounded flex-shrink-0"></div>
                                </div>
                            ))
                        ) : recentContent.length > 0 ? (
                            recentContent.map(item => (
                                <div key={item.id} className="flex items-center gap-3 sm:gap-4 w-full max-w-full">
                                    <Image 
                                        src={item.image} 
                                        alt={item.title} 
                                        width={64} 
                                        height={64} 
                                        className="rounded-md object-cover w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0"
                                    />
                                    <div className="flex-1 min-w-0 overflow-hidden">
                                        <h3 className="font-medium text-sm sm:text-base text-truncate-1">{item.title}</h3>
                                        <p className="text-xs sm:text-sm text-muted-foreground capitalize text-truncate-1">{item.type}</p>
                                        <p className="text-xs text-muted-foreground">{new Date(item.date).toLocaleDateString()}</p>
                                    </div>
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="flex-shrink-0 text-xs sm:text-sm min-h-[36px] sm:min-h-[40px] touch-manipulation px-2 sm:px-3"
                                    >
                                        Edit
                                    </Button>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                <p className="text-sm sm:text-base">No recent content found</p>
                            </div>
                        )}
                   </div>
                </CardContent>
            </Card>
        </div>
         <div className="xl:col-span-1">
            <Card className="bg-card border-border shadow-lg h-full w-full max-w-full">
                <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="text-lg sm:text-xl font-headline">Top Performing Models</CardTitle>
                    <CardDescription className="text-sm sm:text-base">Models featured in the most content.</CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                   <p className="text-muted-foreground text-sm sm:text-base">Data coming soon.</p>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}