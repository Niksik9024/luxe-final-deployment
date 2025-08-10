
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Calendar } from 'lucide-react';
import { Filter, X, RotateCcw, Sparkles, Crown, Star, Diamond } from 'lucide-react';

export interface FilterOptions {
  sortBy: string;
  dateRange: 'all' | 'today' | 'week' | 'month' | 'year';
  category: string;
  featured: boolean;
  minRating: number;
  tags: string[];
  searchInDescription: boolean;
  contentLength: 'all' | 'short' | 'medium' | 'long';
  quality: 'all' | 'hd' | '4k' | '8k';
}

interface AdvancedFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  availableCategories: string[];
  availableTags: string[];
  contentType: 'video' | 'gallery' | 'model' | 'all';
}

export const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  filters,
  onFiltersChange,
  availableCategories,
  availableTags,
  contentType
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  useEffect(() => {
    // Calculate active filters for display
    const active: string[] = [];
    
    if (filters.dateRange !== 'all') active.push(`Date: ${filters.dateRange}`);
    if (filters.category && filters.category !== 'all') active.push(`Category: ${filters.category}`);
    if (filters.featured) active.push('Featured Only');
    if (filters.minRating > 0) active.push(`Min Rating: ${filters.minRating}★`);
    if (filters.tags.length > 0) active.push(`${filters.tags.length} tags`);
    if (filters.contentLength !== 'all') active.push(`Length: ${filters.contentLength}`);
    if (filters.quality !== 'all') active.push(`Quality: ${filters.quality.toUpperCase()}`);
    
    setActiveFilters(active);
  }, [filters]);

  const updateFilter = (key: keyof FilterOptions, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const addTag = (tag: string) => {
    if (!filters.tags.includes(tag)) {
      updateFilter('tags', [...filters.tags, tag]);
    }
  };

  const removeTag = (tag: string) => {
    updateFilter('tags', filters.tags.filter(t => t !== tag));
  };

  const resetFilters = () => {
    onFiltersChange({
      sortBy: 'relevance',
      dateRange: 'all',
      category: '',
      featured: false,
      minRating: 0,
      tags: [],
      searchInDescription: false,
      contentLength: 'all',
      quality: 'all'
    });
  };

  const sortOptions = [
    { value: 'relevance', label: 'Best Match', icon: <Star className="w-4 h-4" /> },
    { value: 'newest', label: 'Newest First', icon: <Calendar className="w-4 h-4" /> },
    { value: 'oldest', label: 'Oldest First', icon: <Calendar className="w-4 h-4" /> },
    { value: 'alphabetical', label: 'A-Z', icon: <Sparkles className="w-4 h-4" /> },
    { value: 'rating', label: 'Highest Rated', icon: <Crown className="w-4 h-4" /> },
    { value: 'popular', label: 'Most Popular', icon: <Diamond className="w-4 h-4" /> }
  ];

  return (
    <Card className="luxury-card mb-8">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Filter className="w-5 h-5 text-primary" />
            Advanced Filters
            {activeFilters.length > 0 && (
              <Badge className="bg-primary/20 text-primary border-0 ml-2">
                {activeFilters.length}
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            {activeFilters.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={resetFilters}
                className="text-muted-foreground hover:text-primary"
              >
                <RotateCcw className="w-4 h-4 mr-1" />
                Reset
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Collapse' : 'Expand'}
            </Button>
          </div>
        </div>

        {/* Active Filters Display */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border/50">
            <span className="text-sm font-medium text-muted-foreground">Active:</span>
            {activeFilters.map((filter, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="bg-primary/10 text-primary border-primary/30 hover:bg-primary/20 transition-colors"
              >
                {filter}
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>

      {(isExpanded || activeFilters.length === 0) && (
        <CardContent className="space-y-6">
          {/* Sort Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-primary">Sort By</Label>
              <Select value={filters.sortBy} onValueChange={(value) => updateFilter('sortBy', value)}>
                <SelectTrigger className="bg-background/50 border-primary/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        {option.icon}
                        {option.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-primary">Date Range</Label>
              <Select value={filters.dateRange} onValueChange={(value) => updateFilter('dateRange', value)}>
                <SelectTrigger className="bg-background/50 border-primary/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {availableCategories.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-primary">Category</Label>
                <Select value={filters.category} onValueChange={(value) => updateFilter('category', value)}>
                  <SelectTrigger className="bg-background/50 border-primary/30">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Categories</SelectItem>
                    {availableCategories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <Separator className="bg-border/50" />

          {/* Quality and Length Filters */}
          {contentType === 'video' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-primary">Quality</Label>
                <Select value={filters.quality} onValueChange={(value) => updateFilter('quality', value)}>
                  <SelectTrigger className="bg-background/50 border-primary/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Qualities</SelectItem>
                    <SelectItem value="hd">HD (1080p+)</SelectItem>
                    <SelectItem value="4k">4K Ultra HD</SelectItem>
                    <SelectItem value="8k">8K Premium</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-primary">Content Length</Label>
                <Select value={filters.contentLength} onValueChange={(value) => updateFilter('contentLength', value)}>
                  <SelectTrigger className="bg-background/50 border-primary/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Lengths</SelectItem>
                    <SelectItem value="short">Short (0-5 min)</SelectItem>
                    <SelectItem value="medium">Medium (5-20 min)</SelectItem>
                    <SelectItem value="long">Long (20+ min)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Rating Filter */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-primary">
              Minimum Rating: {filters.minRating}★
            </Label>
            <Slider
              value={[filters.minRating]}
              onValueChange={([value]) => updateFilter('minRating', value)}
              max={5}
              min={0}
              step={0.5}
              className="w-full"
            />
          </div>

          {/* Switches */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border/50">
              <Label htmlFor="featured-only" className="font-medium">
                Featured Content Only
              </Label>
              <Switch
                id="featured-only"
                checked={filters.featured}
                onCheckedChange={(value) => updateFilter('featured', value)}
                className="data-[state=checked]:bg-primary"
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border/50">
              <Label htmlFor="search-description" className="font-medium">
                Search in Descriptions
              </Label>
              <Switch
                id="search-description"
                checked={filters.searchInDescription}
                onCheckedChange={(value) => updateFilter('searchInDescription', value)}
                className="data-[state=checked]:bg-primary"
              />
            </div>
          </div>

          {/* Tags Filter */}
          {availableTags.length > 0 && (
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-primary">Tags</Label>
              
              {/* Selected Tags */}
              {filters.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {filters.tags.map(tag => (
                    <Badge 
                      key={tag} 
                      className="bg-primary/20 text-primary border-primary/40 cursor-pointer hover:bg-primary/30 transition-colors"
                      onClick={() => removeTag(tag)}
                    >
                      {tag}
                      <X className="w-3 h-3 ml-1" />
                    </Badge>
                  ))}
                </div>
              )}

              {/* Available Tags */}
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                {availableTags
                  .filter(tag => !filters.tags.includes(tag))
                  .slice(0, 20)
                  .map(tag => (
                    <Badge 
                      key={tag} 
                      variant="outline" 
                      className="cursor-pointer hover:bg-primary/10 border-primary/30 hover:border-primary transition-all duration-200"
                      onClick={() => addTag(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};
