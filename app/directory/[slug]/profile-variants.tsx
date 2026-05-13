"use client";

import { useEffect, useRef, useState, type ComponentProps, type ReactNode } from "react";
import { EntityHeader } from "@/app/components/entity";
import { cn } from "@/app/lib/cn";

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
  const [showCompactBar, setShowCompactBar] = useState(false);
  const fullHeaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = fullHeaderRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowCompactBar(!entry.isIntersecting),
      { rootMargin: "-56px 0px 0px 0px", threshold: 0 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Sticky compact bar — slides in once the full header scrolls out of view */}
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

      <div className="max-w-[var(--content-max)] mx-auto px-6 w-full py-0">
        <div ref={fullHeaderRef} className="pt-6">
          <EntityHeader {...headerProps} variant="v1" />
        </div>

        <div className="grid gap-5 pb-20 items-start max-lg:grid-cols-1 grid-cols-[340px_1fr]">
          <div className="flex flex-col gap-5 min-w-0 lg:order-2">
            {mainContent}
          </div>

          <aside className="lg:sticky lg:top-[80px] flex flex-col gap-5 max-lg:grid max-lg:grid-cols-2 max-md:grid-cols-1 lg:order-1">
            {sidebarContent}
          </aside>
        </div>
      </div>
    </>
  );
}
