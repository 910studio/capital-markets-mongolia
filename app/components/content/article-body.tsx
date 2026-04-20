import { cn } from "@/app/lib/cn";

/* ── ArticleBody ───────────────────────── */

interface ArticleBodyProps {
  children: React.ReactNode;
  className?: string;
}

export function ArticleBody({ children, className }: ArticleBodyProps) {
  return (
    <div className={cn("max-w-[var(--body-narrow)] max-lg:max-w-none", className)}>
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
      className="font-display font-extrabold text-xl tracking-[-0.02em] mt-10 mb-4 pt-6 border-t border-border-s first:mt-0 first:pt-0 first:border-t-0"
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
    <p className="text-base leading-[1.8] text-fg-2 mb-5">
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
    <blockquote className="border border-dashed border-brand px-5 py-4 my-8 bg-brand-m">
      <p className="font-display font-bold text-[1.0625rem] leading-[1.55] tracking-[-0.01em] text-fg mb-2">
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
    <div className="mt-8 p-5 rounded-[var(--card-r)] bg-brand-m border-l-[3px] border-brand">
      <div className="font-display font-bold text-sm mb-1">{title}</div>
      <div className="text-xs text-fg-2 leading-relaxed italic">{children}</div>
    </div>
  );
}
