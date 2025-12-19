import type { Metadata } from "next";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { getSiteSettings } from "@/lib/data";
import { ContactForm } from "@/components/public/contact-form";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Ace Service Group LLC for construction and home services in Lansdale, PA. Request a quote today.",
};

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const phoneLink = `tel:${settings.phone.replace(/[^\d+]/g, "")}`;

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gray-900 text-white py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Contact Us
            </h1>
            <p className="mt-6 text-lg text-gray-300">
              Ready to start your project? Get in touch with us today. We&apos;re here to turn your problems into solutions.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Send Us a Message
              </h2>
              <ContactForm />
            </div>

            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Contact Information
              </h2>

              <div className="bg-gray-50 rounded-2xl p-8">
                <ul className="space-y-6">
                  <li>
                    <a
                      href={phoneLink}
                      className="flex items-start gap-4 text-gray-600 hover:text-blue-600 transition-colors group"
                    >
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 transition-colors">
                        <Phone className="h-5 w-5 text-blue-600 group-hover:text-white transition-colors" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Phone</p>
                        <p className="text-lg">{settings.phone}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          Call us anytime
                        </p>
                      </div>
                    </a>
                  </li>

                  <li>
                    <a
                      href={`mailto:${settings.email}`}
                      className="flex items-start gap-4 text-gray-600 hover:text-blue-600 transition-colors group"
                    >
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 transition-colors">
                        <Mail className="h-5 w-5 text-blue-600 group-hover:text-white transition-colors" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Email</p>
                        <p className="text-lg break-all">{settings.email}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          We&apos;ll respond within 24 hours
                        </p>
                      </div>
                    </a>
                  </li>

                  <li className="flex items-start gap-4 text-gray-600">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Service Area</p>
                      <p className="text-lg">{settings.serviceArea || "Lansdale, PA and surrounding areas"}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Montgomery County, PA
                      </p>
                    </div>
                  </li>

                  <li className="flex items-start gap-4 text-gray-600">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Hours</p>
                      <p className="text-lg">{settings.hours || "Always open"}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Available for emergencies
                      </p>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Quick Call CTA */}
              <div className="mt-8 bg-blue-600 rounded-2xl p-8 text-white">
                <h3 className="text-xl font-semibold mb-2">
                  Need Immediate Help?
                </h3>
                <p className="text-blue-100 mb-4">
                  Call us directly for faster response on urgent projects.
                </p>
                <a
                  href={phoneLink}
                  className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                >
                  <Phone className="h-5 w-5" />
                  {settings.phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
