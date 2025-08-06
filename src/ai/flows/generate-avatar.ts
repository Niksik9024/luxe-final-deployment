
'use server';
/**
 * @fileOverview An AI flow for generating a model avatar image.
 *
 * - generateAvatar - A function that generates an image based on a prompt.
 * - GenerateAvatarInput - The input type for the generateAvatar function.
 * - GenerateAvatarOutput - The return type for the generateAvatar function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateAvatarInputSchema = z.object({
  prompt: z.string().describe('A descriptive prompt for generating the model avatar image.'),
});

const GenerateAvatarOutputSchema = z.object({
  imageUrl: z.string().url().describe("The data URI of the generated image. Expected format: 'data:image/png;base64,<encoded_data>'."),
});

export type GenerateAvatarInput = z.infer<typeof GenerateAvatarInputSchema>;
export type GenerateAvatarOutput = z.infer<typeof GenerateAvatarOutputSchema>;

export async function generateAvatar(input: GenerateAvatarInput): Promise<GenerateAvatarOutput> {
  return generateAvatarFlow(input);
}

const generateAvatarFlow = ai.defineFlow(
  {
    name: 'generateAvatarFlow',
    inputSchema: GenerateAvatarInputSchema,
    outputSchema: GenerateAvatarOutputSchema,
  },
  async (input) => {
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: `A professional, high-fashion model avatar for a luxury brand. The style should be elegant and artistic. Prompt: "${input.prompt}"`,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media?.url) {
      throw new Error('Image generation failed to return a valid image.');
    }

    return { imageUrl: media.url };
  }
);
