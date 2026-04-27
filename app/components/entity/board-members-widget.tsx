import { Widget, WidgetHeader, WidgetBody } from "@/app/components/ui";
import type { Person } from "@/app/lib/mock-data";

interface BoardMembersWidgetProps {
  members: Person[];
  className?: string;
}

function classifyRole(title: string): "chair" | "independent" | "director" | "other" {
  const t = title.toLowerCase();
  if (t.includes("chair")) return "chair";
  if (t.includes("independent")) return "independent";
  if (t.includes("director")) return "director";
  return "other";
}

const GROUP_LABELS: Record<"chair" | "independent" | "director" | "other", string> = {
  chair: "Board Chair",
  independent: "Independent Directors",
  director: "Directors",
  other: "Other Members",
};

export function BoardMembersWidget({ members, className }: BoardMembersWidgetProps) {
  if (members.length === 0) return null;

  const groups: Record<string, Person[]> = { chair: [], independent: [], director: [], other: [] };
  members.forEach((m) => groups[classifyRole(m.title)].push(m));

  return (
    <Widget className={className}>
      <WidgetHeader title="Board of Directors" />
      <WidgetBody>
        <div className="flex flex-col gap-5">
          {(["chair", "independent", "director", "other"] as const).map((g) => {
            if (groups[g].length === 0) return null;
            return (
              <div key={g}>
                <div className="font-mono text-[10px] uppercase tracking-badge text-fg-3 mb-2">
                  {GROUP_LABELS[g]}
                </div>
                <div className="grid grid-cols-2 max-md:grid-cols-1 gap-2">
                  {groups[g].map((m) => (
                    <div
                      key={m.name}
                      className="flex items-center gap-3 p-2 rounded-[var(--btn-r)] hover:bg-brand-m transition-colors"
                    >
                      <div
                        className="shrink-0 w-9 h-9 rounded-full grid place-items-center font-display font-bold text-[11px] text-brand-l"
                        style={{
                          background:
                            "linear-gradient(135deg, var(--brand-m), var(--surface-el))",
                        }}
                      >
                        {m.initials ??
                          m.name
                            .split(/\s+/)
                            .map((w) => w[0])
                            .slice(0, 2)
                            .join("")
                            .toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="font-display font-semibold text-sm text-fg leading-[1.25] truncate">
                          {m.name}
                        </div>
                        <div className="text-[11px] text-fg-3 leading-[1.35] truncate">
                          {m.title}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </WidgetBody>
    </Widget>
  );
}
