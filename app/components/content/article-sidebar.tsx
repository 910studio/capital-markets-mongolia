"use client";

import Link from "next/link";
import { cn } from "@/app/lib/cn";

/* ── Types ─────────────────────────────── */

interface TocItem {
  id: string;
  label: string;
  locked?: boolean;
}

interface RelatedEntity {
  name: string;
  href: string;
}

interface ArticleSidebarProps {
  toc: TocItem[];
  entities: RelatedEntity[];
  activeSection?: string;
}

/* ── SidebarWidget wrapper ─────────────── */

function SidebarWidget({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="widget mb-5">
      <div className="widget-header">
        <span>{title}</span>
      </div>
      <div className="widget-body">{children}</div>
    </div>
  );
}

/* ── ArticleSidebar ────────────────────── */

export function ArticleSidebar({
  toc,
  entities,
  activeSection,
}: ArticleSidebarProps) {
  return (
    <div>
      {/* Table of Contents */}
      <SidebarWidget title="Contents">
        <div className="flex flex-col">
          {toc.map((item) => (
            <a
              key={item.id}
              href={item.locked ? undefined : `#${item.id}`}
              className={cn(
                "flex items-start gap-2.5 py-[5px]",
                "font-body text-xs no-underline cursor-pointer",
                "transition-all duration-[200ms]",
                item.locked && "opacity-40 pointer-events-none",
                item.id === activeSection
                  ? "text-brand font-semibold"
                  : "text-fg-3 hover:text-fg"
              )}
            >
              <span
                className={cn(
                  "w-[2px] h-full rounded-[1px] shrink-0 self-stretch",
                  item.id === activeSection ? "bg-brand" : "bg-border-s"
                )}
              />
              {item.label}
            </a>
          ))}
        </div>
      </SidebarWidget>

      {/* Related Entities */}
      <SidebarWidget title="Related Entities">
        <div className="flex flex-col gap-[5px]">
          {entities.map((entity) => (
            <Link
              key={entity.name}
              href={entity.href}
              className="flex items-center gap-1.5 font-body text-xs text-brand-l no-underline cursor-pointer transition-colors duration-[200ms] hover:text-brand"
            >
              <span className="inline-block w-[5px] h-[5px] rounded-full bg-brand shrink-0" />
              {entity.name}
            </Link>
          ))}
        </div>
      </SidebarWidget>
    </div>
  );
}
