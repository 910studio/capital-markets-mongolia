import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms & Conditions — Capital Markets Mongolia",
  description:
    "Terms and conditions governing use of Capital Markets Mongolia services and content.",
};

const LAST_UPDATED = "May 2026";

const SECTIONS = [
  {
    title: "Acceptance of terms",
    body: "By accessing or using the Capital Markets Mongolia (CMM) platform, including the website, research, events, and advisory services, you agree to be bound by these Terms & Conditions. If you do not agree, do not use the service.",
  },
  {
    title: "Research content",
    body: "All research, insights, briefings, and event recordings published by CMM are for informational purposes only and do not constitute investment advice, an offer, or a solicitation to buy or sell any security or financial instrument. CMM is not a registered broker-dealer or investment adviser. You should consult a qualified professional before making any investment decision.",
  },
  {
    title: "Intellectual property",
    body: "All content on the CMM platform — including but not limited to text, graphics, logos, data visualizations, methodology, and downloadable reports — is the property of Capital Markets Mongolia or its licensors and is protected by Mongolian and international copyright laws. Redistribution, resale, or commercial use without prior written consent is prohibited.",
  },
  {
    title: "Permitted use",
    body: "Subscribers and registered users may view, download, and reference CMM materials for their own internal research and decision-making. Citation is permitted with appropriate attribution (\"Source: Capital Markets Mongolia\"). Forwarding subscriber-only content to non-subscribers is a breach of these Terms.",
  },
  {
    title: "Account responsibility",
    body: "You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account. Notify CMM immediately if you suspect unauthorized access. Sharing a single account across multiple individuals at the same institution is not permitted unless explicitly licensed.",
  },
  {
    title: "Event registrations",
    body: "Registration for CMM-hosted events (including the Mongolia Investment Forum series) is subject to the registration deadlines, capacity limits, and code of conduct stated on each event page. CMM reserves the right to decline registrations and to remove attendees in breach of the code of conduct. Refunds for ticketed events follow the policy disclosed at the point of sale.",
  },
  {
    title: "Disclaimers",
    body: "CMM provides its content on an \"as-is\" and \"as-available\" basis. While we work to keep our data accurate and up-to-date, CMM makes no representations or warranties as to the completeness, accuracy, reliability, or suitability of the information for any particular purpose. CMM is not liable for any direct, indirect, incidental, or consequential losses arising from your use of the platform.",
  },
  {
    title: "Third-party content",
    body: "Links to third-party websites, data providers, and partners are provided for convenience. CMM does not endorse and is not responsible for the content, accuracy, or practices of third-party services.",
  },
  {
    title: "Modifications",
    body: "CMM may update these Terms from time to time. Material changes will be communicated via email to active subscribers and posted on this page. Continued use of the platform after changes constitutes acceptance of the updated Terms.",
  },
  {
    title: "Governing law",
    body: "These Terms are governed by the laws of Mongolia. Any dispute arising out of or relating to these Terms will be resolved in the competent courts of Ulaanbaatar.",
  },
  {
    title: "Contact",
    body: "Questions about these Terms? Reach out at info@capitalmarkets.mn.",
  },
];

export default function TermsPage() {
  return (
    <div className="content-max px-6 py-16 max-w-[860px] mx-auto">
      <div className="pb-3">
        <Link
          href="/"
          className="text-[11px] uppercase tracking-[0.14em] font-display font-bold text-fg-3 hover:text-brand no-underline transition-colors"
        >
          ← Home
        </Link>
      </div>

      <header className="pb-10 border-b-[2px] border-fg mb-12">
        <p className="font-display font-extrabold text-[11px] tracking-[0.18em] uppercase text-brand mb-4">
          / Legal
        </p>
        <h1
          className="font-display font-extrabold uppercase tracking-tight"
          style={{
            fontSize: "clamp(2.25rem, 5.5vw, 4.5rem)",
            lineHeight: 0.95,
            letterSpacing: "-0.025em",
          }}
        >
          Terms &amp; Conditions
        </h1>
        <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.1em] text-fg-3">
          Last updated · {LAST_UPDATED}
        </p>
      </header>

      <ol className="flex flex-col gap-12">
        {SECTIONS.map((s, i) => (
          <li key={s.title}>
            <div className="flex items-baseline gap-4 mb-4">
              <span className="font-mono font-bold text-[12px] tracking-[0.1em] text-brand w-10 tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h2 className="font-display font-extrabold uppercase text-xl tracking-tight">
                {s.title}
              </h2>
            </div>
            <p className="text-base text-fg-2 leading-[1.7] pl-14 max-w-[700px]">
              {s.body}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}
