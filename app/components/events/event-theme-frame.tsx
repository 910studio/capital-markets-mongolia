"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Renders an event's custom HTML theme inside a sandboxed iframe.
 *
 * Security model:
 *   • `sandbox="allow-scripts"` (no `allow-same-origin`) → the iframe has
 *     a null origin. Scripts run inside (so editor animations work) but
 *     the iframe can't reach parent cookies, localStorage, or DOM.
 *   • External CDN/font requests still work (those aren't gated by the
 *     iframe origin, only by network CORS rules on the asset host).
 *
 * Sizing model:
 *   • `heightVh` is the FALLBACK height (viewport-height units) used
 *     when the theme doesn't opt into auto-resize.
 *   • Auto-resize convention: the theme posts a message to the parent
 *       parent.postMessage({ type: 'event-theme-height', height: <px> }, '*')
 *     and the iframe resizes to match. Editors drop this one-liner at
 *     the bottom of their HTML:
 *       new ResizeObserver(() =>
 *         parent.postMessage({ type: 'event-theme-height',
 *           height: document.documentElement.scrollHeight }, '*')
 *       ).observe(document.documentElement);
 *     Themes without the snippet stay at the fallback height.
 */
export function EventThemeFrame({
  src,
  heightVh = 100,
  title,
  fullBleed = false,
}: {
  src: string;
  heightVh?: number;
  title: string;
  /** When true, breaks out of the content-max container with a negative
   *  margin trick so the theme runs edge-to-edge. */
  fullBleed?: boolean;
}) {
  const fallbackVh = Math.min(500, Math.max(30, heightVh));
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [autoHeightPx, setAutoHeightPx] = useState<number | null>(null);

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      // Only accept messages from THIS iframe (e.source identity check
      // — works even though the iframe is null-origin, since we're
      // comparing the contentWindow ref, not origins).
      if (e.source !== iframeRef.current?.contentWindow) return;
      const data = e.data as { type?: string; height?: unknown } | null;
      if (!data || data.type !== "event-theme-height") return;
      const h = typeof data.height === "number" ? data.height : Number(data.height);
      if (!Number.isFinite(h) || h <= 0) return;
      // Clamp 50px–50000px so a buggy theme can't hang the page with a
      // pathological height.
      setAutoHeightPx(Math.min(50000, Math.max(50, Math.round(h))));
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  const style: React.CSSProperties = autoHeightPx
    ? { height: `${autoHeightPx}px` }
    : { height: `${fallbackVh}vh` };

  return (
    <div
      className={fullBleed ? "relative w-screen left-1/2 -translate-x-1/2 my-8" : "relative w-full my-8"}
    >
      <iframe
        ref={iframeRef}
        src={src}
        title={`${title} — custom theme`}
        sandbox="allow-scripts"
        loading="lazy"
        referrerPolicy="no-referrer"
        // scrolling="no" is the legacy attribute that still works to
        // suppress the iframe's internal scrollbar across browsers.
        // Modern CSS `overflow: hidden` on the iframe element doesn't
        // actually disable its internal scroll — only this attribute does.
        scrolling="no"
        className="block w-full border-0 bg-transparent"
        style={{ ...style, overflow: "hidden" }}
      />
    </div>
  );
}
