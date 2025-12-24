import Link from "next/link";
import { FolderKanban, Inbox, Settings, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/db";

async function getDashboardStats() {
  const [projectCount, submissionCount, unhandledSubmissions] =
    await Promise.all([
      prisma.project.count(),
      prisma.contactSubmission.count(),
      prisma.contactSubmission.count({ where: { handled: false } }),
    ]);

  return {
    projectCount,
    submissionCount,
    unhandledSubmissions,
  };
}

async function getRecentSubmissions() {
  return prisma.contactSubmission.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
  });
}

export default async function AdminDashboard() {
  const [stats, recentSubmissions] = await Promise.all([
    getDashboardStats(),
    getRecentSubmissions(),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="mt-1 text-[#CFCFCF]">
          Welcome to the Ace Service Group admin panel
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-[#121212] border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#CFCFCF]">
              Total Projects
            </CardTitle>
            <FolderKanban className="h-4 w-4 text-[#CFCFCF]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {stats.projectCount}
            </div>
            <Link
              href="/admin/projects"
              className="text-xs text-[#B71C1C] hover:text-[#9A1B1B] flex items-center mt-2"
            >
              View all projects
              <ArrowRight className="h-3 w-3 ml-1" />
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-[#121212] border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#CFCFCF]">
              Contact Submissions
            </CardTitle>
            <Inbox className="h-4 w-4 text-[#CFCFCF]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {stats.submissionCount}
            </div>
            {stats.unhandledSubmissions > 0 && (
              <span className="text-xs text-orange-400 font-medium">
                {stats.unhandledSubmissions} unhandled
              </span>
            )}
            <Link
              href="/admin/submissions"
              className="text-xs text-[#B71C1C] hover:text-[#9A1B1B] flex items-center mt-2"
            >
              View submissions
              <ArrowRight className="h-3 w-3 ml-1" />
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-[#121212] border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#CFCFCF]">
              Site Settings
            </CardTitle>
            <Settings className="h-4 w-4 text-[#CFCFCF]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">Active</div>
            <Link
              href="/admin/settings"
              className="text-xs text-[#B71C1C] hover:text-[#9A1B1B] flex items-center mt-2"
            >
              Edit settings
              <ArrowRight className="h-3 w-3 ml-1" />
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Submissions */}
      <Card className="bg-[#121212] border-gray-800">
        <CardHeader>
          <CardTitle className="text-lg text-white">
            Recent Submissions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentSubmissions.length > 0 ? (
            <div className="space-y-4">
              {recentSubmissions.map((submission) => (
                <div
                  key={submission.id}
                  className="flex items-start justify-between border-b border-gray-800 pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-white truncate">
                        {submission.name}
                      </p>
                      {!submission.handled && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-400/20 text-orange-400 border border-orange-400/30">
                          New
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-[#CFCFCF] truncate">
                      {submission.subject || submission.message.slice(0, 50)}
                    </p>
                    <p className="text-xs text-[#CFCFCF] mt-1">
                      {new Date(submission.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Link
                    href={`/admin/submissions?id=${submission.id}`}
                    className="text-sm text-[#B71C1C] hover:text-[#9A1B1B] ml-4"
                  >
                    View
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[#CFCFCF] text-sm">No submissions yet.</p>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="bg-[#121212] border-gray-800">
        <CardHeader>
          <CardTitle className="text-lg text-white">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              href="/admin/projects/new"
              className="flex items-center gap-3 p-4 rounded-lg border border-gray-700 hover:border-[#B71C1C] hover:bg-[#B71C1C]/10 transition-colors"
            >
              <FolderKanban className="h-5 w-5 text-[#B71C1C]" />
              <span className="text-sm font-medium text-white">
                Add New Project
              </span>
            </Link>
            <Link
              href="/admin/submissions"
              className="flex items-center gap-3 p-4 rounded-lg border border-gray-700 hover:border-[#B71C1C] hover:bg-[#B71C1C]/10 transition-colors"
            >
              <Inbox className="h-5 w-5 text-[#B71C1C]" />
              <span className="text-sm font-medium text-white">
                Check Submissions
              </span>
            </Link>
            <Link
              href="/admin/settings"
              className="flex items-center gap-3 p-4 rounded-lg border border-gray-700 hover:border-[#B71C1C] hover:bg-[#B71C1C]/10 transition-colors"
            >
              <Settings className="h-5 w-5 text-[#B71C1C]" />
              <span className="text-sm font-medium text-white">
                Update Settings
              </span>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
