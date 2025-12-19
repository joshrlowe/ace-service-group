import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ProjectForm } from "@/components/admin/project-form";
import { prisma } from "@/lib/db";

async function getCategories() {
  const projects = await prisma.project.findMany({
    select: { category: true },
    distinct: ["category"],
  });
  return projects.map((p) => p.category);
}

export default async function NewProjectPage() {
  const categories = await getCategories();

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
        <h1 className="text-2xl font-bold text-gray-900">New Project</h1>
        <p className="mt-1 text-gray-500">
          Add a new project to your portfolio
        </p>
      </div>

      <ProjectForm categories={categories} />
    </div>
  );
}
