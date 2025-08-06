
'use server';
/**
 * @fileOverview A flow to safely delete a model and all its references.
 *
 * - deleteModel - The main function to execute the deletion process.
 * - DeleteModelInputSchema - The input type for the deleteModel function.
 * - DeleteModelOutputSchema - The return type for the deleteModel function.
 */

import { ai } from '@/ai/genkit';
import { adminDb } from '@/lib/firebase-admin';
import type { Video, Gallery } from '@/lib/types';
import { z } from 'genkit';
import { FieldValue } from 'firebase-admin/firestore';
import type { DeleteModelInput, DeleteModelOutput } from '@/ai/schemas/description';
import { DeleteModelInputSchema, DeleteModelOutputSchema } from '@/ai/schemas/description';


export async function deleteModel(input: DeleteModelInput): Promise<DeleteModelOutput> {
  return deleteModelFlow(input);
}

const deleteModelFlow = ai.defineFlow(
  {
    name: 'deleteModelFlow',
    inputSchema: DeleteModelInputSchema,
    outputSchema: DeleteModelOutputSchema,
  },
  async ({ modelId }) => {
    if (!modelId) {
      return { success: false, message: 'Model ID is required.' };
    }

    try {
      const modelRef = adminDb.collection('models').doc(modelId);
      const modelSnap = await modelRef.get();

      if (!modelSnap.exists) {
        return { success: false, message: 'Model not found.' };
      }
      
      const modelName = modelSnap.data()?.name;
      if (!modelName) {
        // If model has no name, just delete it as it can't be referenced
        await modelRef.delete();
        return { success: true, message: `Model with ID ${modelId} was deleted (no name found).` };
      }

      const batch = adminDb.batch();

      // Find and update videos
      const videosQuery = adminDb.collection('videos').where('models', 'array-contains', modelName);
      const videosSnap = await videosQuery.get();
      videosSnap.forEach(doc => {
        batch.update(doc.ref, {
          models: FieldValue.arrayRemove(modelName),
          keywords: FieldValue.arrayRemove(modelName.toLowerCase())
        });
      });
      
      // Find and update galleries
      const galleriesQuery = adminDb.collection('galleries').where('models', 'array-contains', modelName);
      const galleriesSnap = await galleriesQuery.get();
      galleriesSnap.forEach(doc => {
        batch.update(doc.ref, {
          models: FieldValue.arrayRemove(modelName),
          keywords: FieldValue.arrayRemove(modelName.toLowerCase())
        });
      });
      
      // Delete the model itself
      batch.delete(modelRef);
      
      await batch.commit();

      return {
        success: true,
        message: `Successfully deleted model "${modelName}" and cleaned up ${videosSnap.size} video(s) and ${galleriesSnap.size} gallerie(s).`,
      };
    } catch (error: any) {
      console.error('Error deleting model:', error);
      return {
        success: false,
        message: `Failed to delete model: ${error.message}`,
      };
    }
  }
);
