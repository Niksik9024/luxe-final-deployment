
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Video } from '@/lib/types';
import { getVideos } from '@/lib/localStorage';
import { ContentCard } from '@/components/shared/ContentCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Clock } from 'lucide-react';
import { PaginationControls } from '@/components/shared/PaginationControls';

const ITEMS_PER_PAGE = 12;

export function VideosList() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'duration'>('newest');

  useEffect(() => {
    const allVideos = getVideos();
    const publishedVideos = allVideos.filter(v => v.status === 'Published');
    setVideos(publishedVideos);
    setLoading(false);
  }, []);

  const filteredAndSortedVideos = useMemo(() => {
    let filtered = videos.filter(video => {
      const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           video.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || video.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });

    // Sort videos
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'duration':
          return parseInt(b.duration) - parseInt(a.duration);
        default:
          return 0;
      }
    });
  }, [videos, searchTerm, selectedCategory, sortBy]);

  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(videos.map(v => v.category).filter(Boolean))];
    return uniqueCategories;
  }, [videos]);

  const paginatedVideos = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedVideos.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAndSortedVideos, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedVideos.length / ITEMS_PER_PAGE);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="aspect-video bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Search and Filter Controls */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search videos..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
              setSelectedCategory('all');
              setCurrentPage(1);
            }}
          >
            All Categories
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setSelectedCategory(category);
                setCurrentPage(1);
              }}
            >
              {category}
            </Button>
          ))}
        </div>

        <div className="flex gap-2">
          <Button
            variant={sortBy === 'newest' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortBy('newest')}
          >
            <Clock className="w-3 h-3 mr-1" />
            Newest
          </Button>
          <Button
            variant={sortBy === 'duration' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortBy('duration')}
          >
            Duration
          </Button>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          Showing {paginatedVideos.length} of {filteredAndSortedVideos.length} videos
        </p>
        {searchTerm && (
          <Badge variant="secondary">
            <Filter className="w-3 h-3 mr-1" />
            Filtered
          </Badge>
        )}
      </div>

      {/* Videos Grid */}
      {paginatedVideos.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2">No videos found</h3>
          <p className="text-muted-foreground">
            {searchTerm ? 'Try adjusting your search terms' : 'No videos are currently available'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {paginatedVideos.map((video) => (
            <ContentCard key={video.id} content={video} type="video" />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
