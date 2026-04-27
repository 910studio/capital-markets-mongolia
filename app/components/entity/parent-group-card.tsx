import Link from "next/link";

interface ParentGroupCardProps {
  parent: { name: string; slug?: string };
  className?: string;
}

export function ParentGroupCard({ parent, className }: ParentGroupCardProps) {
  const Inner = (
    <>
      <div className="font-mono text-[10px] uppercase tracking-badge text-fg-3 mb-1">
        Parent group
      </div>
      <div className="font-display font-bold text-sm leading-[1.3] text-fg">
        {parent.name}
      </div>
    </>
  );

  if (parent.slug) {
    return (
      <Link
        href={`/directory/${parent.slug}`}
        className={`card !p-4 block no-underline group hover:border-brand-l transition-colors ${className ?? ""}`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">{Inner}</div>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-fg-3 shrink-0 mt-1 group-hover:text-brand transition-colors"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </div>
      </Link>
    );
  }
  return (
    <div className={`card !p-4 ${className ?? ""}`}>
      <div className="min-w-0">{Inner}</div>
    </div>
  );
}
