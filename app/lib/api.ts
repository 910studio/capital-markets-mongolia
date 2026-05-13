/**
 * Tiny typed fetch wrapper around the CMM MarketIQ NestJS API.
 *
 * Uses generated OpenAPI types (`api-types.ts`) for compile-time safety
 * without a runtime client library.
 *
 * Auth: in a server context (Server Component / Route Handler / Server
 * Action) the Clerk session token is auto-attached as a Bearer header.
 * Opt out with `{ anonymous: true }` when calling a public endpoint
 * where you don't want to leak the token. In a client context no token
 * is attached — client-side calls must go through a server action.
 */

import type { paths } from "./api-types";

// `process.env` is available in Next.js (server + client via NEXT_PUBLIC_).
declare const process: { env: { NEXT_PUBLIC_API_URL?: string } };

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

const IS_SERVER = typeof window === "undefined";

async function getClerkToken(): Promise<string | null> {
  if (!IS_SERVER) return null;
  try {
    const { auth } = await import("@clerk/nextjs/server");
    const session = await auth();
    return (await session.getToken()) ?? null;
  } catch {
    // Outside a request scope (build, scripts) auth() throws — that's fine.
    return null;
  }
}

type Method = "GET" | "POST" | "PATCH" | "DELETE";

type PathOps<P extends keyof paths> = paths[P];

type GetResponse<P extends keyof paths> =
  PathOps<P> extends { get: { responses: { 200: { content: { "application/json": infer R } } } } }
    ? R
    : never;

type GetQuery<P extends keyof paths> =
  PathOps<P> extends { get: { parameters: { query?: infer Q } } } ? Q : undefined;

type PostBody<P extends keyof paths> =
  PathOps<P> extends { post: { requestBody?: { content: { "application/json": infer B } } } }
    ? B
    : never;

type PostResponse<P extends keyof paths> =
  PathOps<P> extends {
    post: {
      responses:
        | { 200: { content: { "application/json": infer R } } }
        | { 201: { content: { "application/json": infer R } } };
    };
  }
    ? R
    : PathOps<P> extends { post: { responses: { 201: { content: { "application/json": infer R } } } } }
      ? R
      : never;

interface BaseOptions {
  /** Override the auto-injected Clerk session token. */
  token?: string;
  /** Skip auto-injecting the Clerk token (use for public endpoints). */
  anonymous?: boolean;
  /** Next.js fetch cache options. Default: `no-store` for fresh data. */
  cache?: RequestCache;
  /** Next.js revalidation tag/seconds. */
  next?: { revalidate?: number; tags?: string[] };
}

interface GetOptions<P extends keyof paths> extends BaseOptions {
  query?: GetQuery<P>;
}

interface PostOptions<P extends keyof paths> extends BaseOptions {
  body?: PostBody<P>;
}

export class ApiError extends Error {
  readonly status: number;
  readonly path: string;
  readonly payload: unknown;

  constructor(status: number, path: string, payload: unknown) {
    super(`API ${status} on ${path}`);
    this.name = "ApiError";
    this.status = status;
    this.path = path;
    this.payload = payload;
  }
}

function buildUrl(path: string, query?: Record<string, unknown>): string {
  const url = new URL(path, API_BASE_URL);
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v === undefined || v === null) continue;
      url.searchParams.set(k, String(v));
    }
  }
  return url.toString();
}

async function request<T>(
  method: Method,
  path: string,
  init: BaseOptions & { query?: Record<string, unknown>; body?: unknown },
): Promise<T> {
  const headers: Record<string, string> = {
    Accept: "application/json",
  };
  if (init.body !== undefined) headers["Content-Type"] = "application/json";

  // Don't auto-inject a token on cacheable requests — Next.js would store
  // the per-user response in the shared cache. Cacheable = anonymous by
  // default. Caller can still pass `token` explicitly to override.
  const isCacheable =
    (init.cache !== undefined && init.cache !== "no-store") ||
    init.next?.revalidate !== undefined;
  const shouldAutoInject = !init.anonymous && !isCacheable;
  const token =
    init.token ?? (shouldAutoInject ? await getClerkToken() : null);
  if (token) headers["Authorization"] = `Bearer ${token}`;

  // Next.js augments RequestInit with `next` (revalidate/tags). Cast to any
  // so this file compiles in environments where Next's lib types haven't loaded.
  const res = await fetch(buildUrl(path, init.query), {
    method,
    headers,
    body: init.body !== undefined ? JSON.stringify(init.body) : undefined,
    cache: init.cache ?? "no-store",
    next: init.next,
  } as RequestInit & { next?: { revalidate?: number; tags?: string[] } });

  if (!res.ok) {
    let payload: unknown = null;
    try {
      payload = await res.json();
    } catch {
      // body wasn't JSON
    }
    throw new ApiError(res.status, path, payload);
  }

  // 204 No Content
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export async function apiGet<P extends keyof paths>(
  path: P,
  options: GetOptions<P> = {},
): Promise<GetResponse<P>> {
  return request<GetResponse<P>>(
    "GET",
    path as string,
    {
      query: options.query as Record<string, unknown> | undefined,
      token: options.token,
      anonymous: options.anonymous,
      cache: options.cache,
      next: options.next,
    },
  );
}

export async function apiPost<P extends keyof paths>(
  path: P,
  options: PostOptions<P> = {},
): Promise<PostResponse<P>> {
  return request<PostResponse<P>>(
    "POST",
    path as string,
    {
      body: options.body,
      token: options.token,
      anonymous: options.anonymous,
      cache: "no-store",
    },
  );
}

/** Helper for paths with `:slug` / `:id` style params. */
export function path<P extends keyof paths>(
  template: P,
  params: Record<string, string>,
): P {
  let s: string = template as string;
  for (const [k, v] of Object.entries(params)) {
    s = s.replace(`{${k}}`, encodeURIComponent(v));
  }
  return s as P;
}
