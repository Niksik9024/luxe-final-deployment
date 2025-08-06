
import admin from 'firebase-admin';

// Initialize a variable to hold the parsed credentials
let serviceAccount;

// Check if running on Vercel by checking for Vercel-specific environment variables
if (process.env.VERCEL_ENV) {
  // On Vercel, assemble credentials from individual environment variables
  if (
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_PRIVATE_KEY &&
    process.env.FIREBASE_CLIENT_EMAIL
  ) {
    serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Still need to replace newlines
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    };
  } else {
    console.warn("Firebase credentials are not fully set for Vercel environment.");
  }
} else {
  // For local development, use the credentials file from the environment variable or local file
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    try {
      const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS);
      if (credentials.private_key) {
        credentials.private_key = credentials.private_key.replace(/\\n/g, '\n');
      }
      serviceAccount = credentials;
    } catch (error) {
      console.error("Failed to parse GOOGLE_APPLICATION_CREDENTIALS from environment:", error);
    }
  } else {
    try {
      // Fallback for local development using the credentials file
      serviceAccount = require('./firebase-credentials.json');
    } catch (error) {
      console.warn("Could not load local 'firebase-credentials.json'. This is expected in production. If you are developing locally, ensure the file exists.");
    }
  }
}

// Initialize the app only if it's not already initialized and we have valid credentials
if (!admin.apps.length) {
    if (serviceAccount) {
        try {
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
            });
        } catch (error: any) {
            console.error("Firebase Admin SDK initialization failed:", error.message);
            // Throw an error if initialization fails, as the app likely can't run without it.
            throw new Error("Could not initialize Firebase Admin SDK. Please check your credentials.");
        }
    } else {
        console.warn("Firebase Admin SDK not initialized: No valid credentials found.");
    }
}

// Export the db and app instances. They will be initialized if credentials were found.
export const adminDb = admin.apps.length ? admin.firestore() : null!;
export const adminApp = admin.apps.length ? admin.app() : null!;
