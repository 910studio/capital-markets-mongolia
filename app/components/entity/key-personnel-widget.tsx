import { Widget, WidgetHeader, WidgetBody } from "@/app/components/ui";

/* ── Types ─────────────────────────────── */

interface Person {
  initials: string;
  name: string;
  title: string;
  bio?: string;
}

interface KeyPersonnelWidgetProps {
  people: Person[];
  className?: string;
}

/* ── Component ─────────────────────────── */

export function KeyPersonnelWidget({
  people,
  className,
}: KeyPersonnelWidgetProps) {
  return (
    <Widget className={className}>
      <WidgetHeader title="Key Personnel" />
      <WidgetBody>
        <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
          {people.map((person) => (
            <div
              key={person.name}
              className="flex flex-col items-center text-center gap-2 p-4 px-2 rounded-xs transition-colors duration-150 hover:bg-brand-m"
            >
              {/* Avatar */}
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center font-display font-bold text-xs text-brand-l"
                style={{
                  background:
                    "linear-gradient(135deg, var(--brand-m), var(--surface-el))",
                }}
              >
                {person.initials}
              </div>
              <div className="font-display font-semibold text-sm text-fg">
                {person.name}
              </div>
              <div className="text-[11px] text-fg-3 leading-snug">
                {person.title}
              </div>
              {person.bio && (
                <div className="text-xs text-fg-2 leading-relaxed mt-1">
                  {person.bio}
                </div>
              )}
            </div>
          ))}
        </div>
      </WidgetBody>
    </Widget>
  );
}
