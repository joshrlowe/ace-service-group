"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  FolderKanban,
  Settings,
  Inbox,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { getInitials } from "@/lib/utils";

interface AdminSidebarProps {
  user: {
    name?: string | null;
    email?: string | null;
  };
}

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Projects", href: "/admin/projects", icon: FolderKanban },
  { name: "Submissions", href: "/admin/submissions", icon: Inbox },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(href);
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/admin/login" });
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#121212] border-b border-gray-800 px-4 py-3">
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-white">Admin</span>
          <button
            type="button"
            className="p-2 text-[#CFCFCF] hover:bg-gray-800 rounded-md"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-[#121212] border-r border-gray-800 transform transition-transform duration-200 ease-in-out lg:translate-x-0",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center h-16 px-6 border-b border-gray-800">
            <span className="text-xl font-bold text-white">Admin Panel</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                  isActive(item.href)
                    ? "bg-[#B71C1C]/20 text-[#B71C1C]"
                    : "text-[#CFCFCF] hover:bg-gray-800 hover:text-white",
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            ))}

            <div className="pt-4 border-t border-gray-800 mt-4">
              <Link
                href="/"
                target="_blank"
                className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-[#CFCFCF] hover:bg-gray-800 hover:text-white rounded-lg transition-colors"
              >
                <ExternalLink className="h-5 w-5" />
                View Site
              </Link>
            </div>
          </nav>

          {/* User section */}
          <div className="border-t border-gray-800 p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-[#B71C1C] flex items-center justify-center text-white font-medium">
                {getInitials(user.name || user.email || "A")}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user.name || "Admin"}
                </p>
                <p className="text-xs text-[#CFCFCF] truncate">{user.email}</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start border-gray-700 text-[#CFCFCF] hover:bg-gray-800 hover:text-white"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Spacer for mobile header */}
      <div className="lg:hidden h-14" />
    </>
  );
}
