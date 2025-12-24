import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatPhoneForTel(phone: string): string {
  return phone.replace(/[^\d+]/g, "");
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length).trim() + "...";
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function formatValidationErrors(zodError: {
  issues: Array<{ path: Array<string | number | symbol>; message: string }>;
}): Record<string, string> {
  const errors: Record<string, string> = {};
  zodError.issues.forEach((err) => {
    const firstPath = err.path[0];
    if (
      firstPath !== undefined &&
      (typeof firstPath === "string" || typeof firstPath === "number")
    ) {
      errors[firstPath.toString()] = err.message;
    }
  });
  return errors;
}
