import Link from "next/link";
import Image from "next/image";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { prisma } from "@/lib/db";
import { ProjectActions } from "@/components/admin/project-actions";

interface ProjectsPageProps {
  searchParams: Promise<{ search?: string; category?: string; featured?: string }>;
}

async function getProjects(params: { search?: string; category?: string; featured?: string }) {
  const where: Record<string, unknown> = {};

  if (params.search) {
    where.OR = [
      { title: { contains: params.search, mode: "insensitive" } },
      { shortDescription: { contains: params.search, mode: "insensitive" } },
    ];
  }

  if (params.category) {
    where.category = params.category;
  }

  if (params.featured === "true") {
    where.featured = true;
  }

  return prisma.project.findMany({
    where,
    include: {
      images: {
        orderBy: { order: "asc" },
        take: 1,
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

async function getCategories() {
  const projects = await prisma.project.findMany({
    select: { category: true },
    distinct: ["category"],
  });
  return projects.map((p) => p.category);
}

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const params = await searchParams;
  const [projects, categories] = await Promise.all([
    getProjects(params),
    getCategories(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="mt-1 text-gray-500">
            Manage your portfolio projects
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/projects/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Project
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <form className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                name="search"
                placeholder="Search projects..."
                defaultValue={params.search}
                className="pl-9"
              />
            </div>
            <select
              name="category"
              defaultValue={params.category || ""}
              className="h-10 rounded-md border border-gray-300 bg-white px-3 text-sm"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <select
              name="featured"
              defaultValue={params.featured || ""}
              className="h-10 rounded-md border border-gray-300 bg-white px-3 text-sm"
            >
              <option value="">All Projects</option>
              <option value="true">Featured Only</option>
            </select>
            <Button type="submit" variant="secondary">
              Filter
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Projects List */}
      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="overflow-hidden">
              <div className="relative aspect-video bg-gray-100">
                {project.images[0] ? (
                  <Image
                    src={project.images[0].url}
                    alt={project.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    No image
                  </div>
                )}
                {project.featured && (
                  <Badge className="absolute top-2 right-2" variant="default">
                    Featured
                  </Badge>
                )}
                {!project.published && (
                  <Badge className="absolute top-2 left-2" variant="secondary">
                    Draft
                  </Badge>
                )}
              </div>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-blue-600 font-medium mb-1">
                      {project.category}
                    </p>
                    <CardTitle className="text-lg line-clamp-1">
                      {project.title}
                    </CardTitle>
                  </div>
                  <ProjectActions project={project} />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {project.shortDescription}
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <Link
                    href={`/admin/projects/${project.id}/edit`}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Edit
                  </Link>
                  <span className="text-gray-300">|</span>
                  <Link
                    href={`/projects/${project.slug}`}
                    target="_blank"
                    className="text-sm text-gray-600 hover:text-gray-700"
                  >
                    View
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12">
            <EmptyState
              title="No projects found"
              description={
                params.search || params.category || params.featured
                  ? "Try adjusting your filters"
                  : "Get started by adding your first project"
              }
              action={
                !params.search && !params.category && !params.featured
                  ? {
                      label: "Add Project",
                      onClick: () => {},
                    }
                  : undefined
              }
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
