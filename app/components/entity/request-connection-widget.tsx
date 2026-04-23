"use client";

import { cn } from "@/app/lib/cn";

/* ── RequestConnectionWidget ────────────────── */

interface RequestConnectionWidgetProps {
  entityName: string;
  loggedIn?: boolean;
  className?: string;
}

export function RequestConnectionWidget({
  entityName,
  loggedIn,
  className,
}: RequestConnectionWidgetProps) {
  return (
    <div
      className={cn(
        "p-4 rounded-[var(--card-r)] border border-border",
        "bg-gradient-to-br from-brand-m to-transparent",
        className,
      )}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="w-2 h-2 rounded-full bg-signal animate-pulse" />
        <span className="font-display font-bold text-[11px] uppercase tracking-[0.08em] text-signal-h">
          Actively Raising
        </span>
      </div>
      <p className="font-display font-bold text-sm leading-[1.4] mb-3">
        Request a connection with {entityName}
      </p>
      <p className="text-xs text-fg-2 leading-[1.5] mb-3">
        CMM facilitates qualified introductions to institutional investors and strategic
        partners.
      </p>
      <button
        type="button"
        className="btn btn-primary w-full text-sm font-bold"
        title={loggedIn ? "Submit a connection request" : "Register or sign in to request a connection"}
      >
        {loggedIn ? "Request Connection" : "Register to Request"}
      </button>
    </div>
  );
}
