import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ProjectForm } from "@/components/admin/project-form";
import { prisma } from "@/lib/db";

interface EditProjectPageProps {
  params: Promise<{ id: string }>;
}

async function getProject(id: string) {
  return prisma.project.findUnique({
    where: { id },
    include: {
      images: {
        orderBy: { order: "asc" },
      },
    },
  });
}

async function getCategories() {
  const projects = await prisma.project.findMany({
    select: { category: true },
    distinct: ["category"],
  });
  return projects.map((p) => p.category);
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const { id } = await params;
  const [project, categories] = await Promise.all([
    getProject(id),
    getCategories(),
  ]);

  if (!project) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/projects"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Projects
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Edit Project</h1>
        <p className="mt-1 text-gray-500">
          Update project details and images
        </p>
      </div>

      <ProjectForm project={project} categories={categories} />
    </div>
  );
}
