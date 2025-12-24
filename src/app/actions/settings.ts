"use server";

import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { siteSettingsSchema, serviceSchema } from "@/lib/validations";
import { formatValidationErrors } from "@/lib/utils";
import {
  revalidateSettingsPaths,
  revalidateServicePaths,
} from "@/lib/revalidation";
import {
  parseServiceFormData,
  parseSiteSettingsFormData,
  normalizeNullableUrls,
} from "@/lib/form-parsers";

export async function updateSiteSettings(formData: FormData) {
  try {
    await requireAdmin();

    const rawData = parseSiteSettingsFormData(formData);

    const validationResult = siteSettingsSchema.safeParse(rawData);

    if (!validationResult.success) {
      return {
        success: false,
        errors: formatValidationErrors(validationResult.error),
      };
    }

    const data = validationResult.data;
    const normalizedUrls = normalizeNullableUrls(data);

    await prisma.siteSettings.upsert({
      where: { id: "default" },
      update: { ...data, ...normalizedUrls },
      create: { id: "default", ...data, ...normalizedUrls },
    });

    revalidateSettingsPaths();

    return { success: true };
  } catch (error) {
    console.error("Update settings error:", error);
    return { success: false, message: "Failed to update settings" };
  }
}

export async function createService(formData: FormData) {
  try {
    await requireAdmin();

    const rawData = parseServiceFormData(formData);

    const validationResult = serviceSchema.safeParse(rawData);

    if (!validationResult.success) {
      return {
        success: false,
        errors: formatValidationErrors(validationResult.error),
      };
    }

    const data = validationResult.data;

    // Check if slug exists
    const existing = await prisma.service.findUnique({
      where: { slug: data.slug },
    });

    if (existing) {
      return {
        success: false,
        errors: { slug: "A service with this slug already exists" },
      };
    }

    await prisma.service.create({
      data: {
        ...data,
        imageUrl: data.imageUrl || null,
      },
    });

    revalidateServicePaths();

    return { success: true };
  } catch (error) {
    console.error("Create service error:", error);
    return { success: false, message: "Failed to create service" };
  }
}

export async function updateService(id: string, formData: FormData) {
  try {
    await requireAdmin();

    const rawData = parseServiceFormData(formData);

    const validationResult = serviceSchema.safeParse(rawData);

    if (!validationResult.success) {
      return {
        success: false,
        errors: formatValidationErrors(validationResult.error),
      };
    }

    const data = validationResult.data;

    // Check if slug exists (excluding current)
    const existing = await prisma.service.findFirst({
      where: { slug: data.slug, NOT: { id } },
    });

    if (existing) {
      return {
        success: false,
        errors: { slug: "A service with this slug already exists" },
      };
    }

    await prisma.service.update({
      where: { id },
      data: {
        ...data,
        imageUrl: data.imageUrl || null,
      },
    });

    revalidateServicePaths();

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

    revalidateServicePaths();

    return { success: true };
  } catch (error) {
    console.error("Delete service error:", error);
    return { success: false, message: "Failed to delete service" };
  }
}
