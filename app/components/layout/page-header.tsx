import { cn } from "@/app/lib/cn";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export function PageHeader({ title, subtitle, className }: PageHeaderProps) {
  return (
    <div className={cn("py-8", className)}>
      <h1 className="font-display text-2xl font-[800] tracking-tight leading-heading">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-2 text-fg-2 text-base leading-relaxed max-w-[600px]">
          {subtitle}
        </p>
      )}
    </div>
  );
}
