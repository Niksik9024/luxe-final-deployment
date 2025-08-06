
'use server';

import admin from 'firebase-admin';
import { getApps, initializeApp, App } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// This is a robust pattern for initializing the Firebase Admin SDK in a Next.js environment.
// It ensures that initialization happens only once.

let adminApp: App;
let adminDb: ReturnType<typeof getFirestore>;

try {
    if (getApps().length > 0) {
        adminApp = getApps()[0];
    } else {
        const serviceAccount = {
            projectId: process.env.FIREBASE_PROJECT_ID,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        };

        adminApp = initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
    }
    adminDb = getFirestore(adminApp);

} catch (error: any) {
    console.error("Firebase Admin Initialization Error:", error.message);
    // Create dummy exports to prevent the app from crashing if initialization fails
    if (!adminApp!) {
        adminApp = {} as App; 
    }
    if (!adminDb!) {
       // @ts-ignore
       adminDb = {};
    }
}

export { adminApp, adminDb };
