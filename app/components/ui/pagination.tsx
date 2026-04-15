"use client";

import { cn } from "@/app/lib/cn";

interface PaginationProps {
  total: number;
  current: number;
  perPage: number;
  onChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  total,
  current,
  perPage,
  onChange,
  className,
}: PaginationProps) {
  const totalPages = Math.ceil(total / perPage);
  if (totalPages <= 1) return null;

  /** Build page numbers with ellipsis for large ranges. */
  function getPages(): (number | "...")[] {
    const pages: (number | "...")[] = [];
    const delta = 1;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= current - delta && i <= current + delta)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== "...") {
        pages.push("...");
      }
    }
    return pages;
  }

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <button
        onClick={() => onChange(current - 1)}
        disabled={current === 1}
        className="btn btn-ghost text-xs h-[28px] w-[28px] p-0 disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="Previous page"
      >
        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>

      {getPages().map((page, i) =>
        page === "..." ? (
          <span key={`ellipsis-${i}`} className="text-xs text-fg-3 px-1">
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onChange(page)}
            className={cn(
              "btn text-xs h-[28px] min-w-[28px] px-1.5",
              page === current
                ? "btn-primary"
                : "btn-ghost"
            )}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() => onChange(current + 1)}
        disabled={current === totalPages}
        className="btn btn-ghost text-xs h-[28px] w-[28px] p-0 disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="Next page"
      >
        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>
    </div>
  );
}
