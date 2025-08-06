

export interface User {
    id: string;
    email: string;
    password?: string; // Optional for security, should not be sent to client
    name: string;
    image: string;
    role: 'admin' | 'user';
    favorites?: Favorite[];
}

export interface Model {
  id: string;
  name: string;
  image: string;
  description?: string;
  instagram?: string;
  twitter?: string;
  height?: string;
  bust?: string;
  waist?: string;
  hips?: string;
  famousFor?: string;
}

export type ContentStatus = 'Published' | 'Draft';
export type ContentCategory = 'fashion' | 'nature' | 'urban' | 'art' | 'cinematic' | 'lifestyle' | 'technology' | 'monochrome';


export interface BaseContent {
  id: string;
  title: string;
  description: string;
  models: string[];
  image: string;
  date: string;
  tags: string[];
  keywords: string[];
  status: ContentStatus;
  category: ContentCategory;
  resolution?: string; // e.g., "1920x1080"
}

export interface Video extends BaseContent {
  videoUrl: string;
  isFeatured?: boolean;
  duration?: number; // in seconds
  fileSize?: string; // e.g., "15MB"
}

export interface Gallery extends BaseContent {
    album: string[];
}

export interface Photo {
    id:string;
    title: string;
    image: string;
    galleryId: string;
    galleryTitle: string;
}


export interface Favorite {
    id: string;
    type: 'video' | 'gallery' | 'photo';
}

export interface HistoryItem {
    id: string;
    type: 'video';
    viewedAt?: string;
}

      