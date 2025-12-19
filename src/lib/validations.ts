import { z } from "zod";

// Contact form validation
export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[\d\s\-\+\(\)]+$/.test(val),
      "Please enter a valid phone number"
    ),
  subject: z.string().max(200, "Subject must be less than 200 characters").optional(),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(5000, "Message must be less than 5000 characters"),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

// Project validation
export const projectSchema = z.object({
  title: z
    .string()
    .min(2, "Title must be at least 2 characters")
    .max(200, "Title must be less than 200 characters"),
  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .max(200, "Slug must be less than 200 characters")
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  shortDescription: z
    .string()
    .min(10, "Short description must be at least 10 characters")
    .max(500, "Short description must be less than 500 characters"),
  fullDescription: z
    .string()
    .max(10000, "Full description must be less than 10000 characters")
    .optional()
    .nullable(),
  category: z.string().min(1, "Category is required"),
  location: z.string().max(200, "Location must be less than 200 characters").optional().nullable(),
  projectDate: z.string().optional().nullable(),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  tags: z.array(z.string()).default([]),
  imageUrls: z.array(z.string().url()).default([]),
});

export type ProjectFormData = z.infer<typeof projectSchema>;

// Site settings validation
export const siteSettingsSchema = z.object({
  businessName: z.string().min(1, "Business name is required").max(200),
  tagline: z.string().max(500).optional(),
  introText: z.string().max(2000).optional().nullable(),
  phone: z.string().min(1, "Phone is required").max(50),
  email: z.string().email("Please enter a valid email"),
  hours: z.string().max(200).optional(),
  serviceArea: z.string().max(500).optional(),
  address: z.string().max(500).optional().nullable(),
  facebookUrl: z.string().url().optional().nullable().or(z.literal("")),
  instagramUrl: z.string().url().optional().nullable().or(z.literal("")),
  twitterUrl: z.string().url().optional().nullable().or(z.literal("")),
  linkedinUrl: z.string().url().optional().nullable().or(z.literal("")),
  youtubeUrl: z.string().url().optional().nullable().or(z.literal("")),
  heroHeadline: z.string().min(1, "Hero headline is required").max(200),
  heroSubheadline: z.string().max(500).optional(),
  heroCta1Text: z.string().max(50).optional(),
  heroCta1Link: z.string().max(200).optional(),
  heroCta2Text: z.string().max(50).optional(),
  heroCta2Link: z.string().max(200).optional(),
  heroImageUrl: z.string().url().optional().nullable().or(z.literal("")),
  aboutHeadline: z.string().max(200).optional(),
  aboutContent: z.string().max(10000).optional().nullable(),
  aboutImageUrl: z.string().url().optional().nullable().or(z.literal("")),
});

export type SiteSettingsFormData = z.infer<typeof siteSettingsSchema>;

// Service validation
export const serviceSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .max(100)
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(2000),
  icon: z.string().max(50).optional().nullable(),
  imageUrl: z.string().url().optional().nullable().or(z.literal("")),
  featured: z.boolean().default(false),
  order: z.number().int().min(0).default(0),
});

export type ServiceFormData = z.infer<typeof serviceSchema>;

// Contact submission notes update
export const submissionNotesSchema = z.object({
  notes: z.string().max(5000).optional().nullable(),
  handled: z.boolean().optional(),
});

export type SubmissionNotesData = z.infer<typeof submissionNotesSchema>;

// Login validation
export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
