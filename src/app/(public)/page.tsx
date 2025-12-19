import Link from "next/link";
import Image from "next/image";
import { Phone, ArrowRight, Droplets, Hammer, Home, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSiteSettings, getFeaturedServices, getFeaturedProjects } from "@/lib/data";

// Map service icons
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Droplets,
  Hammer,
  Home,
  Lightbulb,
};

export default async function HomePage() {
  const [settings, services, projects] = await Promise.all([
    getSiteSettings(),
    getFeaturedServices(),
    getFeaturedProjects(3),
  ]);

  const phoneLink = `tel:${settings.phone.replace(/[^\d+]/g, "")}`;

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 md:py-32 lg:py-40">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              {settings.heroHeadline}
            </h1>
            <p className="mt-6 text-lg md:text-xl text-gray-300 max-w-2xl">
              {settings.heroSubheadline}
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="text-base">
                <a href={phoneLink} className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  {settings.heroCta1Text || "Call Now"}
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-base bg-transparent border-white text-white hover:bg-white hover:text-gray-900">
                <Link href={settings.heroCta2Link || "/contact"}>
                  {settings.heroCta2Text || "Request a Quote"}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Our Services
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              From plumbing to full-scale renovations, we provide quality solutions for your home.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service) => {
              const Icon = service.icon ? iconMap[service.icon] : null;
              return (
                <div
                  key={service.id}
                  className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  {Icon && (
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-blue-600" />
                    </div>
                  )}
                  <h3 className="text-lg font-semibold text-gray-900">
                    {service.name}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 line-clamp-3">
                    {service.description}
                  </p>
                  <Link
                    href={`/services#${service.slug}`}
                    className="mt-4 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    Learn more
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <Button asChild variant="outline">
              <Link href="/services">View All Services</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      {projects.length > 0 && (
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Featured Projects
              </h2>
              <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                See the transformations we&apos;ve delivered for our clients.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  href={`/projects/${project.slug}`}
                  className="group"
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-gray-100">
                    {project.images[0] ? (
                      <Image
                        src={project.images[0].url}
                        alt={project.images[0].alt || project.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                        <span className="text-gray-400">No image</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-blue-600 font-medium">
                      {project.category}
                    </p>
                    <h3 className="mt-1 text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {project.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                      {project.shortDescription}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Button asChild>
                <Link href="/projects">View All Projects</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-blue-600">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Ready to Start Your Project?
          </h2>
          <p className="mt-4 text-lg text-blue-100 max-w-2xl mx-auto">
            Contact us today for a free consultation. We&apos;re here to turn your problems into solutions.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              <a href={phoneLink} className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                {settings.phone}
              </a>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600 bg-transparent">
              <Link href="/contact">Request a Quote</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
