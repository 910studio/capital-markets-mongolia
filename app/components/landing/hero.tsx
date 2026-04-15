"use client";

import Link from "next/link";
import { HeroChart } from "./hero-chart";

export function Hero() {
  return (
    <section className="content-max grid items-center gap-12 pb-10 pt-12 lg:grid-cols-[1fr_420px] lg:gap-12">
      {/* Left: Copy */}
      <div>
        <h1 className="hero-title mb-3">
          The Mongolian market
          <br />
          doesn&apos;t have a{" "}
          <span className="text-brand">Bloomberg.</span>
          <br />
          Yet.
        </h1>

        <p className="hero-sub mb-7 font-mono text-xs leading-relaxed tracking-normal text-fg-2">
          100 entity profiles &middot; 150 research articles &middot; Live
          market feed &middot; Institutional-grade data
        </p>

        <div className="flex gap-2.5">
          <Link href="/directory" className="btn btn-primary">
            Browse Directory
          </Link>
          <Link href="/insights" className="btn btn-secondary no-underline">
            Start Research
          </Link>
        </div>
      </div>

      {/* Right: Chart card */}
      <div className="max-w-[480px] lg:max-w-none">
        <HeroChart />
      </div>
    </section>
  );
}
