
'use server';
/**
 * @fileOverview An AI flow for generating fun facts about a model.
 *
 * - generateFunFacts - A function that generates facts about a model.
 * - FunFactsInput - The input type for the generateFunFacts function.
 * - FunFactsOutput - The return type for the generateFunFacts function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const FunFactsInputSchema = z.object({
  modelName: z.string().describe('The name of the fashion model.'),
});

const FunFactsOutputSchema = z.object({
  facts: z.array(z.string()).describe('An array of 3-4 interesting, flirty, or surprising "fun facts" about the model.'),
});

export type FunFactsInput = z.infer<typeof FunFactsInputSchema>;
export type FunFactsOutput = z.infer<typeof FunFactsOutputSchema>;

export async function generateFunFacts(input: FunFactsInput): Promise<FunFactsOutput> {
  return generateFunFactsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateFunFactsPrompt',
  input: { schema: FunFactsInputSchema },
  output: { schema: FunFactsOutputSchema },
  prompt: `You are a witty and sophisticated creative assistant for a luxury fashion brand.
Your task is to generate a short list of 3-4 "fun facts" for a fashion model.
The provided model's name is: {{{modelName}}}.

Your tone must be intriguing and sophisticated, but strictly safe-for-work.
Do not generate anything explicitly adult or vulgar. The facts should be creative and plausible for a high-fashion model.

Please generate the facts based on the following themes:
- Mysterious pasts or hidden talents
- Luxurious or eccentric habits
- A taste for the finer things in life
- A surprisingly down-to-earth hobby

Example for a model named "Isabella":
- "Rumor has it she only drinks champagne that's been chilled by Alpine snow."
- "She learned to speak fluent Italian just to be able to order pasta perfectly in Portofino."
- "Her lucky charm is a single, black pearl she supposedly won in a high-stakes poker game in Monaco."

Now, generate the fun facts for the specified model.
`,
});

const generateFunFactsFlow = ai.defineFlow(
  {
    name: 'generateFunFactsFlow',
    inputSchema: FunFactsInputSchema,
    outputSchema: FunFactsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
