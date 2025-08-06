/**
 * @fileOverview Zod schemas and TypeScript types for the generateDescription AI flow.
 */
import { z } from 'genkit';

export const GenerateDescriptionInputSchema = z.object({
    title: z.string().describe('The title of the content.'),
    models: z.array(z.string()).describe('A list of models featured in the content.'),
    tags: z.string().describe('A comma-separated string of tags for the content.'),
    imageUrl: z
      .string()
      .url()
      .describe(
        "A public URL to the cover image of the content."
      ),
  });
  
  export const GenerateDescriptionOutputSchema = z.object({
      description: z.string().describe("The generated description for the content.")
  });
  
  export type GenerateDescriptionInput = z.infer<typeof GenerateDescriptionInputSchema>;
  export type GenerateDescriptionOutput = z.infer<typeof GenerateDescriptionOutputSchema>;
  
