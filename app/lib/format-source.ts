/**
 * Display formatter for news-feed source identifiers.
 *
 * The BFF returns `source` in two shapes:
 *   - Slug-cased entity refs (e.g. "ministry-of-road-and-transport-development",
 *     "mse", "mongolian-mining-corp") — internal identifiers from the
 *     entities/sources table.
 *   - Already-readable publication names (e.g. "Asia News Network",
 *     "The Australian", "Azərtac") — passed through verbatim.
 *
 * This helper:
 *   1. Returns the value unchanged when it looks like a real label
 *      (no dashes, contains a space or non-ASCII, or all-uppercase short).
 *   2. Otherwise, title-cases the slug with an acronym allow-list so
 *      "mse" → "MSE", "ard-credit" → "Ard Credit", etc.
 */

const ACRONYMS = new Set([
  "mse", "bta", "tdb", "mmc", "mmce", "mim", "cmm", "csi", "kpmg",
  "imf", "adb", "wb", "boe", "fed", "ecb", "msc", "ifrs", "sec",
  "etf", "ipo", "ev", "esg", "ai", "fx", "fdi", "ipp", "bess",
]);

const OVERRIDES: Record<string, string> = {
  "1212-mn": "1212.mn",
  "ikon": "Ikon",
  "marketinfo": "MarketInfo",
  "entr-e-resources-ltd": "Entrée Resources Ltd",
  "banpu-public-company-limited": "Banpu",
  "mongolian-mining-corp": "Mongolian Mining Corp",
  "mongolian-mortgage-corporation": "Mongolian Mortgage Corporation",
  "ard-credit": "Ard Credit",
  "government-of-mongolia": "Government of Mongolia",
  "ministry-of-environment-and-climate-change": "Ministry of Environment & Climate Change",
  "ministry-of-road-and-transport-development": "Ministry of Road & Transport",
};

export function formatSourceLabel(raw: string | null | undefined): string {
  if (!raw) return "";
  const s = raw.trim();
  if (!s) return "";

  // Already-readable: contains a space (multi-word name), non-ASCII
  // characters (e.g. БТА, Azərtac, 아시아경제), or has a dot in it.
  if (/\s/.test(s) || /[^\x00-\x7F]/.test(s) || s.includes(".")) return s;

  // Slug shape — has a dash. Use override or title-case rules.
  if (s.includes("-")) {
    const override = OVERRIDES[s.toLowerCase()];
    if (override) return override;
    return s
      .split("-")
      .map((word) => {
        const lower = word.toLowerCase();
        if (ACRONYMS.has(lower)) return lower.toUpperCase();
        return lower.charAt(0).toUpperCase() + lower.slice(1);
      })
      .join(" ");
  }

  // Single token, no dashes.
  const lower = s.toLowerCase();
  if (ACRONYMS.has(lower)) return lower.toUpperCase();
  // 2–4 char single token → assume acronym (NTC, etc.).
  if (s.length <= 4) return s.toUpperCase();
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}
