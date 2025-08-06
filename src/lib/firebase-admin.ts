
import admin from 'firebase-admin';
import { getApps, initializeApp, App } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// This is a robust pattern for initializing the Firebase Admin SDK in a Next.js environment.
// It ensures that initialization happens only once.

let adminApp: App;
let adminDb: ReturnType<typeof getFirestore>;

const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};

// Check if all required service account details are present
const hasServiceAccount = serviceAccount.projectId && serviceAccount.privateKey && serviceAccount.clientEmail;

if (hasServiceAccount) {
    try {
        if (getApps().length > 0) {
            adminApp = getApps()[0];
        } else {
            adminApp = initializeApp({
                credential: admin.credential.cert(serviceAccount),
            });
        }
        adminDb = getFirestore(adminApp);
    } catch (error: any) {
        console.error("Firebase Admin Initialization Error:", error.message);
        // Fallback to dummy objects if initialization fails
        if (!adminApp!) {
            adminApp = {} as App;
        }
        // @ts-ignore
        adminDb = {};
    }
} else {
    console.warn("Firebase Admin credentials not provided in environment variables. Server-side Firestore operations will be disabled.");
    // @ts-ignore
    adminDb = {};
    adminApp = {} as App;
}


export { adminApp, adminDb };
