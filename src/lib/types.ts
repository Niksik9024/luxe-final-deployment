

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
    status: 'Active' | 'Inactive';
    isFeatured?: boolean;
    stats?: {
        videos: number;
        galleries: number;
        likes: number;
    };
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

export interface Video {
    id: string;
    title: string;
    description: string;
    url?: string;
    videoUrl?: string;
    thumbnail?: string;
    image?: string;
    duration?: string;
    modelId?: string;
    models?: string[];
    status: 'Published' | 'Draft';
    isFeatured?: boolean;
    tags: string[];
    keywords?: string[];
    date: string;
    category?: string;
    resolution?: string;
    fileSize?: string;
}

export interface Gallery {
    id: string;
    title: string;
    description: string;
    images: Array<{
        url: string;
        alt: string;
    }>;
    modelId?: string;
    models?: string[];
    status: 'Published' | 'Draft';
    tags: string[];
    keywords?: string[];
    date: string;
    category?: string;
    resolution?: string;
}

export interface Photo {
    id: string;
    image: string;
    title: string;
    galleryId: string;
    galleryTitle: string;
}
