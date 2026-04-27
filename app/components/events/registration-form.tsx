"use client";

import { useState } from "react";
import { cn } from "@/app/lib/cn";

interface RegistrationFormProps {
  eventTitle: string;
  ticketPrice?: string;
  registrationDeadline?: string;
}

const ATTENDANCE_TYPES = [
  { value: "in-person", label: "In Person" },
  { value: "virtual", label: "Virtual" },
];

export function RegistrationForm({
  eventTitle,
  ticketPrice,
  registrationDeadline,
}: RegistrationFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [attendance, setAttendance] = useState("in-person");

  function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 700);
  }

  if (submitted) {
    return (
      <div className="card !p-6 flex flex-col gap-3">
        <div className="w-10 h-10 rounded-full bg-pos-m grid place-items-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--pos-t)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
        <div>
          <div className="font-display font-extrabold text-base mb-1">
            You&apos;re registered.
          </div>
          <p className="text-sm text-fg-2 leading-[1.5]">
            We sent a confirmation to your email with the event brief and access details. CMM concierge will reach out 48 hours before {eventTitle}.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card !p-6 flex flex-col gap-4">
      <div>
        <div className="font-display font-extrabold text-base mb-1">
          Reserve your spot
        </div>
        {ticketPrice && (
          <div className="font-mono text-[11px] uppercase tracking-badge text-fg-3">
            {ticketPrice}
            {registrationDeadline && (
              <>
                {" · Closes "}
                {new Date(registrationDeadline).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </>
            )}
          </div>
        )}
      </div>

      <Field label="Full name" name="name" required />
      <Field label="Work email" name="email" type="email" required />
      <Field label="Company / Firm" name="company" required />
      <Field label="Title" name="title" />

      <div>
        <label className="block font-display font-semibold text-xs uppercase tracking-[0.08em] text-fg-3 mb-2">
          Attendance
        </label>
        <div className="flex gap-2">
          {ATTENDANCE_TYPES.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setAttendance(opt.value)}
              className={cn(
                "flex-1 px-3 py-2 rounded-[var(--btn-r)] text-sm font-medium border cursor-pointer transition-all",
                attendance === opt.value
                  ? "border-brand bg-brand-m text-brand font-semibold"
                  : "border-border bg-[var(--white)] text-fg-2 hover:border-brand-l"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <Field
        label="Anything we should know?"
        name="notes"
        textarea
        placeholder="Dietary restrictions, accessibility, or topics you'd want to discuss 1:1."
      />

      <button
        type="submit"
        disabled={submitting}
        className="btn btn-primary w-full justify-center"
      >
        {submitting ? "Submitting…" : "Complete Registration"}
      </button>

      <p className="text-[11px] text-fg-3 leading-[1.5]">
        By registering you agree to CMM&apos;s code of conduct and event policies.
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
          rows={3}
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
