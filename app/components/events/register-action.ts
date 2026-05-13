"use server";

import { ApiError, apiPost, path } from "@/app/lib/api";

export interface RegisterActionState {
  status: "idle" | "success" | "error";
  message?: string;
}

export async function registerForEventAction(
  slug: string,
  _prev: RegisterActionState,
  formData: FormData,
): Promise<RegisterActionState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const company = String(formData.get("company") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();

  if (!name || !email) {
    return { status: "error", message: "Name and email are required." };
  }

  try {
    await apiPost(path("/api/events/{slug}/register", { slug }), {
      body: {
        name,
        email,
        company: company || undefined,
        title: title || undefined,
        notes: notes || undefined,
      },
    });
    return { status: "success" };
  } catch (err) {
    if (err instanceof ApiError) {
      const payload = err.payload as { message?: string | string[] } | null;
      const msg = Array.isArray(payload?.message)
        ? payload.message.join(", ")
        : (payload?.message ?? `Registration failed (${err.status}).`);
      return { status: "error", message: msg };
    }
    console.error("[event register] unexpected error:", err);
    return {
      status: "error",
      message: "Something went wrong. Please try again in a moment.",
    };
  }
}
