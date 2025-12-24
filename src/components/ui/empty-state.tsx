"use client";

import { cn } from "@/lib/utils";
import { Button } from "./button";
import Link from "next/link";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-12 px-4 text-center",
        className,
      )}
    >
      {Icon && (
        <div className="rounded-full bg-[#121212] p-4 mb-4 border border-gray-800">
          <Icon className="h-8 w-8 text-[#CFCFCF]" />
        </div>
      )}
      <h3 className="text-lg font-medium text-white">{title}</h3>
      {description && (
        <p className="mt-1 text-sm text-[#CFCFCF] max-w-md">{description}</p>
      )}
      {action && (
        <>
          {action.href ? (
            <Button asChild className="mt-4">
              <Link href={action.href}>{action.label}</Link>
            </Button>
          ) : (
            <Button onClick={action.onClick} className="mt-4">
              {action.label}
            </Button>
          )}
        </>
      )}
    </div>
  );
}
