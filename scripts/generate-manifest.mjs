
// scripts/generate-manifest.mjs
import { File } from 'megajs';
import fs from 'fs/promises';
import path from 'path';

// This script connects to your MEGA account, reads the contents of a specified folder,
// and generates a JSON "manifest" file. This file acts as a fast, local database for your website.
// You should run this script (`npm run build:manifest`) whenever you add new content to your MEGA folder.

async function generateManifest() {
  console.log('Starting manifest generation...');

  // --- CONFIGURATION ---
  // IMPORTANT: Set these environment variables in your .env file.
  // DO NOT COMMIT YOUR PASSWORD TO GIT.
  const email = process.env.MEGA_EMAIL;
  const password = process.env.MEGA_PASSWORD;
  // This is the public URL of the folder you want to index.
  // Example: 'https://mega.nz/folder/xxxxxx#yyyyyy'
  const folderUrl = process.env.MEGA_FOLDER_URL;
  const manifestPath = path.join(process.cwd(), 'public/manifest.json');

  if (!email || !password || !folderUrl) {
    console.error('ERROR: Missing required environment variables (MEGA_EMAIL, MEGA_PASSWORD, MEGA_FOLDER_URL).');
    process.exit(1);
  }

  try {
    console.log(`Connecting to MEGA folder: ${folderUrl}`);
    // Connect to the public MEGA folder. We don't need to log in to list files from a public link.
    const folder = File.fromURL(folderUrl);

    // Load the folder's metadata and file list
    await new Promise((resolve, reject) => folder.loadAttributes(err => err ? reject(err) : resolve()));

    console.log(`Found ${folder.children.length} files. Processing...`);

    const contentManifest = folder.children.map(file => {
      // Basic type detection based on file extension.
      const fileType = /\.(jpg|jpeg|png|gif|webp)$/i.test(file.name) ? 'image' : 
                       /\.(mp4|webm|mov|mkv)$/i.test(file.name) ? 'video' : 'file';

      return {
        id: file.nodeId, // MEGA's unique ID for the file
        name: file.name,
        size: file.size,
        type: fileType,
        // We will generate the download URL on the client-side when needed
      };
    });

    console.log(`Successfully processed ${contentManifest.length} items.`);

    // Write the manifest file to the public directory
    await fs.writeFile(manifestPath, JSON.stringify(contentManifest, null, 2));
    console.log(`✅ Manifest file created successfully at: ${manifestPath}`);

  } catch (error) {
    console.error('❌ Failed to generate manifest:', error.message);
    process.exit(1);
  }
}

generateManifest();
