export function EventCard() {
  return (
    <div className="widget">
      <div className="p-6" style={{ borderLeft: "3px solid var(--signal)" }}>
        {/* Label */}
        <div className="mb-2 font-mono text-[10px] uppercase tracking-badge text-signal">
          Upcoming Event
        </div>

        {/* Title */}
        <div className="mb-2 font-display text-base font-extrabold">
          MIF 2026
        </div>

        {/* Meta */}
        <div className="mb-1 text-xs text-fg-2">
          May 15&ndash;16, 2026 &middot; Shangri-La Hotel, UB
        </div>
        <div className="mb-3 text-xs text-fg-2">
          200+ investors &middot; 40 presenting companies
        </div>

        {/* CTA */}
        <button className="btn btn-signal" type="button">
          Register
        </button>

        {/* Note */}
        <div className="mt-2 font-mono text-[10px] text-fg-2">
          42 investors registered
        </div>
      </div>
    </div>
  );
}
