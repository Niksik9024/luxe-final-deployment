/**
 * @fileOverview Centralized Zod schemas for validating content entities (Videos and Galleries).
 * This file provides a single source of truth for content data structures, ensuring consistency
 * across the application, especially in admin forms for creating and editing content.
 */

import { z } from "zod";

/**
 * Defines the base set of validation rules common to all content types.
 * This includes core fields like title, image URL, associated models, and status.
 */
export const baseContentSchema = {
  title: z.string().min(2, "Title must be at least 2 characters.").max(100, "Title cannot exceed 100 characters."),
  description: z.string().optional(),
  image: z.string().url("Please enter a valid image URL."),
  models: z.array(z.string()).min(1, "Please select at least one model."),
  tags: z.string().optional(),
  status: z.enum(['Published', 'Draft']),
};

/**
 * Defines the validation schema specifically for Video content.
 * It extends the base schema with fields unique to videos, like the video URL
 * and a flag to feature it on the homepage.
 */
export const videoFormSchema = z.object({
  ...baseContentSchema,
  videoUrl: z.string().min(1, "Video source URL is required.").url("Please enter a valid video source URL."),
  isFeatured: z.boolean().optional(),
});

/**
 * Defines the validation schema specifically for Gallery content.
 * It extends the base schema with an 'album' field, which is an array
 * of objects containing valid image URLs.
 */
export const galleryFormSchema = z.object({
  ...baseContentSchema,
  album: z.array(z.object({ value: z.string().url({ message: "Please enter a valid URL for each album image." }) })).optional(),
});
