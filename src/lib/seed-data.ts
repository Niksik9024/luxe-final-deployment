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
    { id: 'model_8', name: 'Katrina', image: 'https://images.unsplash.com/photo-1552695845-8a7231260780?q=80&w=800&h=1200&auto=format&fit=crop', description: "Katrina possesses a powerful presence on both print and runway.", instagram: 'katrina_storm', twitter: 'katrina_storm', height: "5'10\"", bust: "33C", waist: "24\"", hips: "35\"", famousFor: "Campaigns for luxury watch and jewelry brands." },
    { id: 'model_9', name: 'Lia', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&h=1200&auto=format&fit=crop', description: "Lia's portfolio is a mix of high-fashion and athletic brands.", instagram: 'lia_flex', twitter: 'lia_flex', height: "5'8\"", bust: "32B", waist: "23\"", hips: "34\"", famousFor: "Global campaigns for major sportswear brands." },
    { id: 'model_10', name: 'Amelia', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd72995a?q=80&w=800&h=1200&auto=format&fit=crop', description: "Amelia's striking look has made her a regular in haute couture.", instagram: 'amelia_couture', twitter: 'amelia_couture', height: "5'11\"", bust: "32A", waist: "22\"", hips: "33\"", famousFor: "Walking for exclusive, high-fashion runway shows." },
];

const allTags = ['fashion', 'portrait', 'editorial', 'studio', 'outdoor', 'black & white', 'cinematic', 'lifestyle', 'art', 'urban'];

const videos: Video[] = [
    { id: `video_1`, title: `Monochrome Dreams`, description: `An artistic exploration of light and shadow in high fashion.`, image: `https://images.unsplash.com/photo-1587502537104-605039215763?q=80&w=1280&h=720&auto=format&fit=crop`, videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', models: [models[0].name], tags: ['fashion', 'cinematic', 'black & white'], keywords: [`monochrome`, `dreams`, models[0].name.toLowerCase()], date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), status: 'Published', isFeatured: true, },
    { id: `video_2`, title: `Urban Canvas`, description: `The city streets become a runway in this dynamic fashion film.`, image: `https://images.unsplash.com/photo-1505692952047-4a6931de4575?q=80&w=1280&h=720&auto=format&fit=crop`, videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', models: [models[1].name, models[2].name], tags: ['fashion', 'urban', 'lifestyle'], keywords: [`urban`, `canvas`, models[1].name.toLowerCase(), models[2].name.toLowerCase()], date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), status: 'Published', isFeatured: true, },
    { id: `video_3`, title: `Desert Bloom`, description: `A stunning visual narrative set against the stark beauty of the desert.`, image: `https://images.unsplash.com/photo-1542359649-31e03cdde433?q=80&w=1280&h=720&auto=format&fit=crop`, videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', models: [models[3].name], tags: ['fashion', 'outdoor', 'cinematic'], keywords: [`desert`, `bloom`, models[3].name.toLowerCase()], date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), status: 'Published', isFeatured: true, },
    { id: `video_4`, title: `Studio Noir`, description: `A classic, elegant studio shoot with a modern twist.`, image: `https://images.unsplash.com/photo-1615143599598-0d17b6863491?q=80&w=1280&h=720&auto=format&fit=crop`, videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', models: [models[4].name], tags: ['studio', 'portrait', 'black & white'], keywords: [`studio`, `noir`, models[4].name.toLowerCase()], date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), status: 'Published', isFeatured: false, },
    { id: `video_5`, title: `Coastal Elegance`, description: `The ocean provides a breathtaking backdrop for this high-fashion piece.`, image: `https://images.unsplash.com/photo-1502370644558-000c2a5c5317?q=80&w=1280&h=720&auto=format&fit=crop`, videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', models: [models[5].name, models[6].name], tags: ['outdoor', 'lifestyle', 'fashion'], keywords: [`coastal`, `elegance`, models[5].name.toLowerCase(), models[6].name.toLowerCase()], date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), status: 'Published', isFeatured: false, },
    { id: `video_6`, title: `Architectural Lines`, description: `Exploring the relationship between fashion and modern architecture.`, image: `https://images.unsplash.com/photo-1488773739845-bf415c1b1625?q=80&w=1280&h=720&auto=format&fit=crop`, videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', models: [models[7].name], tags: ['urban', 'editorial', 'art'], keywords: [`architectural`, `lines`, models[7].name.toLowerCase()], date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), status: 'Published', isFeatured: false, },
    { id: `video_7`, title: `Golden Hour`, description: `A cinematic piece capturing the magic of the golden hour.`, image: `https://images.unsplash.com/photo-1587060029316-2c24cce315e1?q=80&w=1280&h=720&auto=format&fit=crop`, videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4', models: [models[8].name], tags: ['cinematic', 'outdoor', 'lifestyle'], keywords: [`golden`, `hour`, models[8].name.toLowerCase()], date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), status: 'Published', isFeatured: false, },
    { id: `video_8`, title: `Reflections`, description: `An introspective and artistic fashion film.`, image: `https://images.unsplash.com/photo-1519741494790108755-2616c0763c87?q=80&w=1280&h=720&auto=format&fit=crop`, videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4', models: [models[9].name], tags: ['art', 'portrait', 'cinematic'], keywords: [`reflections`, models[9].name.toLowerCase()], date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), status: 'Published', isFeatured: false, },
    { id: `video_9`, title: `Future Forward`, description: `A look at futuristic fashion concepts.`, image: `https://images.unsplash.com/photo-1534723328310-e82dad3ee43f?q=80&w=1280&h=720&auto=format&fit=crop`, videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4', models: [models[0].name], tags: ['editorial', 'art', 'fashion'], keywords: [`future`, `forward`, models[0].name.toLowerCase()], date: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(), status: 'Published', isFeatured: false, },
    { id: `video_10`, title: `The Getaway`, description: `A stylish narrative about a chic escape.`, image: `https://images.unsplash.com/photo-1533106418989-88406e7a82ca?q=80&w=1280&h=720&auto=format&fit=crop`, videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4', models: [models[1].name], tags: ['lifestyle', 'cinematic', 'fashion'], keywords: [`getaway`, models[1].name.toLowerCase()], date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), status: 'Published', isFeatured: false, },
    { id: `video_11`, title: `Static Charge`, description: `High energy and bold colors define this studio piece.`, image: `https://images.unsplash.com/photo-1557053910-d9eadeed1c58?q=80&w=1280&h=720&auto=format&fit=crop`, videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4', models: [models[2].name], tags: ['studio', 'fashion', 'editorial'], keywords: [`static`, `charge`, models[2].name.toLowerCase()], date: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(), status: 'Published', isFeatured: false, },
    { id: `video_12`, title: `Elegance in Motion`, description: `A graceful and fluid expression of modern dance and fashion.`, image: `https://images.unsplash.com/photo-1508849789987-4e5033412b9c?q=80&w=1280&h=720&auto=format&fit=crop`, videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4', models: [models[3].name, models[4].name], tags: ['art', 'cinematic', 'lifestyle'], keywords: [`elegance`, `motion`, models[3].name.toLowerCase(), models[4].name.toLowerCase()], date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(), status: 'Published', isFeatured: false, },
];

const galleryAlbums = [
    // Album 1: Alina - Serene Portraits
    ["https://images.unsplash.com/photo-1611601322175-804153535543?q=80&w=800&h=1200&auto=format&fit=crop", "https://images.unsplash.com/photo-1552838686-39a3ffb82d36?q=80&w=800&h=1200&auto=format&fit=crop", "https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?q=80&w=800&h=1200&auto=format&fit=crop", "https://images.unsplash.com/photo-1562572159-4efc207f5aff?q=80&w=800&h=1200&auto=format&fit=crop", "https://images.unsplash.com/photo-1589571894937-37d452361d90?q=80&w=800&h=1200&auto=format&fit=crop", "https://images.unsplash.com/photo-1533228100845-081b8b703224?q=80&w=800&h=1200&auto=format&fit=crop", "https://images.unsplash.com/photo-1581338834614-2505a0287b58?q=80&w=800&h=1200&auto=format&fit=crop", "https://images.unsplash.com/photo-1564413123594-878954753f7c?q=80&w=800&h=1200&auto=format&fit=crop", "https://images.unsplash.com/photo-1605085446056-37b189333324?q=80&w=800&h=1200&auto=format&fit=crop", "https://images.unsplash.com/photo-1528994273449-399a3c36087b?q=80&w=800&h=1200&auto=format&fit=crop"],
    // Album 2: Elena - Urban & Edgy
    ["https://images.unsplash.com/photo-1517940310602-26a3d680948e?q=80&w=800&h=1200&auto=format&fit=crop", "https://images.unsplash.com/photo-1551009175-8a68da93d5f9?q=80&w=800&h=1200&auto=format&fit=crop", "https://images.unsplash.com/photo-1584344963539-87a5c4a2b3ee?q=80&w=800&h=1200&auto=format&fit=crop", "https://images.unsplash.com/photo-1604514256697-a68f44397a6e?q=80&w=800&h=1200&auto=format&fit=crop", "https://images.unsplash.com/photo-1542103749-8ef59b94f475?q=80&w=800&h=1200&auto=format&fit=crop", "https://images.unsplash.com/photo-1522262590532-a92543d211a5?q=80&w=800&h=1200&auto=format&fit=crop", "https://images.unsplash.com/photo-1531123414780-f74242c2b052?q=80&w=800&h=1200&auto=format&fit=crop", "https://images.unsplash.com/photo-1554313861-39a10996b758?q=80&w=800&h=1200&auto=format&fit=crop", "https://images.unsplash.com/photo-1589463945468-345a8c35350b?q=80&w=800&h=1200&auto=format&fit=crop", "https://images.unsplash.com/photo-1530268729831-4b090a8c3052?q=80&w=800&h=1200&auto=format&fit=crop"],
    // Album 3: Sophia - Black & White Classics
    ["https://images.unsplash.com/photo-1565408684237-90924445c71b?q=80&w=800&h=1200&auto=format&fit=crop", "https://images.unsplash.com/photo-1555631550-93048f07755a?q=80&w=800&h=1200&auto=format&fit=crop", "https://images.unsplash.com/photo-1548248197-42f2b3113a2d?q=80&w=800&h=1200&auto=format&fit=crop", "https://images.unsplash.com/photo-1589308428206-5bf963d76b5a?q=80&w=800&h=1200&auto=format&fit=crop", "https://images.unsplash.com/photo-1612622067890-99a8b996b770?q=80&w=800&h=1200&auto=format&fit=crop", "https://images.unsplash.com/photo-1570177114338-51bab46a4829?q=80&w=800&h=1200&auto=format&fit=crop", "https://images.unsplash.com/photo-1590155291419-e483f069f449?q=80&w=800&h=1200&auto=format&fit=crop", "https://images.unsplash.com/photo-1594902123986-224a8a886d3?q=80&w=800&h=1200&auto=format&fit=crop", "https://images.unsplash.com/photo-1552058544-f2b08425535a?q=80&w=800&h=1200&auto=format&fit=crop", "https://images.unsplash.com/photo-1553531384-411a247ccd73?q=80&w=800&h=1200&auto=format&fit=crop"],
    // Album 4: Isabella - Studio Elegance
    ["https://images.unsplash.com/photo-1604681630454-c89118c1874c?q=80&w=800&h=1200&auto=format&fit=crop", "https://images.unsplash.com/photo-1588190349479-0a44229535a3?q=80&w=800&h=1200&auto=format&fit=crop", "https://images.unsplash.com/photo-1560253326-78c6421096a8?q=80&w=800&h=1200&auto=format&fit=crop", "https://images.unsplash.com/photo-1615143599598-0d17b6863491?q=80&w=800&h=1200&auto=format&fit=crop", "https://images.unsplash.com/photo-1567881223916-f3f2a58837a7?q=80&w=800&h=1200&auto=format&fit=crop", "https://images.unsplash.com/photo-1562362391-32698d212d22?q=80&w=800&h=1200&auto=format&fit=crop", "https://images.unsplash.com/photo-1588075592446-256fd1e6e76f?q=80&w=800&h=1200&auto=format&fit=crop", "https://images.unsplash.com/photo-1550985223-e4a682a4a36f?q=80&w=800&h=1200&auto=format&fit=crop", "https://images.unsplash.com/photo-1553835422-8878a3873111?q=80&w=800&h=1200&auto=format&fit=crop", "https://images.unsplash.com/photo-1611742409048-94b295c5a770?q=80&w=800&h=1200&auto=format&fit=crop"],
    // ... Add 14 more unique albums
    ...Array.from({ length: 14 }, (_, i) => [
        `https://images.unsplash.com/photo-1588190349479-0a44229535a3?q=80&w=800&h=1200&auto=format&fit=crop&seed=${i+1}`,
        `https://images.unsplash.com/photo-1611601322175-804153535543?q=80&w=800&h=1200&auto=format&fit=crop&seed=${i+2}`,
        `https://images.unsplash.com/photo-1517940310602-26a3d680948e?q=80&w=800&h=1200&auto=format&fit=crop&seed=${i+3}`,
        `https://images.unsplash.com/photo-1565408684237-90924445c71b?q=80&w=800&h=1200&auto=format&fit=crop&seed=${i+4}`,
        `https://images.unsplash.com/photo-1604681630454-c89118c1874c?q=80&w=800&h=1200&auto=format&fit=crop&seed=${i+5}`,
        `https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=800&h=1200&auto=format&fit=crop&seed=${i+6}`,
        `https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&h=1200&auto=format&fit=crop&seed=${i+7}`,
        `https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=800&h=1200&auto=format&fit=crop&seed=${i+8}`,
        `https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800&h=1200&auto=format&fit=crop&seed=${i+9}`,
        `https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=800&h=1200&auto=format&fit=crop&seed=${i+10}`
    ])
];


const galleries: Gallery[] = Array.from({ length: 18 }, (_, i) => ({
    id: `gallery_${i + 1}`,
    title: `Collection ${String.fromCharCode(65 + i)}`,
    description: `An exclusive look into Collection ${String.fromCharCode(65 + i)}, featuring stunning visuals and unique concepts.`,
    image: `https://images.unsplash.com/photo-1516205651411-aef8ea4f4d20?q=80&w=400&h=600&auto=format&fit=crop&seed=${i}`,
    album: galleryAlbums[i],
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