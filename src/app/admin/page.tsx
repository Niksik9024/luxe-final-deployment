
'use client';
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Video, ImageIcon, Users, Eye, ArrowUp, Calendar as CalendarIcon, MoreVertical } from 'lucide-react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { type Video as VideoType, type Gallery, type Model } from '@/lib/types'
import { Skeleton } from '@/components/ui/skeleton'

type ContentItem = (VideoType | Gallery) & { type: 'video' | 'gallery' };

const StatCard = ({ title, value, icon: Icon, period, trend }: { title: string; value: string; icon: React.ElementType; period?: string, trend?: string }) => (
    <Card className="bg-card border-border shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="w-4 h-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        { (trend || period) && 
            <p className="text-xs text-muted-foreground flex items-center">
                {trend && <span className="text-green-500 flex items-center mr-2"><ArrowUp className="h-3 w-3 mr-1"/>{trend}</span>}
                {period}
            </p>
        }
      </CardContent>
    </Card>
  );
  
const getMonthlyContentData = (content: ContentItem[]) => {
    const months = Array.from({ length: 6 }, (_, i) => {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        return { name: d.toLocaleString('default', { month: 'short' }), year: d.getFullYear(), videos: 0, galleries: 0 };
    }).reverse();

    const monthMap = new Map(months.map(m => [`${m.name}-${m.year}`, m]));

    content.forEach(item => {
        const itemDate = new Date(item.date);
        const monthKey = `${itemDate.toLocaleString('default', { month: 'short' })}-${itemDate.getFullYear()}`;
        if (monthMap.has(monthKey)) {
            const monthData = monthMap.get(monthKey)!;
            if (item.type === 'video') {
                monthData.videos += 1;
            } else {
                monthData.galleries += 1;
            }
        }
    });

    return Array.from(monthMap.values());
};


export default function AdminDashboard() {
    const [stats, setStats] = React.useState({ videos: 0, galleries: 0, models: 0 });
    const [recentContent, setRecentContent] = React.useState<ContentItem[]>([]);
    const [chartData, setChartData] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [videosSnap, galleriesSnap, modelsSnap] = await Promise.all([
                    getDocs(collection(db, 'videos')),
                    getDocs(collection(db, 'galleries')),
                    getDocs(collection(db, 'models')),
                ]);

                const videos = videosSnap.docs.map(doc => ({ ...doc.data(), id: doc.id, type: 'video' } as VideoType & { type: 'video'}));
                const galleries = galleriesSnap.docs.map(doc => ({ ...doc.data(), id: doc.id, type: 'gallery' } as Gallery & { type: 'gallery' }));

                setStats({
                    videos: videosSnap.size,
                    galleries: galleriesSnap.size,
                    models: modelsSnap.size
                });
                
                const allContent: ContentItem[] = [...videos, ...galleries];
                allContent.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                setRecentContent(allContent.slice(0, 5));
                setChartData(getMonthlyContentData(allContent));

            } catch (error) {
                console.error("Error fetching dashboard data: ", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
             <div>
                <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
                <div className="grid gap-6 md:grid-cols-3">
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
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-3">
        <StatCard title="Total Videos" value={String(stats.videos)} icon={Video} trend="+2" period="in the last month" />
        <StatCard title="Total Galleries" value={String(stats.galleries)} icon={ImageIcon} trend="+5" period="in the last month"/>
        <StatCard title="Total Models" value={String(stats.models)} icon={Users} trend="+1" period="in the last month"/>
      </div>
      <div className="grid gap-8 mt-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
            <Card className="bg-card border-border shadow-lg h-full">
                <CardHeader>
                    <CardTitle className="text-xl">Content Growth</CardTitle>
                    <CardDescription>New videos and galleries added in the last 6 months.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData}>
                            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                            <Tooltip
                              cursor={{ fill: 'hsla(var(--muted), 0.5)' }}
                              contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)' }}
                              labelStyle={{ color: 'hsl(var(--foreground))' }}
                            />
                            <Legend wrapperStyle={{fontSize: "0.8rem"}}/>
                            <Bar dataKey="videos" fill="hsl(var(--accent))" name="Videos" stackId="a" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="galleries" fill="hsl(var(--primary))" name="Galleries" stackId="a" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
         <div className="lg:col-span-1">
            <Card className="bg-card border-border shadow-lg h-full">
                <CardHeader>
                    <CardTitle className="text-xl">Recent Content</CardTitle>
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
      </div>
    </div>
  );
}
