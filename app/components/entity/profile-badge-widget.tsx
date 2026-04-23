import { cn } from "@/app/lib/cn";
import type { DataSource } from "@/app/lib/mock-data";

interface ProfileBadgeWidgetProps {
  dataSource?: DataSource;
  className?: string;
}

const BADGE_STYLES: Record<DataSource, { label: string; classes: string; icon: React.ReactNode }> = {
  "CMM Verified": {
    label: "CMM Verified",
    classes: "bg-pos-m text-pos",
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="m9 11 3 3L22 4" />
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      </svg>
    ),
  },
  "AI-Generated": {
    label: "AI-Generated",
    classes: "bg-brand-m text-brand",
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L13.09 8.26L20 9L14 13L16.18 21L12 17L7.82 21L10 13L4 9L10.91 8.26L12 2Z" />
      </svg>
    ),
  },
  "Company Submitted": {
    label: "Company Submitted",
    classes: "bg-signal-m text-signal-h",
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
      </svg>
    ),
  },
};

export function ProfileBadgeWidget({ dataSource, className }: ProfileBadgeWidgetProps) {
  if (!dataSource) return null;
  const style = BADGE_STYLES[dataSource];

  return (
    <div className={cn("flex items-center gap-2 text-xs font-display font-semibold", className)}>
      <span
        className={cn(
          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[var(--badge-r)]",
          style.classes,
        )}
      >
        {style.icon}
        {style.label}
      </span>
    </div>
  );
}
