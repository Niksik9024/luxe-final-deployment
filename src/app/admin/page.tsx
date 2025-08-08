
'use client';
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Video, ImageIcon, Users, Calendar as CalendarIcon, MoreVertical } from 'lucide-react';
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
             <div>
                <h1 className="text-3xl font-headline font-bold mb-8">Dashboard</h1>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                   <Skeleton className="h-28 w-full" />
                   <Skeleton className="h-28 w-full" />
                   <Skeleton className="h-28 w-full" />
                </div>
                 <div className="grid gap-8 mt-8 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <Skeleton className="h-[400px] w-full" />
                    </div>
                    <div className="lg:col-span-1">
                        <Skeleton className="h-[400px] w-full" />
                    </div>
                 </div>
            </div>
        )
    }

  return (
    <div>
      <h1 className="text-3xl font-headline font-bold mb-8">Dashboard</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Total Videos" value={String(stats.videos)} icon={Video} />
        <StatCard title="Total Galleries" value={String(stats.galleries)} icon={ImageIcon} />
        <StatCard title="Total Models" value={String(stats.models)} icon={Users} />
      </div>
      <div className="grid gap-8 mt-8 grid-cols-1 xl:grid-cols-3">
        <div className="xl:col-span-2">
            <Card className="bg-card border-border shadow-lg h-full">
                <CardHeader>
                    <CardTitle className="text-xl font-headline">Recent Content</CardTitle>
                    <CardDescription>The latest videos and galleries added.</CardDescription>
                </CardHeader>
                <CardContent>
                   <div className="space-y-4">
                        {recentContent.map(item => (
                            <div key={item.id} className="flex items-center gap-4">
                                <Image 
                                    src={item.image} 
                                    alt={item.title} 
                                    width={64} 
                                    height={64} 
                                    className="rounded-md object-cover w-16 h-16"
                                />
                                <div className="flex-1">
                                    <Link href={`/admin/${item.type === 'video' ? 'videos' : 'galleries'}/edit/${item.id}`} className="font-semibold hover:underline">{item.title}</Link>
                                    <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                                        <Badge variant={item.type === 'video' ? 'destructive' : 'default'} className={item.type === 'video' ? 'bg-accent' : 'bg-primary'}>
                                          {item.type === 'video' ? 'Video' : 'Gallery'}
                                        </Badge>
                                        <span className="flex items-center gap-1"><CalendarIcon size={14}/> {new Date(item.date).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" asChild>
                                  <Link href={`/admin/${item.type === 'video' ? 'videos' : 'galleries'}/edit/${item.id}`}>
                                    <MoreVertical className="text-muted-foreground" />
                                  </Link>
                                </Button>
                            </div>
                        ))}
                   </div>
                </CardContent>
            </Card>
        </div>
         <div className="xl:col-span-1">
            <Card className="bg-card border-border shadow-lg h-full">
                <CardHeader>
                    <CardTitle className="text-xl font-headline">Top Performing Models</CardTitle>
                    <CardDescription>Models featured in the most content.</CardDescription>
                </CardHeader>
                <CardContent>
                   <p className="text-muted-foreground">Data coming soon.</p>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
