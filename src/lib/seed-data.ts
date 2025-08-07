
import type { Model, Video, Gallery, User } from './types';

const generateId = () => Math.random().toString(36).substr(2, 9);

const models: Model[] = [
    { id: 'model_1', name: 'Alina', image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=800&h=1200&auto=format&fit=crop', description: "Alina's ethereal look has graced the covers of numerous international fashion magazines.", instagram: 'alina_official', twitter: 'alina_official', height: "5'11\"", bust: "32B", waist: "23\"", hips: "34\"", famousFor: "Known for her piercing gaze and runway walk for Chanel." },
    { id: 'model_2', name: 'Elena', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&h=1200&auto=format&fit=crop', description: "A versatile model known for both commercial and high-fashion work.", instagram: 'elena_the_model', twitter: 'elena_the_model', height: "5'9\"", bust: "34C", waist: "25\"", hips: "36\"", famousFor: "Face of a major global beauty campaign for two consecutive years." },
    { id: 'model_3', name: 'Sophia', image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=800&h=1200&auto=format&fit=crop', description: "Sophia brings a classic, timeless beauty to every project.", instagram: 'sophia_grace', twitter: 'sophia_grace', height: "5'10\"", bust: "33B", waist: "24\"", hips: "35\"", famousFor: "Lead model in a critically acclaimed art-house fashion film." },
    { id: 'model_4', name: 'Isabella', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800&h=1200&auto=format&fit=crop', description: "Isabella's strong features make her a favorite for editorial shoots.", instagram: 'isabella_j', twitter: 'isabella_j', height: "6'0\"", bust: "34A", waist: "24\"", hips: "35\"", famousFor: "Iconic editorial in Vogue Italia." },
    { id: 'model_5', name: 'Mia', image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=800&h=1200&auto=format&fit=crop', description: "Mia's energetic and vibrant personality shines through in her work.", instagram: 'mia_muse', twitter: 'mia_muse', height: "5'8\"", bust: "32C", waist: "24\"", hips: "34\"", famousFor: "Viral social media presence and high-fashion collaborations." },
    { id: 'model_6', name: 'Chloe', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&h=1200&auto=format&fit=crop', description: "Chloe is celebrated for her unique look and artistic collaborations.", instagram: 'chloe_art', twitter: 'chloe_art', height: "5'9\"", bust: "32A", waist: "23\"", hips: "33\"", famousFor: "Muse for several avant-garde designers." },
    { id: 'model_7', name: 'Nadia', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=800&h=1200&auto=format&fit=crop', description: "Nadia's professionalism and adaptability make her a sought-after talent.", instagram: 'nadia_official', twitter: 'nadia_official', height: "5'11\"", bust: "34B", waist: "25\"", hips: "36\"", famousFor: "Opening and closing multiple shows during Paris Fashion Week." },
    { id: 'model_8', name: 'Katrina', image: 'https://images.unsplash.com/photo-1552695845-4c514b87532b?q=80&w=800&h=1200&auto=format&fit=crop', description: "Katrina possesses a powerful presence on both print and runway.", instagram: 'katrina_storm', twitter: 'katrina_storm', height: "5'10\"", bust: "33C", waist: "24\"", hips: "35\"", famousFor: "Campaigns for luxury watch and jewelry brands." },
    { id: 'model_9', name: 'Lia', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&h=1200&auto=format&fit=crop', description: "Lia's portfolio is a mix of high-fashion and athletic brands.", instagram: 'lia_flex', twitter: 'lia_flex', height: "5'8\"", bust: "32B", waist: "23\"", hips: "34\"", famousFor: "Global campaigns for major sportswear brands." },
    { id: 'model_10', name: 'Amelia', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&h=1200&auto=format&fit=crop', description: "Amelia's striking look has made her a regular in haute couture.", instagram: 'amelia_couture', twitter: 'amelia_couture', height: "5'11\"", bust: "32A", waist: "22\"", hips: "33\"", famousFor: "Walking for exclusive, high-fashion runway shows." },
];

const allTags = ['fashion', 'portrait', 'editorial', 'studio', 'outdoor', 'black & white', 'cinematic', 'lifestyle', 'art', 'urban'];

const videos: Video[] = Array.from({ length: 12 }, (_, i) => ({
    id: `video_${i + 1}`,
    title: `Cinematic Scene ${i + 1}`,
    description: `A beautifully shot cinematic scene featuring our top models. This video showcases the latest trends in fashion.`,
    image: `https://images.unsplash.com/photo-1505692952047-4a6931de4575?q=80&w=1280&h=720&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`,
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
    image: `https://images.unsplash.com/photo-1516205651411-aef8ea4f4d20?q=80&w=400&h=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`,
    album: Array.from({ length: 10 }, (_, j) => `https://images.unsplash.com/photo-1588190349479-0a44229535a3?q=80&w=800&h=1200&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?${j}`),
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
        password: 'password', 
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&h=100&auto=format&fit=crop',
        role: 'admin',
        favorites: [],
        watchHistory: [],
    },
    {
        id: 'normal_user',
        name: 'Normal User',
        email: 'user@example.com',
        password: 'password',
        image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&h=100&auto=format&fit=crop',
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
