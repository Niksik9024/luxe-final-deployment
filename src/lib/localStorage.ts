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

// Initialize on first load
initializeLocalStorage();