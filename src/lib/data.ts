import { prisma } from "@/lib/db";
import { unstable_cache } from "next/cache";

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
      return {
        id: "default",
        businessName: "Ace Service Group LLC",
        tagline: "At Ace Service Group, we turn problems into solutions.",
        introText: null,
        phone: "(267) 640-5958",
        email: "aceservicegroupllc@gmail.com",
        hours: "Always open",
        serviceArea: "Lansdale, PA and surrounding areas",
        address: null,
        facebookUrl: null,
        instagramUrl: null,
        twitterUrl: null,
        linkedinUrl: null,
        youtubeUrl: null,
        heroHeadline: "Quality Construction & Home Services",
        heroSubheadline:
          "From simple plumbing calls to full scale renovations - we turn problems into solutions.",
        heroCta1Text: "Call Now",
        heroCta1Link: "tel:+12676405958",
        heroCta2Text: "Request a Quote",
        heroCta2Link: "/contact",
        heroImageUrl: null,
        aboutHeadline: "About Ace Service Group",
        aboutContent: null,
        aboutImageUrl: null,
        updatedAt: new Date(),
      };
    }

    return settings;
  },
  [CACHE_TAGS.settings],
  { tags: [CACHE_TAGS.settings], revalidate: 60 }
);

// Get all services with caching
export const getServices = unstable_cache(
  async () => {
    return prisma.service.findMany({
      orderBy: { order: "asc" },
    });
  },
  [CACHE_TAGS.services],
  { tags: [CACHE_TAGS.services], revalidate: 60 }
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
  { tags: [CACHE_TAGS.services], revalidate: 60 }
);

// Get all published projects with caching
export const getProjects = unstable_cache(
  async (options?: { category?: string; featured?: boolean; limit?: number }) => {
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
  { tags: [CACHE_TAGS.projects], revalidate: 60 }
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
  { tags: [CACHE_TAGS.projects], revalidate: 60 }
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
  { tags: [CACHE_TAGS.projects], revalidate: 60 }
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
  { tags: [CACHE_TAGS.projects], revalidate: 60 }
);
