"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { createService, updateService, deleteService } from "@/app/actions/settings";
import { slugify } from "@/lib/utils";

interface Service {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string | null;
  featured: boolean;
  order: number;
}

interface ServicesManagerProps {
  services: Service[];
}

const iconOptions = [
  { value: "Droplets", label: "Droplets (Plumbing)" },
  { value: "Hammer", label: "Hammer (Construction)" },
  { value: "Home", label: "Home (Residential)" },
  { value: "Lightbulb", label: "Lightbulb (Lighting)" },
  { value: "Wrench", label: "Wrench (Repairs)" },
  { value: "PaintBucket", label: "Paint Bucket (Painting)" },
];

export function ServicesManager({ services }: ServicesManagerProps) {
  const router = useRouter();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    const formData = new FormData(e.currentTarget);

    try {
      const result = await createService(formData);

      if (result.success) {
        toast.success("Service created");
        setIsAdding(false);
        router.refresh();
      } else {
        if (result.errors) {
          setErrors(result.errors);
        } else {
          toast.error(result.message || "Failed to create service");
        }
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>, id: string) {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    const formData = new FormData(e.currentTarget);

    try {
      const result = await updateService(id, formData);

      if (result.success) {
        toast.success("Service updated");
        setEditingId(null);
        router.refresh();
      } else {
        if (result.errors) {
          setErrors(result.errors);
        } else {
          toast.error(result.message || "Failed to update service");
        }
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    setIsSubmitting(true);

    try {
      const result = await deleteService(deleteId);

      if (result.success) {
        toast.success("Service deleted");
        router.refresh();
      } else {
        toast.error(result.message || "Failed to delete service");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
      setDeleteId(null);
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Services</CardTitle>
            <CardDescription>Manage your service offerings</CardDescription>
          </div>
          {!isAdding && (
            <Button onClick={() => setIsAdding(true)} size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add Service
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add Service Form */}
        {isAdding && (
          <form onSubmit={handleCreate} className="border rounded-lg p-4 bg-gray-50 space-y-4">
            <h4 className="font-medium">New Service</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new-name" required>Name</Label>
                <Input
                  id="new-name"
                  name="name"
                  placeholder="Service name"
                  error={errors.name}
                  onChange={(e) => {
                    const slugInput = document.getElementById("new-slug") as HTMLInputElement;
                    if (slugInput) slugInput.value = slugify(e.target.value);
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-slug" required>Slug</Label>
                <Input
                  id="new-slug"
                  name="slug"
                  placeholder="service-url-slug"
                  error={errors.slug}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-description" required>Description</Label>
              <Textarea
                id="new-description"
                name="description"
                placeholder="Service description..."
                rows={3}
                error={errors.description}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new-icon">Icon</Label>
                <select
                  id="new-icon"
                  name="icon"
                  className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm"
                >
                  <option value="">Select icon</option>
                  {iconOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-order">Order</Label>
                <Input id="new-order" name="order" type="number" defaultValue="0" min="0" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-featured">Featured</Label>
                <select
                  id="new-featured"
                  name="featured"
                  className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm"
                >
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit" size="sm" loading={isSubmitting}>Save</Button>
              <Button type="button" variant="outline" size="sm" onClick={() => { setIsAdding(false); setErrors({}); }}>
                Cancel
              </Button>
            </div>
          </form>
        )}

        {/* Services List */}
        {services.length > 0 ? (
          <div className="space-y-2">
            {services.map((service) => (
              <div key={service.id}>
                {editingId === service.id ? (
                  <form
                    onSubmit={(e) => handleUpdate(e, service.id)}
                    className="border rounded-lg p-4 bg-gray-50 space-y-4"
                  >
                    <h4 className="font-medium">Edit Service</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label required>Name</Label>
                        <Input name="name" defaultValue={service.name} error={errors.name} />
                      </div>
                      <div className="space-y-2">
                        <Label required>Slug</Label>
                        <Input name="slug" defaultValue={service.slug} error={errors.slug} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label required>Description</Label>
                      <Textarea
                        name="description"
                        defaultValue={service.description}
                        rows={3}
                        error={errors.description}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Icon</Label>
                        <select
                          name="icon"
                          defaultValue={service.icon || ""}
                          className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm"
                        >
                          <option value="">Select icon</option>
                          {iconOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label>Order</Label>
                        <Input name="order" type="number" defaultValue={service.order} min="0" />
                      </div>
                      <div className="space-y-2">
                        <Label>Featured</Label>
                        <select
                          name="featured"
                          defaultValue={service.featured ? "true" : "false"}
                          className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm"
                        >
                          <option value="false">No</option>
                          <option value="true">Yes</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" size="sm" loading={isSubmitting}>Update</Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => { setEditingId(null); setErrors({}); }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50">
                    <GripVertical className="h-5 w-5 text-gray-400" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium truncate">{service.name}</p>
                        {service.featured && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                            Featured
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 truncate">{service.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingId(service.id)}
                        className="h-8 w-8"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(service.id)}
                        className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm text-center py-8">
            No services yet. Add your first service above.
          </p>
        )}
      </CardContent>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Service"
        description="Are you sure you want to delete this service? This action cannot be undone."
        confirmText="Delete"
        variant="destructive"
        loading={isSubmitting}
      />
    </Card>
  );
}
