"use server";

/**
 * Newsletter subscribe — server action.
 * In mock mode this is a no-op that "accepts" the signup. In live mode
 * it'd POST to the BFF, but no endpoint exists yet — log + accept gracefully.
 */
export async function subscribeNewsletterAction({
  email,
}: {
  email: string;
}): Promise<{ ok: boolean; message: string }> {
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return { ok: false, message: "Enter a valid email." };
  }

  // TODO: wire to BFF /api/newsletter/subscribe when the endpoint lands.
  console.log("[newsletter] signup:", email);

  return { ok: true, message: "You're subscribed — check your inbox." };
}
