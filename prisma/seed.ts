import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Get admin credentials from environment variables
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminName = process.env.ADMIN_NAME || "Admin";

  if (!adminEmail || !adminPassword) {
    throw new Error(
      "ADMIN_EMAIL and ADMIN_PASSWORD environment variables are required for seeding"
    );
  }

  // Create or update admin user
  const passwordHash = await hash(adminPassword, 12);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail.toLowerCase() },
    update: {
      passwordHash,
      name: adminName,
    },
    create: {
      email: adminEmail.toLowerCase(),
      passwordHash,
      name: adminName,
      role: "admin",
    },
  });

  console.log(`✅ Admin user created/updated: ${admin.email}`);

  // Create default site settings if not exists
  const settings = await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      businessName: "Ace Service Group LLC",
      tagline:
        "At Ace Service Group, we turn problems into solutions. From simple plumbing calls to full scale reno.",
      introText:
        "Professional construction and home services in Lansdale, PA. Quality workmanship you can trust.",
      phone: "(267) 640-5958",
      email: "aceservicegroupllc@gmail.com",
      hours: "Always open",
      serviceArea: "Lansdale, PA and surrounding areas in Pennsylvania",
      heroHeadline: "Quality Construction & Home Services",
      heroSubheadline:
        "From simple plumbing calls to full scale renovations - we turn problems into solutions.",
      heroCta1Text: "Call Now",
      heroCta1Link: "tel:+12676405958",
      heroCta2Text: "Request a Quote",
      heroCta2Link: "/contact",
      aboutHeadline: "About Ace Service Group",
      aboutContent: `Ace Service Group LLC is a construction company based in Lansdale, Pennsylvania. We specialize in turning problems into solutions, handling everything from simple plumbing calls to full-scale renovations.

Our services include plumbing, renovations, basement transformations (from framing to finishes), and permanent outdoor lighting installation. We take pride in delivering quality work that transforms your spaces.

Whether you need a quick fix or a complete renovation, we're here to help. Contact us today to discuss your project.`,
    },
  });

  console.log(`✅ Site settings initialized`);

  // Create default services
  const services = [
    {
      name: "Plumbing",
      slug: "plumbing",
      description:
        "Professional plumbing services for repairs, installations, and maintenance. From simple fixes to complex plumbing projects.",
      icon: "Droplets",
      featured: true,
      order: 1,
    },
    {
      name: "Renovations",
      slug: "renovations",
      description:
        "Full-scale renovation services to transform your home. We handle projects of all sizes with quality and care.",
      icon: "Hammer",
      featured: true,
      order: 2,
    },
    {
      name: "Basement Transformations",
      slug: "basement-transformations",
      description:
        "Complete basement finishing from framing to finishes. Turn your unused basement into a beautiful living space.",
      icon: "Home",
      featured: true,
      order: 3,
    },
    {
      name: "Outdoor Lighting",
      slug: "outdoor-lighting",
      description:
        "Permanent outdoor lighting installation including GOVEE permanent outdoor lights. From warm white ambiance to holiday themes.",
      icon: "Lightbulb",
      featured: true,
      order: 4,
    },
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: service,
      create: service,
    });
  }

  console.log(`✅ ${services.length} services created/updated`);

  console.log("🎉 Database seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
