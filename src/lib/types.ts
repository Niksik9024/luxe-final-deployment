

export interface Favorite {
    id: string;
    type: 'video' | 'gallery' | 'photo';
}

export interface HistoryItem extends Favorite {
    type: 'video';
    viewedAt: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    password?: string; // Only for local storage simulation
    image: string;
    role: 'user' | 'admin';
    favorites: Favorite[];
    watchHistory?: HistoryItem[];
}

export interface Model {
    id: string;
    name: string;
    image: string;
    description: string;
    instagram?: string;
    twitter?: string;
    height?: string;
    bust?: string;
    waist?: string;
    hips?: string;
    famousFor?: string;
}

export interface BaseContent {
    id: string;
    title: string;
    description: string;
    image: string;
    models: string[];
    tags: string[];
    keywords: string[];
    date: string;
    status: 'Published' | 'Draft';
}

export interface Video extends BaseContent {
    videoUrl: string;
    isFeatured?: boolean;
    duration?: number;
    resolution?: string;
    fileSize?: string;
    category?: string;
}

export interface Gallery extends BaseContent {
    album: string[];
    resolution?: string;
    category?: string;
}

export interface Photo {
    id: string;
    image: string;
    title: string;
    galleryId: string;
    galleryTitle: string;
}
