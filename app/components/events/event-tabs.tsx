"use client";

import { useEffect, useRef, useState } from "react";

export interface EventTabItem {
  id: string;
  label: string;
  count: number;
}

interface EventTabsProps {
  tabs: EventTabItem[];
  /** Right-rail label, e.g. "Season II · 2026". */
  meta?: string;
  /** Show the LIVE pulse to the right. */
  showLive?: boolean;
}

/**
 * Sticky brutalist tabs that auto-activate based on scroll position via
 * IntersectionObserver. Click scrolls to the section (smooth) — also
 * supports anchor deep-links (e.g. /events#past).
 */
export function EventTabs({ tabs, meta, showLive = true }: EventTabsProps) {
  const [active, setActive] = useState(tabs[0]?.id ?? "");
  const [stuck, setStuck] = useState(false);
  // Offset for scrollTo: just the tab strip height (49px). When tabs are
  // visible they cover the nav, so nav height doesn't enter the equation.
  const headerOffset = useRef(49);

  useEffect(() => {
    headerOffset.current = 49;

    // Scroll-driven slide-in: tabs come down from above once user has scrolled
    // past most of the hero. Slide back up on scroll-to-top.
    const onScroll = () => {
      const triggerY = window.innerHeight - 49;
      setStuck(window.scrollY > triggerY);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // honor #hash on load
    if (window.location.hash) {
      const id = window.location.hash.slice(1);
      if (tabs.some((t) => t.id === id)) {
        setActive(id);
        // small delay so layout settles before scrollIntoView
        setTimeout(() => scrollToSection(id), 30);
      }
    }

    const sections = tabs
      .map((t) => document.getElementById(t.id))
      .filter((el): el is HTMLElement => Boolean(el));

    let io: IntersectionObserver | null = null;
    if (sections.length > 0) {
      io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              setActive(entry.target.id);
            }
          }
        },
        {
          rootMargin: `-${headerOffset.current + 80}px 0px -50% 0px`,
          threshold: 0,
        },
      );
      sections.forEach((s) => io!.observe(s));
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
      io?.disconnect();
    };
  }, [tabs]);

  function scrollToSection(id: string) {
    const el = document.getElementById(id);
    if (!el) return;
    // First tab = page top (e.g. hero is "Featured"): scroll to viewport top so
    // the full hero is visible. Otherwise offset by sticky nav + tabs height.
    const isFirstTab = tabs[0]?.id === id;
    const top = isFirstTab
      ? 0
      : el.getBoundingClientRect().top + window.scrollY - headerOffset.current + 1;
    window.scrollTo({ top, behavior: "smooth" });
  }

  return (
    <div
      role="tablist"
      aria-hidden={!stuck}
      className="fixed left-0 right-0 top-0 flex items-stretch bg-[var(--bg)] border-b border-border px-6 overflow-x-auto scrollbar-none"
      style={{
        zIndex: 51,
        fontFamily: "var(--font-d)",
        transform: stuck ? "translateY(0)" : "translateY(-100%)",
        transition: "transform 0.32s cubic-bezier(0.4, 0, 0.2, 1)",
        willChange: "transform",
      }}
    >
      {tabs.map((t) => {
        const isActive = t.id === active;
        return (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => {
              setActive(t.id);
              scrollToSection(t.id);
            }}
            className="appearance-none bg-transparent border-0 py-3.5 mr-8 font-display font-bold text-[13px] uppercase tracking-[0.08em] cursor-pointer whitespace-nowrap border-b-2 transition-colors inline-flex items-center gap-2"
            style={{
              color: isActive ? "var(--fg)" : "var(--fg-3)",
              borderBottomColor: isActive ? "var(--brand)" : "transparent",
            }}
          >
            {t.label}
            <span
              className="font-mono text-[10px] font-medium px-1.5 py-0.5 rounded-[2px] transition-colors"
              style={{
                background: isActive ? "var(--brand)" : "var(--surface)",
                color: isActive ? "var(--white)" : "var(--fg-3)",
              }}
            >
              {String(t.count).padStart(2, "0")}
            </span>
          </button>
        );
      })}

      <span className="flex-1 min-w-0" />

      <div className="hidden md:flex items-center gap-4 self-center font-mono text-[11px] uppercase tracking-[0.1em] text-fg-3">
        {showLive && (
          <span
            className="inline-flex items-center gap-1.5 font-bold"
            style={{ color: "var(--signal)" }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: "var(--signal)",
                animation: "event-tabs-pulse 1.6s infinite",
              }}
            />
            LIVE
          </span>
        )}
        {meta && <span>{meta}</span>}
      </div>

      <style>{`
        @keyframes event-tabs-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        .scrollbar-none::-webkit-scrollbar { display: none; }
        .scrollbar-none { scrollbar-width: none; }
      `}</style>
    </div>
  );
}
