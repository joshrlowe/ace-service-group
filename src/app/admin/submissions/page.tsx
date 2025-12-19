import { prisma } from "@/lib/db";
import { SubmissionsList } from "@/components/admin/submissions-list";

interface SubmissionsPageProps {
  searchParams: Promise<{ handled?: string; id?: string }>;
}

async function getSubmissions(handled?: string) {
  const where: Record<string, unknown> = {};

  if (handled === "true") {
    where.handled = true;
  } else if (handled === "false") {
    where.handled = false;
  }

  return prisma.contactSubmission.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });
}

async function getStats() {
  const [total, unhandled] = await Promise.all([
    prisma.contactSubmission.count(),
    prisma.contactSubmission.count({ where: { handled: false } }),
  ]);

  return { total, unhandled, handled: total - unhandled };
}

export default async function SubmissionsPage({ searchParams }: SubmissionsPageProps) {
  const params = await searchParams;
  const [submissions, stats] = await Promise.all([
    getSubmissions(params.handled),
    getStats(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Contact Submissions</h1>
        <p className="mt-1 text-gray-500">
          Manage contact form submissions from your website
        </p>
      </div>

      <SubmissionsList
        submissions={submissions}
        stats={stats}
        currentFilter={params.handled}
        selectedId={params.id}
      />
    </div>
  );
}
