import { prisma } from "@/lib/db";
import { SettingsForm } from "@/components/admin/settings-form";
import { ServicesManager } from "@/components/admin/services-manager";

async function getSiteSettings() {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: "default" },
  });

  // Return defaults if not found
  if (!settings) {
    return {
      id: "default",
      businessName: "Ace Service Group LLC",
      tagline: "At Ace Service Group, we turn problems into solutions.",
      introText: null,
      phone: "(267) 640-5958",
      email: "aceservicegroupllc@gmail.com",
      hours: "Always open",
      serviceArea: "Lansdale, PA and surrounding areas",
      address: null,
      facebookUrl: null,
      instagramUrl: null,
      twitterUrl: null,
      linkedinUrl: null,
      youtubeUrl: null,
      heroHeadline: "Quality Construction & Home Services",
      heroSubheadline:
        "From simple plumbing calls to full scale renovations - we turn problems into solutions.",
      heroCta1Text: "Call Now",
      heroCta1Link: "tel:+12676405958",
      heroCta2Text: "Request a Quote",
      heroCta2Link: "/contact",
      heroImageUrl: null,
      aboutHeadline: "About Ace Service Group",
      aboutContent: null,
      aboutImageUrl: null,
      updatedAt: new Date(),
    };
  }

  return settings;
}

async function getServices() {
  return prisma.service.findMany({
    orderBy: { order: "asc" },
  });
}

export default async function SettingsPage() {
  const [settings, services] = await Promise.all([
    getSiteSettings(),
    getServices(),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Site Settings</h1>
        <p className="mt-1 text-gray-500">
          Manage your website content and configuration
        </p>
      </div>

      <div className="space-y-8">
        <SettingsForm settings={settings} />
        <ServicesManager services={services} />
      </div>
    </div>
  );
}
