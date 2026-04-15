interface FeedItem {
  title: string;
  source: string;
  time: string;
}

const FEED_ITEMS: FeedItem[] = [
  {
    title: "MSE Mining Index Posts Record Monthly Close on Copper Rally",
    source: "Reuters",
    time: "12m ago",
  },
  {
    title: "Khan Bank Announces \u20AE50B Bond Issuance for Infrastructure Lending",
    source: "Bloomberg",
    time: "1h ago",
  },
  {
    title: "Oyu Tolgoi Underground Phase 2 Reaches Production Milestone",
    source: "Mining.com",
    time: "3h ago",
  },
  {
    title: "Mongolia Government Approves New Mining Tax Framework",
    source: "FT",
    time: "6h ago",
  },
  {
    title: "APU Reports Q1 Revenue Decline on Consumer Spending Slowdown",
    source: "Montsame",
    time: "8h ago",
  },
];

export function MarketFeedWidget() {
  return (
    <div className="widget">
      {/* Header */}
      <div className="widget-header">
        <span>Market Feed</span>
        <span className="flex items-center gap-[5px] font-mono text-[9px] font-medium text-pos">
          <span className="live-dot" />
          Live
        </span>
      </div>

      {/* Feed items */}
      <div>
        {FEED_ITEMS.map((item) => (
          <div
            key={item.title}
            className="group cursor-pointer border-b border-border-s px-5 py-3.5 transition-colors last:border-b-0 hover:bg-brand-m"
          >
            <div className="mb-1 line-clamp-2 font-display text-[13px] font-semibold leading-[1.35] transition-colors group-hover:text-brand">
              {item.title}
            </div>
            <div className="flex items-center gap-1.5 font-mono text-[10px] text-fg-2">
              <span className="font-semibold text-fg">{item.source}</span>
              <span>&middot;</span>
              <span>{item.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
