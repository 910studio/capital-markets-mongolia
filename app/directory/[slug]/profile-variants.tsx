"use client";

import { useEffect, useRef, useState, type ComponentProps, type ReactNode } from "react";
import { EntityHeader } from "@/app/components/entity";
import { cn } from "@/app/lib/cn";

type Variant = "v1" | "v2" | "v3";

const VARIANTS: { value: Variant; label: string }[] = [
  { value: "v1", label: "Crunchbase" },
  { value: "v2", label: "V2 — Sidebar CTAs" },
  { value: "v3", label: "V3 — Editorial" },
];

interface ProfileVariantsProps {
  headerProps: Omit<ComponentProps<typeof EntityHeader>, "variant">;
  mainContent: ReactNode;
  sidebarContent: ReactNode;
}

export function ProfileVariants({
  headerProps,
  mainContent,
  sidebarContent,
}: ProfileVariantsProps) {
  const [variant, setVariant] = useState<Variant>("v1");
  const [showCompactBar, setShowCompactBar] = useState(false);
  const fullHeaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (variant !== "v1") {
      setShowCompactBar(false);
      return;
    }
    const el = fullHeaderRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowCompactBar(!entry.isIntersecting),
      { rootMargin: "-56px 0px 0px 0px", threshold: 0 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [variant]);

  return (
    <>
      {/* Sticky compact bar (V1 only) — slides in once the full header scrolls out of view */}
      {variant === "v1" && (
        <div
          className={cn(
            "fixed top-[var(--header-h)] left-0 right-0 z-30 bg-[var(--bg)] border-b border-border-s transition-transform duration-200 ease-out",
            showCompactBar ? "translate-y-0" : "-translate-y-full",
          )}
        >
          <div className="max-w-[var(--content-max)] mx-auto px-6 w-full py-2">
            <EntityHeader {...headerProps} variant="v1" compact />
          </div>
        </div>
      )}

      <div className="max-w-[var(--content-max)] mx-auto px-6 w-full py-0">
        <div ref={fullHeaderRef} className="pt-6">
          <EntityHeader {...headerProps} variant={variant} />
        </div>

        <div
          className={cn(
            "grid gap-5 pb-20 items-start max-lg:grid-cols-1",
            variant === "v1"
              ? "grid-cols-[340px_1fr]"
              : "grid-cols-[1fr_340px]",
          )}
        >
          <div
            className={cn(
              "flex flex-col gap-5 min-w-0",
              variant === "v1" && "lg:order-2",
            )}
          >
            {mainContent}
          </div>

          <aside
            className={cn(
              "lg:sticky lg:top-[80px] flex flex-col gap-5 max-lg:grid max-lg:grid-cols-2 max-md:grid-cols-1",
              variant === "v1" && "lg:order-1",
            )}
          >
            {(variant === "v2" || variant === "v3") && (
              <div className="widget">
                <div className="widget-body flex flex-col gap-2">
                  <button className="btn btn-secondary text-sm w-full">
                    Add to Watchlist
                  </button>
                  <button className="btn btn-signal text-sm w-full">
                    Request Connection
                  </button>
                </div>
              </div>
            )}
            {sidebarContent}
          </aside>
        </div>
      </div>

      {/* Floating variant switcher (bottom-center) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 p-1 rounded-[var(--btn-r)] border border-border bg-[var(--white)] shadow-lg">
        {VARIANTS.map((v) => (
          <button
            key={v.value}
            onClick={() => setVariant(v.value)}
            className={cn(
              "px-3 py-1.5 rounded-[var(--btn-r)] text-xs font-display font-semibold cursor-pointer transition-all duration-[200ms] border-none",
              variant === v.value
                ? "bg-brand text-white"
                : "bg-transparent text-fg-2 hover:text-brand",
            )}
          >
            {v.label}
          </button>
        ))}
      </div>
    </>
  );
}
