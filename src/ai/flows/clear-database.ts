
'use server';
/**
 * @fileOverview A utility flow to clear all content from the Firestore database.
 * This is a destructive operation and should be used with caution.
 *
 * - clearDatabase - The main function to execute the clearing process.
 */

import { ai } from '@/ai/genkit';
import { adminDb } from '@/lib/firebase-admin';
import { z } from 'genkit';

const ClearDatabaseOutputSchema = z.object({
    success: z.boolean(),
    message: z.string(),
});

export type ClearDatabaseOutput = z.infer<typeof ClearDatabaseOutputSchema>;

export async function clearDatabase(): Promise<ClearDatabaseOutput> {
    return clearDatabaseFlow(null);
}

// Helper function to delete all documents in a collection
async function deleteCollection(collectionPath: string, batchSize: number) {
    const collectionRef = adminDb.collection(collectionPath);
    const query = collectionRef.orderBy('__name__').limit(batchSize);

    return new Promise((resolve, reject) => {
        deleteQueryBatch(query, resolve).catch(reject);
    });
}

async function deleteQueryBatch(query: FirebaseFirestore.Query, resolve: (value?: unknown) => void) {
    const snapshot = await query.get();

    const batchSize = snapshot.size;
    if (batchSize === 0) {
        // When there are no documents left, we are done
        resolve();
        return;
    }

    // Delete documents in a batch
    const batch = adminDb.batch();
    snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
    });
    await batch.commit();

    // Recurse on the next process tick, to avoid
    // exploding the stack.
    process.nextTick(() => {
        deleteQueryBatch(query, resolve);
    });
}


const clearDatabaseFlow = ai.defineFlow(
    {
        name: 'clearDatabaseFlow',
        inputSchema: z.null(),
        outputSchema: ClearDatabaseOutputSchema,
    },
    async () => {
        try {
            console.log('Starting database clearing process...');

            const collectionsToDelete = ['videos', 'galleries', 'models'];
            for (const collectionName of collectionsToDelete) {
                console.log(`Deleting collection: ${collectionName}...`);
                await deleteCollection(collectionName, 100);
                console.log(`Finished deleting collection: ${collectionName}.`);
            }
            
            // Also clear the tags document
            console.log('Clearing tags document...');
            const tagsDocRef = adminDb.doc('tags/--all--');
            await tagsDocRef.delete();
            console.log('Finished clearing tags document.');


            return {
                success: true,
                message: 'Successfully cleared the database. All models, videos, and galleries have been deleted.',
            };
        } catch (error: any) {
            console.error('Error clearing database:', error);
            return {
                success: false,
                message: `Failed to clear database: ${error.message}`,
            };
        }
    }
);
