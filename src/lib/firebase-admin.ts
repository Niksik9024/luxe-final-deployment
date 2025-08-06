
import admin from 'firebase-admin';

// Initialize a variable to hold the parsed credentials
let serviceAccount;

// Check if the GOOGLE_APPLICATION_CREDENTIALS environment variable is set for production
if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  try {
    const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS);
    
    // Vercel (and other platforms) can mangle the private key's newlines.
    // This reformats the private key to ensure it's correctly parsed.
    if (credentials.private_key) {
        credentials.private_key = credentials.private_key.replace(/\\n/g, '\n');
    }
    
    serviceAccount = credentials;

  } catch (error) {
    console.error("Failed to parse GOOGLE_APPLICATION_CREDENTIALS:", error);
    // Don't throw here, to allow builds to succeed even if the variable is present but empty.
    // The error will be caught during app initialization instead.
  }
} else {
  // Fallback for local development using the credentials file from the same directory
  try {
    serviceAccount = require('./firebase-credentials.json');
  } catch (error) {
    console.warn("Could not load local 'firebase-credentials.json'. This is expected in production. If you are developing locally, ensure the file exists.");
  }
}

// Initialize the app only if it's not already initialized and we have valid credentials
if (!admin.apps.length) {
    if (serviceAccount && serviceAccount.project_id) {
        try {
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
            });
        } catch (error: any) {
            console.error("Firebase Admin SDK initialization failed:", error);
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
