import { revalidatePath } from "next/cache";

/**
 * Revalidates common paths after data changes
 */
export function revalidateCommonPaths() {
  revalidatePath("/", "layout");
  revalidatePath("/projects", "layout");
  revalidatePath("/services", "layout");
  revalidatePath("/about", "layout");
}

/**
 * Revalidates project-related paths
 */
export function revalidateProjectPaths() {
  revalidatePath("/", "layout");
  revalidatePath("/projects", "layout");
}

/**
 * Revalidates service-related paths
 */
export function revalidateServicePaths() {
  revalidatePath("/", "layout");
  revalidatePath("/services", "layout");
}

/**
 * Revalidates settings-related paths
 */
export function revalidateSettingsPaths() {
  revalidatePath("/", "layout");
  revalidatePath("/about", "layout");
}
