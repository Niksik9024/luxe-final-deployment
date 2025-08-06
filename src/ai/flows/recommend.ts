
'use server';
/**
 * @fileOverview An AI flow for recommending content.
 *
 * - recommend - A function that recommends content based on user favorites.
 * - RecommendInput - The input type for the recommend function.
 * - RecommendOutput - The return type for the recommend function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { Video, Gallery } from '@/lib/types';
import type { RecommendInput, RecommendOutput } from '@/ai/schemas/description';
import { RecommendInputSchema, RecommendOutputSchema } from '@/ai/schemas/description';


export async function recommend(input: RecommendInput): Promise<RecommendOutput> {
  return recommendFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendContentPrompt',
  input: { schema: RecommendInputSchema },
  output: { schema: RecommendOutputSchema },
  prompt: `You are a recommendation engine for a luxury content platform.
Your task is to recommend content to a user based on their favorites.

Analyze the user's favorites to understand their preferences for models, tags, and themes.
- User's Favorites:
{{#each favorites}}
- Title: {{title}} (ID: {{id}})
  Description: {{description}}
  Models: {{#each models}}{{.}}{{#unless @last}}, {{/unless}}{{/each}}
  Tags: {{#each tags}}{{.}}{{#unless @last}}, {{/unless}}{{/each}}
{{/each}}

Based on these preferences, select up to 3 items from the following list of all available content.
Do NOT recommend items that the user has already favorited.
Return only an array of the recommended content IDs.

- All Available Content:
{{#each allContent}}
- Title: {{title}} (ID: {{id}})
  Description: {{description}}
  Models: {{#each models}}{{.}}{{#unless @last}}, {{/unless}}{{/each}}
  Tags: {{#each tags}}{{.}}{{#unless @last}}, {{/unless}}{{/each}}
{{/each}}
`,
});

const recommendFlow = ai.defineFlow(
  {
    name: 'recommendFlow',
    inputSchema: RecommendInputSchema,
    outputSchema: RecommendOutputSchema,
  },
  async (input) => {
    // Filter out already favorited content from the recommendation pool
    const favoriteIds = new Set(input.favorites.map(f => f.id));
    const contentToRecommendFrom = input.allContent.filter(c => !favoriteIds.has(c.id));

    if (contentToRecommendFrom.length === 0) {
        return [];
    }

    const { output } = await prompt({
        ...input,
        allContent: contentToRecommendFrom,
    });
    
    return output || [];
  }
);
