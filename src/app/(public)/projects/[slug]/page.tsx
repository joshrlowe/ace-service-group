import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, Calendar, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getProjectBySlug, getSiteSettings } from "@/lib/data";
import { formatDate } from "@/lib/utils";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: project.title,
    description: project.shortDescription,
    openGraph: {
      title: project.title,
      description: project.shortDescription,
      images: project.images[0] ? [{ url: project.images[0].url }] : [],
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const [project, settings] = await Promise.all([
    getProjectBySlug(slug),
    getSiteSettings(),
  ]);

  if (!project) {
    notFound();
  }

  const phoneLink = `tel:${settings.phone.replace(/[^\d+]/g, "")}`;

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gray-900 text-white py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/projects"
            className="inline-flex items-center text-gray-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Link>
          <div className="max-w-3xl">
            <p className="text-blue-400 font-medium mb-2">{project.category}</p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
              {project.title}
            </h1>
            <p className="mt-4 text-lg text-gray-300">
              {project.shortDescription}
            </p>

            {/* Meta Info */}
            <div className="mt-6 flex flex-wrap gap-4 text-sm text-gray-400">
              {project.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {project.location}
                </span>
              )}
              {project.projectDate && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatDate(project.projectDate)}
                </span>
              )}
            </div>

            {/* Tags */}
            {project.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 bg-gray-800 text-gray-300 px-2 py-1 rounded text-xs"
                  >
                    <Tag className="h-3 w-3" />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Image Gallery */}
      {project.images.length > 0 && (
        <section className="py-12 md:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Main Image */}
            <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-gray-100 mb-4">
              <Image
                src={project.images[0].url}
                alt={project.images[0].alt || project.title}
                fill
                className="object-cover"
                sizes="100vw"
                priority
              />
            </div>

            {/* Thumbnail Grid */}
            {project.images.length > 1 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {project.images.slice(1).map((image, index) => (
                  <div
                    key={image.id}
                    className="relative aspect-[4/3] overflow-hidden rounded-lg bg-gray-100"
                  >
                    <Image
                      src={image.url}
                      alt={image.alt || `${project.title} - Image ${index + 2}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Description */}
      {project.fullDescription && (
        <section className="py-8 md:py-12">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              About This Project
            </h2>
            <div className="prose prose-gray max-w-none">
              {project.fullDescription.split("\n").map((paragraph, index) => (
                <p key={index} className="text-gray-600 mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Want a Similar Project?
          </h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Contact us today to discuss your project. We&apos;re ready to bring your vision to life.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg">
              <a href={phoneLink}>Call {settings.phone}</a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/contact">Get a Quote</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
