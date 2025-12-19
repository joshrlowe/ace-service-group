"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { X, Upload, GripVertical } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createProject, updateProject } from "@/app/actions/projects";
import { slugify } from "@/lib/utils";

interface ProjectFormProps {
  project?: {
    id: string;
    title: string;
    slug: string;
    shortDescription: string;
    fullDescription: string | null;
    category: string;
    location: string | null;
    projectDate: Date | null;
    featured: boolean;
    published: boolean;
    tags: string[];
    images: { id: string; url: string; alt: string | null; order: number }[];
  };
  categories: string[];
}

const defaultCategories = [
  "Plumbing",
  "Renovation",
  "Basement",
  "Outdoor Lighting",
  "Other",
];

export function ProjectForm({ project, categories }: ProjectFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imageUrls, setImageUrls] = useState<string[]>(
    project?.images.map((img) => img.url) || []
  );
  const [newImageUrl, setNewImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const allCategories = [
    ...new Set([...defaultCategories, ...categories]),
  ].sort();

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);

    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Upload failed");
        }

        const data = await response.json();
        setImageUrls((prev) => [...prev, data.url]);
      }
      toast.success("Images uploaded successfully");
    } catch {
      toast.error("Failed to upload images");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  }

  function handleAddImageUrl() {
    if (!newImageUrl) return;
    try {
      new URL(newImageUrl);
      setImageUrls((prev) => [...prev, newImageUrl]);
      setNewImageUrl("");
    } catch {
      toast.error("Please enter a valid URL");
    }
  }

  function handleRemoveImage(index: number) {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    const formData = new FormData(e.currentTarget);

    // Add image URLs
    imageUrls.forEach((url) => formData.append("imageUrls", url));

    try {
      const result = project
        ? await updateProject(project.id, formData)
        : await createProject(formData);

      if (result.success) {
        toast.success(project ? "Project updated" : "Project created");
        router.push("/admin/projects");
        router.refresh();
      } else {
        if (result.errors) {
          setErrors(result.errors);
          toast.error("Please fix the errors below");
        } else {
          toast.error(result.message || "Failed to save project");
        }
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title" required>
                  Title
                </Label>
                <Input
                  id="title"
                  name="title"
                  defaultValue={project?.title}
                  error={errors.title}
                  placeholder="Project title"
                  onChange={(e) => {
                    if (!project) {
                      const slugInput = document.getElementById("slug") as HTMLInputElement;
                      if (slugInput) {
                        slugInput.value = slugify(e.target.value);
                      }
                    }
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug" required>
                  Slug
                </Label>
                <Input
                  id="slug"
                  name="slug"
                  defaultValue={project?.slug}
                  error={errors.slug}
                  placeholder="project-url-slug"
                />
                <p className="text-xs text-gray-500">
                  URL-friendly identifier (auto-generated from title)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="shortDescription" required>
                  Short Description
                </Label>
                <Textarea
                  id="shortDescription"
                  name="shortDescription"
                  defaultValue={project?.shortDescription}
                  error={errors.shortDescription}
                  placeholder="Brief description for listings..."
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullDescription">Full Description</Label>
                <Textarea
                  id="fullDescription"
                  name="fullDescription"
                  defaultValue={project?.fullDescription || ""}
                  error={errors.fullDescription}
                  placeholder="Detailed description..."
                  rows={6}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category" required>
                    Category
                  </Label>
                  <Select
                    id="category"
                    name="category"
                    defaultValue={project?.category || ""}
                    error={errors.category}
                  >
                    <option value="">Select category</option>
                    {allCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    defaultValue={project?.location || ""}
                    placeholder="e.g., Lansdale, PA"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="projectDate">Project Date</Label>
                  <Input
                    id="projectDate"
                    name="projectDate"
                    type="date"
                    defaultValue={
                      project?.projectDate
                        ? new Date(project.projectDate).toISOString().split("T")[0]
                        : ""
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <Input
                    id="tags"
                    name="tags"
                    defaultValue={project?.tags.join(", ") || ""}
                    placeholder="tag1, tag2, tag3"
                  />
                  <p className="text-xs text-gray-500">Comma-separated</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle>Images</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Image Upload */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">
                  Upload images or add URLs
                </p>
                <div className="mt-4 flex flex-col sm:flex-row gap-2 justify-center">
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={isUploading}
                    />
                    <Button type="button" variant="outline" disabled={isUploading} asChild>
                      <span>{isUploading ? "Uploading..." : "Upload Files"}</span>
                    </Button>
                  </label>
                </div>
              </div>

              {/* Add URL */}
              <div className="flex gap-2">
                <Input
                  placeholder="Or paste image URL..."
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                />
                <Button type="button" variant="outline" onClick={handleAddImageUrl}>
                  Add URL
                </Button>
              </div>

              {/* Image Preview */}
              {imageUrls.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {imageUrls.map((url, index) => (
                    <div
                      key={index}
                      className="relative group aspect-video bg-gray-100 rounded-lg overflow-hidden"
                    >
                      <Image
                        src={url}
                        alt={`Image ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      {index === 0 && (
                        <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-0.5 rounded">
                          Cover
                        </span>
                      )}
                      <span className="absolute bottom-2 right-2 text-white text-xs bg-black/50 px-2 py-0.5 rounded">
                        <GripVertical className="h-3 w-3 inline mr-1" />
                        {index + 1}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Publish</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="published">Status</Label>
                <select
                  id="published"
                  name="published"
                  defaultValue={project?.published !== false ? "true" : "false"}
                  className="h-9 rounded-md border border-gray-300 bg-white px-3 text-sm"
                >
                  <option value="true">Published</option>
                  <option value="false">Draft</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="featured">Featured</Label>
                <select
                  id="featured"
                  name="featured"
                  defaultValue={project?.featured ? "true" : "false"}
                  className="h-9 rounded-md border border-gray-300 bg-white px-3 text-sm"
                >
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              </div>

              <hr />

              <div className="flex flex-col gap-2">
                <Button type="submit" loading={isSubmitting} className="w-full">
                  {isSubmitting
                    ? "Saving..."
                    : project
                    ? "Update Project"
                    : "Create Project"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="w-full"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
