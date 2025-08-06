
'use server';
/**
 * @fileOverview Utility flows for common AI-related tasks.
 *
 * - convertImageUrlToDataUri - Fetches an image from a URL and converts it to a Base64 data URI.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const UrlInputSchema = z.object({
    url: z.string().url(),
});

export async function convertImageUrlToDataUri(input: z.infer<typeof UrlInputSchema>): Promise<string> {
    return convertImageUrlToDataUriFlow(input);
}

const convertImageUrlToDataUriFlow = ai.defineFlow(
  {
    name: 'convertImageUrlToDataUriFlow',
    inputSchema: UrlInputSchema,
    outputSchema: z.string(),
  },
  async ({ url }) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
      }
      const contentType = response.headers.get('content-type') || 'image/jpeg';
      const buffer = await response.arrayBuffer();
      const base64 = Buffer.from(buffer).toString('base64');
      return `data:${contentType};base64,${base64}`;
    } catch (error) {
      console.error('Error converting image URL to data URI:', error);
      // Return a transparent 1x1 pixel as a fallback to prevent crashes
      return 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    }
  }
);
