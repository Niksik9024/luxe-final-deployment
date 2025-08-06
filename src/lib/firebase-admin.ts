
'use server';

import admin from 'firebase-admin';

// This block ensures we only initialize the app once, which is the correct pattern.
if (!admin.apps.length) {
  try {
    let serviceAccount;

    // Vercel environment: build credentials from individual environment variables.
    // This is the recommended and most reliable way for Vercel.
    if (process.env.VERCEL_ENV) {
      if (
        !process.env.FIREBASE_PROJECT_ID ||
        !process.env.FIREBASE_PRIVATE_KEY ||
        !process.env.FIREBASE_CLIENT_EMAIL
      ) {
        throw new Error('Firebase credentials are not fully set for Vercel environment.');
      }
      serviceAccount = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      };
    } else {
      // Local development environment: read from the credentials file.
      // This allows you to work locally without setting individual variables.
      serviceAccount = require('./firebase-credentials.json');
    }

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    });

  } catch (error: any) {
    console.error('Firebase Admin SDK initialization failed:', error.message);
    // In a production environment, you might want to handle this more gracefully.
    // For now, we log the error, which will be visible in Vercel build logs.
  }
}

// Export the initialized instances.
// The `|| null!` is a way to tell TypeScript that while these could be null in theory
// if initialization fails, we expect them to be available for the app to function.
export const adminDb = admin.firestore() || null!;
export const adminApp = admin.app() || null!;
