/**
 * @fileOverview Zod schemas and TypeScript types for the AI flows.
 */
import { z } from 'genkit';
import type { Video, Gallery, Photo, Favorite, Model } from '@/lib/types';

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


export const ClearDatabaseOutputSchema = z.object({
    success: z.boolean(),
    message: z.string(),
});
export type ClearDatabaseOutput = z.infer<typeof ClearDatabaseOutputSchema>;


export const DeleteModelInputSchema = z.object({
  modelId: z.string().describe('The ID of the model to be deleted.'),
});
export type DeleteModelInput = z.infer<typeof DeleteModelInputSchema>;

export const DeleteModelOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});
export type DeleteModelOutput = z.infer<typeof DeleteModelOutputSchema>;


export const DeleteUserInputSchema = z.object({
  userId: z.string().describe('The UID of the user to be deleted.'),
});
export type DeleteUserInput = z.infer<typeof DeleteUserInputSchema>;

export const DeleteUserOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});
export type DeleteUserOutput = z.infer<typeof DeleteUserOutputSchema>;

export const GenerateAvatarInputSchema = z.object({
  prompt: z.string().describe('A descriptive prompt for generating the model avatar image.'),
});
export type GenerateAvatarInput = z.infer<typeof GenerateAvatarInputSchema>;

export const GenerateAvatarOutputSchema = z.object({
  imageUrl: z.string().url().describe("The data URI of the generated image. Expected format: 'data:image/png;base64,<encoded_data>'."),
});
export type GenerateAvatarOutput = z.infer<typeof GenerateAvatarOutputSchema>;


export const FunFactsInputSchema = z.object({
  modelName: z.string().describe('The name of the fashion model.'),
});
export type FunFactsInput = z.infer<typeof FunFactsInputSchema>;

export const FunFactsOutputSchema = z.object({
  facts: z.array(z.string()).describe('An array of 3-4 interesting, flirty, or surprising "fun facts" about the model.'),
});
export type FunFactsOutput = z.infer<typeof FunFactsOutputSchema>;


export const GetFavoriteDetailsInputSchema = z.object({
  userId: z.string().describe("The ID of the user whose favorites are being fetched."),
  favorites: z.array(z.custom<Favorite>()).describe("An array of the user's favorite references, containing id and type."),
});
export type GetFavoriteDetailsInput = z.infer<typeof GetFavoriteDetailsInputSchema>;

export const FavoriteDetailsSchema = z.object({
    videos: z.array(z.custom<Video>()),
    galleries: z.array(z.custom<Gallery>()),
    photos: z.array(z.custom<Photo>()),
});
export type FavoriteDetails = z.infer<typeof FavoriteDetailsSchema>;


export const PerformSearchInputSchema = z.object({
  query: z.string().optional().describe('The user\'s natural language search query.'),
  type: z.enum(['all', 'videos', 'galleries', 'models']).optional().describe('The type of content to search for.'),
  category: z.string().optional().describe('The category to filter content by.'),
});
export type PerformSearchInput = z.infer<typeof PerformSearchInputSchema>;

export const PerformSearchOutputSchema = z.object({
    videos: z.array(z.custom<Video>()),
    galleries: z.array(z.custom<Gallery>()),
    models: z.array(z.custom<Model>()),
});
export type PerformSearchOutput = z.infer<typeof PerformSearchOutputSchema>;


const BaseContentSchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    models: z.array(z.string()),
    tags: z.array(z.string()),
});
export const RecommendInputSchema = z.object({
  favorites: z.array(BaseContentSchema).describe("A list of the user's favorite content items."),
  allContent: z.array(BaseContentSchema).describe("A list of all available content items to recommend from."),
});
export type RecommendInput = z.infer<typeof RecommendInputSchema>;

export const RecommendOutputSchema = z.array(z.string()).describe("An array of content IDs that are recommended for the user.");
export type RecommendOutput = z.infer<typeof RecommendOutputSchema>;


export const SeedDatabaseOutputSchema = z.object({
    success: z.boolean(),
    message: z.string(),
});
export type SeedDatabaseOutput = z.infer<typeof SeedDatabaseOutputSchema>;
