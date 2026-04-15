import { cn } from "@/app/lib/cn";

/* ── Types ─────────────────────────────── */

interface ArticleBodyProps {
  children: React.ReactNode;
  className?: string;
}

/* ── ArticleBody ───────────────────────── */

export function ArticleBody({ children, className }: ArticleBodyProps) {
  return (
    <div className={cn("max-w-[var(--body-narrow)]", className)}>
      {children}
    </div>
  );
}

/* ── Heading ───────────────────────────── */

interface SectionHeadingProps {
  id?: string;
  children: React.ReactNode;
}

export function SectionHeading({ id, children }: SectionHeadingProps) {
  return (
    <h2
      id={id}
      className="font-display font-extrabold text-[1.125rem] tracking-[-0.02em] mt-7 mb-3 first:mt-0"
    >
      {children}
    </h2>
  );
}

/* ── Paragraph ─────────────────────────── */

interface ParagraphProps {
  children: React.ReactNode;
}

export function Paragraph({ children }: ParagraphProps) {
  return (
    <p className="text-sm leading-[1.65] text-fg-2 mb-3.5">
      {children}
    </p>
  );
}

/* ── Pullquote ─────────────────────────── */

interface PullquoteProps {
  quote: string;
  cite?: string;
}

export function Pullquote({ quote, cite }: PullquoteProps) {
  return (
    <blockquote className="border-l-[3px] border-brand pl-4 py-3 my-5">
      <p className="font-display font-semibold text-base leading-[1.55] tracking-[-0.01em] mb-2">
        &ldquo;{quote}&rdquo;
      </p>
      {cite && (
        <cite className="font-body not-italic text-sm text-fg-3">
          {cite}
        </cite>
      )}
    </blockquote>
  );
}

/* ── KeyMetric box ─────────────────────── */

interface KeyMetricBoxProps {
  title: string;
  children: React.ReactNode;
}

export function KeyMetricBox({ title, children }: KeyMetricBoxProps) {
  return (
    <div className="mt-6 p-5 rounded-[var(--card-r)] bg-brand-m border-l-[3px] border-brand">
      <div className="font-display font-bold text-sm mb-1">{title}</div>
      <div className="text-xs text-fg-2 leading-relaxed italic">{children}</div>
    </div>
  );
}
