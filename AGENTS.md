<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Two-repo setup

This codebase is pushed to **two remotes** with different roles:

- `mock` → `910studio/capital-markets-mongolia` — mocked playground, demos, FE tests. **No backend.**
- `prod` → `capital-markets-mn/market-iq-fe` — production. Wired to market-iq BFF, Clerk auth, real data.

**Same code on both remotes.** Data source is controlled by the `DATA_MODE` env var:

- `DATA_MODE=mock` → reads from `app/lib/mock-data.ts` (set on mock's Vercel project)
- `DATA_MODE=live` → calls market-iq BFF via `apiGet` (set on prod's Vercel project)

Defaults to `mock` if unset, so fresh clones / new envs work without a backend.

## Data layer

All data reads MUST go through `app/lib/data/*` — never call `apiGet` directly from pages. The data layer branches on `DATA_MODE` and returns the canonical shape (e.g. `MockEvent`). Live adapters in `app/lib/api-adapters.ts` normalize BFF DTOs into the same shape.

```ts
// ✓ good
import { getEvents } from "@/app/lib/data/events";
const events = await getEvents();

// ✗ bad — bypasses the mock/live split
import { apiGet } from "@/app/lib/api";
const res = await apiGet("/api/events");
```

## Push workflow

- Daily WIP commits → push to `mock` only (`git push mock`)
- Feature complete + locally verified in both modes → push to `prod` (`git push prod <branch>:main`)
- Never push half-baked work to `prod`. It's production.
