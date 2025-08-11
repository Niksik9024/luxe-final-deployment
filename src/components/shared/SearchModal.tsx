'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Film, ImageIcon, Users, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { getVideos, getGalleries, getModels } from '@/lib/localStorage';
import type { Video, Gallery, Model } from '@/lib/types';

interface SearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type SearchResult = {
  id: string;
  title: string;
  type: 'video' | 'gallery' | 'model';
  image: string;
  url: string;
  category?: string;
  description?: string;
};

export function SearchModal({ open, onOpenChange }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const allContent = useMemo(() => {
    const videos = getVideos().map((video: Video): SearchResult => ({
      id: video.id,
      title: video.title,
      type: 'video',
      image: video.image,
      url: `/videos/${video.id}`,
      category: video.category,
      description: video.description,
    }));

    const galleries = getGalleries().map((gallery: Gallery): SearchResult => ({
      id: gallery.id,
      title: gallery.title,
      type: 'gallery',
      image: gallery.image,
      url: `/galleries/${gallery.id}`,
      category: gallery.category,
      description: gallery.description,
    }));

    const models = getModels().map((model: Model): SearchResult => ({
      id: model.id,
      title: model.name,
      type: 'model',
      image: model.image,
      url: `/models/${model.id}`,
      category: model.category,
      description: model.bio,
    }));

    return [...videos, ...galleries, ...models];
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    const searchQuery = query.toLowerCase();

    const filteredResults = allContent.filter(item =>
      item.title.toLowerCase().includes(searchQuery) ||
      item.category?.toLowerCase().includes(searchQuery) ||
      item.description?.toLowerCase().includes(searchQuery)
    );

    setResults(filteredResults.slice(0, 20)); // Limit to 20 results
    setLoading(false);
  }, [query, allContent]);

  const handleResultClick = () => {
    onOpenChange(false);
    setQuery('');
    setResults([]);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'video': return <Film className="h-4 w-4" />;
      case 'gallery': return <ImageIcon className="h-4 w-4" />;
      case 'model': return <Users className="h-4 w-4" />;
      default: return <Search className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'gallery': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'model': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] bg-card/95 backdrop-blur-xl border-primary/20 p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <Search className="h-5 w-5" />
            Search LUXE
          </DialogTitle>
          <DialogDescription>
            Search through our collection of videos, galleries, and models.
          </DialogDescription>
        </DialogHeader>

        <div className="px-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for videos, galleries, or models..."
              className="pl-10 pr-10 min-h-[44px] text-base"
              autoFocus
            />
            {query && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setQuery('')}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          {query.trim() && (
            <ScrollArea className="h-full max-h-[400px] px-6 pb-6">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : results.length > 0 ? (
                <div className="space-y-2">
                  {results.map((result) => (
                    <Link
                      key={`${result.type}-${result.id}`}
                      href={result.url}
                      onClick={handleResultClick}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary/10 transition-colors group"
                    >
                      <div className="relative w-16 h-12 flex-shrink-0 rounded-md overflow-hidden">
                        <Image
                          src={result.image}
                          alt={result.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-sm group-hover:text-primary transition-colors truncate">
                            {result.title}
                          </h4>
                          <Badge className={`${getTypeColor(result.type)} text-xs flex items-center gap-1`}>
                            {getIcon(result.type)}
                            {result.type}
                          </Badge>
                        </div>
                        {result.category && (
                          <p className="text-xs text-muted-foreground">
                            {result.category}
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Search className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No results found for "{query}"</p>
                  <p className="text-xs mt-1">Try different keywords or check your spelling</p>
                </div>
              )}
            </ScrollArea>
          )}

          {!query.trim() && (
            <div className="text-center py-8 px-6 text-muted-foreground">
              <Search className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">Start typing to search...</p>
              <p className="text-xs mt-1">Find videos, galleries, and models</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}