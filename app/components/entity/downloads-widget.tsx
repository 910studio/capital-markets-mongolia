import type { Download } from "@/app/lib/mock-data";

/* ── DownloadsWidget ────────────────── */

interface DownloadsWidgetProps {
  reports?: Download[];
  pitchDecks?: Download[];
  sustainabilityDocs?: Download[];
  investmentTeasers?: Download[];
  operationalDocs?: Download[];
  /** Service provider variant — a single generic "Documents" bucket */
  genericDocs?: Download[];
  requiresAuth?: boolean;
}

interface DownloadSectionProps {
  title: string;
  items: Download[];
  requiresAuth?: boolean;
}

function DownloadSection({ title, items, requiresAuth }: DownloadSectionProps) {
  if (!items.length) return null;
  return (
    <div>
      <span className="font-display font-bold text-[11px] uppercase tracking-[0.08em] text-fg-3 mb-2 block">
        {title}
      </span>
      <div className="flex flex-col gap-1.5">
        {items.map((item) => (
          <a
            key={item.title}
            href={item.url ?? "#"}
            className="group flex items-start gap-2.5 py-1.5 no-underline"
            title={requiresAuth ? "Register to download" : "Download"}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-brand-l shrink-0 mt-0.5"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <div className="min-w-0 flex-1">
              <span className="font-body text-xs font-medium text-fg group-hover:text-brand transition-colors block leading-[1.4]">
                {item.title}
              </span>
              <div className="font-mono text-[10px] text-fg-3 mt-0.5">
                {[item.fileSize, item.pages ? `${item.pages}p` : null, item.date]
                  .filter(Boolean)
                  .join(" · ")}
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

export function DownloadsWidget({
  reports,
  pitchDecks,
  sustainabilityDocs,
  investmentTeasers,
  operationalDocs,
  genericDocs,
  requiresAuth,
}: DownloadsWidgetProps) {
  const hasAny =
    (reports?.length ?? 0) +
      (pitchDecks?.length ?? 0) +
      (sustainabilityDocs?.length ?? 0) +
      (investmentTeasers?.length ?? 0) +
      (operationalDocs?.length ?? 0) +
      (genericDocs?.length ?? 0) >
    0;

  if (!hasAny) return null;

  return (
    <div className="widget">
      <div className="widget-header">
        <span>Downloads</span>
        {requiresAuth && (
          <span className="font-mono text-[10px] text-fg-3">Register to download</span>
        )}
      </div>
      <div className="widget-body flex flex-col gap-4">
        <DownloadSection title="Reports" items={reports ?? []} requiresAuth={requiresAuth} />
        <DownloadSection
          title="Pitch Decks"
          items={pitchDecks ?? []}
          requiresAuth={requiresAuth}
        />
        <DownloadSection
          title="Sustainability Docs"
          items={sustainabilityDocs ?? []}
          requiresAuth={requiresAuth}
        />
        <DownloadSection
          title="Investment Teasers"
          items={investmentTeasers ?? []}
          requiresAuth={requiresAuth}
        />
        <DownloadSection
          title="Operational Documents"
          items={operationalDocs ?? []}
          requiresAuth={requiresAuth}
        />
        <DownloadSection
          title="Other Documents"
          items={genericDocs ?? []}
          requiresAuth={requiresAuth}
        />
      </div>
    </div>
  );
}
