# MarketIQ v1: Content Taxonomy

**Status:** Final — Reviewed by Namkhai, integrated Apr 14
**Owner:** Namkhai (confirms/modifies), Zane (proposes)
**Reviewer:** Namkhai (Apr 14 review)

---

# Part 1: For Analysts & Editorial Team

This section covers what you publish, how you categorize it, and what rules to follow. If you're on the content or editorial side, this is your section.

---

## Why This Matters

The content taxonomy defines every content type that lives in MarketIQ's Insights section. It determines:

- How content is categorized, filtered, and discovered by users
- How the CMS is set up (each type may have different fields and publishing workflows)
- Which content types have downloadable PDFs (PDF downloads require free registration, making them a conversion tool)
- What migrates from the current site (153 items across 11 legacy categories)
- What the editorial calendar looks like post-launch

Get this wrong and we either confuse users with too many buckets, or lose specificity by collapsing everything into "Article."

---

## Current State: capitalmarkets.mn/insight

The existing site has **153 content items** across **11 content type filters**:

| Current Type                | Count (approx) | Description                                                                   |
| --------------------------- | -------------- | ----------------------------------------------------------------------------- |
| Article                     | High           | Opinion pieces, analysis, commentary on markets, politics, economy            |
| Monthly Market Update       | ~12-15         | Recurring monthly recap of MSE performance, key macro data                    |
| Investment Teaser           | ~5-8           | Single-company equity research snapshots (e.g., [MSE:KHAN] Q4 2025)           |
| Deal Insight                | ~5-8           | Deep analysis of specific transactions or deal structures                     |
| DealBook                    | ~2-3           | Annual compilation of Mongolia's deal activity (e.g., Mongolia DealBook 2025) |
| Press Release               | ~5-10          | CMM corporate announcements, MOU signings, partnerships                       |
| Interview                   | ~3-5           | Q&A format with market participants                                           |
| Market Reports              | ~3-5           | Longer-form sector or thematic research                                       |
| Investors Guide to Mongolia | ~1-2           | Comprehensive onboarding guides for foreign investors                         |
| CMM Guide                   | ~1-2           | Guides about CMM's services and process                                       |
| Other                       | ~5-10          | Catch-all for uncategorized content                                           |

**Industry/topic tags (19):** Politics, Technology, Health Care, Energy, Fixed Income, Banking, Sustainability, State-Owned Enterprises, M-OTC market, Pension reform, Mining, Regulations, Public Companies, Capital Markets, Economy, Government, ESG, Ratings, Industries

**Content metadata per item:** Title, category badge (colored), publication date, thumbnail image, author name

---

## Problems With the Current Setup

1. **Too many types, unclear boundaries.** "Article" vs "Deal Insight" vs "Market Reports" overlap. An article about a bond issuance could be any of the three.
2. **"Other" is a red flag.** If content doesn't fit your categories, the categories are wrong.
3. **Inconsistent granularity.** "DealBook" is one annual product. "Article" is everything else. These aren't at the same level.
4. **No access model per type.** The current site has no registration gate. MarketIQ v1 introduces action-based registration gating (PDF downloads, connection requests). Content itself is fully visible to all visitors. Knowing which types carry downloadable PDFs matters because PDF downloads are a registration trigger.

---

## Content Types (6)

| #   | Content Type          | Description                                                                                                                                                                                       | Typical Length      | Cadence             |
| --- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- | ------------------- |
| 1   | **Article**           | Opinion, analysis, and commentary. The core editorial voice of CMM. Covers politics, economics, sectors, policy. Also includes interviews.                                                        | 800-2,500 words     | 2-4/week            |
| 2   | **Market Brief**      | Recurring data-driven snapshots: monthly updates, quarterly reviews, sector scorecards. Follows a standard template.                                                                               | 1,000-3,000 words   | Monthly+            |
| 3   | **Investment Teaser** | Single-entity equity research snapshot. Company overview, key financials, investment thesis, risks. Always linked to a specific company or project in the directory.                                | 500-1,500 words     | As needed           |
| 4   | **Deal Insight**      | Deep analysis of a specific transaction, deal structure, or market event. Context, terms, implications.                                                                                            | 1,500-4,000 words   | As deals happen     |
| 5   | **Research Report**   | Long-form sector or thematic research. CMM's flagship content. Always has a downloadable PDF. Includes annual DealBook, Investor Guides, and former CMM Guides.                                   | 3,000-10,000+ words | Quarterly or ad-hoc |
| 6   | **Press Release**     | Partner company announcements published on CMM channels. MOU signings, partnerships, corporate news.                                                                                               | 300-800 words       | As needed           |

**How current types map to new types:**

| Current Type                | New Type          | Series Tag                    | Notes                                                            |
| --------------------------- | ----------------- | ----------------------------- | ---------------------------------------------------------------- |
| Article                     | Article           |                               | Direct.                                                          |
| Interview                   | Article           |                               | Interviews become Articles. No structural difference.            |
| Monthly Market Update       | Market Brief      | Monthly Market Update         | Renamed. The current monthly recap becomes a series within Market Brief. |
| Investment Teaser           | Investment Teaser |                               | Direct. Must link to an entity in the directory.                 |
| Deal Insight                | Deal Insight      |                               | Direct. Must link to entities involved.                          |
| Market Reports              | Research Report   |                               | Rename. Check if any are actually Deal Insights.                 |
| DealBook                    | Research Report   | DealBook                      | Annual compilations become a series within Research Report.      |
| Investors Guide to Mongolia | Research Report   | Investor Guide to Mongolia    | Long-form reference content, tagged as a series.                 |
| Press Release               | Press Release     |                               | Direct. Must link to partner entity.                             |
| CMM Guide                   | Research Report   | Investor Guide to Mongolia    | Folded into Research Report. Guides are long-form reference content. |
| Other (~5-10 items)         | Article or Press Release |                        | Each item needs manual review and re-categorization.             |

---

## Series

Series is a cross-cutting organizational layer that groups related content across content types. It surfaces to readers as a "Browse by Series" filter on the Insights page.

**How it works:**
- Each content item can optionally be assigned to a series in the CMS
- The Insights page includes a "Browse by Series" filter alongside Content Type, Topic, and Writer filters
- Clicking a series shows all content in that series, regardless of content type

**Launch series:**

| Series Name                  | Content Type    | Description                                    |
| ---------------------------- | --------------- | ---------------------------------------------- |
| Monthly Market Update        | Market Brief    | Recurring monthly recap of MSE and macro data  |
| DealBook                     | Research Report | Annual compilation of Mongolia's deal activity |
| Investor Guide to Mongolia   | Research Report | Reference guides for foreign investors         |

New series can be added in the CMS at any time without taxonomy changes (e.g., "Sector Spotlight", "CEO Interview Series", quarterly sector reviews).

---

## Topic Tags (12)

Topic tags are separate from content types. Every piece of content gets 1-3 topic tags. These power filtering on the Insights page.

| #   | Tag                              | What It Covers                                                          |
| --- | -------------------------------- | ----------------------------------------------------------------------- |
| 1   | **Mining & Resources**           | Mining, critical minerals, exploration                                  |
| 2   | **Energy**                       | Power, renewables, oil & gas                                            |
| 3   | **Banking & Finance**            | Banks, fintech, financial services, pension reform                      |
| 4   | **Capital Markets**              | MSE, IPOs, bonds, fixed income, M-OTC, public companies                |
| 5   | **Economy & Macro**              | GDP, inflation, trade balance, monetary policy                          |
| 6   | **Policy & Regulation**          | Government policy, regulation, legislation, reform                      |
| 7   | **ESG & Climate**                | ESG, climate, green finance, COP                                        |
| 8   | **Technology**                   | Tech sector, digital infrastructure, fintech                            |
| 9   | **Real Estate & Infrastructure** | Construction, urban development, PPPs                                   |
| 10  | **State-Owned Enterprises**      | SOE reform, privatization                                               |
| 11  | **Ratings & Governance**         | Credit ratings, corporate governance                                    |
| 12  | **Trade & Geopolitics**          | FDI, cross-border trade, transit economy, China/Russia relations, diplomacy |

**Changes from current site (19 tags to 12):**
- Merged "Fixed Income" into "Capital Markets" (bonds are a capital markets topic)
- Merged "Industries" (too vague) into specific sector tags
- Merged "Public Companies" into "Capital Markets" (public companies is a directory category, not a content topic)
- Merged "Pension reform" into "Banking & Finance" (niche subtopic)
- Merged "Regulations" into "Policy & Regulation"
- Renamed "Economy" to "Economy & Macro" (more precise)
- Renamed "Politics & Government" to "Policy & Regulation" (more precise)
- Renamed "ESG & Sustainability" to "ESG & Climate" (more precise)
- Added "Real Estate & Infrastructure" (currently missing, but Mongolia has significant construction/infrastructure activity)
- Added "Trade & Geopolitics" (Mongolia's strategic position between China and Russia, FDI flows, Belt & Road, cross-border commerce)
- Kept "State-Owned Enterprises" as its own tag (important for Mongolian context, frequent topic)
- **Dropped "Health Care"** from launch set. CMM rarely publishes healthcare content. Can add it later if needed.

---

## Entity Linking Rules

When a piece of content is linked to a company or project in the directory, two things happen:
1. That entity's profile page shows the content under "Related Research"
2. The content page shows clickable company chips that link to entity profiles

This is one of MarketIQ's core features: an investor reading about a mining company can click through to its full profile, and vice versa.

| Content Type | Required? | Rule |
|---|---|---|
| Investment Teaser | Mandatory | Always tied to exactly one entity. Cannot publish without a link. |
| Deal Insight | Mandatory | Tied to 1-3 entities involved in the deal. |
| Press Release | Mandatory | Press releases are about partner companies published on CMM channels. Always tied to at least one entity. |
| Research Report | Recommended | Link to all companies the report actually analyzes. Includes DealBook, Investor Guides. Not every passing mention. |
| Article | Optional | Link if the article focuses on specific companies. Don't force it for macro or political commentary. |
| Market Brief | Optional | Link to companies highlighted in the update. |

---

## Downloadable Files

PDF downloads require free registration. They are one of the key ways we convert guest visitors into registered users.

| Content Type | Downloadable? | Who Can Download? |
|---|---|---|
| Research Report | Yes (PDF version of the report) | Registered users only |
| Investment Teaser | Yes (1-page PDF snapshot) | Registered users only |
| Deal Insight | Yes (PDF version) | Registered users only |
| Market Brief | No (web only) | N/A |
| Article | No | N/A |
| Press Release | No | N/A |

---

## v1 Access Model

All content is fully visible to all visitors in v1. Registration gates actions, not content. Paid tiers will be defined in Q3/Q4 2026.

| Content Type | Guest (not logged in) | Registered (free) |
|---|---|---|
| Article | Full content | Full content |
| Market Brief | Full content | Full content |
| Investment Teaser | Full content. "Register to download" on PDF button. | Full content + PDF download |
| Deal Insight | Full content. "Register to download" on PDF button. | Full content + PDF download |
| Research Report | Full content. "Register to download" on PDF button. | Full content + PDF download |
| Press Release | Full content | Full content |

---

## Content Migration

**What's happening:** Migrating 153 content items from the current Payload CMS setup on capitalmarkets.mn to the new Payload CMS setup on MarketIQ.

**Why migrate if it's the same CMS?** The current content is messy. Images are raw, uncompressed files that heavily impact site performance. Content lacks hyperlinks, entity linking, and consistent formatting. We're treating this as a full migration, not an in-place edit. Every piece of content gets audited.

**Migration QA checklist (per article):**
- Assign correct content type from the new taxonomy (6 types)
- Assign 1-3 topic tags (12 tags)
- Assign series label if applicable (Monthly Market Update, DealBook, Investor Guide to Mongolia)
- Compress images (max 500KB per image, WebP where possible)
- Add hyperlinks where missing
- Add entity links where applicable (see entity linking rules above)
- Write or verify excerpt text
- Verify cover image exists (or assign placeholder)
- Check formatting in the new design system

*Note: read_time is auto-calculated from word count. No analyst action needed.*

**Volume:** ~153 items. Estimated analyst effort: ~8 days at 15-20 articles per day per analyst (W3-W4, Apr 14-25).

---

## Resolved Questions (from Namkhai review, Apr 14)

1. **Interviews:** Fold into Article. No separate type needed.

2. **DealBook:** Treated as a recurring series within Research Report. Tagged with series: "DealBook".

3. **Future content types:** Plan for Data Snapshot, Podcast Episode, and Earnings Summary as potential additions. CMS schema uses an extensible enum for content_type so new types can be added without migration.

4. **Topic tag gaps:** Added "Trade & Geopolitics" as 12th tag to cover Mongolia's transit economy position, FDI flows, Belt & Road, and China/Russia relations.

5. **PDF strategy:** Yes. Investment Teasers get 1-page PDF snapshots, Deal Insights get full PDF versions. Both gated behind free registration. More PDF types = more registration triggers.

6. **AI news feed:** Option C (keep separate) for v1. News feed stays in its own section, Insights stays CMM-authored only. Revisit in v1.1 with Option B (Weekly Brief compiled from AI feed).

---

## Insights Page UX (v1)

Key changes from the current capitalmarkets.mn/insight page:

- **Filters:** 5 dimensions total. Content Type (multi-select), Topic (multi-select), Writer (single-select), Browse by Series, Sort by date.
- **Hero section:** Reduce from ~800px to ~400px max. Current hero pushes filters and content below the fold.
- **Read time:** Display estimated read time on content cards (auto-calculated from word count).

---

# Part 2: For Engineering (Dulguun & Gray)

Technical specs for implementation. DB structure, URL slugs, CMS field definitions, and AI pipeline configuration.

---

## Content Type Slugs

| Content Type | Slug | URL Pattern |
|---|---|---|
| Article | `article` | `/insights/articles/[slug]` |
| Market Brief | `market-brief` | `/insights/briefs/[slug]` |
| Investment Teaser | `investment-teaser` | `/insights/teasers/[slug]` |
| Deal Insight | `deal-insight` | `/insights/deals/[slug]` |
| Research Report | `research-report` | `/insights/research/[slug]` |
| Press Release | `press-release` | `/insights/press/[slug]` |

## Topic Tag Slugs

| Tag | Slug |
|---|---|
| Mining & Resources | `mining` |
| Energy | `energy` |
| Banking & Finance | `banking` |
| Capital Markets | `capital-markets` |
| Economy & Macro | `economy` |
| Policy & Regulation | `politics` |
| ESG & Climate | `esg` |
| Technology | `technology` |
| Real Estate & Infrastructure | `real-estate` |
| State-Owned Enterprises | `soe` |
| Ratings & Governance | `ratings` |
| Trade & Geopolitics | `trade` |

---

## CMS Data Model (Content Metadata)

Every content item in Payload CMS carries these fields:

| Field | Type | Required | Notes |
|---|---|---|---|
| `title` | String | Yes | |
| `slug` | Auto-generated from title | Yes | URL path: `/insights/[type-segment]/[slug]` (see Content Type Slugs above) |
| `content_type` | Enum (6 types) | Yes | Determines URL segment, gating rules, chunk strategy, CMS workflow |
| `topic_tags` | Multi-select (12 tags) | Yes (min 1) | Powers filtering. Max 3 recommended. |
| `series` | Select (optional) | No | Groups recurring content. Options: "Monthly Market Update", "DealBook", "Investor Guide to Mongolia". New values can be added without migration. Powers "Browse by Series" filter. |
| `read_time` | Number (auto-calc) | System | Estimated read time in minutes, auto-calculated from word count. Displayed on content cards. |
| `author` | Relation (People collection) | Yes | Author profile with name, avatar, bio |
| `published_at` | Date | Yes | Display date, also used for sort order |
| `cover_image` | Image upload | No | Falls back to placeholder per content_type if empty |
| `excerpt` | Text (max 200 chars) | Yes | Card preview text. If empty, auto-generated from first 200 chars of body. |
| `body` | Rich text (Lexical editor) | Yes | Full content body. Supports headings, images, tables, embeds. |
| `entity_references` | Relation (Entities collection) | Conditional | **Mandatory** for Investment Teaser, Deal Insight, Press Release. **Recommended** for Research Report. Optional for others. Powers "Related Media" widget on entity profiles and entity chip display on content pages. |
| `pdf_attachment` | File upload | No | For Research Reports, Investment Teasers, and Deal Insights. Download requires free registration. |
| `is_premium` | Boolean | No | Reserved for post-trial gating (Q3/Q4 2026). Not enforced in v1. All content is public. |
| `subscription_tier` | Enum (PRO default) | Auto-set | Default: PRO for all registered users during free trial. Field exists for future tier enforcement but does not restrict access in v1. |
| `rag_status` | Enum (Indexed/Pending/Failed) | System | Tracks whether the content has been embedded into pgvector |
| `newsletter_ready` | Boolean | No | Toggle for newsletter export |
| `seo_title` | String | No | Override for meta title. Falls back to `title`. |
| `seo_description` | String | No | Override for meta description. Falls back to `excerpt`. |

---

## AI/RAG Chunk Strategy by Content Type

| Content Type      | Chunk Strategy                                                          | Max Chunk Size | Overlap   |
| ----------------- | ----------------------------------------------------------------------- | -------------- | --------- |
| Article           | Single chunk if <1,000 tokens. Split at paragraph boundaries otherwise. | 1,000 tokens   | 50 tokens |
| Market Brief      | Semantic paragraphs                                                     | 512 tokens     | 50 tokens |
| Investment Teaser | Single chunk (they're short)                                            | 1,500 tokens   | N/A       |
| Deal Insight      | Semantic paragraphs                                                     | 512 tokens     | 50 tokens |
| Research Report   | Semantic paragraphs                                                     | 512 tokens     | 50 tokens |
| Press Release     | Single chunk                                                            | 1,000 tokens   | N/A       |

---

## Open Engineering Questions

1. **CMS collection structure:** One Payload collection with a content_type discriminator field, or separate collections per type? Single collection is simpler for querying the Insights index. Separate collections give cleaner field validation per type.

2. **`is_premium` and `subscription_tier` fields:** Keep in the v1 schema for future use, or omit and add later? Recommendation: include them now so the data model doesn't change when paid tiers activate. They just won't be enforced.

3. **Migration script (Payload-to-Payload):** Both old and new systems run Payload CMS. What's the approach? Direct DB migration with schema transformation, or export/import via Payload's API? Image compression: automated in the script or manual per article during analyst QA?

4. **Entity linking UI:** How do analysts select entities in the CMS when publishing? Search with autocomplete? Dropdown? Multi-select with entity name + type preview?

---

*Draft: April 4, 2026 | Restructured: April 6, 2026 | Updated: April 14, 2026*
*Author: Zane | Reviewed by: Namkhai*
*Integrated Namkhai's review feedback. Next: share with Dulguun & Gray for engineering review.*
