
'use server';
/**
 * @fileOverview A utility flow to seed the Firestore database with sample content.
 * This should be run only once to populate the application with initial data.
 *
 * - seedDatabase - The main function to execute the seeding process.
 */

import { ai } from '@/ai/genkit';
import { adminDb } from '@/lib/firebase-admin';
import { z } from 'genkit';
import type { ContentCategory } from '@/lib/types'

const SeedDatabaseOutputSchema = z.object({
    success: z.boolean(),
    message: z.string(),
});

export type SeedDatabaseOutput = z.infer<typeof SeedDatabaseOutputSchema>;

export async function seedDatabase(): Promise<SeedDatabaseOutput> {
    return seedDatabaseFlow(null);
}

const seedDatabaseFlow = ai.defineFlow(
    {
        name: 'seedDatabaseFlow',
        inputSchema: z.null(),
        outputSchema: SeedDatabaseOutputSchema,
    },
    async () => {
        try {
            const batch = adminDb.batch();

            // Seed Models
            const models = [
                { name: 'Aurora Celeste', image: 'https://images.unsplash.com/photo-1596421256372-9518342d992a?w=400&h=600&fit=crop', description: 'Known for her ethereal runway presence and captivating editorial shoots.', famousFor: 'Vogue Arabia cover, face of a major perfume campaign.', height: "5'11\"", bust: '32B', waist: '24"', hips: '34"' },
                { name: 'Jasper Knight', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=600&fit=crop', description: 'A chiseled physique and intense gaze define his powerful look.', famousFor: 'Men\'s Health cover, leading role in a luxury watch advertisement.', height: "6'2\"", bust: '40"', waist: '31"', hips: '38"' },
                { name: 'Seraphina Moon', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop', description: 'Brings a unique and artistic flair to high-fashion campaigns.', famousFor: 'Avant-garde runway shows in Paris, collaborations with indie designers.', height: "5'9\"", bust: '33A', waist: '25"', hips: '35"' },
                { name: 'Orion Blackwood', image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=600&fit=crop', description: 'Exudes a timeless, classic charm with a modern edge.', famousFor: 'Face of a luxury suiting brand, prominent in international fashion weeks.', height: "6'1\"", bust: '39"', waist: '30"', hips: '37"' },
                { name: 'Luna Belle', image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=600&fit=crop', description: 'A versatile model known for her expressive features and commercial appeal.', famousFor: 'Numerous global beauty campaigns, frequent appearances in lifestyle magazines.', height: "5'10\"", bust: '34C', waist: '26"', hips: '36"' },
                { name: 'Kaius Sterling', image: 'https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?w=400&h=600&fit=crop', description: 'A sought-after model for his athletic build and effortless cool.', famousFor: 'Leading sportswear campaigns, fitness and wellness editorials.', height: "6'3\"", bust: '42"', waist: '32"', hips: '39"' },
                { name: 'Elara Vance', image: 'https://images.unsplash.com/photo-1516726817505-f5ed825624d8?w=400&h=600&fit=crop', description: 'Her striking features have made her a favorite among high-fashion photographers.', famousFor: 'Exclusive runway contract with a top Italian designer, iconic black-and-white portraits.', height: "5'11.5\"", bust: '32A', waist: '23"', hips: '34.5"' },
                { name: 'Caspian Duke', image: 'https://images.unsplash.com/photo-1581803118522-7b72a50f7e9f?w=400&h=600&fit=crop', description: 'Represents a new generation of male models blending classic and contemporary styles.', famousFor: 'Viral social media campaigns, face of a popular fragrance.', height: "6'0\"", bust: '38"', waist: '29"', hips: '36"' },
                { name: 'Athena Evergreen', image: 'https://images.unsplash.com/photo-1589466725882-627c226ac861?w=400&h=600&fit=crop', description: 'A powerful presence on the runway, known for her strong walk and versatility.', famousFor: 'Opening and closing major shows in New York, London, Milan, and Paris.', height: "6'0\"", bust: '34B', waist: '25"', hips: '35"' },
                { name: 'Rexford "Rex" Cole', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop', description: 'Brings a rugged yet sophisticated look to every campaign he fronts.', famousFor: 'Luxury automotive ads, high-end denim campaigns.', height: "6'2\"", bust: '41"', waist: '32"', hips: '38"' },
            ];
            models.forEach(model => {
                const docRef = adminDb.collection('models').doc();
                batch.set(docRef, model);
            });

            const modelNames = models.map(m => m.name);

            // Seed Videos
            const videos = [
                { title: 'Neon Dreams', description: 'A journey through a rain-slicked, neon-lit city.', models: [modelNames[0], modelNames[1]], image: 'https://images.unsplash.com/photo-1534439839163-74a8a38523a0?w=1280&h=720&fit=crop', videoUrl: 'https://videos.pexels.com/video-files/3209828/3209828-hd_1920_1080_25fps.mp4', category: 'urban' as ContentCategory, duration: 25, resolution: '1920x1080', fileSize: '18MB' },
                { title: 'Desert Mirage', description: 'Finding beauty in the stark, expansive landscapes of the desert.', models: [modelNames[2]], image: 'https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?w=1280&h=720&fit=crop', videoUrl: 'https://videos.pexels.com/video-files/4434246/4434246-hd_1920_1080_25fps.mp4', category: 'nature' as ContentCategory, duration: 15, resolution: '1920x1080', fileSize: '12MB'  },
                { title: 'Ocean\'s Breath', description: 'The power and serenity of the ocean waves.', models: [modelNames[3], modelNames[4]], image: 'https://images.unsplash.com/photo-1502759683299-cdcd6974244f?w=1280&h=720&fit=crop', videoUrl: 'https://videos.pexels.com/video-files/853828/853828-hd_1920_1080_25fps.mp4', category: 'nature' as ContentCategory, duration: 32, resolution: '1920x1080', fileSize: '22MB'  },
                { title: 'Forest Whispers', description: 'A story told in dappled light, deep within an ancient forest.', models: [modelNames[5]], image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1280&h=720&fit=crop', videoUrl: 'https://videos.pexels.com/video-files/4782823/4782823-hd_1920_1080_30fps.mp4', category: 'nature' as ContentCategory, duration: 28, resolution: '1920x1080', fileSize: '20MB'  },
                { title: 'Urban Canvas', description: 'The city as a playground of architecture and movement.', models: [modelNames[6], modelNames[7]], image: 'https://images.unsplash.com/photo-1479839672679-a46483c0f748?w=1280&h=720&fit=crop', videoUrl: 'https://videos.pexels.com/video-files/5493250/5493250-hd_1920_1080_24fps.mp4', category: 'urban' as ContentCategory, duration: 18, resolution: '1920x1080', fileSize: '14MB'  },
                { title: 'Golden Hour', description: 'Chasing the last light of day in a field of gold.', models: [modelNames[8]], image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1280&h=720&fit=crop', videoUrl: 'https://videos.pexels.com/video-files/2853225/2853225-hd_1920_1080_25fps.mp4', category: 'nature' as ContentCategory, duration: 21, resolution: '1920x1080', fileSize: '16MB'  },
                { title: 'Monochrome Mood', description: 'A study in shadow and light, form and texture.', models: [modelNames[9], modelNames[0]], image: 'https://images.unsplash.com/photo-1536423324639-2a9a5a2f5899?w=1280&h=720&fit=crop', videoUrl: 'https://videos.pexels.com/video-files/855321/855321-hd_1920_1080_25fps.mp4', category: 'monochrome' as ContentCategory, duration: 10, resolution: '1920x1080', fileSize: '9MB'  },
                { title: 'Crimson Peak', description: 'A dramatic tale set against a mountainous backdrop.', models: [modelNames[1]], image: 'https://images.unsplash.com/photo-1587593208589-91880c588a4c?w=1280&h=720&fit=crop', videoUrl: 'https://videos.pexels.com/video-files/5688584/5688584-hd_1920_1080_25fps.mp4', category: 'nature' as ContentCategory, duration: 35, resolution: '1920x1080', fileSize: '25MB'  },
                { title: 'Static Flow', description: 'Exploring the beauty in stillness and subtle motion.', models: [modelNames[2], modelNames[3]], image: 'https://images.unsplash.com/photo-1491841550275-5b462bf41751?w=1280&h=720&fit=crop', videoUrl: 'https://videos.pexels.com/video-files/4059008/4059008-hd_1920_1080_25fps.mp4', category: 'art' as ContentCategory, duration: 12, resolution: '1920x1080', fileSize: '11MB'  },
                { title: 'Electric Pulse', description: 'A high-energy visual experience with dynamic editing.', models: [modelNames[4], modelNames[5], modelNames[6]], image: 'https://images.unsplash.com/photo-1554147090-e1221a04a025?w=1280&h=720&fit=crop', videoUrl: 'https://videos.pexels.com/video-files/3196887/3196887-hd_1920_1080_25fps.mp4', category: 'art' as ContentCategory, duration: 20, resolution: '1920x1080', fileSize: '15MB'  },
            ];

            const videoTags = ['cinematic', 'moody', 'fashion', 'editorial', 'experimental'];
            videos.forEach((video, index) => {
                const docRef = adminDb.collection('videos').doc();
                const tags = [videoTags[index % videoTags.length], videoTags[(index + 1) % videoTags.length]];
                batch.set(docRef, {
                    ...video,
                    isFeatured: index === 0,
                    status: 'Published',
                    date: new Date(Date.now() - index * 24 * 60 * 60 * 1000).toISOString(),
                    tags,
                    keywords: [
                        ...video.title.toLowerCase().split(' '),
                        ...video.models.map(m => m.toLowerCase()),
                        ...tags,
                        video.category,
                    ]
                });
            });

            // Seed Galleries
            const galleries = [
                { title: 'Porcelain & Ivy', description: 'Juxtaposing delicate features with raw nature.', models: [modelNames[0]], category: 'fashion' as ContentCategory },
                { title: 'Architectural Lines', description: 'Exploring the human form against stark, modern architecture.', models: [modelNames[1], modelNames[2]], category: 'urban' as ContentCategory },
                { title: 'Midnight Garden', description: 'A mysterious and enchanting series set in a moonlit garden.', models: [modelNames[3]], category: 'nature' as ContentCategory },
                { title: 'Downtown Hues', description: 'Capturing the vibrant and diverse colors of the city.', models: [modelNames[4], modelNames[5]], category: 'lifestyle' as ContentCategory },
                { title: 'Coastal Serenity', description: 'A tranquil collection from the edge of the sea.', models: [modelNames[6]], category: 'nature' as ContentCategory },
                { title: 'Rooftop Reverie', description: 'Dreamy, sun-drenched moments from above the city streets.', models: [modelNames[7], modelNames[8]], category: 'urban' as ContentCategory },
                { title: 'Studio Abstracts', description: 'A minimalist exploration of shape, shadow, and form.', models: [modelNames[9]], category: 'art' as ContentCategory },
                { title: 'Velvet & Chrome', description: 'A high-contrast series blending soft textures with hard reflections.', models: [modelNames[0], modelNames[3]], category: 'fashion' as ContentCategory },
                { title: 'Autumnal Tones', description: 'Warm, rich colors and cozy textures define this seasonal collection.', models: [modelNames[1], modelNames[4]], category: 'lifestyle' as ContentCategory },
                { title: 'Ethereal Light', description: 'A series focused on soft focus, lens flares, and dream-like visuals.', models: [modelNames[5], modelNames[7]], category: 'art' as ContentCategory },
            ];

            const galleryTags = ['portrait', 'art', 'beauty', 'lifestyle', 'outdoor'];
            galleries.forEach((gallery, index) => {
                const docRef = adminDb.collection('galleries').doc();
                const tags = [galleryTags[index % galleryTags.length], galleryTags[(index + 2) % galleryTags.length]];
                batch.set(docRef, {
                    ...gallery,
                    resolution: "800x1200",
                    image: `https://images.unsplash.com/photo-1588701177348-c197a731d1ce?w=400&h=600&fit=crop&q=80&${index}`,
                    album: [
                        `https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=1200&fit=crop&q=80&${index}1`,
                        `https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&h=1200&fit=crop&q=80&${index}2`,
                        `https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&h=1200&fit=crop&q=80&${index}3`,
                        `https://images.unsplash.com/photo-1492707892479-7a89487ee8ec?w=800&h=1200&fit=crop&q=80&${index}4`,
                        `https://images.unsplash.com/photo-1509319117193-57bab727e09d?w=800&h=1200&fit=crop&q=80&${index}5`,
                    ],
                    status: 'Published',
                    date: new Date(Date.now() - (index + 10) * 24 * 60 * 60 * 1000).toISOString(),
                    tags,
                    keywords: [
                        ...gallery.title.toLowerCase().split(' '),
                        ...gallery.models.map(m => m.toLowerCase()),
                        ...tags,
                        gallery.category,
                    ]
                });
            });

            await batch.commit();

            return {
                success: true,
                message: 'Successfully seeded the database with 10 models, 10 videos, and 10 galleries.',
            };
        } catch (error: any) {
            console.error('Error seeding database:', error);
            return {
                success: false,
                message: `Failed to seed database: ${error.message}`,
            };
        }
    }
);

      