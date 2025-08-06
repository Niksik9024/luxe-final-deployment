
'use server';
/**
 * @fileOverview A server-side flow for performing a secure and efficient search against the database.
 * This flow uses a pre-computed keywords field on content documents for fast, case-insensitive searching,
 * and allows for filtering by content type and category.
 *
 * - performSearch - The main function to execute a search.
 * - PerformSearchInput - The input type for the performSearch function.
 * - PerformSearchOutput - The return type for the performSearch function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { adminDb } from '@/lib/firebase-admin';
import type { Video, Gallery, Model } from '@/lib/types';
import type { Query } from 'firebase-admin/firestore';

const PerformSearchInputSchema = z.object({
  query: z.string().optional().describe('The user\'s natural language search query.'),
  type: z.enum(['all', 'videos', 'galleries', 'models']).optional().describe('The type of content to search for.'),
  category: z.string().optional().describe('The category to filter content by.'),
});

const PerformSearchOutputSchema = z.object({
    videos: z.array(z.custom<Video>()),
    galleries: z.array(z.custom<Gallery>()),
    models: z.array(z.custom<Model>()),
});

export type PerformSearchInput = z.infer<typeof PerformSearchInputSchema>;
export type PerformSearchOutput = z.infer<typeof PerformSearchOutputSchema>;

export async function performSearch(input: PerformSearchInput): Promise<PerformSearchOutput> {
  return performSearchFlow(input);
}

const performSearchFlow = ai.defineFlow(
  {
    name: 'performSearchFlow',
    inputSchema: PerformSearchInputSchema,
    outputSchema: PerformSearchOutputSchema,
  },
  async ({ query, type = 'all', category }) => {
    
    // Collect all search terms, converting to lowercase
    const searchTerms = (query || '')
      .toLowerCase()
      .split(' ')
      .filter(Boolean);
      
    if (category && category !== 'all') {
        searchTerms.push(category.toLowerCase());
    }

    // 1. Find models that match the query (case-insensitive)
    let foundModels: Model[] = [];
    if (type === 'all' || type === 'models') {
        const lowerCaseQuery = (query || '').toLowerCase().trim();
        if (lowerCaseQuery) {
            const allModelsSnap = await adminDb.collection('models').get();
            const allModels = allModelsSnap.docs.map(doc => ({ ...doc.data(), id: doc.id } as Model));
            foundModels = allModels.filter(model => model.name.toLowerCase().includes(lowerCaseQuery));
        } else if (type === 'models' && !query) {
             const allModelsSnap = await adminDb.collection('models').get();
             foundModels = allModelsSnap.docs.map(doc => ({ ...doc.data(), id: doc.id } as Model));
        }
    }

    let foundVideos: Video[] = [];
    let foundGalleries: Gallery[] = [];

    // Since Firestore doesn't support multiple array-contains clauses on the same field without a composite index,
    // we fetch based on the first term and then filter in memory for the rest.
    // This is a trade-off to avoid manual index creation. For very large datasets, indexing would be required.
    const primarySearchTerm = searchTerms.length > 0 ? searchTerms[0] : null;

    // 2. Build base queries for Videos and Galleries
    let videosQuery: Query = adminDb.collection('videos').where('status', '==', 'Published');
    let galleriesQuery: Query = adminDb.collection('galleries').where('status', '==', 'Published');

    // Add the primary keyword filter if it exists
    if (primarySearchTerm) {
      videosQuery = videosQuery.where('keywords', 'array-contains', primarySearchTerm);
      galleriesQuery = galleriesQuery.where('keywords', 'array-contains', primarySearchTerm);
    }
    
    // 3. Execute queries based on type filter
    let videoSnapshots: FirebaseFirestore.QuerySnapshot | null = null;
    let gallerySnapshots: FirebaseFirestore.QuerySnapshot | null = null;

    if (type === 'all' || type === 'videos') {
        videoSnapshots = await videosQuery.get();
    }
    if (type === 'all' || type === 'galleries') {
        gallerySnapshots = await galleriesQuery.get();
    }

    // 4. In-memory filtering for additional search terms
    const remainingTerms = searchTerms.slice(1);

    if (videoSnapshots) {
      foundVideos = videoSnapshots.docs
        .map(doc => ({ ...doc.data(), id: doc.id } as Video))
        .filter(video => remainingTerms.every(term => video.keywords.includes(term)));
    }
    
    if (gallerySnapshots) {
      foundGalleries = gallerySnapshots.docs
        .map(doc => ({ ...doc.data(), id: doc.id } as Gallery))
        .filter(gallery => remainingTerms.every(term => gallery.keywords.includes(term)));
    }
    
    return {
      videos: foundVideos,
      galleries: foundGalleries,
      models: foundModels,
    };
  }
);
