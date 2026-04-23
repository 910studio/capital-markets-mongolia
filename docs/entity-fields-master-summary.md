# MarketIQ v1 — Entity Fields Master (Summary)

**Source:** `brief/MarketIQ_Entity_Fields_Master.xlsx`
**Author:** Zane (PM) · Cross-team PRD
**Status:** v1 spec locked except for BLOCKING items below

---

## Entity Types (4)

| Type | Example | Notes |
|------|---------|-------|
| **Public Company** | Tavan Tolgoi JSC | MSE-listed or foreign-listed. Live market data if LOCAL, manual if FOREIGN. |
| **Private Company** | Ard Financial | Self-reported financials. No live stock chart. |
| **Project** | Mining / Energy / Infra / Real Estate | Uses sponsor relationship instead of parent/subsidiary. Stage badge. |
| **Service Provider** | Legal / Audit / Advisory | Practice areas instead of financials. No deal insights. No request connection. |

Bond is separate — `/bonds/[slug]` vs `/directory/[slug]` still ACTIVE decision.

---

## Profile Layout (Source of Truth — Overview sheet)

Two-column layout: **65% main content / 35% sticky sidebar**.

### Main Content (left column)

1. **Header** — Name, Logo, Listing/Stage badge, Sector tags, Status badges (Actively Raising, Featured)
2. **Overview** — Description (2-3 sentences, CMM analyst or AI-verified)
3. **Market Data** — *Public only*
   - LOCAL listings: Price, Daily Change, Volume, Market Cap, Stock Chart (1M/3M/1Y/ALL, live)
   - FOREIGN listings: Manually entered. No chart. Last Updated warning if >30 days.
4. **Financial Performance** — *Public + Private*
   - **Summary Ratios** (P/E, P/B, EV/EBITDA, Div Yield, ROE, Market Cap) — **PENDING Zoloo & Namkhai**
   - **Multi-Year Tables** (Balance Sheet, P&L, Cash Flow — last 3 years) — **PENDING Zoloo & Namkhai**
5. **Sustainability** — *Public + Private (applicable only)*
   - Outcomes (from Mongolia SDG Finance Taxonomy — 12 categories, multi-select)
   - UN SDGs (1-17, multi-select, display as official icons)
   - ESG Policy / Disclosure / Transition Strategy (Yes/No)
   - Impact Tracked / Impact Verified (Yes/No)
   - Certifications (open list, analyst uploads logo per cert)
6. **Ownership & Structure**
   - Subsidiaries & Projects (Public/Project)
   - Parent Group (all 3 types that have it)
   - Shareholders (Public) / Sponsor (Project)
   - Controlling flag for >50% owner
7. **Key People** — *All 4 types*
   - CEO / Founder & CEO / Project Lead / Managing Partner
   - Executive Team / Senior Partners
   - Board Members (Public/Private only)
8. **Deal Insights** — *Public + Private*
   - Summary line + Deal Table: Date, Amount, Investor(s), Funding Type (Equity/Debt/Bond/Syndicated/Other), Purpose

### Sticky Sidebar (right column)

1. **CTAs**
   - Request Connection button (if Actively Raising, all but Service Providers, register to click)
   - Registration CTA (guests only)
2. **Downloads** — Reports, Pitch Decks, Sustainability Docs, Investment Teasers, Operational Documents (Service Providers: Reports/Works/Artifacts, Service List)
3. **News Feed** — AI-tagged recent news, scrollable
4. **CMM Insights** — CMM-authored articles tagged to entity
5. **Profile Badge** — AI-Generated / CMM Verified / Company Submitted
6. **Service Provider extras**: Profile Notes (No Financial Data, No Request Connection, No Deal Insights, No Sustainability — "Fully Public")

---

## BLOCKING Items (can't ship v1 without)

| Owner | Item |
|-------|------|
| Namkhai / Zoloo | Mongolian sector taxonomy — final category list |
| Zoloo & Namkhai | Financial Performance structure (Summary Ratios + Multi-Year Tables) |
| Bond team | Full Bond section review |

## ACTIVE (not blocking but needs decision)

- Foreign market data long-term solution (Zane)
- Bond profiles URL structure — `/bonds/[slug]` vs `/directory/[slug]` (Zane)
- Static market data admin interface approach (Dulguun + Zane)
- Bond data sources — is MSE sufficient? (Namkhai/Zoloo + Dulguun)
- Certification logo upload workflow (Dulguun + analysts)

## Resolved (decision log)

- **SERVICE_PROVIDER added as first-class entity type** — Dulguun + Zane
- **Sectors: single tag in v1**, multi-tag deferred — CMM leadership
- **Sustainability: certifications as open list with analyst-uploaded logos**, no narrative, 12 outcome categories, no quantitative metrics in v1 — Nandia (2026-04-21)
- **Interviews fold into Article** (taxonomy PR merged)
- **DealBook is a series within Research Report** (taxonomy PR merged)

---

## Implementation Gaps vs. Current Code

Our current `MockEntity` type is minimal:

```ts
interface MockEntity {
  slug, name, ticker?, sector, type, description,
  marketCap?, price?, change?, changePercent?, isRaising?
}
```

**Needs to grow to cover (v1):**
- Listing Location (LOCAL/FOREIGN)
- Website
- `isFeatured` flag (in addition to `isRaising`)
- Logo URL (not just initials fallback)
- Summary Ratios + Multi-Year Financial Tables
- Sustainability object (outcomes, SDGs, ESG flags, certifications)
- Ownership: Parent Group slug, Shareholders array with controlling flag, Subsidiaries array
- Key People: CEO, Executive Team, Board Members (with photos, clickable to person profiles in v1.1)
- Deal Insights table
- Downloads array (reports, pitch decks, etc.)
- Profile Badge: AI-Generated / CMM Verified / Company Submitted

**Needs new widgets (we don't have all):**
- SustainabilityWidget (SDG icons + cert logos)
- DealsTableWidget
- DownloadsWidget (multiple categories)
- RequestConnectionWidget (the CTA)
- ProfileBadgeWidget

Project and Service Provider variants need their own field sets (stage badge, practice areas, etc.) — current `MockEntity` doesn't branch by type.

---

## v1.1 Deferred

- People as first-class entities with own profile pages (`/people/[slug]`)
- People in directory search (toggle vs. only via company profiles)
- Multi-tag sectors (revisit 3-6 months post-launch)
