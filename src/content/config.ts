import { defineCollection, z } from 'astro:content';

const sectionConfig = z
  .object({
    key: z.string(),
    title: z.string().optional(),
    variant: z.string().optional(),
  })
  .passthrough();

const programs = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    eyebrow: z.literal('MEDICAL PROGRAM'),
    lede: z.string(),
    heroImage: z.string(),
    heroImageAlt: z.string(),
    heroImageAspect: z.enum(['4/3', '3/4', '1/1', '16/9']).default('4/3'),
    icon: z.string().optional(),
    sections: z.array(sectionConfig).default([]),
    metadata: z
      .object({
        duration: z.string().optional(),
        commitmentLevel: z.string().optional(),
        pairsWith: z.array(z.string()).optional(),
      })
      .optional(),
    publishedAt: z.string(),
  }),
});

const services = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    eyebrow: z.literal('SERVICE'),
    lede: z.string(),
    heroImage: z.string(),
    heroImageAlt: z.string(),
    heroImageAspect: z.enum(['4/3', '3/4', '1/1', '16/9']).default('4/3'),
    icon: z.string().optional(),
    sections: z.array(sectionConfig).default([]),
    metadata: z
      .object({
        duration: z.string().optional(),
        price: z.string().optional(),
        pairsWith: z.array(z.string()).optional(),
      })
      .optional(),
    publishedAt: z.string(),
  }),
});

const ivProtocols = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    category: z.enum(['hydration', 'performance', 'wellness', 'beauty', 'detox', 'specialty']),
    shortDescription: z.string(),
    ingredients: z.array(z.string()).default([]),
    duration: z.string(),
    price: z.string().optional(),
    goodFor: z.array(z.string()).default([]),
    icon: z.string().optional(),
    thumbnailImage: z.string().optional(),
    publishedAt: z.string(),
    order: z.number().optional(),
  }),
});

export const collections = {
  programs,
  services,
  'iv-protocols': ivProtocols,
};
