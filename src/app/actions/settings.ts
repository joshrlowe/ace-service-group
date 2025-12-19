"use server";

import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { siteSettingsSchema, serviceSchema } from "@/lib/validations";
import { CACHE_TAGS } from "@/lib/data";

export async function updateSiteSettings(formData: FormData) {
  try {
    await requireAdmin();

    const rawData = {
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

    const validationResult = siteSettingsSchema.safeParse(rawData);

    if (!validationResult.success) {
      const errors: Record<string, string> = {};
      validationResult.error.errors.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0].toString()] = err.message;
        }
      });
      return { success: false, errors };
    }

    const data = validationResult.data;

    await prisma.siteSettings.upsert({
      where: { id: "default" },
      update: {
        ...data,
        facebookUrl: data.facebookUrl || null,
        instagramUrl: data.instagramUrl || null,
        twitterUrl: data.twitterUrl || null,
        linkedinUrl: data.linkedinUrl || null,
        youtubeUrl: data.youtubeUrl || null,
        heroImageUrl: data.heroImageUrl || null,
        aboutImageUrl: data.aboutImageUrl || null,
      },
      create: {
        id: "default",
        ...data,
        facebookUrl: data.facebookUrl || null,
        instagramUrl: data.instagramUrl || null,
        twitterUrl: data.twitterUrl || null,
        linkedinUrl: data.linkedinUrl || null,
        youtubeUrl: data.youtubeUrl || null,
        heroImageUrl: data.heroImageUrl || null,
        aboutImageUrl: data.aboutImageUrl || null,
      },
    });

    revalidateTag(CACHE_TAGS.settings);

    return { success: true };
  } catch (error) {
    console.error("Update settings error:", error);
    return { success: false, message: "Failed to update settings" };
  }
}

export async function createService(formData: FormData) {
  try {
    await requireAdmin();

    const rawData = {
      name: formData.get("name"),
      slug: formData.get("slug"),
      description: formData.get("description"),
      icon: formData.get("icon") || null,
      imageUrl: formData.get("imageUrl") || null,
      featured: formData.get("featured") === "true",
      order: parseInt(formData.get("order") as string) || 0,
    };

    const validationResult = serviceSchema.safeParse(rawData);

    if (!validationResult.success) {
      const errors: Record<string, string> = {};
      validationResult.error.errors.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0].toString()] = err.message;
        }
      });
      return { success: false, errors };
    }

    const data = validationResult.data;

    // Check if slug exists
    const existing = await prisma.service.findUnique({
      where: { slug: data.slug },
    });

    if (existing) {
      return { success: false, errors: { slug: "A service with this slug already exists" } };
    }

    await prisma.service.create({
      data: {
        ...data,
        imageUrl: data.imageUrl || null,
      },
    });

    revalidateTag(CACHE_TAGS.services);

    return { success: true };
  } catch (error) {
    console.error("Create service error:", error);
    return { success: false, message: "Failed to create service" };
  }
}

export async function updateService(id: string, formData: FormData) {
  try {
    await requireAdmin();

    const rawData = {
      name: formData.get("name"),
      slug: formData.get("slug"),
      description: formData.get("description"),
      icon: formData.get("icon") || null,
      imageUrl: formData.get("imageUrl") || null,
      featured: formData.get("featured") === "true",
      order: parseInt(formData.get("order") as string) || 0,
    };

    const validationResult = serviceSchema.safeParse(rawData);

    if (!validationResult.success) {
      const errors: Record<string, string> = {};
      validationResult.error.errors.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0].toString()] = err.message;
        }
      });
      return { success: false, errors };
    }

    const data = validationResult.data;

    // Check if slug exists (excluding current)
    const existing = await prisma.service.findFirst({
      where: { slug: data.slug, NOT: { id } },
    });

    if (existing) {
      return { success: false, errors: { slug: "A service with this slug already exists" } };
    }

    await prisma.service.update({
      where: { id },
      data: {
        ...data,
        imageUrl: data.imageUrl || null,
      },
    });

    revalidateTag(CACHE_TAGS.services);

    return { success: true };
  } catch (error) {
    console.error("Update service error:", error);
    return { success: false, message: "Failed to update service" };
  }
}

export async function deleteService(id: string) {
  try {
    await requireAdmin();

    await prisma.service.delete({ where: { id } });

    revalidateTag(CACHE_TAGS.services);

    return { success: true };
  } catch (error) {
    console.error("Delete service error:", error);
    return { success: false, message: "Failed to delete service" };
  }
}
