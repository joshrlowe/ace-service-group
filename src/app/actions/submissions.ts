"use server";

import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { submissionNotesSchema } from "@/lib/validations";

export async function updateSubmission(
  id: string,
  data: { handled?: boolean; notes?: string | null }
) {
  try {
    await requireAdmin();

    const validationResult = submissionNotesSchema.safeParse(data);

    if (!validationResult.success) {
      return { success: false, message: "Invalid data" };
    }

    const updateData: { handled?: boolean; notes?: string | null } = {};

    if (data.handled !== undefined) {
      updateData.handled = data.handled;
    }

    if (data.notes !== undefined) {
      updateData.notes = data.notes || null;
    }

    await prisma.contactSubmission.update({
      where: { id },
      data: updateData,
    });

    return { success: true };
  } catch (error) {
    console.error("Update submission error:", error);
    return { success: false, message: "Failed to update submission" };
  }
}

export async function deleteSubmission(id: string) {
  try {
    await requireAdmin();

    await prisma.contactSubmission.delete({
      where: { id },
    });

    return { success: true };
  } catch (error) {
    console.error("Delete submission error:", error);
    return { success: false, message: "Failed to delete submission" };
  }
}
