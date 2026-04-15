interface StatItem {
  value: string;
  label: string;
}

const STATS: StatItem[] = [
  { value: "100+", label: "Entities" },
  { value: "150+", label: "Articles" },
  { value: "Live", label: "Feed" },
  { value: "4\u00D7", label: "MIF / Year" },
];

export function StatsWidget() {
  return (
    <div className="widget">
      <div className="grid grid-cols-2 gap-2.5 p-4 px-5">
        {STATS.map((s) => (
          <div key={s.label} className="text-center">
            <div className="font-mono text-lg font-bold leading-none text-brand">
              {s.value}
            </div>
            <div className="mt-1 font-mono text-[9px] uppercase tracking-badge text-fg-2">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
