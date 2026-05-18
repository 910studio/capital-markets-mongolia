"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { cn } from "@/app/lib/cn";
import {
  registerForEventAction,
  type RegisterActionState,
} from "./register-action";

interface RegistrationFormProps {
  slug: string;
  eventTitle: string;
  ticketPrice?: string;
  registrationDeadline?: string;
  /** Visual treatment. "card" (default) is the standard sidebar form
   *  with white card chrome. "editorial" strips the card and uses
   *  underlined inputs that work on a dark themed page. */
  variant?: "card" | "editorial";
}

const ATTENDANCE_TYPES = [
  { value: "in-person", label: "In Person" },
  { value: "virtual", label: "Virtual" },
];

const INITIAL: RegisterActionState = { status: "idle" };

export function RegistrationForm({
  slug,
  eventTitle,
  ticketPrice,
  registrationDeadline,
  variant = "card",
}: RegistrationFormProps) {
  const action = registerForEventAction.bind(null, slug);
  const [state, formAction] = useActionState(action, INITIAL);
  const [attendance, setAttendance] = useState("in-person");
  const editorial = variant === "editorial";

  if (state.status === "success") {
    return (
      <div className={editorial ? "flex flex-col gap-3 py-4" : "card !p-6 flex flex-col gap-3"}>
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
    <form
      action={formAction}
      className={editorial ? "flex flex-col gap-6" : "card !p-6 flex flex-col gap-4"}
    >
      {!editorial && (
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
      )}

      <Field label="Full name" name="name" required variant={variant} />
      <Field label="Work email" name="email" type="email" required variant={variant} />
      <Field label="Company / Firm" name="company" required variant={variant} />
      <Field label="Title" name="title" variant={variant} />

      <div>
        <label className="block font-display font-semibold text-xs uppercase tracking-[0.08em] text-fg-3 mb-2">
          Attendance
        </label>
        <div className="flex gap-2">
          {ATTENDANCE_TYPES.map((opt) => {
            const active = attendance === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setAttendance(opt.value)}
                className={cn(
                  "flex-1 px-3 py-2 text-sm font-medium border cursor-pointer transition-all",
                  editorial
                    ? cn(
                        "rounded-none border-x-0 border-t-0 border-b font-display font-semibold text-[11px] uppercase tracking-[0.18em] py-3",
                        active
                          ? "border-fg text-fg"
                          : "border-border-s text-fg-3 hover:text-fg hover:border-fg-2",
                      )
                    : cn(
                        "rounded-[var(--btn-r)]",
                        active
                          ? "border-transparent bg-brand-m text-brand font-semibold"
                          : "border-border bg-[var(--white)] text-fg-2 hover:border-brand-l",
                      ),
                )}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      <Field
        label="Anything we should know?"
        name="notes"
        textarea
        placeholder="Dietary restrictions, accessibility, or topics you'd want to discuss 1:1."
        variant={variant}
      />

      {state.status === "error" && state.message && (
        <div className="text-sm text-neg bg-neg-m px-3 py-2 rounded-[var(--btn-r)] leading-[1.4]">
          {state.message}
        </div>
      )}

      <SubmitButton variant={variant} />

      <p className="text-[11px] text-fg-3 leading-[1.5]">
        By registering you agree to CMM&apos;s code of conduct and event policies.
      </p>
    </form>
  );
}

function SubmitButton({ variant }: { variant: "card" | "editorial" }) {
  const { pending } = useFormStatus();
  if (variant === "editorial") {
    return (
      <button
        type="submit"
        disabled={pending}
        className={cn(
          "w-full mt-2 py-4 font-display font-extrabold text-[11px] uppercase tracking-[0.24em] cursor-pointer transition-all",
          "border-none disabled:cursor-not-allowed disabled:opacity-50",
        )}
        style={{ background: "var(--fg)", color: "var(--bg)" }}
        onMouseEnter={(e) => {
          if (pending) return;
          e.currentTarget.style.background = "var(--signal, #fca311)";
          e.currentTarget.style.color = "#0a0720";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "var(--fg)";
          e.currentTarget.style.color = "var(--bg)";
        }}
      >
        {pending ? "Submitting…" : "Complete registration →"}
      </button>
    );
  }
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn btn-primary w-full justify-center"
    >
      {pending ? "Submitting…" : "Complete Registration"}
    </button>
  );
}

interface FieldProps {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  textarea?: boolean;
  placeholder?: string;
  variant?: "card" | "editorial";
}

function Field({ label, name, type = "text", required, textarea, placeholder, variant = "card" }: FieldProps) {
  const cardCls =
    "w-full px-3 py-2 bg-[var(--white)] border border-border rounded-[var(--btn-r)] text-sm text-fg placeholder:text-fg-3 focus:outline-none focus:border-brand-l transition-colors";
  const editorialCls =
    "w-full px-0 py-3 bg-transparent border-x-0 border-t-0 border-b border-border text-base text-fg placeholder:text-fg-3 focus:outline-none focus:border-fg transition-colors";
  const baseCls = variant === "editorial" ? editorialCls : cardCls;

  return (
    <label className="block">
      <span
        className={cn(
          "block font-display font-semibold uppercase mb-1.5",
          variant === "editorial"
            ? "text-[10px] tracking-[0.22em] text-fg-3"
            : "text-xs tracking-[0.08em] text-fg-3",
        )}
      >
        {label}
        {required && (
          <span
            className={cn(
              "ml-1",
              variant === "editorial" ? "text-signal" : "text-brand",
            )}
            style={variant === "editorial" ? { color: "var(--signal, #fca311)" } : undefined}
          >
            *
          </span>
        )}
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
