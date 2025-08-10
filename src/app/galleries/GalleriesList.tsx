
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Gallery } from '@/lib/types';
import { getGalleries } from '@/lib/localStorage';
import { ContentCard } from '@/components/shared/ContentCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Filter } from 'lucide-react';
import { PaginationControls } from '@/components/shared/PaginationControls';

const ITEMS_PER_PAGE = 12;

export function GalleriesList() {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    const allGalleries = getGalleries();
    const publishedGalleries = allGalleries.filter(g => g.status === 'Published');
    setGalleries(publishedGalleries);
    setLoading(false);
  }, []);

  const filteredGalleries = useMemo(() => {
    return galleries.filter(gallery => {
      const matchesSearch = gallery.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           gallery.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || gallery.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [galleries, searchTerm, selectedCategory]);

  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(galleries.map(g => g.category).filter(Boolean))];
    return uniqueCategories;
  }, [galleries]);

  const paginatedGalleries = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredGalleries.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredGalleries, currentPage]);

  const totalPages = Math.ceil(filteredGalleries.length / ITEMS_PER_PAGE);

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
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search galleries..."
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
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          Showing {paginatedGalleries.length} of {filteredGalleries.length} galleries
        </p>
        {searchTerm && (
          <Badge variant="secondary">
            <Filter className="w-3 h-3 mr-1" />
            Filtered
          </Badge>
        )}
      </div>

      {/* Galleries Grid */}
      {paginatedGalleries.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2">No galleries found</h3>
          <p className="text-muted-foreground">
            {searchTerm ? 'Try adjusting your search terms' : 'No galleries are currently available'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {paginatedGalleries.map((gallery) => (
            <ContentCard key={gallery.id} content={gallery} type="gallery" />
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
