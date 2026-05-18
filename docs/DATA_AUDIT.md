# Data Layer Audit — market-iq-fe

**Scope:** `app/lib/data/*` getters, mock/live parity, bypass violations, and mock content quality for the Mongolia capital-markets FE.

## Executive summary

- **8 getters audited** across 4 files (`directory.ts`, `events.ts`, `feed.ts`, `insights.ts`).
- **6 shape mismatches** (1 BLOCK, 5 DRIFT) — live mode silently strips fields the mock UI renders.
- **8 bypass violations** (1 BLOCK, 5 DRIFT, 2 INFO) — pages and widgets read directly from `MOCK_*` or `apiGet` outside the data layer.
- **1 direct `fetch()`** in a page (`/feed/[id]`) bypassing both `apiGet` *and* the data layer.
- **Mock content ~90% realistic** — names, sectors, MNT currency, and dates look right. Main gaps: zero `sourceUrl` on news items, recap/replay URLs are `#` placeholders, a few stale entity tags on articles.
- **Coverage:** 19 articles, 25 entities (16 verified + 3 AI-sourced + 6 light stubs), 6 contributors, 7 events, 14 speakers, 20 news items.

---

## Shape parity

### `getInsights()` → `Article[]`

🟡 **DRIFT** — `app/lib/data/insights.ts:32-45` vs `app/lib/api-adapters.ts:243-263`
Mock path (`mockArticleToArticle`) sets `readTime: "${a.readTime} min"`. Live path (`adaptInsightToArticle`) **never sets `readTime`** — undefined on every live item. UI gracefully omits it (`readTime?` is optional) but the live grid loses that meta. Suggested fix: thread `readTime` through BFF DTO or stub `"5 min"` in the adapter.

🟡 **DRIFT** — `app/lib/data/insights.ts:56-59`
`coverImage` is patched in the data layer (`...adaptInsightToArticle(dto), coverImage: dto.coverImageUrl`), but the adapter signature never declares it. This works at runtime but bypasses the adapter contract. Fix: move `coverImage` mapping inside `adaptInsightToArticle`.

### `getInsightBySlug()` → `MockArticle | null`

🔴 **BLOCK** — `app/lib/data/insights.ts:86-97`
Live path hardcodes `readTime: 5` and `isPremium: dto.isPremium ?? false`. **`entityRefs`** is mapped from `dto.entities[].slug` — but `MockArticle.entityRefs` expects entity slugs that resolve in `MOCK_ENTITIES` to drive `<EntityChip>` rendering on the detail page (`content-detail-client.tsx` imports `MOCK_ENTITIES` directly). Live entity slugs from Payload won't match the local mock slug list → entity chips silently render as missing on live. Fix: either ship `MOCK_ENTITIES` references through the data layer or have `content-detail-client.tsx` look up entities through `getEntityBySlug`.

### `getEvents()` / `getEventBySlug()` → `MockEvent` / `EventDetail`

🟡 **DRIFT** — `app/lib/api-adapters.ts:80-100` (`adaptEventListItem`)
List adapter sets `description: ""` and `speakerSlugs: []`. Mock list items include both. Acceptable for list view (`event-card.tsx` doesn't render description on cards) but anything that touches `event.speakerSlugs` from a list query in live mode will be empty.

🟡 **DRIFT** — `app/lib/api-adapters.ts:161-201` (`adaptEventDetail`)
`sponsors[].tier` defaults to `"partner"` on unknown enum values. Backend enum is uppercase (`PLATINUM/GOLD/SILVER/PARTNER`) per `EVENT_FORMAT_MAP` pattern — looks fine for known tiers. **However**: mock `MockEvent.expectedAttendees`, `presentingCompanies`, `registrationCount`, `ticketPrice`, `venue` flow through, but `sponsors[].logo` only maps from `logoUrl` — if backend sends `logo` instead of `logoUrl` you get nothing. Verify BFF DTO matches.

🟡 **DRIFT** — `app/lib/data/events.ts:59-67` (`getSpeakerBySlug`)
Comment is honest: speakers endpoint not yet implemented on BFF, falls back to `MOCK_SPEAKERS` even in live mode. Live mode therefore can't ever show a speaker beyond what's in the mock array. Tracked TODO — fix when `/api/speakers` ships.

### `getNewsItems()` → `MockNewsItem[]`

🟡 **DRIFT** — `app/lib/api-adapters.ts:119-137` (`adaptNewsItem`)
Live path sets `confidence: dto.signalScore ?? 0.8` and `reviewed: true` for every item. Mock data has `reviewed?: true` only when human-checked (some items omit it → low-confidence treatment in UI). Live mode loses that signal — every live item looks reviewed. Also drops `topics` (live items get no `topics` array) and `isBreaking` / `imageUrl`. Fix: pull through `dto` topics if/when available, surface a separate `isReviewed` flag from BFF rather than hard-true.

### `getEntities()` / `getEntityBySlug()` → `MockEntity` / `EntityListPage`

🟡 **DRIFT** — `app/lib/api-adapters.ts:52-78` (`adaptEntityListItem`, `adaptEntityDetail`)
Live mode only populates a tiny slice of `MockEntity`: `slug, name, ticker, sector, type, description, logo, dataSource, website, yearEstablished`. **Everything else is undefined** — `marketCap`, `price`, `change`, `volume`, `socialLinks`, `summaryRatios`, `financials`, `sustainability`, `shareholders`, `subsidiaries`, `ceo`, `executives`, `boardMembers`, `deals`, `reports`, `pitchDecks`, etc.
This is intentional per the adapter docstring ("UI components already handle missing values") and the `[slug]/page.tsx` merge strategy at lines 36-54 explicitly overlays mock data on top of live for design fidelity. **No fix needed** — flag as INFO so any reader knows live mode shows skeleton-grade detail until BFF financials/ownership endpoints land. The "BLOCKED" markers in mock-data (`financialBlocked: true`) reinforce this is by design.

🟢 **INFO** — `app/lib/data/directory.ts:77-79`
Backend doesn't filter by `raising` so it's done client-side after fetch. Works fine but breaks pagination — `total` will be wrong when `raising=true` because backend returns count of all entities, not filtered. Low-stakes; flag for when the BFF gets a `raising` filter.

🟢 **INFO** — `MockEntity.ticker` source mismatch
Live adapter maps `ticker: dto.mseCode`. Backend `EntityDetailDto` also has `stockTicker` (separate field) — could be misalignment if MSE-listed entities use `mseCode` but foreign-listed (TSX/HKEX) use `stockTicker`. Currently no foreign-listed entities show ticker correctly through live.

---

## Bypass detection

> Rule: `app/lib/data/*` is the only place that should import from `@/app/lib/api` or `@/app/lib/mock-data`. Adapters in `api-adapters.ts` are also allowed.

### Value imports of `MOCK_*` outside the data layer

🔴 **BLOCK** — `app/feed/[id]/page.tsx:43`
Calls `fetch(`${base}/api/news/articles/${id}`)` **directly**, bypasses both `apiGet` and the data layer. Plus imports `MOCK_NEWS, MOCK_ENTITIES, NEWS_CATEGORY_COLORS, NEWS_CATEGORY_LABELS` (line 10) — uses `MOCK_NEWS` as the live fallback. Fix: add `getNewsItemById(id)` to `app/lib/data/feed.ts`, route through `IS_MOCK`. The DTO mapping logic at lines 33-70 should live in `api-adapters.ts` as `adaptNewsArticleDetail`.

🟡 **DRIFT** — `app/page.tsx:6,31` (landing page)
Hits `getInsights()` + `getEvents()` correctly, but then does `new Map(MOCK_ARTICLES.map(...))` to enrich live insights with mock-only fields (probably `coverImage` or `excerpt`). In live mode this map will miss insights not present in the mock. Fix: bake the enrichment into the data layer or accept the gap. Also imports `type MockEvent` — type-only, fine.

🟡 **DRIFT** — `app/account/account-portal.tsx:7-11`
Imports `MOCK_ARTICLES, MOCK_EVENTS` as values to render "Saved Insights" and "My Events" tabs. Hardcoded slug lists at lines 26-32. This is the mocked user state shim ("Mocked user state — wire to real backend later", line 25). **Acceptable as INFO** since it's flagged in code, but the data should flow through `getInsightBySlug` + `getEventBySlug` once the user-saves API exists, otherwise live users see slugs that don't exist in their account.

🟡 **DRIFT** — `app/insights/[slug]/content-detail-client.tsx:18`
Client component imports `MOCK_ARTICLES, MOCK_CONTRIBUTORS, MOCK_ENTITIES` as values to render related articles, author chip, and entity chips on the article detail page. Live `MockArticle` from `getInsightBySlug` carries `entityRefs` but the actual entity records (logos, sectors) are pulled from `MOCK_ENTITIES`. This is the root cause of the BLOCK in `getInsightBySlug` above. Fix: replace with a server-side fetch of related contributors/entities, pass as props.

🟡 **DRIFT** — `app/contributors/[slug]/page.tsx:3`
Server page imports `MOCK_CONTRIBUTORS, MOCK_ARTICLES` as values. The page already calls `apiGet` directly (line 5, see next finding) and falls back to mocks. The mock fallback at lines 95+ is intentional ("Try BFF first, fall back to mocks") but the dual import of `apiGet` *and* `MOCK_*` belongs in `app/lib/data/contributors.ts` (which doesn't exist yet). Fix: create `getContributorBySlug` in the data layer with the BFF→mock fallback baked in.

🟡 **DRIFT** — `app/directory/[slug]/page.tsx:22-26, 38`
Server page imports `MOCK_ENTITIES` to merge with live entity. The merge strategy is the explicit design (per the docstring at line 30-34) for the integration ramp. Fix: long-term, move the merge into `getEntityBySlug` and have it return the merged record. Short-term: fine, flag as DRIFT to revisit when BFF entity coverage is complete.

🟡 **DRIFT** — `app/feed/feed-stream.tsx:8` + `app/components/feed/news-item-card.tsx:7` + `app/insights/insights-controls.tsx:7` + `app/components/insights/feed-sidebar.tsx:5`
These import `NEWS_CATEGORY_LABELS`, `NEWS_CATEGORY_COLORS`, type `MockNewsItem`. Type imports are fine. The constant imports (`NEWS_CATEGORY_LABELS/COLORS`) are arguably static UI config rather than mock data — they live in `mock-data.ts` but they belong with the type. **Pragmatic fix:** move `NEWS_CATEGORY_LABELS/COLORS` + `ENTITY_TYPE_LABELS` + `SECTOR_OPTIONS` + `SECTOR_SLUG_TO_LABEL` out of `mock-data.ts` into a `app/lib/constants.ts`. Then mock-data only holds mock arrays + their interfaces, and these imports stop counting as bypass.

🟡 **DRIFT** — `app/components/entity/entity-coverage-widget.tsx:7` + `app/components/feed/entity-news-widget.tsx:2`
Client components import `MOCK_NEWS` directly as the data source for entity-specific news. In live mode the entity page will show **mock news** instead of live news for that entity. Fix: lift the news data to the server-side page (`/directory/[slug]/page.tsx`), call `getNewsItems()` with an entity filter (filter client-side for now), pass the matched array as a prop.

🟢 **INFO** — `app/account/page.tsx:5,34`
Calls `apiGet("/api/users/me", { token })` directly from the page. This is the auth/profile sync endpoint, not a content endpoint — arguable whether it belongs in the data layer. Either way, current state is harmless because it's a soft-fail check and there's no mock equivalent. Leave as-is or add `getCurrentUser()` for symmetry.

🟢 **INFO** — `app/contributors/[slug]/page.tsx:5` and `app/components/events/register-action.ts:3`
`register-action.ts` is a server action calling `apiPost("/api/events/{slug}/register")`. Mutations are explicitly **not** covered by the data layer rule (the rule says "all data **reads** MUST go through `app/lib/data/*`"). This is correct usage. Same applies to `apiPost` in concierge/connection actions if they exist. No fix needed.

### Direct `fetch()` calls in pages/components

🔴 **BLOCK** — `app/feed/[id]/page.tsx:43`
Already flagged above. This is the only direct `fetch()` in the app tree. Replacing it with `apiGet` (or better, a `getNewsItemById` data-layer getter) is the single highest-leverage fix in this audit.

---

## Mock quality

### MOCK_ARTICLES (19 entries)

🟢 **INFO** — Coverage looks solid. Topics span banking, mining, energy, policy, capital markets. Date distribution is 2025-11 → 2026-04 (sensible for a "current" mock). Authors map to real `MOCK_CONTRIBUTORS` slugs.

🟡 **DRIFT** — `mock-data.ts:344` (`tsetsens-mining-300m-bond`)
Title is "Tsetsens Mining and Energy's US$300M Landmark Bond" but `entityRefs: ["golomt-bank"]` — should reference Tsetsens (which isn't in `MOCK_ENTITIES`) or omit. Golomt as bookrunner is possible but the entity chip will mislead readers. Fix: add `tsetsens-mining-energy` stub entity or remove the ref.

🟡 **DRIFT** — `mock-data.ts:410` (`erdene-25m-bought-deal-placement`)
Article about Erdene Resource Development → `entityRefs: []`. Erdene isn't in `MOCK_ENTITIES`. Fix: add an Erdene stub entity OR populate `entityRefs` with the existing `aspire-mining` analog. Same gap on `em-frontier-mongolia-bonds-2026-outlook` (line 449), `missing-piece-mongolia-energy-transition` (line 501), `three-prime-ministers-whats-next` (line 318) — all `entityRefs: []`.

🟡 **DRIFT** — `mock-data.ts:262` (`mongolia-banking-sector-q1-2026-earnings-review`)
`publishedAt: "2026-04-18"` but article references "Q1 2026 earnings" + cites cabinet transition that elsewhere is dated 2026-04-04. Internally consistent.

🟢 **INFO** — `mock-data.ts:472` (`how-governments-emerging-markets-unlock-potential`)
`publishedAt: "2026-02-05"` — out of natural sequence (article right before this in the array is dated 2025-12-15). Not broken, just unsorted. Sort order doesn't appear to be load-bearing because the UI sorts by date when rendering.

### MOCK_ENTITIES (25 entries)

🟢 **INFO** — Mix of public companies (Khan Bank, Golomt, TDB, Tavan Tolgoi, Gobi Cashmere, Mandal, Aspire, SouthGobi, Darkhan Steel, Khar Tolgoi, M Bank-less...), private (Oyu Tolgoi, MCS, Petrovis, Newcom, Hunnu Air, Bayan-Airag), 2 projects (Tsakhia Solar, Khanbogd Copper), 2 service providers (Baker McKenzie, KPMG), 3 AI-Sourced stubs (Khar Tolgoi, Bayan-Airag, DigiPay).

🟢 **INFO** — Currency / pricing realistic.
- MNT used for local market caps (Khan Bank "MNT 3.2T", Tavan Tolgoi "MNT 8.2T").
- USD for offshore deal sizes ("$120M", "$300M bond").
- AUD/CAD for ASX/TSX-listed entities (Aspire `AUD $95M`, SouthGobi `CAD $180M`).
- Tickers look right: KHAN, TDB, GLMT, TTL, GOBI, MNDL, AKM, SGQ, AARD, MSE.

🟡 **DRIFT** — `mock-data.ts:1031` Darkhan Steel ticker `"DARK"` — looks fabricated, not real MSE listing. Real Darkhan Metallurgical Plant ticker is `DAR` historically. Verify or remove.

🟡 **DRIFT** — `mock-data.ts:946` Mandal Insurance ticker `"MNDL"` — Mandal Daatgal trades as `MNDL` on MSE, this checks out. (Confirmed real.) Similarly `GOBI` for Gobi Cashmere is real.

🟢 **INFO** — Golomt Bank (line 597) is the **richest profile** — full executives, board, deals, downloads, sustainability, ratios. KPMG Mongolia (line 967) is the showcase service-provider profile. Both serve as the "look how good this can be" template. Tavan Tolgoi has financials but `financialBlocked: true` — intentionally gated.

🟢 **INFO** — AI-Sourced profiles have realistic `aiMeta.citations` and disclaimer language. `dataSource: "AI-Sourced"` triggers the thin fall-back layout on the detail page — good.

### MOCK_CONTRIBUTORS (6 entries)

🟢 **INFO** — Realistic Mongolian names, plausible CMM roles. Matches the `AUTHOR_SLUG_MAP` in `contributors/[slug]/page.tsx`. `Enkhtaivan B.` (article author, line 327) is not in contributors but is mapped to `enkhjin-a` in the slug map (line 33) — close enough but technically a different person; consider adding Enkhtaivan as a contributor.

### MOCK_EVENTS (7 entries)

🟢 **INFO** — MIF 2026, MIF Shanghai 2026, MMES, CMM Investor Day Spring + Winter, MIF 2025, ESG Mongolia. Realistic Shangri-La / Blue Sky Tower / Grand Hyatt venues. Ticket prices in MNT ("MNT 1,200,000", "MNT 800,000") — correct.

🟡 **DRIFT** — `mock-data.ts:1394, 1416, 1417, 1434` — `recapUrl: "#"`, `replayUrl: "#"` for all past events except Winter Investor Day (which links to `/insights/mongolia-dealbook-2025`). The `#` placeholder will render as a dead link. Fix: drop `recapUrl/replayUrl` from those records and let the UI conditionally hide the button OR point to a real recap article slug.

🟢 **INFO** — MIF 2026 sponsors list (line 1282-1288) cross-references real `MOCK_ENTITIES` slugs (Khan Bank, TDB, Rio Tinto absent, KPMG Mongolia, Golomt). Rio Tinto isn't in `MOCK_ENTITIES` as an entity — sponsor is rendered by name, so this is fine for display but won't link.

### MOCK_SPEAKERS (14 entries)

🟢 **INFO** — Speakers map to real-ish Mongolian roles (PM Uchral N., Minister of Mining Damdinnyam G., Tavan Tolgoi Board Chair Byambasaikhan B.). Foreign names (John Bell @ Khan Bank, Sarah Mitchell @ Rio Tinto) are plausibly placeholder-but-realistic. Photo paths exist for some (`/events/speakers/...`) but not all — some show as initials, which matches the `Avatar` component contract.

### MOCK_NEWS (20 entries)

🔴 **BLOCK on data quality, not the data layer** — **0 of 20 news items have `sourceUrl` populated.** The `MockNewsItem.sourceUrl?` field is optional per the interface, but every news card and the `/feed/[id]` detail page assume there's an external article to click through to. `news-item-card.tsx` renders the source name but with no URL → a dead source attribution. Fix: add `sourceUrl` to each MOCK_NEWS entry (e.g. `https://www.bloomberg.com/...`, `https://www.reuters.com/...`). For obviously-fabricated mock items, use realistic-looking placeholder URLs that 404 — better than nothing.

🟢 **INFO** — Sources used: Bloomberg, Reuters, FT, Mining.com, Montsame (Mongolia's state news agency — real and correct), CMM Research. All plausible.

🟢 **INFO** — Categories distributed across markets/companies/sectors/policy/deals/macro. Confidence scores realistic (`0.62` to `0.99`). `reviewed: true` on most, omitted on 3 lower-confidence items — matches the analyst-review workflow.

🟡 **DRIFT** — `mock-data.ts:1815` (n-016 Mongolian Properties) and `mock-data.ts:1862` (n-020 M Bank) have `entitySlugs: []` despite headlines naming specific entities. M Bank doesn't have an entity record — add `m-bank` stub OR drop the company-tagged category and use `sectors`. Same fix for `aspire-mining` reference at n-014 (line 1791) — Aspire IS in MOCK_ENTITIES (`aspire-mining`), this one's correct.

🟢 **INFO** — Date ordering: news items run from `2026-04-27` (n-001) backward to `2026-04-21` (n-020). Monotonic, clean.

🟢 **INFO** — `tsakhia-solar` entity slug referenced in n-010 matches `MOCK_ENTITIES`. Cross-refs hold up.

---

## Top fix priority

1. **Add `getNewsItemById(id)` to `app/lib/data/feed.ts`** — kill the only direct `fetch()` and the dual MOCK/api mess in `app/feed/[id]/page.tsx`.
2. **Backfill `sourceUrl` on all 20 MOCK_NEWS items** — the entire news UX assumes a clickable source.
3. **Resolve `MOCK_ENTITIES` lookup in `getInsightBySlug` live path** — entity chips on article detail pages silently break in live mode.
4. **Extract `NEWS_CATEGORY_*`, `ENTITY_TYPE_LABELS`, `SECTOR_*` constants out of `mock-data.ts`** — eliminates 5 of the 8 bypass violations in one move because they become legitimate UI-constant imports.
5. **Create `app/lib/data/contributors.ts` with BFF→mock fallback** — collapses the dual `apiGet` + `MOCK_CONTRIBUTORS` import in `contributors/[slug]/page.tsx`.
