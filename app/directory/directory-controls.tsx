"use client";

import { useCallback, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { EntityCard } from "@/app/components/directory/entity-card";
import { cn } from "@/app/lib/cn";
import {
  ENTITY_TYPE_FILTERS,
  ENTITY_TYPE_LABELS,
  SECTOR_OPTIONS,
  SECTOR_SLUG_TO_LABEL,
  type EntityType,
  type MockEntity,
} from "@/app/lib/mock-data";

const TYPE_ORDER: { variant: EntityType; label: string }[] = [
  { variant: "public_company", label: "Public Companies" },
  { variant: "private_company", label: "Private Companies" },
  { variant: "project", label: "Projects" },
  { variant: "service_provider", label: "Service Providers" },
];

interface FilterState {
  q: string;
  type: string;
  sector: string | null;
  raising: boolean;
}

type SectionsMode = {
  mode: "sections";
  sections: Array<{ type: EntityType; items: MockEntity[]; total: number }>;
  filters: FilterState;
};

type FilteredMode = {
  mode: "filtered";
  items: MockEntity[];
  total: number;
  page: number;
  pageSize: number;
  filters: FilterState;
};

type Props = SectionsMode | FilteredMode;

export function DirectoryControls(props: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const { filters } = props;
  const [searchDraft, setSearchDraft] = useState(filters.q);

  const navigate = useCallback(
    (next: URLSearchParams) => {
      const qs = next.toString();
      startTransition(() => {
        router.push(qs ? `${pathname}?${qs}` : pathname);
      });
    },
    [pathname, router],
  );

  const updateFilter = useCallback(
    (patch: Partial<FilterState>) => {
      const next = new URLSearchParams(searchParams.toString());
      const merged = { ...filters, ...patch };

      if (merged.q) next.set("q", merged.q);
      else next.delete("q");
      if (merged.type !== "all") next.set("type", merged.type);
      else next.delete("type");
      if (merged.sector) next.set("sector", merged.sector);
      else next.delete("sector");
      if (merged.raising) next.set("raising", "1");
      else next.delete("raising");
      // Any filter change resets paging.
      next.delete("page");

      navigate(next);
    },
    [filters, navigate, searchParams],
  );

  const goToPage = useCallback(
    (p: number) => {
      const next = new URLSearchParams(searchParams.toString());
      if (p <= 1) next.delete("page");
      else next.set("page", String(p));
      navigate(next);
    },
    [navigate, searchParams],
  );

  const submitSearch = useCallback(() => {
    if (searchDraft.trim() === filters.q) return;
    updateFilter({ q: searchDraft.trim() });
  }, [searchDraft, filters.q, updateFilter]);

  const clearAll = useCallback(() => {
    setSearchDraft("");
    startTransition(() => router.push(pathname));
  }, [pathname, router]);

  const hasFilters =
    !!filters.q || filters.type !== "all" || !!filters.sector || filters.raising;

  const headerLabel =
    filters.type !== "all"
      ? (ENTITY_TYPE_LABELS[filters.type as EntityType] ?? "Directory")
      : filters.sector
        ? (SECTOR_SLUG_TO_LABEL[filters.sector] ?? "Directory")
        : "All Entities";

  return (
    <div className="grid grid-cols-[220px_1fr] gap-10 max-lg:grid-cols-1 max-lg:gap-6">
      {/* ── Sticky sidebar ─────────────────────────────── */}
      <aside
        className={cn(
          "sticky self-start py-8 pr-2",
          "top-[var(--header-h)]",
          "max-h-[calc(100vh-var(--header-h))] overflow-y-auto scrollbar-none",
          "max-lg:static max-lg:max-h-none max-lg:py-4 max-lg:pr-0 max-lg:overflow-visible",
        )}
        aria-label="Filters"
      >
        {/* Search */}
        <div className="relative mb-7">
          <SearchIcon />
          <input
            type="text"
            placeholder="Search name, ticker..."
            value={searchDraft}
            onChange={(e) => setSearchDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                submitSearch();
              }
            }}
            onBlur={submitSearch}
            className="input !pl-9 !h-9 !text-[13px]"
          />
        </div>

        {/* Type */}
        <SidebarSectionLabel>Type</SidebarSectionLabel>
        <ul className="flex flex-col mb-7 -mx-2">
          {ENTITY_TYPE_FILTERS.map((f) => (
            <li key={f.value}>
              <button
                onClick={() => updateFilter({ type: f.value })}
                className={cn(
                  "group w-full text-left px-2 py-1.5 text-[13px] font-display font-semibold cursor-pointer transition-colors duration-[180ms] border-none bg-transparent",
                  "flex items-center gap-2",
                  f.value === filters.type
                    ? "text-fg"
                    : "text-fg-3 hover:text-fg",
                )}
              >
                <span
                  className={cn(
                    "inline-block h-px transition-all duration-[280ms] ease-[cubic-bezier(0.7,0,0.2,1)]",
                    f.value === filters.type
                      ? "w-4 bg-fg"
                      : "w-1.5 bg-fg-3 group-hover:w-3 group-hover:bg-fg",
                  )}
                />
                <span>{f.label}</span>
              </button>
            </li>
          ))}
        </ul>

        {/* Sectors */}
        <SidebarSectionLabel>Sectors</SidebarSectionLabel>
        <ul className="flex flex-col mb-7 -mx-2">
          {SECTOR_OPTIONS.map((s) => {
            const active = filters.sector === s.slug;
            return (
              <li key={s.slug}>
                <button
                  onClick={() =>
                    updateFilter({ sector: active ? null : s.slug })
                  }
                  className={cn(
                    "w-full text-left px-2 py-1.5 text-[13px] cursor-pointer transition-colors duration-[180ms] border-none bg-transparent",
                    active
                      ? "text-fg font-display font-semibold"
                      : "text-fg-3 hover:text-fg",
                  )}
                >
                  {s.label}
                </button>
              </li>
            );
          })}
        </ul>

        {/* Status — Raising toggle */}
        <SidebarSectionLabel>Status</SidebarSectionLabel>
        <button
          onClick={() => updateFilter({ raising: !filters.raising })}
          role="switch"
          aria-checked={filters.raising}
          className={cn(
            "flex items-center gap-2 px-2 py-1.5 -mx-2 text-[13px] font-display font-semibold cursor-pointer transition-colors border-none bg-transparent w-full text-left",
            filters.raising ? "text-fg" : "text-fg-3 hover:text-fg",
          )}
        >
          <span
            className={cn(
              "relative inline-block w-7 h-[16px] rounded-full transition-colors duration-200 shrink-0",
              filters.raising ? "bg-brand" : "bg-border",
            )}
          >
            <span
              className={cn(
                "absolute top-[2px] left-[2px] w-[12px] h-[12px] rounded-full bg-[var(--white)] shadow-sm transition-transform duration-200",
                filters.raising ? "translate-x-[12px]" : "translate-x-0",
              )}
            />
          </span>
          Actively Raising
        </button>

        {hasFilters && (
          <button
            onClick={clearAll}
            className="mt-6 text-[11px] uppercase tracking-[0.12em] font-display font-bold text-fg-3 hover:text-brand cursor-pointer bg-transparent border-none px-2"
          >
            Clear all
          </button>
        )}
      </aside>

      {/* ── Content column ─────────────────────────────── */}
      <div className="min-w-0">
        {/* Page header */}
        <header className="pt-8 pb-6 border-b border-fg flex items-end justify-between gap-6">
          <div>
            <p className="font-display font-bold text-[11px] tracking-[0.18em] uppercase text-fg-3 mb-2">
              Directory
            </p>
            <h1 className="font-display font-extrabold text-3xl tracking-tight leading-none">
              {headerLabel}
            </h1>
          </div>

          <div className="flex items-center gap-4 pb-1">
            <span className="text-[11px] text-fg-3 font-mono whitespace-nowrap">
              {props.mode === "filtered"
                ? `${props.total} results`
                : `${props.sections.reduce((sum, s) => sum + s.total, 0)} entities`}
            </span>
          </div>
        </header>

        {/* Active filter chips */}
        {hasFilters && (
          <div className="flex flex-wrap items-center gap-2 mt-4">
            <span className="text-[10px] uppercase tracking-[0.12em] font-display font-bold text-fg-3">
              Filtering by
            </span>
            {filters.q && (
              <Chip
                label={`"${filters.q}"`}
                onClear={() => {
                  setSearchDraft("");
                  updateFilter({ q: "" });
                }}
              />
            )}
            {filters.type !== "all" && (
              <Chip
                label={
                  ENTITY_TYPE_LABELS[filters.type as EntityType] ?? filters.type
                }
                onClear={() => updateFilter({ type: "all" })}
              />
            )}
            {filters.sector && (
              <Chip
                label={SECTOR_SLUG_TO_LABEL[filters.sector] ?? filters.sector}
                onClear={() => updateFilter({ sector: null })}
              />
            )}
            {filters.raising && (
              <Chip
                label="Actively Raising"
                onClear={() => updateFilter({ raising: false })}
              />
            )}
          </div>
        )}

        {/* Results */}
        <div className="mt-7">
          {props.mode === "sections" ? (
            <SectionsView
              sections={props.sections}
              onSeeAll={(t) => updateFilter({ type: t })}
            />
          ) : (
            <FilteredView
              items={props.items}
              total={props.total}
              page={props.page}
              pageSize={props.pageSize}
              onClear={clearAll}
              onPage={goToPage}
            />
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Sub-components ──────────────────────────────────── */

function SectionsView({
  sections,
  onSeeAll,
}: {
  sections: Array<{ type: EntityType; items: MockEntity[]; total: number }>;
  onSeeAll: (type: EntityType) => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      {TYPE_ORDER.map(({ variant, label }) => {
        const section = sections.find((s) => s.type === variant);
        if (!section || section.total === 0) return null;
        const hasMore = section.total > section.items.length;

        return (
          <div key={variant} className="mt-4">
            <div className="flex items-center justify-between py-2 border-b border-border-s mb-5 mt-6 sticky top-[var(--header-h)] z-10 bg-[var(--bg)]">
              <button
                onClick={() => onSeeAll(variant)}
                className="font-display font-extrabold text-xl tracking-tight text-fg cursor-pointer bg-transparent border-none p-0 hover:text-brand transition-colors"
              >
                {label}
                <span className="text-fg-3 font-normal text-base ml-2">
                  {section.total}
                </span>
              </button>
              {hasMore && (
                <button
                  onClick={() => onSeeAll(variant)}
                  className="text-sm font-semibold text-brand-l hover:text-brand cursor-pointer bg-transparent border-none transition-colors font-display"
                >
                  View all →
                </button>
              )}
            </div>

            <div className="grid grid-cols-4 gap-4 max-md:grid-cols-1 max-lg:grid-cols-2 max-xl:grid-cols-3">
              {section.items.map((entity) => (
                <EntityCard key={entity.slug} entity={entity} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function FilteredView({
  items,
  total,
  page,
  pageSize,
  onClear,
  onPage,
}: {
  items: MockEntity[];
  total: number;
  page: number;
  pageSize: number;
  onClear: () => void;
  onPage: (p: number) => void;
}) {
  if (items.length === 0) {
    return (
      <div className="py-20 text-center">
        <div className="w-12 h-12 rounded-[var(--card-r)] bg-surface grid place-items-center mx-auto mb-4">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-fg-3"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </div>
        <p className="font-display font-bold text-base mb-1">
          No entities found
        </p>
        <p className="text-sm text-fg-3 mb-5">
          Try adjusting your filters or search a different term.
        </p>
        <button onClick={onClear} className="btn btn-secondary text-sm">
          Clear Filters
        </button>
      </div>
    );
  }

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <>
      <div className="grid grid-cols-4 gap-4 max-md:grid-cols-1 max-lg:grid-cols-2 max-xl:grid-cols-3">
        {items.map((entity) => (
          <EntityCard key={entity.slug} entity={entity} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-10 py-4 border-t border-border-s">
          <span className="text-xs text-fg-3 font-mono">
            Page {page} of {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPage(page - 1)}
              disabled={page <= 1}
              className="px-3 py-1.5 rounded-[var(--btn-r)] border border-border bg-[var(--white)] text-sm font-display font-semibold text-fg-2 hover:border-brand-l disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              ← Prev
            </button>
            <button
              onClick={() => onPage(page + 1)}
              disabled={page >= totalPages}
              className="px-3 py-1.5 rounded-[var(--btn-r)] border border-border bg-[var(--white)] text-sm font-display font-semibold text-fg-2 hover:border-brand-l disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function Chip({ label, onClear }: { label: string; onClear: () => void }) {
  return (
    <span className="flex items-center gap-1.5 text-xs font-medium text-brand bg-brand-m px-2.5 py-1 rounded-[var(--btn-r)]">
      {label}
      <button
        onClick={onClear}
        className="text-brand hover:text-brand-h cursor-pointer bg-transparent border-none p-0 text-xs font-bold"
        aria-label={`Remove ${label} filter`}
      >
        ×
      </button>
    </span>
  );
}

function SidebarSectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-display font-bold text-[10px] tracking-[0.18em] uppercase text-fg-3 mb-2 pb-2 border-b border-border-s">
      {children}
    </p>
  );
}

function SearchIcon() {
  return (
    <svg
      className="absolute left-3 top-1/2 -translate-y-1/2 text-fg-3 pointer-events-none"
      width="14"
      height="14"
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
