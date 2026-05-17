import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — Capital Markets Mongolia",
  description:
    "How Capital Markets Mongolia collects, uses, and protects user data across our platform and services.",
};

const LAST_UPDATED = "May 2026";

const SECTIONS = [
  {
    title: "Information we collect",
    body: "We collect information you provide directly — email when you subscribe, name and organization when you register for events, and any details you share during advisory engagements. We also automatically collect technical data: IP address, browser type, pages visited, time on site, and referral source. Cookies and similar technologies are used to maintain your session and remember your preferences.",
  },
  {
    title: "How we use information",
    body: "We use your information to: (1) deliver the research, briefings, and event services you've requested, (2) personalize the content you see on the platform, (3) communicate updates, event invitations, and subscription-related messages, (4) improve our platform via aggregated analytics, and (5) meet legal and regulatory obligations. We do not sell your personal information to third parties.",
  },
  {
    title: "Legal basis for processing",
    body: "Processing of your personal data is based on: your consent (where you opt-in to subscriptions and marketing), performance of a contract (delivery of subscriber services and advisory engagements), legitimate interest (platform analytics, fraud prevention), and legal obligation (anti-money-laundering, tax records where applicable).",
  },
  {
    title: "Sharing & disclosure",
    body: "We share data only with service providers that help us operate the platform — hosting, email delivery, analytics, payment processing — and only under contracts that require them to safeguard your data and not use it for their own purposes. We may disclose data when required by law, court order, or to protect the rights, property, or safety of CMM, our users, or others.",
  },
  {
    title: "Event registration data",
    body: "When you register for a CMM event (such as the Mongolia Investment Forum series), we collect your professional details (name, title, organization, email) to confirm attendance and produce attendee lists shared with co-sponsors and venue partners. Attendee lists are not made public.",
  },
  {
    title: "Cookies",
    body: "We use essential cookies (for authentication and session management) and analytical cookies (anonymized, aggregated usage data). You can disable non-essential cookies in your browser settings; some platform features may not function without them.",
  },
  {
    title: "Data retention",
    body: "We retain personal data only as long as needed for the purposes outlined above, or as required by law. Subscriber records are retained for the duration of the subscription plus seven years to meet recordkeeping obligations. Event attendance records are retained for five years.",
  },
  {
    title: "Your rights",
    body: "You have the right to access, correct, or delete your personal data, to object to processing, and to receive a copy of your data in a portable format. To exercise any of these rights, email info@capitalmarkets.mn from the address associated with your account. We will respond within 30 days.",
  },
  {
    title: "Security",
    body: "We implement industry-standard technical and organizational measures to protect your data, including encryption in transit (TLS) and at rest, access controls, and regular security audits. No system is perfectly secure — please report any suspected vulnerability or breach to security@capitalmarkets.mn.",
  },
  {
    title: "Children",
    body: "The CMM platform is intended for professional and institutional users and is not directed at individuals under 18. We do not knowingly collect personal data from children.",
  },
  {
    title: "International transfers",
    body: "Your data may be processed in Mongolia and in other jurisdictions where our hosting and service providers operate. When data leaves Mongolia, we ensure adequate safeguards are in place consistent with applicable data protection laws.",
  },
  {
    title: "Updates to this policy",
    body: "We may update this Privacy Policy periodically. Material changes will be notified to active subscribers via email and posted on this page. The \"last updated\" date above reflects the most recent revision.",
  },
  {
    title: "Contact",
    body: "Privacy questions, requests, or complaints? Email info@capitalmarkets.mn. We will route the message to our data protection contact.",
  },
];

export default function PrivacyPage() {
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
          Privacy Policy
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
