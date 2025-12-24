"use server";

import { prisma } from "@/lib/db";
import { contactFormSchema } from "@/lib/validations";
import { formatValidationErrors } from "@/lib/utils";
import { parseContactFormData } from "@/lib/form-parsers";
import { headers } from "next/headers";

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_SUBMISSIONS_PER_WINDOW = 5;

async function getClientIp(): Promise<string> {
  const headersList = await headers();
  return (
    headersList.get("x-forwarded-for")?.split(",")[0] ||
    headersList.get("x-real-ip") ||
    "unknown"
  );
}

async function checkRateLimit(identifier: string): Promise<boolean> {
  const now = new Date();
  const expirationTime = new Date(now.getTime() + RATE_LIMIT_WINDOW_MS);

  // Clean up expired rate limits
  await prisma.rateLimit.deleteMany({
    where: { expiresAt: { lt: now } },
  });

  // Check current rate limit
  const rateLimit = await prisma.rateLimit.findUnique({
    where: { id: identifier },
  });

  if (!rateLimit) {
    await prisma.rateLimit.create({
      data: { id: identifier, count: 1, expiresAt: expirationTime },
    });
    return true;
  }

  if (rateLimit.count >= MAX_SUBMISSIONS_PER_WINDOW) {
    return false;
  }

  await prisma.rateLimit.update({
    where: { id: identifier },
    data: { count: rateLimit.count + 1 },
  });

  return true;
}

export async function submitContactForm(formData: FormData) {
  try {
    const clientIp = await getClientIp();
    const rateLimitId = `contact-${clientIp}`;
    const allowed = await checkRateLimit(rateLimitId);

    if (!allowed) {
      return {
        success: false,
        message: "Too many submissions. Please try again later.",
      };
    }

    // Parse and validate form data
    const rawData = parseContactFormData(formData);

    const validationResult = contactFormSchema.safeParse(rawData);

    if (!validationResult.success) {
      return {
        success: false,
        errors: formatValidationErrors(validationResult.error),
        message: "Please fix the validation errors.",
      };
    }

    const data = validationResult.data;

    // Create submission in database
    await prisma.contactSubmission.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        subject: data.subject || null,
        message: data.message,
      },
    });

    return {
      success: true,
      message: "Your message has been sent successfully!",
    };
  } catch (error) {
    console.error("Contact form submission error:", error);
    return {
      success: false,
      message: "An error occurred. Please try again later.",
    };
  }
}
