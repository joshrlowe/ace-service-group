import type { Metadata } from "next";
import Link from "next/link";
import { Phone, MapPin, Clock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSiteSettings } from "@/lib/data";
import { PageAnimations } from "@/components/public/page-animations";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Ace Service Group LLC - professional construction and home services in Lansdale, PA. We turn problems into solutions.",
};

export default async function AboutPage() {
  const settings = await getSiteSettings();
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
              {settings.aboutHeadline || "About Ace Service Group"}
            </h1>
            <p className="hero-subtext mt-6 text-lg text-[#FFFFFF]">
              {settings.tagline}
            </p>
          </div>
        </div>
      </section>

      {/* About Content */}
      <section className="animate-section py-20 md:py-28 lg:py-32 bg-[#121212]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Main Content */}
            <div className="animate-item">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
                Who We Are
              </h2>
              {settings.aboutContent ? (
                <div className="prose prose-gray max-w-none">
                  {settings.aboutContent.split("\n").map((paragraph, index) => (
                    <p
                      key={index}
                      className="text-[#E0E0E0] mb-4 leading-relaxed"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              ) : (
                <div className="space-y-4 text-[#E0E0E0] leading-relaxed">
                  <p>
                    Ace Service Group LLC is a construction company based in
                    Lansdale, Pennsylvania. We specialize in turning problems
                    into solutions, handling everything from simple plumbing
                    calls to full-scale renovations.
                  </p>
                  <p>
                    Our services include plumbing, renovations, basement
                    transformations (from framing to finishes), and permanent
                    outdoor lighting installation. We take pride in delivering
                    quality work that transforms your spaces.
                  </p>
                  <p>
                    Whether you need a quick fix or a complete renovation,
                    we&apos;re here to help. Contact us today to discuss your
                    project.
                  </p>
                </div>
              )}
            </div>

            {/* Contact Info Card */}
            <div className="animate-item bg-[#121212] rounded-2xl p-8">
              <h3 className="text-xl font-semibold text-white mb-6">
                Get In Touch
              </h3>
              <ul className="space-y-4">
                <li>
                  <a
                    href={phoneLink}
                    className="flex items-start gap-3 text-[#E0E0E0] hover:text-[#B71C1C] transition-colors"
                  >
                    <Phone className="h-5 w-5 flex-shrink-0 mt-0.5 text-[#B71C1C]" />
                    <div>
                      <p className="font-medium text-white">Phone</p>
                      <p>{settings.phone}</p>
                    </div>
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${settings.email}`}
                    className="flex items-start gap-3 text-[#E0E0E0] hover:text-[#B71C1C] transition-colors"
                  >
                    <Mail className="h-5 w-5 flex-shrink-0 mt-0.5 text-[#B71C1C]" />
                    <div>
                      <p className="font-medium text-white">Email</p>
                      <p>{settings.email}</p>
                    </div>
                  </a>
                </li>
                <li className="flex items-start gap-3 text-[#E0E0E0]">
                  <MapPin className="h-5 w-5 flex-shrink-0 mt-0.5 text-[#B71C1C]" />
                  <div>
                    <p className="font-medium text-white">Service Area</p>
                    <p>
                      {settings.serviceArea ||
                        "Lansdale, PA and surrounding areas"}
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3 text-[#E0E0E0]">
                  <Clock className="h-5 w-5 flex-shrink-0 mt-0.5 text-[#B71C1C]" />
                  <div>
                    <p className="font-medium text-white">Hours</p>
                    <p>{settings.hours || "Always open"}</p>
                  </div>
                </li>
              </ul>

              <div className="mt-8 pt-6 border-t border-gray-800">
                <Button asChild className="w-full">
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="animate-section py-20 md:py-28 lg:py-32 bg-[#121212]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              What We Stand For
            </h2>
            <p className="section-description mt-4 text-lg text-[#B0B0B0] max-w-2xl mx-auto">
              Our core values guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="animate-grid-item bg-[#121212] rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-white">Quality Work</h3>
              <p className="text-[#E0E0E0] mt-2">
                We take pride in delivering high-quality craftsmanship on every
                project, no matter the size.
              </p>
            </div>

            <div className="animate-grid-item bg-[#121212] rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-white">
                Problem Solvers
              </h3>
              <p className="text-[#E0E0E0] mt-2">
                We turn problems into solutions. From quick fixes to complex
                renovations, we find the right approach.
              </p>
            </div>

            <div className="animate-grid-item bg-[#121212] rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-white">
                Transformations
              </h3>
              <p className="text-[#E0E0E0] mt-2">
                We love creating transformations that improve your living spaces
                and add value to your home.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="animate-section py-20 md:py-28 lg:py-32 bg-[#121212]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Ready to Get Started?
          </h2>
          <p className="section-description mt-4 text-lg text-[#B0B0B0] max-w-2xl mx-auto">
            Contact us today to discuss your project. We&apos;re here to help
            bring your vision to life.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg">
              <a href={phoneLink} className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Call Now
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-[#121212] bg-transparent"
            >
              <Link href="/contact">Send a Message</Link>
            </Button>
          </div>
        </div>
      </section>
    </PageAnimations>
  );
}
