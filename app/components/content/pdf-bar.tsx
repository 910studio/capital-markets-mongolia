"use client";

import { cn } from "@/app/lib/cn";

interface PdfBarProps {
  fileSize: string;
  pageCount: number;
  requiresAuth?: boolean;
  onDownload?: () => void;
}

export function PdfBar({
  fileSize,
  pageCount,
  requiresAuth,
  onDownload,
}: PdfBarProps) {
  return (
    <div className="widget">
      <button
        onClick={onDownload}
        className={cn(
          "flex items-center justify-center gap-2 w-full",
          "py-[7px] px-3 rounded-[var(--btn-r)]",
          "border-none bg-brand text-white",
          "font-display font-bold text-xs",
          "cursor-pointer transition-all duration-[200ms]",
          "hover:bg-brand-h"
        )}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        <span>{requiresAuth ? "Register to Download" : "Download PDF"}</span>
      </button>
      <div className="px-3 py-2 text-center">
        <span className="font-mono text-[10px] text-fg-3">
          PDF &middot; {fileSize} &middot; {pageCount} pages
        </span>
      </div>
    </div>
  );
}
