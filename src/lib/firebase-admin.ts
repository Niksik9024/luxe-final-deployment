
'use server';

import admin from 'firebase-admin';
import { getApps } from 'firebase-admin/app';

// This pattern is more robust for Next.js environments, especially Vercel.
// It directly checks for existing apps before attempting to initialize.
if (getApps().length === 0) {
    const serviceAccount = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    };
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    });
}

// Export the initialized instances for use in other server-side files.
export const adminDb = admin.firestore();
export const adminApp = admin.app();
