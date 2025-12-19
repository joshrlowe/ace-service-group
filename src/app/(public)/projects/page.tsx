import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getProjects, getProjectCategories } from "@/lib/data";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Browse our portfolio of construction projects including renovations, plumbing, basement transformations, and more.",
};

interface ProjectsPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const params = await searchParams;
  const selectedCategory = params.category;

  const [projects, categories] = await Promise.all([
    getProjects({ category: selectedCategory }),
    getProjectCategories(),
  ]);

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gray-900 text-white py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Our Projects
            </h1>
            <p className="mt-6 text-lg text-gray-300">
              Explore our portfolio of completed projects. Each project showcases our commitment to quality craftsmanship and attention to detail.
            </p>
          </div>
        </div>
      </section>

      {/* Filter & Projects Grid */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Category Filter */}
          {categories.length > 0 && (
            <div className="mb-12">
              <div className="flex flex-wrap gap-2">
                <Link
                  href="/projects"
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    !selectedCategory
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
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
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
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
                  className="group"
                >
                  <article>
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
                      {project.featured && (
                        <span className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded">
                          Featured
                        </span>
                      )}
                    </div>
                    <div className="mt-4">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-blue-600 font-medium">
                          {project.category}
                        </span>
                        {project.location && (
                          <>
                            <span className="text-gray-300">•</span>
                            <span className="text-gray-500">{project.location}</span>
                          </>
                        )}
                      </div>
                      <h2 className="mt-2 text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {project.title}
                      </h2>
                      <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                        {project.shortDescription}
                      </p>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">
                {selectedCategory
                  ? `No projects found in "${selectedCategory}" category.`
                  : "No projects available yet. Check back soon!"}
              </p>
              {selectedCategory && (
                <Link
                  href="/projects"
                  className="mt-4 inline-block text-blue-600 hover:text-blue-700 font-medium"
                >
                  View all projects
                </Link>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
