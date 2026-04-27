import Link from "next/link";
import { Widget, WidgetHeader, WidgetBody } from "@/app/components/ui";
import type { Subsidiary } from "@/app/lib/mock-data";
import { cn } from "@/app/lib/cn";

interface SubsidiariesWidgetProps {
  subsidiaries: Subsidiary[];
  title?: string;
  className?: string;
}

const STATUS_TONE: Record<string, string> = {
  Operating: "bg-[var(--pos-m)] text-[color:var(--pos-t)]",
  Construction: "bg-[var(--signal-m)] text-[color:var(--signal-h)]",
  Development: "bg-[var(--info-m)] text-[color:var(--info)]",
  Exploration: "bg-surface text-fg-2",
  Suspended: "bg-[var(--neg-m)] text-[color:var(--neg-t)]",
};

export function SubsidiariesWidget({
  subsidiaries,
  title = "Subsidiaries & Projects",
  className,
}: SubsidiariesWidgetProps) {
  if (subsidiaries.length === 0) return null;
  return (
    <Widget className={className}>
      <WidgetHeader title={title} />
      <WidgetBody>
        <ul className="flex flex-col m-0 p-0 list-none">
          {subsidiaries.map((s) => {
            const Inner = (
              <>
                <span className="font-display font-semibold text-sm text-fg leading-[1.35] flex-1 min-w-0 truncate group-hover:text-brand transition-colors">
                  {s.name}
                </span>
                {s.status && (
                  <span
                    className={cn(
                      "shrink-0 inline-flex items-center font-mono uppercase font-semibold tracking-badge text-[10px] px-2 py-0.5 rounded-[var(--btn-r)]",
                      STATUS_TONE[s.status] ?? "bg-surface text-fg-2"
                    )}
                  >
                    {s.status}
                  </span>
                )}
              </>
            );
            return (
              <li key={s.name} className="border-b border-border-s last:border-b-0">
                {s.slug ? (
                  <Link
                    href={`/directory/${s.slug}`}
                    className="group flex items-center gap-3 py-3 no-underline -mx-[var(--w-p)] px-[var(--w-p)] hover:bg-brand-m transition-colors"
                  >
                    {Inner}
                  </Link>
                ) : (
                  <div className="group flex items-center gap-3 py-3">{Inner}</div>
                )}
              </li>
            );
          })}
        </ul>
      </WidgetBody>
    </Widget>
  );
}
