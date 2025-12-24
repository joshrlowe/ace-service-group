"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MoreVertical, Pencil, Trash2, Eye, Star, StarOff } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { deleteProject, toggleProjectFeatured } from "@/app/actions/projects";

interface ProjectActionsProps {
  project: {
    id: string;
    slug: string;
    featured: boolean;
  };
}

export function ProjectActions({ project }: ProjectActionsProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleToggleFeatured = async () => {
    try {
      const result = await toggleProjectFeatured(project.id);
      if (result.success) {
        toast.success(
          result.featured ? "Project featured" : "Project unfeatured",
        );
        router.refresh();
      } else {
        toast.error(result.message || "Failed to update project");
      }
    } catch {
      toast.error("Something went wrong");
    }
    setIsOpen(false);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteProject(project.id);
      if (result.success) {
        toast.success("Project deleted");
        router.refresh();
      } else {
        toast.error(result.message || "Failed to delete project");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <>
      <div className="relative">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="h-8 w-8"
        >
          <MoreVertical className="h-4 w-4" />
        </Button>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute right-0 top-full mt-1 z-20 w-48 bg-[#121212] rounded-lg shadow-lg border border-gray-800 py-1">
              <a
                href={`/admin/projects/${project.id}/edit`}
                className="flex items-center gap-2 px-4 py-2 text-sm text-[#CFCFCF] hover:bg-gray-800 hover:text-white"
                onClick={() => setIsOpen(false)}
              >
                <Pencil className="h-4 w-4" />
                Edit
              </a>
              <a
                href={`/projects/${project.slug}`}
                target="_blank"
                className="flex items-center gap-2 px-4 py-2 text-sm text-[#CFCFCF] hover:bg-gray-800 hover:text-white"
                onClick={() => setIsOpen(false)}
              >
                <Eye className="h-4 w-4" />
                View on Site
              </a>
              <button
                onClick={handleToggleFeatured}
                className="flex items-center gap-2 px-4 py-2 text-sm text-[#CFCFCF] hover:bg-gray-800 hover:text-white w-full text-left"
              >
                {project.featured ? (
                  <>
                    <StarOff className="h-4 w-4" />
                    Unfeature
                  </>
                ) : (
                  <>
                    <Star className="h-4 w-4" />
                    Feature
                  </>
                )}
              </button>
              <hr className="my-1 border-gray-800" />
              <button
                onClick={() => {
                  setIsOpen(false);
                  setShowDeleteDialog(true);
                }}
                className="flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-400/10 w-full text-left"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          </>
        )}
      </div>

      <ConfirmDialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete Project"
        description="Are you sure you want to delete this project? This action cannot be undone."
        confirmText="Delete"
        variant="destructive"
        loading={isDeleting}
      />
    </>
  );
}
