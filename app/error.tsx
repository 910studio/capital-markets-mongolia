"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="content-max flex min-h-screen items-center justify-center py-24">
      <div className="text-center">
        {/* Icon */}
        <div
          className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xs border border-border"
          style={{ background: "var(--neg-m)" }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--neg)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>

        {/* Label */}
        <div className="label mb-3">SOMETHING WENT WRONG</div>

        {/* Description */}
        <p className="mx-auto max-w-[420px] text-sm text-fg-2 leading-relaxed">
          An unexpected error occurred while loading this page. This has been
          logged — try again or head back to the dashboard.
        </p>

        {/* Actions */}
        <div className="mt-8 flex items-center justify-center gap-3">
          <button onClick={() => unstable_retry()} className="btn btn-primary">
            Try Again
          </button>
          <Link href="/" className="btn btn-secondary">
            Back to Home
          </Link>
        </div>

      </div>
    </div>
  );
}
