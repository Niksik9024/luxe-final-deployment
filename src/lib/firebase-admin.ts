
import admin from 'firebase-admin';
import { getApps, initializeApp, App } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// This is a robust pattern for initializing the Firebase Admin SDK in a Next.js environment.
// It ensures that initialization happens only once.

let adminApp: App | undefined;
let adminDb: ReturnType<typeof getFirestore> | undefined;

try {
    const serviceAccount = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    };

    if (serviceAccount.projectId && serviceAccount.privateKey && serviceAccount.clientEmail) {
        if (!getApps().length) {
            adminApp = initializeApp({
                credential: admin.credential.cert(serviceAccount),
            });
        } else {
            adminApp = getApps()[0];
        }
        adminDb = getFirestore(adminApp);
    } else {
        console.warn("Firebase Admin credentials not provided in environment variables. Server-side Firestore operations will be disabled.");
    }
} catch (error: any) {
    console.error("Firebase Admin Initialization Error:", error.message);
}


export { adminApp, adminDb };
