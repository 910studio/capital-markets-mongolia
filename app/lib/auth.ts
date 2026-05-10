import { auth } from "@clerk/nextjs/server";

/**
 * Server-only helper. Returns the current Clerk session JWT, or null when
 * the user is signed out. Call inside a Server Component / Route Handler
 * and pass the result into apiGet({ token }) for protected BFF endpoints.
 */
export async function getBffToken(): Promise<string | null> {
  const { getToken } = await auth();
  return (await getToken()) ?? null;
}
