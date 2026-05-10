"use client";

import { useEffect, useRef } from "react";

/**
 * Observes a wrapper element and stamps `data-revealed="true"` on it
 * (and any descendants marked `data-reveal`) the first time it crosses the viewport.
 *
 * Pair with the CSS rules in globals.css under `[data-reveal]`.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(opts?: {
  threshold?: number;
  rootMargin?: string;
}) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      el.dataset.revealed = "true";
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).dataset.revealed = "true";
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: opts?.threshold ?? 0.15, rootMargin: opts?.rootMargin ?? "0px 0px -8% 0px" },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [opts?.threshold, opts?.rootMargin]);

  return ref;
}
