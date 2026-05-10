"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { EntityCard } from "@/app/components/directory/entity-card";
import { cn } from "@/app/lib/cn";
import type { MockEntity } from "@/app/lib/mock-data";
import { ENTITY_TYPE_FILTERS, ENTITY_TYPE_LABELS, SECTOR_LIST } from "@/app/lib/mock-data";

const TYPE_ORDER = [
  { variant: "public_company", label: "Public Companies" },
  { variant: "private_company", label: "Private Companies" },
  { variant: "project", label: "Projects" },
  { variant: "service_provider", label: "Service Providers" },
];

const SECTION_PREVIEW = 8;

/* ── URL param helpers ───────────────────── */

function readParams() {
  if (typeof window === "undefined") return {};
  const p = new URLSearchParams(window.location.search);
  return {
    q: p.get("q") ?? "",
    type: p.get("type") ?? "all",
    sector: p.get("sector") ?? null,
    raising: p.get("raising") === "1",
  };
}

function writeParams(state: {
  q: string;
  type: string;
  sector: string | null;
  raising: boolean;
}) {
  const p = new URLSearchParams();
  if (state.q) p.set("q", state.q);
  if (state.type !== "all") p.set("type", state.type);
  if (state.sector) p.set("sector", state.sector);
  if (state.raising) p.set("raising", "1");
  const str = p.toString();
  window.history.replaceState(null, "", str ? `?${str}` : window.location.pathname);
}

/* ── Sector dropdown ─────────────────────── */

function SectorDropdown({
  value,
  onChange,
  options,
}: {
  value: string | null;
  onChange: (value: string | null) => void;
  options: readonly string[];
}) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number; minWidth: number } | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  /* Recompute panel position any time it opens or the viewport changes */
  useEffect(() => {
    if (!open) {
      setPos(null);
      return;
    }
    const update = () => {
      const el = triggerRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      setPos({ top: r.bottom + 6, left: r.left, minWidth: Math.max(r.width, 220) });
    };
    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [open]);

  /* Click-outside + Escape */
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      const t = e.target as Node;
      if (
        triggerRef.current && !triggerRef.current.contains(t) &&
        panelRef.current && !panelRef.current.contains(t)
      ) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const label = value ?? "All Sectors";
  const active = !!value;

  return (
    <>
      <button
        type="button"
        ref={triggerRef}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-[var(--btn-r)] border text-sm font-display font-semibold cursor-pointer transition-all duration-[200ms] whitespace-nowrap",
          active
            ? "border-transparent bg-brand-m text-brand"
            : "border-border bg-[var(--white)] text-fg-2 hover:border-brand-l",
        )}
      >
        <span>{label}</span>
        <svg
          className={cn(
            "transition-transform duration-200",
            open && "rotate-180",
          )}
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && pos && (
        <div
          ref={panelRef}
          style={{ position: "fixed", top: pos.top, left: pos.left, minWidth: pos.minWidth }}
          className="z-[100] py-1 rounded-[var(--card-r)] border border-border bg-[var(--white)] shadow-lg max-h-[320px] overflow-y-auto scrollbar-none"
        >
          <button
            type="button"
            onClick={() => {
              onChange(null);
              setOpen(false);
            }}
            className={cn(
              "flex items-center w-full text-left px-3 py-2 text-sm font-medium cursor-pointer transition-colors border-none",
              !active
                ? "bg-brand-m text-brand font-semibold"
                : "bg-transparent text-fg-2 hover:bg-surface hover:text-fg",
            )}
          >
            All Sectors
          </button>
          <div className="h-px bg-border-s my-1" />
          {options.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                onChange(s);
                setOpen(false);
              }}
              className={cn(
                "flex items-center gap-2 w-full text-left px-3 py-2 text-sm font-medium cursor-pointer transition-colors border-none",
                value === s
                  ? "bg-brand-m text-brand font-semibold"
                  : "bg-transparent text-fg-2 hover:bg-surface hover:text-fg",
              )}
            >
              <span
                className={cn(
                  "w-1.5 h-1.5 rounded-full shrink-0 transition-colors",
                  value === s ? "bg-brand" : "bg-fg-3",
                )}
              />
              {s}
            </button>
          ))}
        </div>
      )}
    </>
  );
}

/* ── Search icon ─────────────────────────── */

function SearchIcon() {
  return (
    <svg
      className="absolute left-3 top-1/2 -translate-y-1/2 text-fg-3 pointer-events-none"
      width="16"
      height="16"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
      />
    </svg>
  );
}

/* ── DirectoryControls ───────────────────── */

interface DirectoryControlsProps {
  entities: MockEntity[];
}

type LayoutVariant = "v1" | "v2";

const LAYOUT_OPTIONS: { value: LayoutVariant; label: string }[] = [
  { value: "v1", label: "V1 — Drawer" },
  { value: "v2", label: "V2 — Inline Filters" },
];

export function DirectoryControls({ entities }: DirectoryControlsProps) {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [sector, setSector] = useState<string | null>(null);
  const [raising, setRaising] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [layout, setLayout] = useState<LayoutVariant>("v1");

  /* Hydrate from URL on mount */
  useEffect(() => {
    const init = readParams();
    setSearch(init.q ?? "");
    setType(init.type ?? "all");
    setSector(init.sector ?? null);
    setRaising(init.raising ?? false);
    setMounted(true);
  }, []);

  /* Sync state → URL */
  useEffect(() => {
    if (!mounted) return;
    writeParams({ q: search, type, sector, raising });
  }, [search, type, sector, raising, mounted]);

  /* Lock body scroll when drawer open */
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  /* Filter logic */
  const filtered = useMemo(() => {
    let result = entities;

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          (e.ticker && e.ticker.toLowerCase().includes(q))
      );
    }

    if (type !== "all") {
      result = result.filter((e) => e.type === type);
    }

    if (sector) {
      result = result.filter((e) => e.sector === sector);
    }

    if (raising) {
      result = result.filter((e) => e.isRaising);
    }

    return result;
  }, [entities, search, type, sector, raising]);

  const total = filtered.length;
  const hasFilters = !!search || type !== "all" || !!sector || raising;
  const activeCount = (type !== "all" ? 1 : 0) + (sector ? 1 : 0) + (raising ? 1 : 0);

  const clearAll = useCallback(() => {
    setSearch("");
    setType("all");
    setSector(null);
    setRaising(false);
  }, []);

  const handleTypeClick = useCallback((variant: string) => {
    setType(variant);
    window.scrollTo({ top: 0 });
  }, []);

  /* Grouped by type for section view */
  const grouped = useMemo(() => {
    const map = new Map<string, MockEntity[]>();
    for (const entity of filtered) {
      const key = entity.type;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(entity);
    }
    return map;
  }, [filtered]);

  return (
    <>
      {/* Slide-in drawer + backdrop (V1 only) */}
      {layout === "v1" && drawerOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/30"
          onClick={() => setDrawerOpen(false)}
        />
      )}
      <div
        className={cn(
          "fixed top-0 left-0 z-[61] h-full w-[340px] max-w-[85vw] bg-[var(--white)] border-r border-border shadow-xl",
          "flex flex-col",
          "transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          layout === "v1" && drawerOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border-s shrink-0">
          <span className="font-display font-bold text-base">Filters</span>
          <button
            onClick={() => setDrawerOpen(false)}
            className="w-8 h-8 rounded-[var(--btn-r)] grid place-items-center cursor-pointer border-none bg-transparent text-fg-3 hover:bg-surface hover:text-fg transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-none p-5">
          <span className="font-display font-bold text-xs uppercase tracking-[0.08em] text-fg-3 mb-3 block">Type</span>
          <div className="flex flex-col gap-0.5 mb-8">
            {ENTITY_TYPE_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => { setType(f.value); }}
                className={cn(
                  "text-left px-3 py-2 rounded-[var(--btn-r)] text-sm font-medium cursor-pointer transition-all duration-[200ms] border-none",
                  f.value === type
                    ? "bg-brand-m text-brand font-semibold"
                    : "bg-transparent text-fg-2 hover:bg-surface hover:text-fg"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>

          <span className="font-display font-bold text-xs uppercase tracking-[0.08em] text-fg-3 mb-3 block">Sector</span>
          <div className="flex flex-col gap-0.5 mb-8">
            {SECTOR_LIST.map((s) => (
              <button
                key={s}
                onClick={() => { setSector(sector === s ? null : s); }}
                className={cn(
                  "flex items-center gap-2 text-left px-3 py-2 rounded-[var(--btn-r)] text-sm font-medium cursor-pointer transition-all duration-[200ms] border-none",
                  sector === s
                    ? "bg-brand-m text-brand font-semibold"
                    : "bg-transparent text-fg-2 hover:text-brand"
                )}
              >
                <span className={cn(
                  "w-1.5 h-1.5 rounded-full shrink-0 transition-colors",
                  sector === s ? "bg-brand" : "bg-fg-3"
                )} />
                {s}
              </button>
            ))}
          </div>

          <span className="font-display font-bold text-xs uppercase tracking-[0.08em] text-fg-3 mb-3 block">Status</span>
          <button
            onClick={() => setRaising(!raising)}
            className={cn(
              "flex items-center gap-2 text-left px-3 py-2 rounded-[var(--btn-r)] text-sm font-medium cursor-pointer transition-all duration-[200ms] border-none w-full",
              raising
                ? "bg-signal-m text-signal-h font-semibold"
                : "bg-transparent text-fg-2 hover:bg-surface hover:text-fg"
            )}
          >
            <span className={cn(
              "w-1.5 h-1.5 rounded-full shrink-0 transition-colors",
              raising ? "bg-signal" : "bg-fg-3"
            )} />
            Actively Raising
          </button>
        </div>

        {hasFilters && (
          <div className="px-5 py-4 border-t border-border-s shrink-0">
            <button
              onClick={clearAll}
              className="btn btn-secondary w-full text-sm"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Page title — dynamic */}
      <div className="pt-8 pb-6">
        <div className="flex items-center gap-3">
          <h1 className="font-display font-extrabold text-2xl tracking-tight">
            {type !== "all"
              ? ENTITY_TYPE_LABELS[type as keyof typeof ENTITY_TYPE_LABELS] ?? "Directory"
              : "All Entities"}
          </h1>
          {type !== "all" && (
            <button
              onClick={() => setType("all")}
              className="font-display font-semibold text-sm text-fg-3 hover:text-brand cursor-pointer bg-transparent border-none leading-none mt-px"
            >
              ← All
            </button>
          )}
        </div>
        <p className="text-base text-fg-2 mt-1">
          Mongolia&apos;s capital markets companies, projects, and service providers
        </p>
      </div>

      {/* ── V1: drawer-trigger top bar ─────────────────── */}
      {layout === "v1" && (
        <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => setDrawerOpen(true)}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-[var(--btn-r)] border text-sm font-display font-semibold cursor-pointer transition-all duration-[200ms]",
                hasFilters
                  ? "border-transparent bg-brand-m text-brand"
                  : "border-border bg-[var(--white)] text-fg-2 hover:border-brand-l"
              )}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="4" y1="12" x2="14" y2="12" />
                <line x1="4" y1="18" x2="10" y2="18" />
              </svg>
              Filters
              {activeCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-brand text-white text-[10px] font-bold grid place-items-center">
                  {activeCount}
                </span>
              )}
            </button>

            {type !== "all" && (
              <span className="flex items-center gap-1.5 text-xs font-medium text-brand bg-brand-m px-2.5 py-1 rounded-[var(--btn-r)]">
                {ENTITY_TYPE_LABELS[type as keyof typeof ENTITY_TYPE_LABELS]}
                <button onClick={() => setType("all")} className="text-brand hover:text-brand-h cursor-pointer bg-transparent border-none p-0 text-xs font-bold">×</button>
              </span>
            )}
            {sector && (
              <span className="flex items-center gap-1.5 text-xs font-medium text-brand bg-brand-m px-2.5 py-1 rounded-[var(--btn-r)]">
                {sector}
                <button onClick={() => setSector(null)} className="text-brand hover:text-brand-h cursor-pointer bg-transparent border-none p-0 text-xs font-bold">×</button>
              </span>
            )}
            {raising && (
              <span className="flex items-center gap-1.5 text-xs font-medium text-signal-h bg-signal-m px-2.5 py-1 rounded-[var(--btn-r)]">
                <span className="w-1.5 h-1.5 rounded-full bg-signal" />
                Actively Raising
                <button onClick={() => setRaising(false)} className="text-signal-h hover:text-signal cursor-pointer bg-transparent border-none p-0 text-xs font-bold">×</button>
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-[280px] max-md:w-full">
              <SearchIcon />
              <input
                type="text"
                placeholder="Search by name, ticker..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input !pl-9"
              />
            </div>
            <span className="text-xs text-fg-3 font-mono whitespace-nowrap">{total} results</span>
          </div>
        </div>
      )}

      {/* ── V2: inline filter bar — single row ── */}
      {layout === "v2" && (
        <div className="flex items-center gap-2 mb-6 overflow-x-auto scrollbar-none -mx-1 px-1">
          {/* Type tabs */}
          {ENTITY_TYPE_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => { setType(f.value); window.scrollTo({ top: 0 }); }}
              className={cn(
                "px-3 py-1.5 rounded-[var(--btn-r)] text-sm font-display font-semibold whitespace-nowrap transition-all border border-transparent cursor-pointer shrink-0",
                type === f.value
                  ? "bg-brand-m text-brand"
                  : "text-fg-2 hover:text-fg hover:bg-surface",
              )}
            >
              {f.label}
            </button>
          ))}

          {/* Divider */}
          <div className="w-px h-5 bg-border-s mx-1 shrink-0" />

          {/* Sector dropdown (custom, styled) */}
          <div className="shrink-0">
            <SectorDropdown value={sector} onChange={setSector} options={SECTOR_LIST} />
          </div>

          {/* Raising toggle */}
          <button
            onClick={() => setRaising(!raising)}
            role="switch"
            aria-checked={raising}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-[var(--btn-r)] border text-sm font-display font-semibold cursor-pointer transition-all duration-[200ms] whitespace-nowrap shrink-0",
              raising
                ? "border-transparent bg-brand-m text-brand"
                : "border-border bg-[var(--white)] text-fg-2 hover:border-brand-l",
            )}
          >
            <span
              className={cn(
                "relative inline-block w-8 h-[18px] rounded-full transition-colors duration-200 shrink-0",
                raising ? "bg-brand" : "bg-border",
              )}
            >
              <span
                className={cn(
                  "absolute top-[2px] left-[2px] w-[14px] h-[14px] rounded-full bg-[var(--white)] shadow-sm transition-transform duration-200",
                  raising ? "translate-x-[14px]" : "translate-x-0",
                )}
              />
            </span>
            Actively Raising
          </button>

          {hasFilters && (
            <button
              onClick={clearAll}
              className="text-xs font-display font-semibold text-fg-3 hover:text-brand cursor-pointer bg-transparent border-none px-2 whitespace-nowrap shrink-0"
            >
              Clear all
            </button>
          )}

          {/* Spacer pushes search + count to the right */}
          <div className="flex-1" />

          <div className="relative w-[240px] shrink-0 max-md:w-[180px]">
            <SearchIcon />
            <input
              type="text"
              placeholder="Search by name, ticker..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input !pl-9"
            />
          </div>
          <span className="text-xs text-fg-3 font-mono whitespace-nowrap shrink-0">{total} results</span>
        </div>
      )}

      {/* Content */}
      {filtered.length === 0 ? (
        <div className="py-20 text-center">
          <div className="w-12 h-12 rounded-[var(--card-r)] bg-surface grid place-items-center mx-auto mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="text-fg-3">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </div>
          <p className="font-display font-bold text-base mb-1">No entities found</p>
          <p className="text-sm text-fg-3 mb-5">Try adjusting your filters or search a different term.</p>
          <button onClick={clearAll} className="btn btn-secondary text-sm">
            Clear Filters
          </button>
        </div>
      ) : type !== "all" || sector || raising || search ? (
        /* Filtered view — flat grid */
        <div className="grid grid-cols-4 gap-4 max-md:grid-cols-1 max-lg:grid-cols-2 max-xl:grid-cols-3">
          {filtered.map((entity) => (
            <EntityCard key={entity.slug} entity={entity} />
          ))}
        </div>
      ) : (
        /* Default view — grouped by type with section headers */
        <div className="flex flex-col gap-5">
          {TYPE_ORDER.map(({ variant, label }) => {
            const items = grouped.get(variant);
            if (!items || items.length === 0) return null;

            const preview = items.slice(0, SECTION_PREVIEW);
            const hasMore = items.length > SECTION_PREVIEW;

            return (
              <div key={variant} className="mt-4">
                <div className="flex items-center justify-between py-2 border-b border-border-s mb-5 mt-6 sticky top-[var(--header-h)] z-10 bg-[var(--bg)]">
                  <button
                    onClick={() => handleTypeClick(variant)}
                    className="font-display font-extrabold text-xl tracking-tight text-fg cursor-pointer bg-transparent border-none p-0 hover:text-brand transition-colors"
                  >
                    {label}
                    <span className="text-fg-3 font-normal text-base ml-2">{items.length}</span>
                  </button>
                  {hasMore && (
                    <button
                      onClick={() => handleTypeClick(variant)}
                      className="text-sm font-semibold text-brand-l hover:text-brand cursor-pointer bg-transparent border-none transition-colors font-display"
                    >
                      View all →
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-4 gap-4 max-md:grid-cols-1 max-lg:grid-cols-2 max-xl:grid-cols-3">
                  {preview.map((entity) => (
                    <EntityCard key={entity.slug} entity={entity} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Floating variant switcher (bottom-center) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 p-1 rounded-[var(--btn-r)] border border-border bg-[var(--white)] shadow-lg">
        {LAYOUT_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setLayout(opt.value)}
            className={cn(
              "px-3 py-1.5 rounded-[var(--btn-r)] text-xs font-display font-semibold cursor-pointer transition-all duration-[200ms] border-none",
              layout === opt.value
                ? "bg-brand text-white"
                : "bg-transparent text-fg-2 hover:text-brand",
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </>
  );
}
