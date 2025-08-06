
'use server';
/**
 * @fileOverview An AI flow for generating content descriptions.
 *
 * - generateDescription - A function that generates a description based on content metadata.
 */

import { ai } from '@/ai/genkit';
import { GenerateDescriptionInputSchema, GenerateDescriptionOutputSchema, type GenerateDescriptionInput, type GenerateDescriptionOutput } from '@/ai/schemas/description';
import { convertImageUrlToDataUri } from '@/ai/flows/util-flows';


export async function generateDescription(input: GenerateDescriptionInput): Promise<GenerateDescriptionOutput> {
  return generateDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateContentDescriptionPrompt',
  input: { schema: GenerateDescriptionInputSchema },
  output: { schema: GenerateDescriptionOutputSchema },
  prompt: `You are a creative copywriter for a luxury content platform. Your tone is sophisticated, evocative, and alluring.
Generate a compelling and SEO-friendly description for a new piece of content. The description should be around 2-3 sentences long.
Use the following information to craft the description:

Title: {{{title}}}
Models: {{{models}}}
Tags: {{{tags}}}

Use the cover image as the primary source of inspiration for the mood and narrative.

Image: {{media url=imageUrl}}
`,
});

const generateDescriptionFlow = ai.defineFlow(
  {
    name: 'generateDescriptionFlow',
    inputSchema: GenerateDescriptionInputSchema,
    outputSchema: GenerateDescriptionOutputSchema,
  },
  async (input) => {
    // Convert the public URL to a data URI before sending it to the prompt
    const dataUri = await convertImageUrlToDataUri({ url: input.imageUrl });
    
    const { output } = await prompt({
        ...input,
        imageUrl: dataUri, // Override with the data URI
    });
    return output!;
  }
);
