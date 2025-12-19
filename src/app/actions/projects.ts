"use server";

import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { projectSchema } from "@/lib/validations";
import { CACHE_TAGS } from "@/lib/data";
import { slugify } from "@/lib/utils";

export async function createProject(formData: FormData) {
  try {
    await requireAdmin();

    const rawData = {
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
        ? (formData.get("tags") as string).split(",").map((t) => t.trim()).filter(Boolean)
        : [],
      imageUrls: formData.getAll("imageUrls").filter(Boolean) as string[],
    };

    const validationResult = projectSchema.safeParse(rawData);

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

    // Check if slug already exists
    const existingProject = await prisma.project.findUnique({
      where: { slug: data.slug },
    });

    if (existingProject) {
      return {
        success: false,
        errors: { slug: "A project with this slug already exists" },
      };
    }

    const project = await prisma.project.create({
      data: {
        title: data.title,
        slug: data.slug,
        shortDescription: data.shortDescription,
        fullDescription: data.fullDescription,
        category: data.category,
        location: data.location,
        projectDate: data.projectDate ? new Date(data.projectDate) : null,
        featured: data.featured,
        published: data.published,
        tags: data.tags,
        images: {
          create: data.imageUrls.map((url, index) => ({
            url,
            order: index,
          })),
        },
      },
    });

    revalidateTag(CACHE_TAGS.projects);

    return { success: true, project };
  } catch (error) {
    console.error("Create project error:", error);
    return { success: false, message: "Failed to create project" };
  }
}

export async function updateProject(id: string, formData: FormData) {
  try {
    await requireAdmin();

    const rawData = {
      title: formData.get("title"),
      slug: formData.get("slug"),
      shortDescription: formData.get("shortDescription"),
      fullDescription: formData.get("fullDescription") || null,
      category: formData.get("category"),
      location: formData.get("location") || null,
      projectDate: formData.get("projectDate") || null,
      featured: formData.get("featured") === "true",
      published: formData.get("published") !== "false",
      tags: formData.get("tags")
        ? (formData.get("tags") as string).split(",").map((t) => t.trim()).filter(Boolean)
        : [],
      imageUrls: formData.getAll("imageUrls").filter(Boolean) as string[],
    };

    const validationResult = projectSchema.safeParse(rawData);

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

    // Check if slug already exists (excluding current project)
    const existingProject = await prisma.project.findFirst({
      where: {
        slug: data.slug,
        NOT: { id },
      },
    });

    if (existingProject) {
      return {
        success: false,
        errors: { slug: "A project with this slug already exists" },
      };
    }

    // Delete existing images and recreate
    await prisma.projectImage.deleteMany({
      where: { projectId: id },
    });

    const project = await prisma.project.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug,
        shortDescription: data.shortDescription,
        fullDescription: data.fullDescription,
        category: data.category,
        location: data.location,
        projectDate: data.projectDate ? new Date(data.projectDate) : null,
        featured: data.featured,
        published: data.published,
        tags: data.tags,
        images: {
          create: data.imageUrls.map((url, index) => ({
            url,
            order: index,
          })),
        },
      },
    });

    revalidateTag(CACHE_TAGS.projects);

    return { success: true, project };
  } catch (error) {
    console.error("Update project error:", error);
    return { success: false, message: "Failed to update project" };
  }
}

export async function deleteProject(id: string) {
  try {
    await requireAdmin();

    await prisma.project.delete({
      where: { id },
    });

    revalidateTag(CACHE_TAGS.projects);

    return { success: true };
  } catch (error) {
    console.error("Delete project error:", error);
    return { success: false, message: "Failed to delete project" };
  }
}

export async function toggleProjectFeatured(id: string) {
  try {
    await requireAdmin();

    const project = await prisma.project.findUnique({
      where: { id },
      select: { featured: true },
    });

    if (!project) {
      return { success: false, message: "Project not found" };
    }

    const updated = await prisma.project.update({
      where: { id },
      data: { featured: !project.featured },
    });

    revalidateTag(CACHE_TAGS.projects);

    return { success: true, featured: updated.featured };
  } catch (error) {
    console.error("Toggle featured error:", error);
    return { success: false, message: "Failed to update project" };
  }
}
