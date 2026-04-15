"use client";

import Link from "next/link";
import { cn } from "@/app/lib/cn";

interface PaywallWallProps {
  className?: string;
}

export function PaywallWall({ className }: PaywallWallProps) {
  return (
    <div className={cn("relative", className)}>
      {/* Gradient mask */}
      <div className="paywall-mask h-[200px] -mt-[200px] relative z-[1] pointer-events-none" />

      {/* Gate card */}
      <div className="text-center py-12 px-8 -mt-10 relative z-[2]">
        <div className="inline-block max-w-[480px] w-full bg-[var(--white)] border border-border rounded-[var(--card-r)] p-7 shadow-[var(--shadow-md)] text-center">
          {/* Lock icon */}
          <div className="w-12 h-12 rounded-[var(--card-r)] bg-brand-m grid place-items-center mx-auto mb-5">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-brand"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>

          <h3 className="font-display font-extrabold text-[1.375rem] tracking-[-0.02em] mb-2">
            Create a free account to continue reading
          </h3>

          <p className="text-sm text-fg-2 leading-body mb-6 max-w-[360px] mx-auto">
            Get access to 3 free research reports per month, plus weekly market
            summaries and entity alerts.
          </p>

          <Link
            href="/sign-in"
            className={cn(
              "btn btn-primary inline-flex",
              "font-bold text-base py-3 px-8",
              "hover:shadow-brand no-underline"
            )}
          >
            Register Free
          </Link>

          <span className="block mt-3.5 text-sm text-fg-3">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="text-brand-l font-medium hover:text-brand hover:underline no-underline"
            >
              Sign in
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}
