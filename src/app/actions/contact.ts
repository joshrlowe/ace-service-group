"use server";

import { prisma } from "@/lib/db";
import { contactFormSchema } from "@/lib/validations";
import { headers } from "next/headers";

const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const MAX_SUBMISSIONS_PER_WINDOW = 5;

async function checkRateLimit(identifier: string): Promise<boolean> {
  const now = new Date();

  // Clean up expired rate limits
  await prisma.rateLimit.deleteMany({
    where: { expiresAt: { lt: now } },
  });

  // Check current rate limit
  const rateLimit = await prisma.rateLimit.findUnique({
    where: { id: identifier },
  });

  if (!rateLimit) {
    // Create new rate limit entry
    await prisma.rateLimit.create({
      data: {
        id: identifier,
        count: 1,
        expiresAt: new Date(now.getTime() + RATE_LIMIT_WINDOW),
      },
    });
    return true;
  }

  if (rateLimit.count >= MAX_SUBMISSIONS_PER_WINDOW) {
    return false;
  }

  // Increment count
  await prisma.rateLimit.update({
    where: { id: identifier },
    data: { count: rateLimit.count + 1 },
  });

  return true;
}

export async function submitContactForm(formData: FormData) {
  try {
    // Get client IP for rate limiting
    const headersList = await headers();
    const ip =
      headersList.get("x-forwarded-for")?.split(",")[0] ||
      headersList.get("x-real-ip") ||
      "unknown";

    // Check rate limit
    const rateLimitId = `contact-${ip}`;
    const allowed = await checkRateLimit(rateLimitId);

    if (!allowed) {
      return {
        success: false,
        message: "Too many submissions. Please try again later.",
      };
    }

    // Parse and validate form data
    const rawData = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone") || undefined,
      subject: formData.get("subject") || undefined,
      message: formData.get("message"),
    };

    const validationResult = contactFormSchema.safeParse(rawData);

    if (!validationResult.success) {
      const errors: Record<string, string> = {};
      validationResult.error.errors.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0].toString()] = err.message;
        }
      });
      return {
        success: false,
        errors,
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
