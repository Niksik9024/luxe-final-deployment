

'use client'

import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import type { Model } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '../ui/button';
import { Edit } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { cn } from '@/lib/utils';

interface ModelCardProps {
  model: Model;
  priority?: boolean;
  isHomepage?: boolean;
}

export const ModelCard = ({ model, priority = false, isHomepage = false }: ModelCardProps) => {
  const { isAdmin } = useAuth();
  return (
    <Card className="overflow-hidden group relative shadow-lg rounded-lg md:hover:shadow-2xl bg-card border-border hover:border-primary transition-all duration-300">
      <div className="absolute top-2 right-2 z-20">
        {isAdmin && (
            <Button asChild size="sm" className="bg-background/70 text-foreground hover:bg-accent hover:text-accent-foreground">
            <Link href={`/admin/models/edit/${model.id}`}>
                <Edit className="mr-2 h-4 w-4" /> Edit
            </Link>
            </Button>
        )}
       </div>
      <Link href={`/models/${model.id}`} className="block w-full h-full">
        <div className="w-full h-full aspect-[9/16] relative">
          <Image
            src={model.image}
            alt={model.name}
            fill
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
            priority={priority}
          />
           <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        </div>
        <div className={cn(
            "absolute bottom-0 left-0 w-full p-4",
            isHomepage && "p-2 text-center"
            )}>
          <h3 className={cn(
            "font-semibold text-lg [text-shadow:0_1px_4px_rgba(0,0,0,0.5)]",
             isHomepage && "text-base"
             )}>{model.name}</h3>
        </div>
      </Link>
    </Card>
  );
};

ModelCard.Skeleton = function ModelCardSkeleton() {
    return (
         <div className="overflow-hidden group relative bg-card rounded-lg border border-border">
            <Skeleton className="w-full aspect-[9/16]" />
            <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent">
                <Skeleton className="h-6 w-3/4" />
            </div>
        </div>
    )
}
