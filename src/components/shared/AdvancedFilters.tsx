
```tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Filter, 
  X, 
  Star, 
  Calendar, 
  Tag, 
  User, 
  Video, 
  Image as ImageIcon,
  Crown,
  Sparkles,
  TrendingUp,
  Clock,
  Search
} from 'lucide-react';
import { getModels, getTags } from '@/lib/localStorage';

export interface FilterOptions {
  query: string;
  type: 'all' | 'video' | 'gallery' | 'model';
  category: string;
  tags: string[];
  models: string[];
  dateRange: {
    from: string;
    to: string;
  };
  featured: boolean;
  sortBy: 'relevance' | 'date' | 'title' | 'popular';
  sortOrder: 'asc' | 'desc';
  minRating: number;
  hasKeywords: string[];
}

interface AdvancedFiltersProps {
  onFiltersChange: (filters: FilterOptions) => void;
  initialFilters?: Partial<FilterOptions>;
  availableCategories?: string[];
  showPresets?: boolean;
}

const defaultFilters: FilterOptions = {
  query: '',
  type: 'all',
  category: '',
  tags: [],
  models: [],
  dateRange: { from: '', to: '' },
  featured: false,
  sortBy: 'relevance',
  sortOrder: 'desc',
  minRating: 0,
  hasKeywords: []
};

const popularCategories = [
  'Fashion', 'Portrait', 'Editorial', 'Runway', 'Beauty', 
  'Couture', 'Lifestyle', 'Commercial', 'Art', 'Street Style'
];

const filterPresets = [
  {
    name: 'Featured Content',
    icon: Crown,
    filters: { featured: true, sortBy: 'date' as const, minRating: 4 }
  },
  {
    name: 'Latest Releases',
    icon: Clock,
    filters: { sortBy: 'date' as const, sortOrder: 'desc' as const }
  },
  {
    name: 'Top Rated',
    icon: Star,
    filters: { minRating: 4, sortBy: 'popular' as const }
  },
  {
    name: 'Trending Now',
    icon: TrendingUp,
    filters: { sortBy: 'popular' as const, minRating: 3 }
  }
];

export function AdvancedFilters({ 
  onFiltersChange, 
  initialFilters = {}, 
  availableCategories = popularCategories,
  showPresets = true
}: AdvancedFiltersProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    ...defaultFilters,
    ...initialFilters
  });
  
  const [availableModels, setAvailableModels] = useState<Array<{id: string, name: string}>>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  useEffect(() => {
    // Load available models and tags
    const models = getModels().map(m => ({ id: m.id, name: m.name }));
    setAvailableModels(models);
    
    const tags = Object.keys(getTags());
    setAvailableTags(tags);
  }, []);

  useEffect(() => {
    // Count active filters
    let count = 0;
    if (filters.query) count++;
    if (filters.type !== 'all') count++;
    if (filters.category) count++;
    if (filters.tags.length > 0) count++;
    if (filters.models.length > 0) count++;
    if (filters.dateRange.from || filters.dateRange.to) count++;
    if (filters.featured) count++;
    if (filters.minRating > 0) count++;
    if (filters.hasKeywords.length > 0) count++;
    
    setActiveFiltersCount(count);
    onFiltersChange(filters);
  }, [filters, onFiltersChange]);

  const updateFilter = (key: keyof FilterOptions, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const addTag = (tag: string) => {
    if (!filters.tags.includes(tag)) {
      updateFilter('tags', [...filters.tags, tag]);
    }
  };

  const removeTag = (tag: string) => {
    updateFilter('tags', filters.tags.filter(t => t !== tag));
  };

  const addModel = (modelId: string) => {
    if (!filters.models.includes(modelId)) {
      updateFilter('models', [...filters.models, modelId]);
    }
  };

  const removeModel = (modelId: string) => {
    updateFilter('models', filters.models.filter(m => m !== modelId));
  };

  const applyPreset = (preset: typeof filterPresets[0]) => {
    setFilters(prev => ({ ...prev, ...preset.filters }));
  };

  const clearFilters = () => {
    setFilters(defaultFilters);
  };

  const clearSpecificFilter = (filterKey: keyof FilterOptions) => {
    switch (filterKey) {
      case 'tags':
        updateFilter('tags', []);
        break;
      case 'models':
        updateFilter('models', []);
        break;
      case 'dateRange':
        updateFilter('dateRange', { from: '', to: '' });
        break;
      case 'hasKeywords':
        updateFilter('hasKeywords', []);
        break;
      default:
        updateFilter(filterKey, defaultFilters[filterKey]);
    }
  };

  return (
    <Card className="luxury-card w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Filter className="w-5 h-5" />
            Advanced Filters
            {activeFiltersCount > 0 && (
              <Badge className="bg-luxury-gradient text-black font-semibold">
                {activeFiltersCount}
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            {activeFiltersCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="text-muted-foreground hover:text-foreground"
              >
                Clear All
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-muted-foreground hover:text-foreground"
            >
              {isExpanded ? 'Collapse' : 'Expand'}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Quick Search */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-semibold">
            <Search className="w-4 h-4" />
            Search Query
          </Label>
          <Input
            placeholder="Search content..."
            value={filters.query}
            onChange={(e) => updateFilter('query', e.target.value)}
            className="bg-background/50"
          />
        </div>

        {/* Filter Presets */}
        {showPresets && (
          <div className="space-y-3">
            <Label className="flex items-center gap-2 text-sm font-semibold">
              <Sparkles className="w-4 h-4" />
              Quick Filters
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {filterPresets.map((preset) => (
                <Button
                  key={preset.name}
                  variant="outline"
                  size="sm"
                  onClick={() => applyPreset(preset)}
                  className="justify-start gap-2 h-auto py-2 text-left hover:bg-luxury-gradient hover:text-black hover:border-primary transition-all"
                >
                  <preset.icon className="w-4 h-4" />
                  <span className="text-sm">{preset.name}</span>
                </Button>
              ))}
            </div>
          </div>
        )}

        <Separator />

        {/* Basic Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-semibold">
              Content Type
            </Label>
            <Select value={filters.type} onValueChange={(value) => updateFilter('type', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    All Content
                  </div>
                </SelectItem>
                <SelectItem value="video">
                  <div className="flex items-center gap-2">
                    <Video className="w-4 h-4" />
                    Videos
                  </div>
                </SelectItem>
                <SelectItem value="gallery">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    Galleries
                  </div>
                </SelectItem>
                <SelectItem value="model">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Models
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-semibold">
              Category
            </Label>
            <Select value={filters.category} onValueChange={(value) => updateFilter('category', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select category..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {availableCategories.map(category => (
                  <SelectItem key={category} value={category.toLowerCase()}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Sorting */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Sort By</Label>
            <Select value={filters.sortBy} onValueChange={(value) => updateFilter('sortBy', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="title">Title</SelectItem>
                <SelectItem value="popular">Popularity</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold">Sort Order</Label>
            <Select value={filters.sortOrder} onValueChange={(value) => updateFilter('sortOrder', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">Descending</SelectItem>
                <SelectItem value="asc">Ascending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Advanced Filters (Expandable) */}
        {isExpanded && (
          <>
            <Separator />
            
            {/* Rating Filter */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-sm font-semibold">
                <Star className="w-4 h-4" />
                Minimum Rating: {filters.minRating > 0 ? `${filters.minRating} stars` : 'Any'}
              </Label>
              <div className="px-2">
                <Slider
                  value={[filters.minRating]}
                  onValueChange={([value]) => updateFilter('minRating', value)}
                  max={5}
                  min={0}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Any</span>
                  <span>1★</span>
                  <span>2★</span>
                  <span>3★</span>
                  <span>4★</span>
                  <span>5★</span>
                </div>
              </div>
            </div>

            {/* Featured Content Toggle */}
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2 text-sm font-semibold">
                <Crown className="w-4 h-4" />
                Featured Content Only
              </Label>
              <Switch
                checked={filters.featured}
                onCheckedChange={(checked) => updateFilter('featured', checked)}
              />
            </div>

            {/* Date Range */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-sm font-semibold">
                <Calendar className="w-4 h-4" />
                Date Range
                {(filters.dateRange.from || filters.dateRange.to) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => clearSpecificFilter('dateRange')}
                    className="h-auto p-1 text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                )}
              </Label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs text-muted-foreground">From</Label>
                  <Input
                    type="date"
                    value={filters.dateRange.from}
                    onChange={(e) => updateFilter('dateRange', { ...filters.dateRange, from: e.target.value })}
                    className="bg-background/50"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">To</Label>
                  <Input
                    type="date"
                    value={filters.dateRange.to}
                    onChange={(e) => updateFilter('dateRange', { ...filters.dateRange, to: e.target.value })}
                    className="bg-background/50"
                  />
                </div>
              </div>
            </div>

            {/* Tags Filter */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-sm font-semibold">
                <Tag className="w-4 h-4" />
                Tags
                {filters.tags.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => clearSpecificFilter('tags')}
                    className="h-auto p-1 text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                )}
              </Label>
              
              <div className="flex flex-wrap gap-2">
                {filters.tags.map(tag => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="flex items-center gap-1 px-2 py-1"
                  >
                    {tag}
                    <X
                      className="w-3 h-3 cursor-pointer hover:text-destructive"
                      onClick={() => removeTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
              
              <ScrollArea className="h-20 border rounded-md p-2">
                <div className="flex flex-wrap gap-1">
                  {availableTags
                    .filter(tag => !filters.tags.includes(tag))
                    .map(tag => (
                      <Button
                        key={tag}
                        variant="ghost"
                        size="sm"
                        onClick={() => addTag(tag)}
                        className="h-auto p-1 text-xs hover:bg-primary/10"
                      >
                        {tag}
                      </Button>
                    ))}
                </div>
              </ScrollArea>
            </div>

            {/* Models Filter */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-sm font-semibold">
                <User className="w-4 h-4" />
                Models
                {filters.models.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => clearSpecificFilter('models')}
                    className="h-auto p-1 text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                )}
              </Label>
              
              <div className="flex flex-wrap gap-2">
                {filters.models.map(modelId => {
                  const model = availableModels.find(m => m.id === modelId);
                  return (
                    <Badge
                      key={modelId}
                      variant="secondary"
                      className="flex items-center gap-1 px-2 py-1"
                    >
                      {model?.name || modelId}
                      <X
                        className="w-3 h-3 cursor-pointer hover:text-destructive"
                        onClick={() => removeModel(modelId)}
                      />
                    </Badge>
                  );
                })}
              </div>
              
              <ScrollArea className="h-24 border rounded-md p-2">
                <div className="space-y-1">
                  {availableModels
                    .filter(model => !filters.models.includes(model.id))
                    .map(model => (
                      <Button
                        key={model.id}
                        variant="ghost"
                        size="sm"
                        onClick={() => addModel(model.id)}
                        className="w-full justify-start h-auto p-2 text-sm hover:bg-primary/10"
                      >
                        {model.name}
                      </Button>
                    ))}
                </div>
              </ScrollArea>
            </div>
          </>
        )}

        {/* Active Filters Summary */}
        {activeFiltersCount > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Active Filters</Label>
              <div className="flex flex-wrap gap-2">
                {filters.query && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    Query: "{filters.query}"
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => clearSpecificFilter('query')}
                    />
                  </Badge>
                )}
                {filters.type !== 'all' && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    Type: {filters.type}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => clearSpecificFilter('type')}
                    />
                  </Badge>
                )}
                {filters.category && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    Category: {filters.category}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => clearSpecificFilter('category')}
                    />
                  </Badge>
                )}
                {filters.featured && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    Featured Only
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => clearSpecificFilter('featured')}
                    />
                  </Badge>
                )}
                {filters.minRating > 0 && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    Min {filters.minRating}★
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => clearSpecificFilter('minRating')}
                    />
                  </Badge>
                )}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
```
