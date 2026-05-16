import type { TextPath } from "@/app/lib/text-to-path";

/**
 * Renders a server-pre-computed SVG `<path>` with a Nair-style hand-drawn
 * animation: stroke traces along the glyph beziers, then the fill fades in.
 *
 * The actual path data (`d`, bounding box) is computed server-side via
 * opentype.js — the browser only sees a finished `<path>` element and a
 * tiny bit of CSS. No font loading, no client-side text-to-path lib.
 */

interface StrokeWriteTextProps {
  /** Server-computed path data from `textToPath()`. */
  pathData: TextPath;
  /** Animation delay in ms. */
  delay?: number;
  /** Stroke draw duration in ms. */
  drawDuration?: number;
  /** Fill fade-in duration in ms — starts right as stroke completes. */
  fillDuration?: number;
  /** Stroke + fill color. Default: white. */
  color?: string;
  /** Stroke thickness in path-data units. Default 4. */
  strokeWidth?: number;
}

export function StrokeWriteText({
  pathData,
  delay = 0,
  drawDuration = 1400,
  fillDuration = 450,
  color = "#fff",
  strokeWidth = 4,
}: StrokeWriteTextProps) {
  // Add a little padding so the stroke isn't clipped at the bounding-box edge.
  const pad = strokeWidth * 2;
  const vbX = pathData.x - pad;
  const vbY = pathData.y - pad;
  const vbW = pathData.width + pad * 2;
  const vbH = pathData.height + pad * 2;
  const aspect = vbW / vbH;
  const fillDelay = delay + drawDuration;

  return (
    <span
      className="block"
      style={{
        display: "block",
        width: "100%",
        height: "1em",
        lineHeight: "0.82",
      }}
    >
      <svg
        viewBox={`${vbX} ${vbY} ${vbW} ${vbH}`}
        preserveAspectRatio="xMinYMid meet"
        style={{
          // Width derived from aspect ratio so the path keeps natural proportions
          // (no horizontal stretching). 1em tall, width grows with character count.
          width: `${aspect}em`,
          height: "1em",
          overflow: "visible",
          display: "block",
        }}
        aria-hidden="true"
      >
        <path
          d={pathData.d}
          fill={color}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
          strokeLinecap="round"
          pathLength="100"
          style={{
            strokeDasharray: 100,
            strokeDashoffset: 100,
            fillOpacity: 0,
            animation: `
              swt-draw ${drawDuration}ms ease-out ${delay}ms forwards,
              swt-fill ${fillDuration}ms ease-out ${fillDelay}ms forwards
            `,
          }}
        />
      </svg>
      <style>{`
        @keyframes swt-draw { to { stroke-dashoffset: 0; } }
        @keyframes swt-fill { to { fill-opacity: 1; } }
        @media (prefers-reduced-motion: reduce) {
          svg path {
            stroke-dashoffset: 0 !important;
            fill-opacity: 1 !important;
            animation: none !important;
          }
        }
      `}</style>
    </span>
  );
}
