"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/app/lib/cn";

const REQUEST_TYPES = [
  { value: "investor-intro", label: "Investor introduction" },
  { value: "company-intro", label: "Company / management intro" },
  { value: "deal-flow", label: "Deal flow access" },
  { value: "research-request", label: "Custom research" },
  { value: "general", label: "Something else" },
] as const;

const URGENCY = [
  { value: "this-week", label: "This week" },
  { value: "this-month", label: "Within a month" },
  { value: "exploratory", label: "Exploratory" },
] as const;

const SECTORS = [
  "Mining & Resources",
  "Banking & Finance",
  "Energy",
  "Technology",
  "Real Estate & Infrastructure",
  "Capital Markets",
  "Agriculture",
  "Professional Services",
];

export function ConciergeForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [requestType, setRequestType] = useState<string>("investor-intro");
  const [urgency, setUrgency] = useState<string>("this-month");
  const [sectorTags, setSectorTags] = useState<string[]>([]);

  function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 800);
  }

  function toggleSector(s: string) {
    setSectorTags((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  }

  if (submitted) {
    return (
      <div className="card !p-8 max-w-[520px] mx-auto text-center flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-pos-m grid place-items-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--pos-t)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
        <div>
          <div className="font-display font-extrabold text-md mb-2">
            Request received.
          </div>
          <p className="text-sm text-fg-2 leading-[1.6] max-w-[400px]">
            A CMM analyst will review your request and reach out within 1 business day. We&apos;ll match you with the right contact and confirm next steps over email.
          </p>
        </div>
        <div className="flex gap-2 mt-2">
          <Link href="/insights" className="btn btn-secondary text-sm">
            Browse Insights
          </Link>
          <Link href="/account" className="btn btn-primary text-sm">
            View My Requests
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="card !p-6 sm:!p-8 max-w-[640px] mx-auto flex flex-col gap-6"
    >
      <div>
        <div className="font-display font-extrabold text-md mb-1">
          Tell us what you need
        </div>
        <p className="text-sm text-fg-2 leading-[1.5]">
          Describe your ask and CMM&apos;s analyst team will route it to the right person within 1 business day.
        </p>
      </div>

      {/* Request type */}
      <fieldset>
        <legend className="block font-display font-semibold text-xs uppercase tracking-[0.08em] text-fg-3 mb-2">
          What are you looking for?
        </legend>
        <div className="flex flex-wrap gap-2">
          {REQUEST_TYPES.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setRequestType(opt.value)}
              className={cn(
                "px-3 py-1.5 rounded-[var(--btn-r)] text-sm font-medium border cursor-pointer transition-all",
                requestType === opt.value
                  ? "border-transparent bg-brand-m text-brand font-semibold"
                  : "border-border bg-[var(--white)] text-fg-2 hover:border-brand-l"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </fieldset>

      <Field
        label="Brief summary"
        name="summary"
        textarea
        required
        placeholder="Eg. We're a Singapore-based credit fund looking to engage with mid-cap Mongolian banks on potential subordinated debt opportunities."
      />

      {/* Sectors */}
      <fieldset>
        <legend className="block font-display font-semibold text-xs uppercase tracking-[0.08em] text-fg-3 mb-2">
          Sectors of interest
        </legend>
        <div className="flex flex-wrap gap-1.5">
          {SECTORS.map((s) => {
            const active = sectorTags.includes(s);
            return (
              <button
                key={s}
                type="button"
                onClick={() => toggleSector(s)}
                className={cn(
                  "px-2.5 py-1 rounded-[var(--btn-r)] text-xs font-medium border cursor-pointer transition-all",
                  active
                    ? "border-transparent bg-brand text-white"
                    : "border-border bg-[var(--white)] text-fg-2 hover:border-brand-l"
                )}
              >
                {s}
              </button>
            );
          })}
        </div>
      </fieldset>

      <Field
        label="Specific entity, person, or deal (optional)"
        name="targetEntity"
        placeholder="Eg. Khan Bank, Tsakhia Solar Park, Erdenes Tavan Tolgoi IPO"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Your name" name="name" required />
        <Field label="Work email" name="email" type="email" required />
        <Field label="Company / Firm" name="company" required />
        <Field label="Role" name="role" />
      </div>

      {/* Urgency */}
      <fieldset>
        <legend className="block font-display font-semibold text-xs uppercase tracking-[0.08em] text-fg-3 mb-2">
          Timing
        </legend>
        <div className="flex gap-2">
          {URGENCY.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setUrgency(opt.value)}
              className={cn(
                "flex-1 px-3 py-2 rounded-[var(--btn-r)] text-sm font-medium border cursor-pointer transition-all",
                urgency === opt.value
                  ? "border-transparent bg-brand-m text-brand font-semibold"
                  : "border-border bg-[var(--white)] text-fg-2 hover:border-brand-l"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </fieldset>

      <button
        type="submit"
        disabled={submitting}
        className="btn btn-primary w-full justify-center"
      >
        {submitting ? "Sending…" : "Send request"}
      </button>

      <p className="text-[11px] text-fg-3 leading-[1.5] text-center">
        CMM treats all concierge requests as confidential. By submitting you agree to our service terms.
      </p>
    </form>
  );
}

interface FieldProps {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  textarea?: boolean;
  placeholder?: string;
}

function Field({ label, name, type = "text", required, textarea, placeholder }: FieldProps) {
  const baseCls =
    "w-full px-3 py-2 bg-[var(--white)] border border-border rounded-[var(--btn-r)] text-sm text-fg placeholder:text-fg-3 focus:outline-none focus:border-brand-l transition-colors";

  return (
    <label className="block">
      <span className="block font-display font-semibold text-xs uppercase tracking-[0.08em] text-fg-3 mb-1.5">
        {label}
        {required && <span className="text-brand ml-0.5">*</span>}
      </span>
      {textarea ? (
        <textarea
          name={name}
          required={required}
          placeholder={placeholder}
          rows={4}
          className={cn(baseCls, "resize-none leading-[1.5]")}
        />
      ) : (
        <input
          type={type}
          name={name}
          required={required}
          placeholder={placeholder}
          className={baseCls}
        />
      )}
    </label>
  );
}
