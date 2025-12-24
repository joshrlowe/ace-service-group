import { slugify } from "./utils";

export function parseProjectFormData(formData: FormData) {
  return {
    title: formData.get("title"),
    slug: formData.get("slug") || slugify(formData.get("title") as string),
    shortDescription: formData.get("shortDescription"),
    fullDescription: formData.get("fullDescription") || null,
    category: formData.get("category"),
    location: formData.get("location") || null,
    projectDate: formData.get("projectDate") || null,
    featured: formData.get("featured") === "true",
    published: formData.get("published") !== "false",
    tags: formData.get("tags")
      ? (formData.get("tags") as string)
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : [],
    imageUrls: formData.getAll("imageUrls").filter(Boolean) as string[],
  };
}

export function parseServiceFormData(formData: FormData) {
  return {
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    icon: formData.get("icon") || null,
    imageUrl: formData.get("imageUrl") || null,
    featured: formData.get("featured") === "true",
    order: parseInt(formData.get("order") as string) || 0,
  };
}

export function parseContactFormData(formData: FormData) {
  return {
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    subject: formData.get("subject") || undefined,
    message: formData.get("message"),
  };
}

export function createProjectImageData(imageUrls: string[]) {
  return imageUrls.map((url, index) => ({
    url,
    order: index,
  }));
}

export function mapProjectDataForDatabase(data: {
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription?: string | null;
  category: string;
  location?: string | null;
  projectDate?: string | null;
  featured: boolean;
  published: boolean;
  tags: string[];
  imageUrls: string[];
}) {
  return {
    title: data.title,
    slug: data.slug,
    shortDescription: data.shortDescription,
    fullDescription: data.fullDescription ?? null,
    category: data.category,
    location: data.location ?? null,
    projectDate: data.projectDate ? new Date(data.projectDate) : null,
    featured: data.featured,
    published: data.published,
    tags: data.tags,
    images: {
      create: createProjectImageData(data.imageUrls),
    },
  };
}

export function parseSiteSettingsFormData(formData: FormData) {
  return {
    businessName: formData.get("businessName"),
    tagline: formData.get("tagline") || null,
    introText: formData.get("introText") || null,
    phone: formData.get("phone"),
    email: formData.get("email"),
    hours: formData.get("hours") || null,
    serviceArea: formData.get("serviceArea") || null,
    address: formData.get("address") || null,
    facebookUrl: formData.get("facebookUrl") || null,
    instagramUrl: formData.get("instagramUrl") || null,
    twitterUrl: formData.get("twitterUrl") || null,
    linkedinUrl: formData.get("linkedinUrl") || null,
    youtubeUrl: formData.get("youtubeUrl") || null,
    heroHeadline: formData.get("heroHeadline"),
    heroSubheadline: formData.get("heroSubheadline") || null,
    heroCta1Text: formData.get("heroCta1Text") || null,
    heroCta1Link: formData.get("heroCta1Link") || null,
    heroCta2Text: formData.get("heroCta2Text") || null,
    heroCta2Link: formData.get("heroCta2Link") || null,
    heroImageUrl: formData.get("heroImageUrl") || null,
    aboutHeadline: formData.get("aboutHeadline") || null,
    aboutContent: formData.get("aboutContent") || null,
    aboutImageUrl: formData.get("aboutImageUrl") || null,
  };
}

export function normalizeNullableUrls(data: {
  facebookUrl?: string | null;
  instagramUrl?: string | null;
  twitterUrl?: string | null;
  linkedinUrl?: string | null;
  youtubeUrl?: string | null;
  heroImageUrl?: string | null;
  aboutImageUrl?: string | null;
}) {
  return {
    facebookUrl: data.facebookUrl || null,
    instagramUrl: data.instagramUrl || null,
    twitterUrl: data.twitterUrl || null,
    linkedinUrl: data.linkedinUrl || null,
    youtubeUrl: data.youtubeUrl || null,
    heroImageUrl: data.heroImageUrl || null,
    aboutImageUrl: data.aboutImageUrl || null,
  };
}
