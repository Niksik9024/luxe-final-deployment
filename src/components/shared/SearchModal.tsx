
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { getVideos, getGalleries, getModels } from '@/lib/localStorage';
import type { Video, Gallery, Model } from '@/lib/types';
import { FileVideo, ImageIcon, User } from 'lucide-react';
import Image from 'next/image';

interface SearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type SearchResult = (Video | Gallery | Model) & { resultType: 'video' | 'gallery' | 'model' };

export function SearchModal({ open, onOpenChange }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (query.length > 1) {
      const allVideos = getVideos().filter(v => v.status === 'Published');
      const allGalleries = getGalleries().filter(g => g.status === 'Published');
      const allModels = getModels();

      const lowerCaseQuery = query.toLowerCase();

      const filteredVideos = allVideos
        .filter(v => v.keywords.some(k => k.toLowerCase().includes(lowerCaseQuery)))
        .map(v => ({...v, resultType: 'video' as const}));
      
      const filteredGalleries = allGalleries
        .filter(g => g.keywords.some(k => k.toLowerCase().includes(lowerCaseQuery)))
        .map(g => ({...g, resultType: 'gallery' as const}));
      
      const filteredModels = allModels
        .filter(m => m.name.toLowerCase().includes(lowerCaseQuery))
        .map(m => ({...m, resultType: 'model' as const}));

      setResults([...filteredModels, ...filteredVideos, ...filteredGalleries].slice(0, 15));
    } else {
      setResults([]);
    }
  }, [query]);

  const handleSelect = (url: string) => {
    router.push(url);
    onOpenChange(false);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput 
        placeholder="Search for models, videos, or galleries..."
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>{query.length > 1 && results.length === 0 ? 'No results found.' : 'Start typing to search.'}</CommandEmpty>
        
        {results.length > 0 && (
          <CommandGroup heading="Results">
            {results.map(item => {
              if (item.resultType === 'model') {
                return (
                  <CommandItem key={`model-${item.id}`} onSelect={() => handleSelect(`/models/${item.id}`)}>
                    <AvatarImage src={item.image} className="w-6 h-6 mr-3 rounded-sm object-cover" />
                    <User className="mr-3" />
                    <span>{item.name}</span>
                  </CommandItem>
                )
              }
              if (item.resultType === 'video') {
                return (
                  <CommandItem key={`video-${item.id}`} onSelect={() => handleSelect(`/videos/${item.id}`)}>
                    <Image src={item.image} alt={item.title} width={24} height={24} className="w-6 h-6 mr-3 rounded-sm object-cover" />
                    <FileVideo className="mr-3" />
                    <span>{item.title}</span>
                  </CommandItem>
                )
              }
               if (item.resultType === 'gallery') {
                return (
                  <CommandItem key={`gallery-${item.id}`} onSelect={() => handleSelect(`/galleries/${item.id}`)}>
                     <Image src={item.image} alt={item.title} width={24} height={24} className="w-6 h-6 mr-3 rounded-sm object-cover" />
                    <ImageIcon className="mr-3" />
                    <span>{item.title}</span>
                  </CommandItem>
                )
              }
              return null;
            })}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}
