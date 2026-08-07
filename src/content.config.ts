import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const people = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/people" }),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    image: z.string(),
    order: z.number(),
    email: z.string().email().optional(),
    website: z.string().url().optional(),
    orcid: z.string().url().optional(),
    scholar: z.string().url().optional(),
  }),
});

const publications = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/publications" }),
  schema: z.object({
    title: z.string(),
    authors: z.array(z.string()),
    journal: z.string(),
    date: z.coerce.date(),
    link: z.string().url(),
    doi: z.string(),
    featured: z.boolean().default(false),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    label: z.string(),
    image: z.string(),
    order: z.number(),
    summary: z.string(),
  }),
});

const updates = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/updates" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    displayDate: z.string(),
    image: z.string(),
    order: z.number().optional(),
  }),
});

export const collections = { people, publications, projects, updates };
