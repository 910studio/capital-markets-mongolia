"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { EntityCard } from "@/app/components/directory/entity-card";
import { Pagination } from "@/app/components/ui/pagination";
import { cn } from "@/app/lib/cn";
import type { MockEntity } from "@/app/lib/mock-data";
import { ENTITY_TYPE_FILTERS, SECTOR_LIST } from "@/app/lib/mock-data";

const PER_PAGE = 20;

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

/* ── URL param helpers ───────────────────── */

function readParams() {
  if (typeof window === "undefined") return {};
  const p = new URLSearchParams(window.location.search);
  return {
    q: p.get("q") ?? "",
    type: p.get("type") ?? "all",
    sector: p.get("sector") ?? null,
    raising: p.get("raising") === "1",
    page: Number(p.get("page")) || 1,
  };
}

function writeParams(state: {
  q: string;
  type: string;
  sector: string | null;
  raising: boolean;
  page: number;
}) {
  const p = new URLSearchParams();
  if (state.q) p.set("q", state.q);
  if (state.type !== "all") p.set("type", state.type);
  if (state.sector) p.set("sector", state.sector);
  if (state.raising) p.set("raising", "1");
  if (state.page > 1) p.set("page", String(state.page));
  const str = p.toString();
  window.history.replaceState(null, "", str ? `?${str}` : window.location.pathname);
}

/* ── DirectoryControls ───────────────────── */

interface DirectoryControlsProps {
  entities: MockEntity[];
}

export function DirectoryControls({ entities }: DirectoryControlsProps) {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [sector, setSector] = useState<string | null>(null);
  const [raising, setRaising] = useState(false);
  const [page, setPage] = useState(1);
  const [mounted, setMounted] = useState(false);

  /* Hydrate from URL on mount */
  useEffect(() => {
    const init = readParams();
    setSearch(init.q ?? "");
    setType(init.type ?? "all");
    setSector(init.sector ?? null);
    setRaising(init.raising ?? false);
    setPage(init.page ?? 1);
    setMounted(true);
  }, []);

  /* Sync state → URL */
  useEffect(() => {
    if (!mounted) return;
    writeParams({ q: search, type, sector, raising, page });
  }, [search, type, sector, raising, page, mounted]);

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

  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const total = filtered.length;
  const hasFilters = search || type !== "all" || sector || raising;

  const clearAll = useCallback(() => {
    setSearch("");
    setType("all");
    setSector(null);
    setRaising(false);
    setPage(1);
  }, []);

  return (
    <>
      {/* Search */}
      <div className="relative mb-5">
        <SearchIcon />
        <input
          type="text"
          placeholder="Search by name, ticker, or description..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="input pl-9"
        />
      </div>

      {/* Type filter tabs */}
      <div className="flex items-center gap-1 flex-wrap mb-4">
        {ENTITY_TYPE_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => {
              setType(f.value);
              setPage(1);
            }}
            className={cn("tab", f.value === type && "tab-active")}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Sector pills + Raising toggle */}
      <div className="flex items-center justify-between gap-4 mb-7 flex-wrap">
        <div className="flex gap-1.5 flex-wrap">
          {SECTOR_LIST.map((s) => (
            <button
              key={s}
              onClick={() => {
                setSector(sector === s ? null : s);
                setPage(1);
              }}
              className={cn(
                "font-body font-medium text-xs py-1 px-3",
                "rounded-[var(--btn-r)] cursor-pointer",
                "transition-all duration-[200ms]",
                sector === s
                  ? "bg-brand-m text-brand"
                  : "bg-surface text-fg-2 hover:bg-brand-m hover:text-brand"
              )}
            >
              {s}
            </button>
          ))}
        </div>

        <button
          onClick={() => {
            setRaising(!raising);
            setPage(1);
          }}
          className={cn(
            "flex items-center gap-2 font-body font-medium text-xs py-1.5 px-3",
            "rounded-[var(--btn-r)] cursor-pointer shrink-0",
            "transition-all duration-[200ms]",
            raising
              ? "bg-signal-m text-signal-h border border-signal"
              : "bg-surface text-fg-2 hover:bg-signal-m hover:text-signal-h border border-transparent"
          )}
        >
          <span
            className={cn(
              "w-2 h-2 rounded-full transition-colors",
              raising ? "bg-signal" : "bg-fg-3"
            )}
          />
          Actively Raising
        </button>
      </div>

      {/* Results bar */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-fg-3">
          {total} {total === 1 ? "entity" : "entities"}
        </span>
        {hasFilters && (
          <button onClick={clearAll} className="btn btn-ghost text-xs">
            Clear Filters
          </button>
        )}
      </div>

      {/* Grid */}
      {paged.length > 0 ? (
        <div className="grid-dense">
          {paged.map((entity) => (
            <EntityCard key={entity.slug} entity={entity} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p className="font-display font-semibold text-fg-2 mb-1">
            No entities found
          </p>
          <p>Try adjusting your filters or search terms.</p>
          <button onClick={clearAll} className="btn btn-secondary mt-4">
            Clear Filters
          </button>
        </div>
      )}

      {/* Pagination */}
      {total > PER_PAGE && (
        <div className="flex items-center justify-between mt-10 pt-6 border-t border-border-s">
          <span className="text-sm text-fg-3">
            Showing {paged.length} of {total} results
          </span>
          <Pagination
            total={total}
            current={page}
            perPage={PER_PAGE}
            onChange={setPage}
          />
        </div>
      )}
    </>
  );
}
