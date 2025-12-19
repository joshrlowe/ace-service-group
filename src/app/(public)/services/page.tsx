import type { Metadata } from "next";
import Link from "next/link";
import { Phone, Droplets, Hammer, Home, Lightbulb, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getServices, getSiteSettings } from "@/lib/data";

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
    <>
      {/* Hero Section */}
      <section className="bg-gray-900 text-white py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Our Services
            </h1>
            <p className="mt-6 text-lg text-gray-300">
              From simple plumbing calls to full-scale renovations, we provide comprehensive construction and home services with quality and care.
            </p>
          </div>
        </div>
      </section>

      {/* Services List */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {services.map((service, index) => {
              const Icon = service.icon ? iconMap[service.icon] : null;
              const isEven = index % 2 === 0;

              return (
                <div
                  key={service.id}
                  id={service.slug}
                  className={`flex flex-col ${isEven ? "md:flex-row" : "md:flex-row-reverse"} gap-8 md:gap-12 items-center scroll-mt-20`}
                >
                  {/* Icon/Image Side */}
                  <div className="w-full md:w-1/3 flex justify-center">
                    <div className="w-32 h-32 md:w-48 md:h-48 bg-blue-100 rounded-2xl flex items-center justify-center">
                      {Icon ? (
                        <Icon className="h-16 w-16 md:h-24 md:w-24 text-blue-600" />
                      ) : (
                        <span className="text-6xl text-blue-600 font-bold">
                          {service.name[0]}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Content Side */}
                  <div className="w-full md:w-2/3">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                      {service.name}
                    </h2>
                    <p className="mt-4 text-gray-600 leading-relaxed">
                      {service.description}
                    </p>
                    <Button asChild className="mt-6">
                      <Link href="/contact" className="flex items-center gap-2">
                        Get a Quote
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {services.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Services information coming soon.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Need a Different Service?
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            We handle a wide range of construction and home improvement projects. Contact us to discuss your specific needs.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg">
              <a href={phoneLink} className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Call {settings.phone}
              </a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/contact">Send Us a Message</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
