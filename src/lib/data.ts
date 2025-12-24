import { prisma } from "@/lib/db";
import { unstable_cache } from "next/cache";
import { DEFAULT_SITE_SETTINGS } from "@/lib/defaults";

// Cache tags for revalidation
export const CACHE_TAGS = {
  settings: "site-settings",
  services: "services",
  projects: "projects",
  project: (slug: string) => `project-${slug}`,
} as const;

// Get site settings with caching
export const getSiteSettings = unstable_cache(
  async () => {
    const settings = await prisma.siteSettings.findUnique({
      where: { id: "default" },
    });

    // Return defaults if no settings exist
    if (!settings) {
      return DEFAULT_SITE_SETTINGS;
    }

    return settings;
  },
  [CACHE_TAGS.settings],
  { tags: [CACHE_TAGS.settings], revalidate: 60 },
);

// Get all services with caching
export const getServices = unstable_cache(
  async () => {
    return prisma.service.findMany({
      orderBy: { order: "asc" },
    });
  },
  [CACHE_TAGS.services],
  { tags: [CACHE_TAGS.services], revalidate: 60 },
);

// Get featured services
export const getFeaturedServices = unstable_cache(
  async () => {
    return prisma.service.findMany({
      where: { featured: true },
      orderBy: { order: "asc" },
    });
  },
  ["featured-services"],
  { tags: [CACHE_TAGS.services], revalidate: 60 },
);

// Get all published projects with caching
export const getProjects = unstable_cache(
  async (options?: {
    category?: string;
    featured?: boolean;
    limit?: number;
  }) => {
    const where: Record<string, unknown> = { published: true };

    if (options?.category) {
      where.category = options.category;
    }
    if (options?.featured !== undefined) {
      where.featured = options.featured;
    }

    return prisma.project.findMany({
      where,
      include: {
        images: {
          orderBy: { order: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
      take: options?.limit,
    });
  },
  [CACHE_TAGS.projects],
  { tags: [CACHE_TAGS.projects], revalidate: 60 },
);

// Get featured projects
export const getFeaturedProjects = unstable_cache(
  async (limit = 6) => {
    return prisma.project.findMany({
      where: { published: true, featured: true },
      include: {
        images: {
          orderBy: { order: "asc" },
          take: 1,
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  },
  ["featured-projects"],
  { tags: [CACHE_TAGS.projects], revalidate: 60 },
);

// Get single project by slug
export const getProjectBySlug = unstable_cache(
  async (slug: string) => {
    return prisma.project.findUnique({
      where: { slug, published: true },
      include: {
        images: {
          orderBy: { order: "asc" },
        },
      },
    });
  },
  ["project"],
  { tags: [CACHE_TAGS.projects], revalidate: 60 },
);

// Get project categories
export const getProjectCategories = unstable_cache(
  async () => {
    const projects = await prisma.project.findMany({
      where: { published: true },
      select: { category: true },
      distinct: ["category"],
    });
    return projects.map((p) => p.category);
  },
  ["project-categories"],
  { tags: [CACHE_TAGS.projects], revalidate: 60 },
);
