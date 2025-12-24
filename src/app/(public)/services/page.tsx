import type { Metadata } from "next";
import Link from "next/link";
import {
  Phone,
  Droplets,
  Hammer,
  Home,
  Lightbulb,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getServices, getSiteSettings } from "@/lib/data";
import { PageAnimations } from "@/components/public/page-animations";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Professional construction services including plumbing, renovations, basement transformations, and outdoor lighting installation in Lansdale, PA.",
};

// Map service icons
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Droplets,
  Hammer,
  Home,
  Lightbulb,
};

export default async function ServicesPage() {
  const [services, settings] = await Promise.all([
    getServices(),
    getSiteSettings(),
  ]);

  const phoneLink = `tel:${settings.phone.replace(/[^\d+]/g, "")}`;

  return (
    <PageAnimations>
      {/* Hero Section */}
      <section className="hero-section relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-20 md:py-28 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-[#B71C1C]/10 via-transparent to-[#B71C1C]/5" />
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="hero-text text-4xl md:text-5xl font-bold tracking-tight text-[#FFFFFF]">
              Our Services
            </h1>
            <p className="hero-subtext mt-6 text-lg text-[#FFFFFF]">
              From simple plumbing calls to full-scale renovations, we provide
              comprehensive construction and home services with quality and
              care.
            </p>
          </div>
        </div>
      </section>

      {/* Services List */}
      <section className="animate-section py-20 md:py-28 lg:py-32 bg-[#121212]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {services.map((service) => {
              const Icon = service.icon ? iconMap[service.icon] : null;

              return (
                <div
                  key={service.id}
                  id={service.slug}
                  className="animate-item bg-[#121212] rounded-2xl p-6 md:p-8 border border-transparent hover:border-[#B71C1C]/30 transition-all scroll-mt-20"
                >
                  <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
                    {/* Icon/Image Side */}
                    <div className="flex-shrink-0">
                      <div className="w-24 h-24 md:w-32 md:h-32 bg-[#B71C1C]/20 rounded-xl flex items-center justify-center">
                        {Icon ? (
                          <Icon className="h-12 w-12 md:h-16 md:w-16 text-[#B71C1C]" />
                        ) : (
                          <span className="text-4xl md:text-5xl text-[#B71C1C] font-bold">
                            {service.name[0]}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Content Side */}
                    <div className="flex-1">
                      <h2 className="text-2xl md:text-3xl font-bold text-white">
                        {service.name}
                      </h2>
                      <p className="mt-4 text-[#E0E0E0] leading-relaxed">
                        {service.description}
                      </p>
                      <Button asChild className="mt-6">
                        <Link
                          href="/contact"
                          className="flex items-center gap-2"
                        >
                          Get a Quote
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {services.length === 0 && (
            <div className="text-center py-12">
              <p className="text-[#E0E0E0]">
                Services information coming soon.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="animate-section py-20 md:py-28 lg:py-32 bg-[#121212]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Need a Different Service?
          </h2>
          <p className="section-description mt-4 text-lg text-[#B0B0B0] max-w-2xl mx-auto">
            We handle a wide range of construction and home improvement
            projects. Contact us to discuss your specific needs.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg">
              <a href={phoneLink} className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Call {settings.phone}
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-[#121212] bg-transparent"
            >
              <Link href="/contact">Send Us a Message</Link>
            </Button>
          </div>
        </div>
      </section>
    </PageAnimations>
  );
}
