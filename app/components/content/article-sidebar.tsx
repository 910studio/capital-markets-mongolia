"use client";

import { useState, useEffect } from "react";
import { cn } from "@/app/lib/cn";

/* ── Types ─────────────────────────────── */

interface TocItem {
  id: string;
  label: string;
  locked?: boolean;
}

interface ArticleSidebarProps {
  toc: TocItem[];
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

    const OFFSET = 100; // px from top of viewport

    function onScroll() {
      let current = validIds[0]!;

      for (const id of validIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top <= OFFSET) {
          current = id;
        } else {
          break;
        }
      }

      setActive(current);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [ids]);

  return active;
}

/* ── ArticleSidebar ────────────────────── */

export function ArticleSidebar({ toc }: ArticleSidebarProps) {
  const sectionIds = toc.filter((t) => !t.locked).map((t) => t.id);
  const activeSection = useActiveSection(sectionIds);

  return (
    <div className="flex flex-col gap-5">
      {/* Table of Contents */}
      <SidebarWidget title="Contents">
        <div className="flex flex-col">
          {toc.map((item) => (
            <a
              key={item.id}
              href={item.locked ? undefined : `#${item.id}`}
              className={cn(
                "flex items-start gap-2.5 py-[6px]",
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

    </div>
  );
}
