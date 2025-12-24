import Link from "next/link";
import Image from "next/image";
import {
  Phone,
  ArrowRight,
  Droplets,
  Hammer,
  Home,
  Lightbulb,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getSiteSettings,
  getFeaturedServices,
  getFeaturedProjects,
} from "@/lib/data";
import { AnimatedHomepage } from "@/components/public/animated-homepage";
import { Logo3D } from "@/components/public/logo-3d";

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
    <AnimatedHomepage>
      {/* Hero Section */}
      <section className="hero-section relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 pb-12 md:py-28 lg:py-36">
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Logo 3D - First on mobile, second on desktop */}
            <div className="hero-logo flex items-center justify-center order-1 lg:order-2 w-full lg:w-auto -mt-4 md:mt-0">
              <div className="relative w-full max-w-[90vw] md:max-w-xl lg:max-w-md aspect-square max-h-[60vh] md:max-h-none md:h-[500px] lg:h-[400px]">
                <div className="absolute inset-0 bg-gradient-to-br from-[#B71C1C]/20 to-transparent rounded-full blur-3xl" />
                <Logo3D className="relative w-full h-full" />
              </div>
            </div>
            {/* Text Content - Second on mobile, first on desktop */}
            <div className="order-2 lg:order-1">
              <h1 className="hero-text text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#FFFFFF]">
                {settings.heroHeadline}
              </h1>
              <p className="hero-subtext mt-6 text-lg md:text-xl text-[#FFFFFF] max-w-2xl">
                {settings.heroSubheadline}
              </p>
              <div className="hero-buttons mt-10 flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="text-base">
                  <a href={phoneLink} className="flex items-center gap-2">
                    <Phone className="h-5 w-5" />
                    {settings.heroCta1Text || "Call Now"}
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="text-base bg-transparent border-white text-white hover:bg-white hover:text-[#121212]"
                >
                  <Link
                    href={settings.heroCta2Link || "/contact"}
                    className="flex items-center gap-2"
                  >
                    {settings.heroCta2Text || "Request a Quote"}
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="animate-section py-12 md:py-16 lg:py-20 bg-[#121212]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Our Services
            </h2>
            <p className="section-description mt-4 text-lg text-[#B0B0B0] max-w-2xl mx-auto">
              From plumbing to full-scale renovations, we provide quality
              solutions for your home.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service) => {
              const Icon = service.icon ? iconMap[service.icon] : null;
              return (
                <div
                  key={service.id}
                  className="service-card bg-[#121212] rounded-xl p-6 border border-transparent hover:border-[#B71C1C]/30 hover:shadow-lg transition-all cursor-pointer"
                >
                  {Icon && (
                    <div className="w-12 h-12 bg-[#B71C1C]/20 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-[#B71C1C]" />
                    </div>
                  )}
                  <h3 className="text-lg font-semibold text-white">
                    {service.name}
                  </h3>
                  <p className="mt-2 text-sm text-[#E0E0E0] line-clamp-3">
                    {service.description}
                  </p>
                  <Link
                    href={`/services#${service.slug}`}
                    className="mt-4 inline-flex items-center text-sm font-medium text-[#B71C1C] hover:text-[#9A1B1B]"
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
        <section className="animate-section py-20 md:py-28 lg:py-32 bg-[#121212]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                Featured Projects
              </h2>
              <p className="section-description mt-4 text-lg text-[#B0B0B0] max-w-2xl mx-auto">
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
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-[#121212]">
                    {project.images[0] ? (
                      <Image
                        src={project.images[0].url}
                        alt={project.images[0].alt || project.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-[#121212]">
                        <span className="text-[#E0E0E0]">No image</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-[#B71C1C] font-medium">
                      {project.category}
                    </p>
                    <h3 className="mt-1 text-lg font-semibold text-white group-hover:text-[#B71C1C] transition-colors">
                      {project.title}
                    </h3>
                    <p className="mt-1 text-sm text-[#E0E0E0] line-clamp-2">
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
      <section className="animate-section py-12 md:py-16 lg:py-20 bg-[#121212]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Ready to Start Your Project?
          </h2>
          <p className="section-description mt-4 text-lg text-[#B0B0B0] max-w-2xl mx-auto">
            Contact us today for a free consultation. We&apos;re here to turn
            your problems into solutions.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="bg-[#B71C1C] hover:bg-[#9A1B1B] text-white font-semibold px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all"
            >
              <a href={phoneLink} className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                {settings.phone}
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-[#121212] bg-transparent"
            >
              <Link href="/contact">Request a Quote</Link>
            </Button>
          </div>
        </div>
      </section>
    </AnimatedHomepage>
  );
}
