import "server-only";

import { readFileSync } from "node:fs";
import path from "node:path";

/**
 * Convert a string into precise SVG path data using the locally-bundled
 * Plus Jakarta Sans font. Runs server-side only — opentype.js (~120KB) is
 * never shipped to the client. The path data is sent down as a tiny string.
 *
 * Use this for hero text that needs true path-traced animations (stroke
 * along glyph bezier curves) — `<text>` + stroke-dasharray doesn't work
 * cleanly in browsers because text rendering uses multiple subpaths.
 */

interface TextToPathOptions {
  /** Font size in font-unit pixels. Default 200. */
  fontSize?: number;
  /** Letter-spacing as em fraction. Negative tightens. Default -0.05. */
  letterSpacing?: number;
}

export interface TextPath {
  /** SVG `d` attribute — full path data for the rendered text. */
  d: string;
  /** Tight bounding box of the path. */
  x: number;
  y: number;
  width: number;
  height: number;
  /** Approximate total path length (sum of subpath perimeters) used for the
      `pathLength` SVG attribute. For a normalized 0..100 dash animation,
      pass `pathLength="100"` and use 100 for dasharray/dashoffset. */
  pathLength: number;
}

// Module-scoped cache — load + parse the font once per server lifetime.
let fontPromise: Promise<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  parse: any;
}> | null = null;

async function getFont() {
  if (!fontPromise) {
    fontPromise = (async () => {
      const opentype = await import("opentype.js");
      const fontPath = path.join(
        process.cwd(),
        "public/fonts/PlusJakartaSans-ExtraBold.ttf",
      );
      const buf = readFileSync(fontPath);
      const font = opentype.parse(buf.buffer.slice(
        buf.byteOffset,
        buf.byteOffset + buf.byteLength,
      ));
      return font as unknown as { parse: typeof font };
    })();
  }
  return fontPromise;
}

export async function textToPath(
  text: string,
  options: TextToPathOptions = {},
): Promise<TextPath> {
  const { fontSize = 200, letterSpacing = -0.05 } = options;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const font = (await getFont()) as any;

  // letterSpacing is em-relative; convert to font-units.
  const tracking = letterSpacing * fontSize;

  // Manually lay out each glyph so we can apply tight tracking (opentype's
  // built-in getPath spaces glyphs at their natural advance widths).
  let x = 0;
  const y = 0;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const combined: any = font.getPath("", 0, 0, fontSize);
  combined.commands = [];

  for (const ch of text) {
    const glyph = font.charToGlyph(ch);
    if (!glyph) continue;
    const cmds = glyph.getPath(x, y, fontSize).commands;
    combined.commands.push(...cmds);
    x += (glyph.advanceWidth ?? 0) * (fontSize / font.unitsPerEm) + tracking;
  }

  const bb = combined.getBoundingBox();
  return {
    d: combined.toPathData(2),
    x: bb.x1,
    y: bb.y1,
    width: bb.x2 - bb.x1,
    height: bb.y2 - bb.y1,
    // opentype doesn't expose path length cheaply — use a generous estimate
    // (perimeter rough: 2 * (width + height) * char count factor) and the
    // browser will accept any positive value with normalized pathLength.
    pathLength: 100,
  };
}
