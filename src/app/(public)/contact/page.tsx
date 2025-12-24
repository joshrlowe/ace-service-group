import type { Metadata } from "next";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { getSiteSettings } from "@/lib/data";
import { ContactForm } from "@/components/public/contact-form";
import { PageAnimations } from "@/components/public/page-animations";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Ace Service Group LLC for construction and home services in Lansdale, PA. Request a quote today.",
};

export default async function ContactPage() {
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
              Contact Us
            </h1>
            <p className="hero-subtext mt-6 text-lg text-[#FFFFFF]">
              Ready to start your project? Get in touch with us today.
              We&apos;re here to turn your problems into solutions.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="animate-section py-20 md:py-28 lg:py-32 bg-[#121212]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="animate-item">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
                Send Us a Message
              </h2>
              <ContactForm />
            </div>

            {/* Contact Info */}
            <div className="animate-item">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
                Contact Information
              </h2>

              <div className="bg-[#121212] rounded-2xl p-8">
                <ul className="space-y-6">
                  <li>
                    <a
                      href={phoneLink}
                      className="flex items-start gap-4 text-[#E0E0E0] hover:text-[#B71C1C] transition-colors group"
                    >
                      <div className="w-12 h-12 bg-[#B71C1C]/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-[#B71C1C] transition-colors">
                        <Phone className="h-5 w-5 text-[#B71C1C] group-hover:text-white transition-colors" />
                      </div>
                      <div>
                        <p className="font-semibold text-white">Phone</p>
                        <p className="text-lg">{settings.phone}</p>
                        <p className="text-sm text-[#E0E0E0] mt-1">
                          Call us anytime
                        </p>
                      </div>
                    </a>
                  </li>

                  <li>
                    <a
                      href={`mailto:${settings.email}`}
                      className="flex items-start gap-4 text-[#E0E0E0] hover:text-[#B71C1C] transition-colors group"
                    >
                      <div className="w-12 h-12 bg-[#B71C1C]/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-[#B71C1C] transition-colors">
                        <Mail className="h-5 w-5 text-[#B71C1C] group-hover:text-white transition-colors" />
                      </div>
                      <div>
                        <p className="font-semibold text-white">Email</p>
                        <p className="text-lg break-all">{settings.email}</p>
                        <p className="text-sm text-[#E0E0E0] mt-1">
                          We&apos;ll respond within 24 hours
                        </p>
                      </div>
                    </a>
                  </li>

                  <li className="flex items-start gap-4 text-[#E0E0E0]">
                    <div className="w-12 h-12 bg-[#B71C1C]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-5 w-5 text-[#B71C1C]" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">Service Area</p>
                      <p className="text-lg">
                        {settings.serviceArea ||
                          "Lansdale, PA and surrounding areas"}
                      </p>
                      <p className="text-sm text-[#E0E0E0] mt-1">
                        Montgomery County, PA
                      </p>
                    </div>
                  </li>

                  <li className="flex items-start gap-4 text-[#E0E0E0]">
                    <div className="w-12 h-12 bg-[#B71C1C]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="h-5 w-5 text-[#B71C1C]" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">Hours</p>
                      <p className="text-lg">
                        {settings.hours || "Always open"}
                      </p>
                      <p className="text-sm text-[#E0E0E0] mt-1">
                        Available for emergencies
                      </p>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Quick Call CTA */}
              <div className="mt-8 bg-[#121212] rounded-2xl p-8 border border-[#B71C1C]/30">
                <h3 className="text-xl font-semibold mb-2 text-white">
                  Need Immediate Help?
                </h3>
                <p className="text-[#E0E0E0] mb-4">
                  Call us directly for faster response on urgent projects.
                </p>
                <a
                  href={phoneLink}
                  className="inline-flex items-center gap-2 bg-[#B71C1C] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#9A1B1B] transition-colors"
                >
                  <Phone className="h-5 w-5" />
                  {settings.phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageAnimations>
  );
}
