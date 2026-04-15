import Link from "next/link";
import { cn } from "@/app/lib/cn";

/* ── Card ───────────────────────────────── */

interface CardProps {
  featured?: boolean;
  href?: string;
  children: React.ReactNode;
  className?: string;
}

export function Card({ featured, href, children, className }: CardProps) {
  const classes = cn(
    "card",
    featured && "border-brand-l shadow-brand",
    className
  );

  if (href) {
    return (
      <Link href={href} className={cn(classes, "block no-underline")}>
        {children}
      </Link>
    );
  }

  return <div className={classes}>{children}</div>;
}

/* ── Sub-components ─────────────────────── */

interface CardChildProps {
  children: React.ReactNode;
  className?: string;
}

export function CardImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <img
      src={src}
      alt={alt}
      className={cn("card-img", "mb-3", className)}
      loading="lazy"
    />
  );
}

export function CardBody({ children, className }: CardChildProps) {
  return <div className={cn("flex flex-col gap-2", className)}>{children}</div>;
}

export function CardTitle({ children, className }: CardChildProps) {
  return (
    <h3
      className={cn(
        "font-display text-base font-semibold leading-heading tracking-heading",
        className
      )}
    >
      {children}
    </h3>
  );
}

export function CardExcerpt({ children, className }: CardChildProps) {
  return (
    <p className={cn("text-sm text-fg-2 leading-body line-clamp-2", className)}>
      {children}
    </p>
  );
}

export function CardMeta({ children, className }: CardChildProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 text-xs text-fg-3 font-mono",
        className
      )}
    >
      {children}
    </div>
  );
}
