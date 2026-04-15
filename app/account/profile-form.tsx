"use client";

import { useState } from "react";
import { cn } from "@/app/lib/cn";

const JOB_LEVELS = [
  "Select...",
  "C-Suite / Executive",
  "VP-Level",
  "Director-Level",
  "Manager-Level",
  "Non-Manager / Individual Contributor",
  "Student / Academic",
  "Independent / Consultant",
];

interface FormData {
  firstName: string;
  lastName: string;
  company: string;
  jobLevel: string;
}

export function ProfileForm() {
  const [form, setForm] = useState<FormData>({
    firstName: "",
    lastName: "",
    company: "",
    jobLevel: "",
  });
  const [saved, setSaved] = useState(false);

  const update = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex flex-col gap-5">
      <Field label="First name">
        <input
          type="text"
          value={form.firstName}
          onChange={(e) => update("firstName", e.target.value)}
          className="input"
          placeholder="Gray"
        />
      </Field>

      <Field label="Last name">
        <input
          type="text"
          value={form.lastName}
          onChange={(e) => update("lastName", e.target.value)}
          className="input"
          placeholder="Chillin"
        />
      </Field>

      <Field label="Company name">
        <input
          type="text"
          value={form.company}
          onChange={(e) => update("company", e.target.value)}
          className="input"
          placeholder="910studio"
        />
      </Field>

      <Field label="Job Level">
        <select
          value={form.jobLevel}
          onChange={(e) => update("jobLevel", e.target.value)}
          className={cn("input appearance-none cursor-pointer", !form.jobLevel && "text-fg-3")}
        >
          {JOB_LEVELS.map((level) => (
            <option key={level} value={level === "Select..." ? "" : level}>
              {level}
            </option>
          ))}
        </select>
      </Field>

      <div className="text-center mt-4">
        {saved && (
          <span className="inline-flex items-center gap-1.5 text-sm text-pos font-medium mb-3">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 11 3 3L22 4" />
            </svg>
            Saved
          </span>
        )}
        <button
          onClick={handleSave}
          className="btn btn-primary w-full font-bold text-sm py-3"
        >
          Save My Profile
        </button>
      </div>

      <div className="mt-6 p-5 rounded-[var(--card-r)] bg-brand-m border-l-[3px] border-brand">
        <p className="font-display font-bold text-sm mb-1">
          Thanks for setting up your profile
        </p>
        <p className="text-xs text-fg-2 leading-relaxed">
          This helps us better know our audience and customize your experience.
          We respect your privacy. Read our{" "}
          <a href="#" className="text-brand-l hover:text-brand no-underline">privacy policy</a> here.
        </p>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-display font-semibold text-xs text-fg-2">
        {label}
      </label>
      {children}
    </div>
  );
}
