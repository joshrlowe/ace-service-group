import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getProjects, getProjectCategories } from "@/lib/data";
import { PageAnimations } from "@/components/public/page-animations";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Browse our portfolio of construction projects including renovations, plumbing, basement transformations, and more.",
};

interface ProjectsPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function ProjectsPage({
  searchParams,
}: ProjectsPageProps) {
  const params = await searchParams;
  const selectedCategory = params.category;

  const [projects, categories] = await Promise.all([
    getProjects({ category: selectedCategory }),
    getProjectCategories(),
  ]);

  return (
    <PageAnimations>
      {/* Hero Section */}
      <section className="hero-section relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-20 md:py-28 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-[#B71C1C]/10 via-transparent to-[#B71C1C]/5" />
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="hero-text text-4xl md:text-5xl font-bold tracking-tight text-[#FFFFFF]">
              Our Projects
            </h1>
            <p className="hero-subtext mt-6 text-lg text-[#FFFFFF]">
              Explore our portfolio of completed projects. Each project
              showcases our commitment to quality craftsmanship and attention to
              detail.
            </p>
          </div>
        </div>
      </section>

      {/* Filter & Projects Grid */}
      <section className="animate-section py-20 md:py-28 lg:py-32 bg-[#121212]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Category Filter */}
          {categories.length > 0 && (
            <div className="mb-12 animate-item">
              <div className="flex flex-wrap gap-2">
                <Link
                  href="/projects"
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    !selectedCategory
                      ? "bg-[#B71C1C] text-white"
                      : "bg-[#121212] text-[#E0E0E0] hover:bg-[#1a1a1a]"
                  }`}
                >
                  All Projects
                </Link>
                {categories.map((category) => (
                  <Link
                    key={category}
                    href={`/projects?category=${encodeURIComponent(category)}`}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? "bg-[#B71C1C] text-white"
                        : "bg-[#121212] text-[#E0E0E0] hover:bg-[#1a1a1a]"
                    }`}
                  >
                    {category}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Projects Grid */}
          {projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  href={`/projects/${project.slug}`}
                  className="group animate-grid-item"
                >
                  <article>
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
                      {project.featured && (
                        <span className="absolute top-4 left-4 bg-[#B71C1C] text-white text-xs font-medium px-2 py-1 rounded">
                          Featured
                        </span>
                      )}
                    </div>
                    <div className="mt-4">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-[#B71C1C] font-medium">
                          {project.category}
                        </span>
                        {project.location && (
                          <>
                            <span className="text-[#E0E0E0]">•</span>
                            <span className="text-[#E0E0E0]">
                              {project.location}
                            </span>
                          </>
                        )}
                      </div>
                      <h2 className="mt-2 text-lg font-semibold text-white group-hover:text-[#B71C1C] transition-colors">
                        {project.title}
                      </h2>
                      <p className="mt-1 text-sm text-[#E0E0E0] line-clamp-2">
                        {project.shortDescription}
                      </p>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-[#E0E0E0]">
                {selectedCategory
                  ? `No projects found in "${selectedCategory}" category.`
                  : "No projects available yet. Check back soon!"}
              </p>
              {selectedCategory && (
                <Link
                  href="/projects"
                  className="mt-4 inline-block text-[#B71C1C] hover:text-[#9A1B1B] font-medium"
                >
                  View all projects
                </Link>
              )}
            </div>
          )}
        </div>
      </section>
    </PageAnimations>
  );
}
