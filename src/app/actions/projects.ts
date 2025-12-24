"use server";

import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { projectSchema } from "@/lib/validations";
import { formatValidationErrors } from "@/lib/utils";
import { revalidateProjectPaths } from "@/lib/revalidation";
import {
  parseProjectFormData,
  mapProjectDataForDatabase,
} from "@/lib/form-parsers";

export async function createProject(formData: FormData) {
  try {
    await requireAdmin();

    const rawData = parseProjectFormData(formData);

    const validationResult = projectSchema.safeParse(rawData);

    if (!validationResult.success) {
      return {
        success: false,
        errors: formatValidationErrors(validationResult.error),
      };
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
      data: mapProjectDataForDatabase(data),
    });

    revalidateProjectPaths();

    return { success: true, project };
  } catch (error) {
    console.error("Create project error:", error);
    return { success: false, message: "Failed to create project" };
  }
}

export async function updateProject(id: string, formData: FormData) {
  try {
    await requireAdmin();

    const rawData = parseProjectFormData(formData);

    const validationResult = projectSchema.safeParse(rawData);

    if (!validationResult.success) {
      return {
        success: false,
        errors: formatValidationErrors(validationResult.error),
      };
    }

    const data = validationResult.data;

    const slugConflict = await prisma.project.findFirst({
      where: { slug: data.slug, NOT: { id } },
    });

    if (slugConflict) {
      return {
        success: false,
        errors: { slug: "A project with this slug already exists" },
      };
    }

    // Delete existing images before recreating
    await prisma.projectImage.deleteMany({
      where: { projectId: id },
    });

    const project = await prisma.project.update({
      where: { id },
      data: mapProjectDataForDatabase(data),
    });

    revalidateProjectPaths();

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

    revalidateProjectPaths();

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

    revalidateProjectPaths();

    return { success: true, featured: updated.featured };
  } catch (error) {
    console.error("Toggle featured error:", error);
    return { success: false, message: "Failed to update project" };
  }
}
