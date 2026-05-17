import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — Capital Markets Mongolia",
  description:
    "Capital Markets Mongolia is the research and advisory platform connecting investors, companies, and regulators across Mongolia's capital markets.",
};

const VALUES = [
  {
    title: "Proven Experience",
    body: "A decade-plus track record across Mongolia's listed equities, fixed-income issuances, and cross-border placements.",
  },
  {
    title: "Professional Team",
    body: "Senior analysts, ex-bankers, and policy specialists translating local context into investable opportunities.",
  },
  {
    title: "Local Expertise",
    body: "Embedded in Ulaanbaatar — not a desk in another time zone. Ground-truth on every issuer we cover.",
  },
  {
    title: "Global Market Gateway",
    body: "We bring Mongolia's capital story to Hong Kong, Singapore, London, and the institutional rooms that allocate.",
  },
];

const TEAM = [
  {
    name: "Zolbayar E.",
    role: "CEO & Founder",
    initials: "ZE",
    bio: "Founded CMM in 2018 to build the research backbone Mongolia's capital markets needed.",
    photo: "/events/speakers/zolbayar-e.jpg",
  },
  {
    name: "Namkhaidorj B.",
    role: "Director of Advisory Services",
    initials: "NB",
    bio: "Leads transaction advisory across IPOs, secondary placements, and corporate restructurings.",
    photo: "/events/speakers/namkhaidorj-b.png",
  },
  {
    name: "Nandin-Erdene E.",
    role: "Director of Sustainable Finance & Strategic Partnership",
    initials: "NE",
    bio: "Builds CMM's green finance and ESG capability and runs the institutional partnership pipeline.",
  },
  {
    name: "Tselmeg E.",
    role: "Financial Analyst",
    initials: "TE",
    bio: "Covers banking, fintech, and consumer sectors. Author of the CMM monthly bank-rates brief.",
  },
  {
    name: "Enkhjin A.",
    role: "Financial Analyst",
    initials: "EA",
    bio: "Mining, energy, and ESG coverage. Authors the quarterly commodities review.",
  },
];

export default function AboutPage() {
  return (
    <div className="content-max px-6 py-16">
      {/* Hero */}
      <header className="pb-16 border-b-[2px] border-fg">
        <p className="font-display font-extrabold text-[11px] tracking-[0.18em] uppercase text-brand mb-4">
          / About us
        </p>
        <h1
          className="font-display font-extrabold tracking-tight max-w-[920px]"
          style={{
            fontSize: "clamp(2.5rem, 6vw, 5rem)",
            lineHeight: 0.95,
            letterSpacing: "-0.025em",
          }}
        >
          The research backbone for Mongolia&apos;s capital markets.
        </h1>
        <p className="mt-6 text-lg text-fg-2 leading-[1.55] max-w-[680px]">
          Capital Markets Mongolia is a neutral platform connecting investors, companies, intermediaries, regulators, and media. We&apos;re the conduit between Mongolian issuers and the global institutional capital they need.
        </p>
      </header>

      {/* About CMM — 4 paragraphs */}
      <section className="py-16 border-b border-border-s">
        <SectionHead label="About CMM" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 max-w-[1100px]">
          <p className="text-base text-fg-2 leading-[1.7]">
            CMM is a neutral platform serving Mongolia&apos;s capital markets ecosystem. Our job is to surface the right signals at the right time — to investors, to companies preparing to raise, to the regulators shaping the rules, and to the media translating it all into public understanding.
          </p>
          <p className="text-base text-fg-2 leading-[1.7]">
            We act as a conduit between participants who don&apos;t share the same dashboards: institutional investors looking for clean comparables, mid-cap companies preparing for their next round, intermediaries closing deals, and the policy teams writing the next iteration of market rules.
          </p>
          <p className="text-base text-fg-2 leading-[1.7]">
            Our mission goes beyond aggregating data. CMM works alongside operators to transform Mongolia&apos;s capital markets — deepening liquidity, strengthening disclosure, broadening the investor base. Every report and event is in service of that transformation.
          </p>
          <p className="text-base text-fg-2 leading-[1.7]">
            We host the Mongolia Investment Forum (MIF), our flagship event series across global financial centers. Past editions have covered equity investing, cross-border listings, impact investing, and fintech — bringing Mongolia&apos;s opportunity set face-to-face with the allocators who matter.
          </p>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 border-b border-border-s">
        <SectionHead label="Why choose us" count={VALUES.length} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border-t border-border-s">
          {VALUES.map((v, i) => (
            <div
              key={v.title}
              className="p-7 border-r border-b border-border-s last:border-r-0 lg:[&:nth-child(4n)]:border-r-0 max-lg:[&:nth-child(2n)]:border-r-0"
            >
              <div className="font-mono text-[11px] uppercase tracking-[0.1em] text-fg-3 mb-3">
                {String(i + 1).padStart(2, "0")}
              </div>
              <h3 className="font-display font-extrabold uppercase text-lg leading-[1.1] tracking-tight mb-3">
                {v.title}
              </h3>
              <p className="text-sm text-fg-2 leading-[1.6]">{v.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 border-b border-border-s">
        <SectionHead label="Mission" />
        <p
          className="font-display font-extrabold uppercase tracking-tight text-fg max-w-[920px]"
          style={{
            fontSize: "clamp(1.75rem, 4vw, 3rem)",
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
          }}
        >
          Being the driving force behind the transformation of the Mongolian financial market.
        </p>
      </section>

      {/* Vision */}
      <section className="py-16 border-b border-border-s">
        <SectionHead label="Vision" />
        <p className="text-lg text-fg-2 leading-[1.6] max-w-[760px]">
          A Mongolian financial market that thrives on integrity, transparency, and global integration — where local issuers access institutional capital on terms that reflect the underlying value of the businesses being built.
        </p>
      </section>

      {/* Values */}
      <section className="py-16 border-b border-border-s">
        <SectionHead label="Values" />
        <ol className="flex flex-col gap-3 max-w-[680px]">
          {["Being a trusted partner", "Being champions of the market", "Being independent"].map((v, i) => (
            <li key={v} className="flex items-baseline gap-4">
              <span className="font-mono font-bold text-[12px] tracking-[0.1em] text-brand w-8">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="font-display font-extrabold uppercase text-xl tracking-tight">
                {v}
              </span>
            </li>
          ))}
        </ol>
      </section>

      {/* Team */}
      <section id="team" className="py-16 border-b border-border-s scroll-mt-[80px]">
        <SectionHead label="Meet the team" count={TEAM.length} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
          {TEAM.map((m) => (
            <div key={m.name} className="flex flex-col">
              <div
                className="relative aspect-[4/5] bg-surface mb-4 overflow-hidden flex items-center justify-center font-display font-extrabold text-4xl text-brand-l"
                style={{ background: "linear-gradient(160deg, var(--brand-m), var(--surface-el))" }}
              >
                {m.initials}
              </div>
              <h3 className="font-display font-extrabold uppercase text-lg tracking-tight leading-[1.1]">
                {m.name}
              </h3>
              <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-fg-3 mt-1">
                {m.role}
              </p>
              <p className="text-sm text-fg-2 leading-[1.55] mt-3">{m.bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Consulting */}
      <section
        id="consulting"
        className="py-16 border-b border-border-s scroll-mt-[80px]"
      >
        <SectionHead label="Consulting" />
        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-12 max-w-[1100px]">
          <div>
            <h2
              className="font-display font-extrabold uppercase tracking-tight mb-5"
              style={{
                fontSize: "clamp(1.5rem, 3.5vw, 2.5rem)",
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
              }}
            >
              Advisory engagements that move the needle on actual transactions.
            </h2>
            <p className="text-base text-fg-2 leading-[1.7] mb-4">
              We work with issuers, sponsors, and intermediaries on the work that doesn&apos;t fit a standard banker pitch: deep market positioning, investor narrative refinement, cross-border listing strategy, ESG disclosure build-out, and bespoke research mandates.
            </p>
            <p className="text-base text-fg-2 leading-[1.7]">
              Selective engagements only — typically 4-6 active mandates at a time.
            </p>
          </div>
          <ul className="flex flex-col gap-3 text-sm">
            {[
              "Capital raise strategy",
              "Cross-border listing playbooks",
              "Investor relations materials",
              "ESG & sustainable finance disclosure",
              "Bespoke research mandates",
              "Market entry advisory",
            ].map((s) => (
              <li
                key={s}
                className="flex items-center gap-3 p-3 border border-border-s rounded-[var(--card-r,8px)] bg-[var(--bg-alt)]"
              >
                <span className="w-1.5 h-1.5 bg-brand rounded-full" />
                <span className="font-display font-semibold">{s}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Contact */}
      <section
        id="contact"
        className="py-16 scroll-mt-[80px]"
      >
        <SectionHead label="Contact" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-[900px]">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-fg-3 mb-2">
              Email
            </p>
            <a
              href="mailto:info@capitalmarkets.mn"
              className="font-display font-semibold text-fg hover:text-brand no-underline transition-colors"
            >
              info@capitalmarkets.mn
            </a>
          </div>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-fg-3 mb-2">
              Office
            </p>
            <p className="font-display font-semibold leading-[1.4]">
              Blue Sky Tower
              <br />
              Ulaanbaatar, Mongolia
            </p>
          </div>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-fg-3 mb-2">
              Inquiries
            </p>
            <p className="text-sm text-fg-2 leading-[1.6]">
              Advisory, research, or speaking opportunities — write to us and a senior team member will respond within 48 hours.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ── SectionHead — thick rule + small caps label ─────────────────── */
function SectionHead({ label, count }: { label: string; count?: number }) {
  return (
    <div className="border-t-[2px] border-fg pt-3 mb-10 flex items-end justify-between">
      <h2 className="font-display font-extrabold uppercase text-3xl tracking-tight leading-none">
        {label}
        {count !== undefined && (
          <span className="ml-3 text-[11px] font-mono font-medium text-fg-3 tracking-[0.05em] tabular-nums align-baseline">
            {String(count).padStart(2, "0")}
          </span>
        )}
      </h2>
    </div>
  );
}
