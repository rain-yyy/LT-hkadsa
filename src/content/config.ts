import { defineCollection, z } from 'astro:content';

const activities = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    year: z.number(),
    month: z.number(),
    monthLabel: z.string().optional(),
    summary: z.string().optional(),
    cover: z.string().optional(),
    images: z.array(z.string()).optional(),
    externalUrl: z.string().optional(),
  }),
});

const news = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    summary: z.string().optional(),
    cover: z.string().optional(),
    type: z.enum(['internal', 'external']),
    externalUrl: z.string().optional(),
  }),
});

export const collections = { activities, news };
