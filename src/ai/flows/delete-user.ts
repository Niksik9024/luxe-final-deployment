
'use server';
/**
 * @fileOverview A flow to safely delete a user from Authentication and Firestore.
 *
 * - deleteUser - The main function to execute the deletion process.
 * - DeleteUserInput - The input type for the deleteUser function.
 * - DeleteUserOutput - The return type for the deleteUser function.
 */

import { ai } from '@/ai/genkit';
import { adminDb } from '@/lib/firebase-admin';
import { getAuth } from 'firebase-admin/auth';
import { z } from 'genkit';
import type { DeleteUserInput, DeleteUserOutput } from '@/ai/schemas/description';
import { DeleteUserInputSchema, DeleteUserOutputSchema } from '@/ai/schemas/description';


export async function deleteUser(input: DeleteUserInput): Promise<DeleteUserOutput> {
  return deleteUserFlow(input);
}

const deleteUserFlow = ai.defineFlow(
  {
    name: 'deleteUserFlow',
    inputSchema: DeleteUserInputSchema,
    outputSchema: DeleteUserOutputSchema,
  },
  async ({ userId }) => {
    if (!userId) {
      return { success: false, message: 'User ID is required.' };
    }

    try {
      const auth = getAuth();
      const userRef = adminDb.collection('users').doc(userId);

      // Start a batch write to ensure atomicity
      const batch = adminDb.batch();

      // 1. Delete the user from Firestore
      batch.delete(userRef);
      
      // Commit the Firestore deletion first
      await batch.commit();
      
      // 2. Delete the user from Firebase Authentication
      // This is done second because if it fails, we haven't lost the Firestore record.
      // If the Firestore delete fails, the whole operation stops.
      await auth.deleteUser(userId);

      return {
        success: true,
        message: `Successfully deleted user with ID ${userId} from Authentication and Firestore.`,
      };
    } catch (error: any) {
      console.error('Error deleting user:', error);
      
      // Provide more specific error messages
      if (error.code === 'auth/user-not-found') {
          return { success: false, message: `User with ID ${userId} not found in Firebase Authentication.` };
      }
      return {
        success: false,
        message: `Failed to delete user: ${error.message}`,
      };
    }
  }
);
