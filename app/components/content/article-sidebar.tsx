"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
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
    <div className="widget">
      <div className="widget-header">
        <span>{title}</span>
      </div>
      <div className="widget-body">{children}</div>
    </div>
  );
}

/* ── Scroll-tracking hook ────────────────── */

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0] ?? "");

  useEffect(() => {
    const validIds = ids.filter((id) => document.getElementById(id));
    if (!validIds.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the topmost visible section
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
          setActive(visible[0]!.target.id);
        }
      },
      {
        rootMargin: "-80px 0px -60% 0px",
        threshold: 0,
      },
    );

    validIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [ids]);

  return active;
}

/* ── ArticleSidebar ────────────────────── */

export function ArticleSidebar({ toc, entities }: ArticleSidebarProps) {
  const sectionIds = toc.filter((t) => !t.locked).map((t) => t.id);
  const activeSection = useActiveSection(sectionIds);

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
                  : "text-fg-3 hover:text-fg",
              )}
            >
              <span
                className={cn(
                  "w-[2px] rounded-[1px] shrink-0 self-stretch min-h-[16px]",
                  "transition-colors duration-[200ms]",
                  item.id === activeSection ? "bg-brand" : "bg-border-s",
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
