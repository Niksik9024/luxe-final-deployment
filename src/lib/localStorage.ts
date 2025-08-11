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

export const getUsers = (): User[] => {
  if (typeof window === 'undefined') return [];
  try {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
  } catch (error) {
    console.error('Error parsing users from localStorage:', error);
    return [];
  }
};
export const setUsers = (users: User[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('users', JSON.stringify(users));
  } catch (error) {
    console.error('Error saving users to localStorage:', error);
  }
};
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

    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Error loading favorites:', error);
    return [];
  }
};

export const addToFavorites = (item: {
  id: string;
  type: 'video' | 'gallery' | 'model';
  title?: string;
  name?: string;
  image: string;
  category?: string;
  keywords?: string[];
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
        tags: item.keywords || []
      };

      const updatedFavorites = [favoriteItem, ...favorites].slice(0, 1000); // Limit to 1000 items
      localStorage.setItem('luxury_favorites', JSON.stringify(updatedFavorites));

      // Save favorites summary for quick access
      const summary = updatedFavorites.map(f => ({ id: f.id, type: f.type }));
      localStorage.setItem('luxury_favorites_summary', JSON.stringify(summary));

      return true;
    }

    return false;
  } catch (error) {
    console.error('Error adding to favorites:', error);
    return false;
  }
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
      const summary = updatedFavorites.map(f => ({ id: f.id, type: f.type }));
      localStorage.setItem('luxury_favorites_summary', JSON.stringify(summary));

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
  } catch (error) {
    console.error('Error clearing favorites:', error);
  }
};

// CRUD Functions for Galleries
export const addGallery = (gallery: Gallery): void => {
  const galleries = getGalleries();
  const updatedGalleries = [...galleries, { ...gallery, id: gallery.id || Date.now().toString() }];
  setGalleries(updatedGalleries);
};

export const updateGallery = (id: string, updates: Partial<Gallery>): void => {
  const galleries = getGalleries();
  const updatedGalleries = galleries.map(gallery => 
    gallery.id === id ? { ...gallery, ...updates } : gallery
  );
  setGalleries(updatedGalleries);
};

export const deleteGallery = (id: string): void => {
  const galleries = getGalleries();
  const updatedGalleries = galleries.filter(gallery => gallery.id !== id);
  setGalleries(updatedGalleries);
};

// CRUD Functions for Videos
export const addVideo = (video: Video): void => {
  const videos = getVideos();
  const updatedVideos = [...videos, { ...video, id: video.id || Date.now().toString() }];
  setVideos(updatedVideos);
};

export const updateVideo = (id: string, updates: Partial<Video>): void => {
  const videos = getVideos();
  const updatedVideos = videos.map(video => 
    video.id === id ? { ...video, ...updates } : video
  );
  setVideos(updatedVideos);
};

export const deleteVideo = (id: string): void => {
  const videos = getVideos();
  const updatedVideos = videos.filter(video => video.id !== id);
  setVideos(updatedVideos);
};

// CRUD Functions for Models
export const addModel = (model: Model): void => {
  const models = getModels();
  const updatedModels = [...models, { ...model, id: model.id || Date.now().toString() }];
  setModels(updatedModels);
};

export const updateModel = (id: string, updates: Partial<Model>): void => {
  const models = getModels();
  const updatedModels = models.map(model => 
    model.id === id ? { ...model, ...updates } : model
  );
  setModels(updatedModels);
};

export const deleteModel = (id: string): void => {
  const models = getModels();
  const updatedModels = models.filter(model => model.id !== id);
  setModels(updatedModels);
};

// Legacy function for backward compatibility
export const getFavoritesLegacy = (): string[] => {
  const favorites = getFavorites();
  return favorites.map(fav => fav.id);
};

// CRUD Functions with proper return types for testing
export const createVideo = (videoData: Omit<Video, 'id'>): Video => {
  const newVideo: Video = {
    ...videoData,
    id: Date.now().toString()
  };
  addVideo(newVideo);
  return newVideo;
};

export const createGallery = (galleryData: Omit<Gallery, 'id'>): Gallery => {
  const newGallery: Gallery = {
    ...galleryData,
    id: Date.now().toString()
  };
  addGallery(newGallery);
  return newGallery;
};

export const createModel = (modelData: Omit<Model, 'id'>): Model => {
  const newModel: Model = {
    ...modelData,
    id: Date.now().toString()
  };
  addModel(newModel);
  return newModel;
};

export const updateVideoFunc = (id: string, updates: Partial<Video>): Video | null => {
  const videos = getVideos();
  const videoIndex = videos.findIndex(v => v.id === id);
  if (videoIndex === -1) return null;
  
  const updatedVideo = { ...videos[videoIndex], ...updates };
  videos[videoIndex] = updatedVideo;
  setVideos(videos);
  return updatedVideo;
};

export const updateGalleryFunc = (id: string, updates: Partial<Gallery>): Gallery | null => {
  const galleries = getGalleries();
  const galleryIndex = galleries.findIndex(g => g.id === id);
  if (galleryIndex === -1) return null;
  
  const updatedGallery = { ...galleries[galleryIndex], ...updates };
  galleries[galleryIndex] = updatedGallery;
  setGalleries(galleries);
  return updatedGallery;
};

export const updateModelFunc = (id: string, updates: Partial<Model>): Model | null => {
  const models = getModels();
  const modelIndex = models.findIndex(m => m.id === id);
  if (modelIndex === -1) return null;
  
  const updatedModel = { ...models[modelIndex], ...updates };
  models[modelIndex] = updatedModel;
  setModels(models);
  return updatedModel;
};

export const deleteVideoFunc = (id: string): boolean => {
  const videos = getVideos();
  const filteredVideos = videos.filter(v => v.id !== id);
  if (filteredVideos.length === videos.length) return false;
  
  setVideos(filteredVideos);
  return true;
};

export const deleteGalleryFunc = (id: string): boolean => {
  const galleries = getGalleries();
  const filteredGalleries = galleries.filter(g => g.id !== id);
  if (filteredGalleries.length === galleries.length) return false;
  
  setGalleries(filteredGalleries);
  return true;
};

export const deleteModelFunc = (id: string): boolean => {
  const models = getModels();
  const filteredModels = models.filter(m => m.id !== id);
  if (filteredModels.length === models.length) return false;
  
  setModels(filteredModels);
  return true;
};

// Initialize on first load
initializeLocalStorage();