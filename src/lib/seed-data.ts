
import type { Model, Video, Gallery, User } from './types';

const generateId = () => Math.random().toString(36).substr(2, 9);

const models: Model[] = Array.from({ length: 10 }, (_, i) => ({
    id: `model_${i + 1}`,
    name: `Model ${i + 1}`,
    image: `https://placehold.co/400x600.png?text=Model+${i+1}`,
    description: `This is a short bio for Model ${i+1}. They are known for their stunning looks and professional work ethic.`,
    instagram: `model${i+1}`,
    twitter: `model${i+1}`,
    height: "5'10\"",
    bust: "34B",
    waist: "24\"",
    hips: "35\"",
    famousFor: `Featured in several international magazines and runway shows.`,
}));

const allTags = ['fashion', 'portrait', 'editorial', 'studio', 'outdoor', 'black & white', 'cinematic', 'lifestyle', 'art', 'urban'];

const videos: Video[] = Array.from({ length: 12 }, (_, i) => ({
    id: `video_${i + 1}`,
    title: `Cinematic Scene ${i + 1}`,
    description: `A beautifully shot cinematic scene featuring our top models. This video showcases the latest trends in fashion.`,
    image: `https://placehold.co/1280x720.png?text=Scene+${i+1}`,
    videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    models: [models[i % models.length].name, models[(i + 1) % models.length].name],
    tags: [allTags[i % allTags.length], allTags[(i + 2) % allTags.length]],
    keywords: [`scene ${i+1}`, models[i % models.length].name.toLowerCase(), allTags[i % allTags.length]],
    date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Published',
    isFeatured: i < 3,
}));

const galleries: Gallery[] = Array.from({ length: 18 }, (_, i) => ({
    id: `gallery_${i + 1}`,
    title: `Photo Gallery ${i + 1}`,
    description: `An exclusive photo gallery from a recent shoot.`,
    image: `https://placehold.co/400x600.png?text=Gallery+${i+1}`,
    album: Array.from({ length: 10 }, (_, j) => `https://placehold.co/800x1200.png?text=Photo+${j+1}`),
    models: [models[i % models.length].name],
    tags: [allTags[i % allTags.length], allTags[(i + 3) % allTags.length]],
    keywords: [`gallery ${i+1}`, models[i % models.length].name.toLowerCase(), allTags[i % allTags.length]],
    date: new Date(Date.now() - i * 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Published',
}));

const users: User[] = [
    {
        id: 'admin_user',
        name: 'Admin User',
        email: 'admin@example.com',
        // Note: In a real app, never store plain text passwords. This is for demo purposes.
        // For local storage auth, we'll just check against this.
        password: 'password', 
        image: 'https://placehold.co/100x100.png?text=Admin',
        role: 'admin',
        favorites: [],
        watchHistory: [],
    },
    {
        id: 'normal_user',
        name: 'Normal User',
        email: 'user@example.com',
        password: 'password',
        image: 'https://placehold.co/100x100.png?text=User',
        role: 'user',
        favorites: [],
        watchHistory: [],
    }
];

const tags: Record<string, number> = {};
videos.forEach(v => v.tags.forEach(tag => { tags[tag] = (tags[tag] || 0) + 1; }));
galleries.forEach(g => g.tags.forEach(tag => { tags[tag] = (tags[tag] || 0) + 1; }));


export const seedData = {
    models,
    videos,
    galleries,
    users,
    tags,
};
