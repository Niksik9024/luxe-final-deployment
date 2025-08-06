
'use server';

import admin from 'firebase-admin';
import { getApps, initializeApp, App } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// This is a robust pattern for initializing the Firebase Admin SDK in a Next.js environment.
// It ensures that initialization happens only once.

const getAdminApp = (): App => {
    if (getApps().length > 0) {
        return getApps()[0];
    }

    const serviceAccount = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    };

    // The SDK expects camelCase properties for programmatic initialization.
    // The error message was misleading. 'projectId', 'privateKey', and 'clientEmail' are correct.
    return initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
}

export const adminApp = getAdminApp();
export const adminDb = getFirestore(adminApp);
