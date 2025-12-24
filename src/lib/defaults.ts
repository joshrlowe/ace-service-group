import type { SiteSettings } from "@prisma/client";

export const DEFAULT_SITE_SETTINGS: Omit<SiteSettings, "updatedAt"> & {
  updatedAt: Date;
} = {
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
