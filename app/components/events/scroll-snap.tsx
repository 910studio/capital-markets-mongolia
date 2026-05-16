"use client";

import { useEffect } from "react";

/**
 * Scoped native scroll-snap. Adds `html.events-snap` while mounted —
 * globals.css then enables `scroll-snap-type: y proximity` + smooth
 * scrolling on the document. Sections opt in via `scroll-snap-align: start`.
 *
 * Native scroll-snap is hardware-accelerated and doesn't fight the
 * horizontal rails' wheel hijacks the way a JS smooth-scroll lib does.
 */
export function ScrollSnap() {
  useEffect(() => {
    const html = document.documentElement;
    html.classList.add("events-snap");
    return () => {
      html.classList.remove("events-snap");
    };
  }, []);
  return null;
}
