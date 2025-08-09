'use client';

import type { Gallery, Model, User, Video } from './types';
import { seedData } from './seed-data';

const isBrowser = typeof window !== 'undefined';

function getItem<T>(key: string, defaultValue: T): T {
    if (!isBrowser) return defaultValue;
    try {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error(`Error reading from localStorage key “${key}”:`, error);
        return defaultValue;
    }
}

function setItem<T>(key: string, value: T): void {
    if (!isBrowser) return;
    try {
        window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(`Error writing to localStorage key “${key}”:`, error);
    }
}

// Ensure initial data is seeded
export function initializeLocalStorage() {
    if (!isBrowser) return;
    const isSeeded = getItem('db_seeded', false);
    if (!isSeeded) {
        console.log("Seeding local storage with initial data...");
        setItem('models', seedData.models);
        setItem('videos', seedData.videos);
        setItem('galleries', seedData.galleries);
        setItem('users', seedData.users);
        setItem('tags', seedData.tags);
        setItem('db_seeded', true);
    }
}

// Data Access Functions
export const getModels = (): Model[] => {
  if (typeof window === 'undefined') return [];

  try {
    const models = localStorage.getItem('models');
    const parsed = models ? JSON.parse(models) : [];
    return Array.isArray(parsed) ? parsed.filter(m => m && m.id) : [];
  } catch (error) {
    console.error('Error loading models:', error);
    return [];
  }
};
export const setModels = (data: Model[]) => setItem('models', data);
export const getModelById = (id: string) => getModels().find(m => m.id === id);

export const getVideos = (): Video[] => {
  if (typeof window === 'undefined') return [];

  try {
    const videos = localStorage.getItem('videos');
    const parsed = videos ? JSON.parse(videos) : [];
    return Array.isArray(parsed) ? parsed.filter(v => v && v.id) : [];
  } catch (error) {
    console.error('Error loading videos:', error);
    return [];
  }
};

export const getGalleries = (): Gallery[] => {
  if (typeof window === 'undefined') return [];

  try {
    const galleries = localStorage.getItem('galleries');
    const parsed = galleries ? JSON.parse(galleries) : [];
    return Array.isArray(parsed) ? parsed.filter(g => g && g.id) : [];
  } catch (error) {
    console.error('Error loading galleries:', error);
    return [];
  }
};
export const setVideos = (data: Video[]) => setItem('videos', data);
export const getVideoById = (id: string) => getVideos().find(v => v.id === id);

export const setGalleries = (data: Gallery[]) => setItem('galleries', data);
export const getGalleryById = (id: string) => getGalleries().find(g => g.id === id);

export const getUsers = () => getItem<User[]>('users', []);
export const setUsers = (data: User[]) => setItem('users', data);
export const getUserById = (id: string) => getUsers().find(u => u.id === id);
export const getUserByEmail = (email: string) => getUsers().find(u => u.email === email);

export const getTags = () => getItem<Record<string, number>>('tags', {});
export const setTags = (data: Record<string, number>) => setItem('tags', data);

export function clearLocalStorage() {
    if (!isBrowser) return;
    setItem('models', []);
    setItem('videos', []);
    setItem('galleries', []);
    setItem('users', []);
    setItem('tags', {});
    setItem('db_seeded', false);
}

// Enhanced Favorites management with categories and metadata
export interface FavoriteItem {
  id: string;
  type: 'video' | 'gallery' | 'model';
  title: string;
  image: string;
  addedAt: string;
  category?: string;
  tags?: string[];
  lastViewed?: string;
  viewCount?: number;
  notes?: string;
  rating?: number; // 1-5 stars
}

export interface FavoritesStats {
  total: number;
  byType: { [key: string]: number };
  recent: FavoriteItem[];
  topRated: FavoriteItem[];
  mostViewed: FavoriteItem[];
}

export const getFavorites = (): FavoriteItem[] => {
  if (typeof window === 'undefined') return [];

  try {
    const favorites = localStorage.getItem('luxury_favorites');
    if (!favorites) return [];

    const parsed = JSON.parse(favorites);
    // Migrate old format
    if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === 'string') {
      return [];
    }

    // Ensure all favorites have required fields
    const validFavorites = Array.isArray(parsed) 
      ? parsed.map((fav: any) => ({
          ...fav,
          viewCount: fav.viewCount || 0,
          rating: fav.rating || 0,
          notes: fav.notes || ''
        }))
      : [];

    return validFavorites;
  } catch (error) {
    console.error('Error loading favorites:', error);
    return [];
  }
};

export const getFavoritesStats = (): FavoritesStats => {
  const favorites = getFavorites();
  
  const stats: FavoritesStats = {
    total: favorites.length,
    byType: {
      video: favorites.filter(f => f.type === 'video').length,
      gallery: favorites.filter(f => f.type === 'gallery').length,
      model: favorites.filter(f => f.type === 'model').length
    },
    recent: favorites
      .sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime())
      .slice(0, 5),
    topRated: favorites
      .filter(f => f.rating && f.rating > 0)
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 5),
    mostViewed: favorites
      .filter(f => f.viewCount && f.viewCount > 0)
      .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
      .slice(0, 5)
  };

  return stats;
};

export const addToFavorites = (item: {
  id: string;
  type: 'video' | 'gallery' | 'model';
  title?: string;
  name?: string;
  image: string;
  category?: string;
  keywords?: string[];
  rating?: number;
}): boolean => {
  if (typeof window === 'undefined') return false;

  try {
    const favorites = getFavorites();
    const existingIndex = favorites.findIndex(fav => fav.id === item.id && fav.type === item.type);

    if (existingIndex === -1) {
      const favoriteItem: FavoriteItem = {
        id: item.id,
        type: item.type,
        title: item.title || item.name || 'Untitled',
        image: item.image,
        addedAt: new Date().toISOString(),
        category: item.category,
        tags: item.keywords || [],
        viewCount: 0,
        rating: item.rating || 0,
        notes: ''
      };

      const updatedFavorites = [favoriteItem, ...favorites].slice(0, 1000); // Limit to 1000 items
      localStorage.setItem('luxury_favorites', JSON.stringify(updatedFavorites));

      // Save favorites summary for quick access
      const summary = updatedFavorites.map(f => ({ 
        id: f.id, 
        type: f.type, 
        addedAt: f.addedAt,
        rating: f.rating 
      }));
      localStorage.setItem('luxury_favorites_summary', JSON.stringify(summary));

      // Update stats
      updateFavoritesStats();

      return true;
    }

    return false;
  } catch (error) {
    console.error('Error adding to favorites:', error);
    return false;
  }
};

export const updateFavoriteItem = (id: string, type: 'video' | 'gallery' | 'model', updates: Partial<FavoriteItem>): boolean => {
  if (typeof window === 'undefined') return false;

  try {
    const favorites = getFavorites();
    const itemIndex = favorites.findIndex(fav => fav.id === id && fav.type === type);

    if (itemIndex !== -1) {
      favorites[itemIndex] = { ...favorites[itemIndex], ...updates };
      localStorage.setItem('luxury_favorites', JSON.stringify(favorites));

      // Update summary
      const summary = favorites.map(f => ({ 
        id: f.id, 
        type: f.type, 
        addedAt: f.addedAt,
        rating: f.rating 
      }));
      localStorage.setItem('luxury_favorites_summary', JSON.stringify(summary));

      return true;
    }

    return false;
  } catch (error) {
    console.error('Error updating favorite:', error);
    return false;
  }
};

export const incrementViewCount = (id: string, type: 'video' | 'gallery' | 'model'): void => {
  const favorites = getFavorites();
  const item = favorites.find(fav => fav.id === id && fav.type === type);
  
  if (item) {
    updateFavoriteItem(id, type, {
      viewCount: (item.viewCount || 0) + 1,
      lastViewed: new Date().toISOString()
    });
  }
};

export const rateFavorite = (id: string, type: 'video' | 'gallery' | 'model', rating: number): boolean => {
  if (rating < 1 || rating > 5) return false;
  return updateFavoriteItem(id, type, { rating });
};

export const addFavoriteNote = (id: string, type: 'video' | 'gallery' | 'model', note: string): boolean => {
  return updateFavoriteItem(id, type, { notes: note });
};

export const removeFromFavorites = (contentId: string, type?: 'video' | 'gallery' | 'model'): boolean => {
  if (typeof window === 'undefined') return false;

  try {
    const favorites = getFavorites();
    const updatedFavorites = favorites.filter(fav => 
      !(fav.id === contentId && (!type || fav.type === type))
    );

    if (updatedFavorites.length !== favorites.length) {
      localStorage.setItem('luxury_favorites', JSON.stringify(updatedFavorites));

      // Update summary
      const summary = updatedFavorites.map(f => ({ 
        id: f.id, 
        type: f.type, 
        addedAt: f.addedAt,
        rating: f.rating 
      }));
      localStorage.setItem('luxury_favorites_summary', JSON.stringify(summary));

      // Update stats
      updateFavoritesStats();

      return true;
    }

    return false;
  } catch (error) {
    console.error('Error removing from favorites:', error);
    return false;
  }
};

export const isFavorite = (contentId: string, type?: 'video' | 'gallery' | 'model'): boolean => {
  if (typeof window === 'undefined') return false;

  try {
    // Use summary for quick lookup
    const summary = localStorage.getItem('luxury_favorites_summary');
    if (summary) {
      const parsed = JSON.parse(summary);
      return parsed.some((fav: any) => 
        fav.id === contentId && (!type || fav.type === type)
      );
    }

    // Fallback to full favorites
    const favorites = getFavorites();
    return favorites.some(fav => 
      fav.id === contentId && (!type || fav.type === type)
    );
  } catch (error) {
    console.error('Error checking favorites:', error);
    return false;
  }
};

export const getFavoritesByType = (type: 'video' | 'gallery' | 'model'): FavoriteItem[] => {
  return getFavorites().filter(fav => fav.type === type);
};

export const searchFavorites = (query: string, type?: 'video' | 'gallery' | 'model'): FavoriteItem[] => {
  const favorites = getFavorites();
  const queryLower = query.toLowerCase();

  return favorites.filter(fav => {
    if (type && fav.type !== type) return false;
    
    return (
      fav.title.toLowerCase().includes(queryLower) ||
      (fav.tags && fav.tags.some(tag => tag.toLowerCase().includes(queryLower))) ||
      (fav.category && fav.category.toLowerCase().includes(queryLower)) ||
      (fav.notes && fav.notes.toLowerCase().includes(queryLower))
    );
  });
};

export const getFavoritesByRating = (minRating: number): FavoriteItem[] => {
  return getFavorites()
    .filter(fav => fav.rating && fav.rating >= minRating)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0));
};

export const getFavoritesCount = (): number => {
  try {
    const summary = localStorage.getItem('luxury_favorites_summary');
    if (summary) {
      return JSON.parse(summary).length;
    }
    return getFavorites().length;
  } catch {
    return 0;
  }
};

export const clearFavorites = (): void => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem('luxury_favorites');
    localStorage.removeItem('luxury_favorites_summary');
    localStorage.removeItem('luxury_favorites_stats');
  } catch (error) {
    console.error('Error clearing favorites:', error);
  }
};

export const exportFavorites = (): string => {
  const favorites = getFavorites();
  const stats = getFavoritesStats();
  
  return JSON.stringify({
    exportDate: new Date().toISOString(),
    version: '2.0',
    favorites,
    stats
  }, null, 2);
};

export const importFavorites = (jsonData: string): boolean => {
  if (typeof window === 'undefined') return false;

  try {
    const data = JSON.parse(jsonData);
    
    if (data.favorites && Array.isArray(data.favorites)) {
      localStorage.setItem('luxury_favorites', JSON.stringify(data.favorites));
      
      // Rebuild summary
      const summary = data.favorites.map((f: FavoriteItem) => ({ 
        id: f.id, 
        type: f.type, 
        addedAt: f.addedAt,
        rating: f.rating 
      }));
      localStorage.setItem('luxury_favorites_summary', JSON.stringify(summary));
      
      updateFavoritesStats();
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error importing favorites:', error);
    return false;
  }
};

// Internal function to update stats
function updateFavoritesStats(): void {
  if (typeof window === 'undefined') return;

  try {
    const stats = getFavoritesStats();
    localStorage.setItem('luxury_favorites_stats', JSON.stringify(stats));
  } catch (error) {
    console.error('Error updating favorites stats:', error);
  }
}

// Legacy function for backward compatibility
export const getFavoritesLegacy = (): string[] => {
  const favorites = getFavorites();
  return favorites.map(fav => fav.id);
};

// Initialize on first load
initializeLocalStorage();