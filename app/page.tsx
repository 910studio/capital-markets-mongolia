import { Hero } from "./components/landing/hero";
import { TopMoversWidget } from "./components/landing/top-movers-widget";
import { MarketFeedWidget } from "./components/landing/market-feed-widget";
import { SectorsWidget } from "./components/landing/sectors-widget";
import { StatsWidget } from "./components/landing/stats-widget";
import { LatestResearchWidget } from "./components/landing/latest-research-widget";
import { EventCard } from "./components/landing/event-card";
import { PaywallDemo } from "./components/landing/paywall-demo";
import { CtaBanner } from "./components/landing/cta-banner";

export default function Home() {
  return (
    <>
      {/* Hero */}
      <Hero />

      {/* Divider */}
      <div className="content-max">
        <div className="h-px bg-border" />
      </div>

      {/* Content Grid: Movers | Feed | Sectors+Stats */}
      <div className="content-max grid gap-5 py-8 lg:grid-cols-[1fr_300px_260px]">
        <TopMoversWidget />
        <MarketFeedWidget />
        <div className="flex flex-col gap-5">
          <SectorsWidget />
          <StatsWidget />
        </div>
      </div>

      {/* Research + Event row */}
      <div className="content-max grid gap-5 pb-8 pt-0 lg:grid-cols-[1fr_340px]">
        <LatestResearchWidget />
        <EventCard />
      </div>

      {/* Paywall Demo */}
      <PaywallDemo />

      {/* CTA Banner */}
      <CtaBanner />
    </>
  );
}
