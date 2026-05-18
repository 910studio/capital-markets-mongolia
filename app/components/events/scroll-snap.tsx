"use client";

import { useEffect } from "react";

/**
 * Deck-style scroll snap for /events. Each wheel "stream" (a burst of
 * continuous wheel events from a single flick, including trackpad
 * inertia) snaps to exactly ONE section. To trigger another snap, the
 * user has to pause scrolling for at least IDLE_MS so the stream ends.
 *
 * Why the stream model, not a fixed cooldown:
 *   • Trackpad inertia fires wheel events for 1–2 seconds after a hard
 *     flick. A fixed cooldown shorter than that triggers a second snap
 *     mid-flick — exactly the "hard scroll still works" bug.
 *   • Tracking the time since the last wheel event and only allowing a
 *     new snap once events have stopped guarantees one-snap-per-flick.
 *
 * Coexists with horizontal rails (events-rail.tsx): the rail's wheel
 * handler calls preventDefault() when it wants the wheel — our listener
 * is non-passive and checks `defaultPrevented` so we don't double-fire.
 */
export function ScrollSnap() {
  useEffect(() => {
    const html = document.documentElement;
    html.classList.add("events-snap");

    // True from the first wheel event of a stream until IDLE_MS of silence.
    let streamActive = false;
    let streamTimer: number | null = null;
    let animating = false;
    let animTimer: number | null = null;

    const IDLE_MS = 180;           // wheel silence before a new stream can start
    const ANIM_MS = 700;           // matches smooth-scroll feel
    const DELTA_THRESHOLD = 8;     // ignore trackpad jitter
    const TOUCH_THRESHOLD = 40;    // px for a real swipe

    function getSnaps(): HTMLElement[] {
      return Array.from(document.querySelectorAll<HTMLElement>("[data-snap]"));
    }

    /** Find the index of the section currently in view (top closest to 0). */
    function currentIndex(): number {
      const snaps = getSnaps();
      if (snaps.length === 0) return 0;
      const scrollY = window.scrollY;
      let idx = 0;
      let bestDist = Infinity;
      snaps.forEach((el, i) => {
        const top = el.getBoundingClientRect().top + scrollY;
        const dist = Math.abs(top - scrollY);
        if (dist < bestDist) { bestDist = dist; idx = i; }
      });
      return idx;
    }

    function snapTo(dir: 1 | -1) {
      if (animating) return;
      const snaps = getSnaps();
      if (snaps.length === 0) return;
      const cur = currentIndex();
      const next = Math.max(0, Math.min(snaps.length - 1, cur + dir));
      if (next === cur) return;
      animating = true;
      const target = snaps[next];
      const top = target.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top, behavior: "smooth" });
      if (animTimer) window.clearTimeout(animTimer);
      animTimer = window.setTimeout(() => { animating = false; }, ANIM_MS);
    }

    function refreshStreamIdle() {
      if (streamTimer) window.clearTimeout(streamTimer);
      streamTimer = window.setTimeout(() => {
        streamActive = false;
        streamTimer = null;
      }, IDLE_MS);
    }

    function onWheel(e: WheelEvent) {
      // Inner handler (horizontal rail) already consumed this wheel event.
      if (e.defaultPrevented) return;
      // Horizontal-dominant gestures belong to rails.
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      // Block native scroll for ANY vertical wheel event, even tiny ones,
      // so trackpad inertia can't bleed through into a native scroll.
      e.preventDefault();
      if (Math.abs(e.deltaY) < DELTA_THRESHOLD) {
        // Refresh the idle timer so the stream stays alive during inertia.
        if (streamActive) refreshStreamIdle();
        return;
      }
      if (streamActive) {
        // Mid-flight — keep the stream alive, but don't trigger another snap.
        refreshStreamIdle();
        return;
      }
      // First "real" wheel event of a new stream.
      streamActive = true;
      refreshStreamIdle();
      snapTo(e.deltaY > 0 ? 1 : -1);
    }

    function onKey(e: KeyboardEvent) {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      switch (e.key) {
        case "ArrowDown":
        case "PageDown":
        case " ":
          e.preventDefault();
          snapTo(1);
          break;
        case "ArrowUp":
        case "PageUp":
          e.preventDefault();
          snapTo(-1);
          break;
        case "Home":
          e.preventDefault();
          animating = true;
          window.scrollTo({ top: 0, behavior: "smooth" });
          if (animTimer) window.clearTimeout(animTimer);
          animTimer = window.setTimeout(() => { animating = false; }, ANIM_MS);
          break;
        case "End": {
          e.preventDefault();
          const snaps = getSnaps();
          const last = snaps[snaps.length - 1];
          if (!last) break;
          animating = true;
          const top = last.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({ top, behavior: "smooth" });
          if (animTimer) window.clearTimeout(animTimer);
          animTimer = window.setTimeout(() => { animating = false; }, ANIM_MS);
          break;
        }
      }
    }

    let touchStartY = 0;
    function onTouchStart(e: TouchEvent) {
      touchStartY = e.touches[0]?.clientY ?? 0;
    }
    function onTouchEnd(e: TouchEvent) {
      const endY = e.changedTouches[0]?.clientY ?? 0;
      const dy = touchStartY - endY;
      if (Math.abs(dy) < TOUCH_THRESHOLD) return;
      snapTo(dy > 0 ? 1 : -1);
    }

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      html.classList.remove("events-snap");
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      if (streamTimer) window.clearTimeout(streamTimer);
      if (animTimer) window.clearTimeout(animTimer);
    };
  }, []);

  return null;
}
