import { cn } from "@/app/lib/cn";

interface BlockerLabelProps {
  /** Who owns unblocking this — e.g. "Namkhai / Zoloo" */
  owner?: string;
  /** What's blocked */
  children: React.ReactNode;
  /** Inline (small tag) vs block (full section warning) */
  variant?: "inline" | "block";
  className?: string;
}

export function BlockerLabel({
  owner,
  children,
  variant = "inline",
  className,
}: BlockerLabelProps) {
  if (variant === "block") {
    return (
      <div
        className={cn(
          "flex items-start gap-3 p-4 rounded-[var(--card-r)]",
          "border border-dashed border-signal bg-signal-m",
          className,
        )}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-signal shrink-0 mt-0.5"
        >
          <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-display font-bold text-xs uppercase tracking-[0.08em] text-signal-h">
              Blocker
            </span>
            {owner && (
              <span className="font-mono text-[11px] text-signal-h/80">
                → {owner}
              </span>
            )}
          </div>
          <div className="text-sm text-fg-2 leading-[1.5]">{children}</div>
        </div>
      </div>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-1.5 py-0.5",
        "rounded-[var(--badge-r)] bg-signal-m text-signal-h",
        "font-display font-bold text-[10px] uppercase tracking-[0.06em]",
        "whitespace-nowrap",
        className,
      )}
      title={owner ? `Blocked — needs ${owner}` : "Blocked"}
    >
      <span className="w-1 h-1 rounded-full bg-signal" />
      Blocker
      {owner && <span className="font-mono text-[9px] opacity-70">· {owner}</span>}
    </span>
  );
}
