"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Mail, Phone, Calendar, Check, X, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { updateSubmission, deleteSubmission } from "@/app/actions/submissions";

interface Submission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  handled: boolean;
  notes: string | null;
  createdAt: Date;
}

interface SubmissionsListProps {
  submissions: Submission[];
  stats: { total: number; unhandled: number; handled: number };
  currentFilter?: string;
  selectedId?: string;
}

export function SubmissionsList({
  submissions,
  stats,
  currentFilter,
  selectedId,
}: SubmissionsListProps) {
  const router = useRouter();
  const [selected, setSelected] = useState<Submission | null>(null);
  const [notes, setNotes] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (selectedId) {
      const submission = submissions.find((s) => s.id === selectedId);
      if (submission) {
        setSelected(submission);
        setNotes(submission.notes || "");
      }
    }
  }, [selectedId, submissions]);

  const handleSelect = (submission: Submission) => {
    setSelected(submission);
    setNotes(submission.notes || "");
    router.push(`/admin/submissions?id=${submission.id}`, { scroll: false });
  };

  const handleToggleHandled = async () => {
    if (!selected) return;
    setIsUpdating(true);

    try {
      const result = await updateSubmission(selected.id, {
        handled: !selected.handled,
        notes,
      });

      if (result.success) {
        toast.success(selected.handled ? "Marked as unhandled" : "Marked as handled");
        router.refresh();
      } else {
        toast.error(result.message || "Failed to update");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSaveNotes = async () => {
    if (!selected) return;
    setIsUpdating(true);

    try {
      const result = await updateSubmission(selected.id, { notes });

      if (result.success) {
        toast.success("Notes saved");
        router.refresh();
      } else {
        toast.error(result.message || "Failed to save notes");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);

    try {
      const result = await deleteSubmission(deleteId);

      if (result.success) {
        toast.success("Submission deleted");
        if (selected?.id === deleteId) {
          setSelected(null);
          router.push("/admin/submissions");
        }
        router.refresh();
      } else {
        toast.error(result.message || "Failed to delete");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* List */}
      <div className="lg:col-span-1 space-y-4">
        {/* Filter Tabs */}
        <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
          <Link
            href="/admin/submissions"
            className={`flex-1 text-center py-2 text-sm font-medium rounded-md transition-colors ${
              !currentFilter ? "bg-white shadow-sm" : "hover:bg-gray-50"
            }`}
          >
            All ({stats.total})
          </Link>
          <Link
            href="/admin/submissions?handled=false"
            className={`flex-1 text-center py-2 text-sm font-medium rounded-md transition-colors ${
              currentFilter === "false" ? "bg-white shadow-sm" : "hover:bg-gray-50"
            }`}
          >
            New ({stats.unhandled})
          </Link>
          <Link
            href="/admin/submissions?handled=true"
            className={`flex-1 text-center py-2 text-sm font-medium rounded-md transition-colors ${
              currentFilter === "true" ? "bg-white shadow-sm" : "hover:bg-gray-50"
            }`}
          >
            Handled ({stats.handled})
          </Link>
        </div>

        {/* Submissions List */}
        <div className="space-y-2 max-h-[600px] overflow-y-auto">
          {submissions.length > 0 ? (
            submissions.map((submission) => (
              <button
                key={submission.id}
                onClick={() => handleSelect(submission)}
                className={`w-full text-left p-4 rounded-lg border transition-colors ${
                  selected?.id === submission.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900 truncate">
                        {submission.name}
                      </p>
                      {!submission.handled && (
                        <Badge variant="warning" className="text-xs">New</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 truncate">
                      {submission.subject || submission.email}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatDate(submission.createdAt)}
                    </p>
                  </div>
                </div>
              </button>
            ))
          ) : (
            <Card>
              <CardContent className="py-8">
                <EmptyState
                  icon={MessageSquare}
                  title="No submissions"
                  description={
                    currentFilter
                      ? "No submissions match this filter"
                      : "No contact form submissions yet"
                  }
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Detail View */}
      <div className="lg:col-span-2">
        {selected ? (
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{selected.name}</CardTitle>
                  <p className="text-sm text-gray-500 mt-1">
                    {formatDate(selected.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant={selected.handled ? "outline" : "default"}
                    size="sm"
                    onClick={handleToggleHandled}
                    disabled={isUpdating}
                  >
                    {selected.handled ? (
                      <>
                        <X className="h-4 w-4 mr-1" />
                        Mark Unhandled
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4 mr-1" />
                        Mark Handled
                      </>
                    )}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setDeleteId(selected.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <a
                    href={`mailto:${selected.email}`}
                    className="text-blue-600 hover:underline"
                  >
                    {selected.email}
                  </a>
                </div>
                {selected.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <a
                      href={`tel:${selected.phone}`}
                      className="text-blue-600 hover:underline"
                    >
                      {selected.phone}
                    </a>
                  </div>
                )}
              </div>

              {/* Subject */}
              {selected.subject && (
                <div>
                  <Label className="text-gray-500">Subject</Label>
                  <p className="mt-1 text-gray-900">{selected.subject}</p>
                </div>
              )}

              {/* Message */}
              <div>
                <Label className="text-gray-500">Message</Label>
                <div className="mt-1 p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-900 whitespace-pre-wrap">
                    {selected.message}
                  </p>
                </div>
              </div>

              {/* Internal Notes */}
              <div>
                <Label htmlFor="notes">Internal Notes</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add internal notes about this submission..."
                  rows={4}
                  className="mt-1"
                />
                <div className="mt-2 flex justify-end">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleSaveNotes}
                    disabled={isUpdating || notes === (selected.notes || "")}
                  >
                    Save Notes
                  </Button>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="pt-4 border-t">
                <p className="text-sm font-medium text-gray-700 mb-2">Quick Actions</p>
                <div className="flex flex-wrap gap-2">
                  <Button asChild variant="outline" size="sm">
                    <a href={`mailto:${selected.email}`}>
                      <Mail className="h-4 w-4 mr-1" />
                      Send Email
                    </a>
                  </Button>
                  {selected.phone && (
                    <Button asChild variant="outline" size="sm">
                      <a href={`tel:${selected.phone}`}>
                        <Phone className="h-4 w-4 mr-1" />
                        Call
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="py-16">
              <EmptyState
                icon={MessageSquare}
                title="Select a submission"
                description="Click on a submission to view details"
              />
            </CardContent>
          </Card>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Submission"
        description="Are you sure you want to delete this submission? This action cannot be undone."
        confirmText="Delete"
        variant="destructive"
        loading={isDeleting}
      />
    </div>
  );
}
