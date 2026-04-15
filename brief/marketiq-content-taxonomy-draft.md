# MarketIQ v1: Content Taxonomy (Draft)

**Status:** Draft for CMM review
**Owner:** Namkhai (confirms/modifies), Zane (proposes)
**Deadline:** Fri Apr 10, 2026
**Dev default if not confirmed:** Articles, Monthly Updates, Press Releases, Comprehensive Guides

---

# Part 1: For Analysts & Editorial Team

This section covers what you publish, how you categorize it, and what rules to follow. If you're on the content or editorial side, this is your section.

---

## Why This Matters
 
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

## Proposed Content Types (7)

| #   | Content Type              | Description                                                                                                                                                          | Typical Length      | Cadence             |
| --- | ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- | ------------------- |
| 1   | **Article**               | Opinion, analysis, and commentary. The core editorial voice of CMM. Covers politics, economics, sectors, policy. Also includes interviews.                           | 800-2,500 words     | 2-4/week            |
| 2   | **Monthly Market Update** | Recurring monthly recap: MSE performance, macro indicators, sector highlights, notable deals. Follows a standard template.                                           | 1,500-3,000 words   | 1/month             |
| 3   | **Investment Teaser**     | Single-entity equity research snapshot. Company overview, key financials, investment thesis, risks. Always linked to a specific company or project in the directory. | 500-1,500 words     | As needed           |
| 4   | **Deal Insight**          | Deep analysis of a specific transaction, deal structure, or market event. Context, terms, implications.                                                              | 1,500-4,000 words   | As deals happen     |
| 5   | **Research Report**       | Long-form sector or thematic research. CMM's flagship content. Often has a downloadable PDF. Includes annual DealBook and Investors Guide to Mongolia.               | 3,000-10,000+ words | Quarterly or ad-hoc |
| 6   | **Press Release**         | Partner company announcements published on CMM channels. MOU signings, partnerships, corporate news.                                                                 | 300-800 words       | As needed           |
| 7   | **CMM Guide**             | In-depth guides on topics relevant to foreign investors. Content-heavy, references specific companies and sectors. Often has a downloadable PDF.                     | 500-2,000 words     | Rarely updated      |

**How current types map to new types:**

| Current Type                | New Type                 | Notes                                                            |
| --------------------------- | ------------------------ | ---------------------------------------------------------------- |
| Article                     | Article                  | Direct.                                                          |
| Interview                   | Article                  | Interviews become Articles. No structural difference.            |
| Monthly Market Update       | Monthly Market Update    | Direct.                                                          |
| Investment Teaser           | Investment Teaser        | Direct. Must link to an entity in the directory.                 |
| Deal Insight                | Deal Insight             | Direct. Must link to entities involved.                          |
| Market Reports              | Research Report          | Rename. Check if any are actually Deal Insights.                 |
| DealBook                    | Research Report          | Annual compilations become Research Reports with PDF attachment. |
| Investors Guide to Mongolia | Research Report          | Long-form reference content.                                     |
| Press Release               | Press Release            | Direct. Must link to partner entity.                             |
| CMM Guide                   | CMM Guide                | Direct.                                                          |
| Other (~5-10 items)         | Article or Press Release | Each item needs manual review and re-categorization.             |

---

## Topic Tags (Consolidated from 19 to 12)

Topic tags are separate from content types. Every piece of content gets 1-3 topic tags. These power filtering on the Insights page.

| #   | Tag                              | What It Covers                                          |
| --- | -------------------------------- | ------------------------------------------------------- |
| 1   | **Mining & Resources**           | Mining, critical minerals, exploration                  |
| 2   | **Energy**                       | Power, renewables, oil & gas                            |
| 3   | **Banking & Finance**            | Banks, fintech, financial services, pension reform      |
| 4   | **Capital Markets**              | MSE, IPOs, bonds, fixed income, M-OTC, public companies |
| 5   | **Economy**                      | Macro indicators, GDP, inflation, trade                 |
| 6   | **Politics & Government**        | Policy, regulation, government actions                  |
| 7   | **ESG & Sustainability**         | ESG, climate, green finance, COP                        |
| 8   | **Technology**                   | Tech sector, digital infrastructure                     |
| 9   | **Real Estate & Infrastructure** | Construction, urban development, PPPs                   |
| 10  | **State-Owned Enterprises**      | SOE reform, privatization                               |
| 11  | **Ratings & Governance**         | Credit ratings, corporate governance, regulations       |

**Changes from current site (19 tags to 11):**
- Merged "Fixed Income" into "Capital Markets" (bonds are a capital markets topic)
- Merged "Industries" (too vague) into specific sector tags
- Merged "Public Companies" into "Capital Markets" (public companies is a directory category, not a content topic)
- Merged "Pension reform" into "Banking & Finance" (niche subtopic)
- Merged "Regulations" into "Politics & Government"
- Added "Real Estate & Infrastructure" (currently missing, but Mongolia has significant construction/infrastructure activity)
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
| Research Report | Recommended | Link to all companies the report actually analyzes. Not every passing mention. |
| CMM Guide | Recommended | These guides are content-heavy and reference specific companies, sectors, or projects. Link to all entities covered substantively. |
| Article | Optional | Link if the article focuses on specific companies. Don't force it for macro or political commentary. |
| Monthly Market Update | Optional | Link to companies highlighted in the update. |

---

## Downloadable Files

PDF downloads require free registration. They are one of the key ways we convert guest visitors into registered users.

| Content Type | Downloadable? | Who Can Download? |
|---|---|---|
| Research Report | Yes (PDF version of the report) | Registered users only |
| CMM Guide | Yes (PDF version of the guide) | Registered users only |
| Investment Teaser | Maybe (1-page PDF snapshot?) | Registered users only |
| Deal Insight | Maybe (PDF version?) | Registered users only |
| Monthly Market Update | No (web only) | N/A |
| Article | No | N/A |
| Press Release | No | N/A |

---

## v1 Access Model

All content is fully visible to all visitors in v1. Registration gates actions, not content. Paid tiers will be defined in Q3/Q4 2026.

| Content Type | Guest (not logged in) | Registered (free) |
|---|---|---|
| Article | Full content | Full content |
| Monthly Market Update | Full content | Full content |
| Investment Teaser | Full content | Full content |
| Deal Insight | Full content | Full content |
| Research Report | Full content. "Register to download" on PDF button. | Full content + PDF download |
| CMM Guide | Full content. "Register to download" on PDF button. | Full content + PDF download |
| Press Release | Full content | Full content |

---

## Content Migration

**What's happening:** Migrating 153 content items from the current Payload CMS setup on capitalmarkets.mn to the new Payload CMS setup on MarketIQ.

**Why migrate if it's the same CMS?** The current content is messy. Images are raw, uncompressed files that heavily impact site performance. Content lacks hyperlinks, entity linking, and consistent formatting. We're treating this as a full migration, not an in-place edit. Every piece of content gets audited.

**Migration QA checklist (per article):**
- Assign correct content type from the new taxonomy
- Assign 1-3 topic tags
- Compress images (max 500KB per image, WebP where possible)
- Add hyperlinks where missing
- Add entity links where applicable (see entity linking rules above)
- Write or verify excerpt text
- Verify cover image exists (or assign placeholder)
- Check formatting in the new design system

**Volume:** ~153 items. Estimated analyst effort: ~8 days at 15-20 articles per day per analyst (W3-W4, Apr 14-25).

---

## Open Questions for CMM

1. **Interviews: separate type or fold into Article?** The current site has a few. They could be Articles with an "Interview" tag, or a distinct type. Recommendation: fold into Article for simplicity.

2. **DealBook: recurring product or one-off?** If annual, it might deserve its own type. If it's just a big Research Report, keep it there.

3. **Future content types:** Are there content types CMM plans to create post-launch that aren't on the current site? (e.g., video content, podcast episodes, data snapshots, earnings summaries) Knowing this now prevents a redesign later.

4. **Topic tag gaps:** Are there sectors or themes CMM covers (or plans to cover) that don't fit the 11 tags above?

5. **PDF strategy:** Beyond Research Reports and CMM Guides, should Investment Teasers and Deal Insights also get downloadable PDFs? More PDF types means more registration triggers.

6. **AI news feed and content:** The Market Feed (the automated news section) generates AI-curated news items daily. Should these be compiled into something for the Insights section?
   - **Option A: Daily Brief.** Compile the day's top news into a daily article. Adds volume to Insights but could feel auto-generated.
   - **Option B: Weekly Brief + Newsletter.** Compile the week's highlights into a weekly digest. Pairs naturally with a regular email newsletter. Lower volume, higher quality per piece.
   - **Option C: Keep them separate.** News feed stays in its own section. Insights stays CMM-authored only. Clean separation, zero extra effort.
   - Which approach fits CMM's editorial voice and analyst capacity?

---

# Part 2: For Engineering (Dulguun & Gray)

Technical specs for implementation. DB structure, URL slugs, CMS field definitions, and AI pipeline configuration.

---

## Content Type Slugs

| Content Type | Slug | URL Pattern |
|---|---|---|
| Article | `article` | `/insights/[slug]` |
| Monthly Market Update | `monthly-update` | `/insights/[slug]` |
| Investment Teaser | `investment-teaser` | `/insights/[slug]` |
| Deal Insight | `deal-insight` | `/insights/[slug]` |
| Research Report | `research-report` | `/insights/[slug]` |
| Press Release | `press-release` | `/insights/[slug]` |
| CMM Guide | `cmm-guide` | `/insights/[slug]` |

## Topic Tag Slugs

| Tag | Slug |
|---|---|
| Mining & Resources | `mining` |
| Energy | `energy` |
| Banking & Finance | `banking` |
| Capital Markets | `capital-markets` |
| Economy | `economy` |
| Politics & Government | `politics` |
| ESG & Sustainability | `esg` |
| Technology | `technology` |
| Real Estate & Infrastructure | `real-estate` |
| State-Owned Enterprises | `soe` |
| Ratings & Governance | `ratings` |

---

## CMS Data Model (Content Metadata)

Every content item in Payload CMS carries these fields:

| Field | Type | Required | Notes |
|---|---|---|---|
| `title` | String | Yes | |
| `slug` | Auto-generated from title | Yes | URL path: `/insights/[slug]` |
| `content_type` | Enum (7 types) | Yes | Determines future gating rules, chunk strategy, CMS workflow |
| `topic_tags` | Multi-select (11 tags) | Yes (min 1) | Powers filtering. Max 3 recommended. |
| `author` | Relation (People collection) | Yes | Author profile with name, avatar, bio |
| `published_at` | Date | Yes | Display date, also used for sort order |
| `cover_image` | Image upload | No | Falls back to placeholder per content_type if empty |
| `excerpt` | Text (max 200 chars) | Yes | Card preview text. If empty, auto-generated from first 200 chars of body. |
| `body` | Rich text (Lexical editor) | Yes | Full content body. Supports headings, images, tables, embeds. |
| `entity_references` | Relation (Entities collection) | Conditional | **Mandatory** for Investment Teaser, Deal Insight, Press Release. **Recommended** for Research Report, CMM Guide. Optional for others. Powers "Related Media" widget on entity profiles and entity chip display on content pages. |
| `pdf_attachment` | File upload | No | For Research Reports and CMM Guides with downloadable PDFs. Download requires free registration. |
| `is_premium` | Boolean | No | Reserved for post-trial gating (Q3/Q4 2026). Not enforced in v1. All content is public. |
| `subscription_tier` | Enum (PRO default) | Auto-set | Default: PRO for all registered users during free trial. Field exists for future tier enforcement but does not restrict access in v1. |
| `rag_status` | Enum (Indexed/Pending/Failed) | System | Tracks whether the content has been embedded into pgvector |
| `newsletter_ready` | Boolean | No | Toggle for newsletter export |
| `seo_title` | String | No | Override for meta title. Falls back to `title`. |
| `seo_description` | String | No | Override for meta description. Falls back to `excerpt`. |

---

## AI/RAG Chunk Strategy by Content Type

| Content Type          | Chunk Strategy                                                          | Max Chunk Size | Overlap   |
| --------------------- | ----------------------------------------------------------------------- | -------------- | --------- |
| Article               | Single chunk if <1,000 tokens. Split at paragraph boundaries otherwise. | 1,000 tokens   | 50 tokens |
| Monthly Market Update | Semantic paragraphs                                                     | 512 tokens     | 50 tokens |
| Investment Teaser     | Single chunk (they're short)                                            | 1,500 tokens   | N/A       |
| Deal Insight          | Semantic paragraphs                                                     | 512 tokens     | 50 tokens |
| Research Report       | Semantic paragraphs                                                     | 512 tokens     | 50 tokens |
| Press Release         | Single chunk                                                            | 1,000 tokens   | N/A       |
| CMM Guide             | Semantic paragraphs                                                     | 512 tokens     | 50 tokens |

---

## Open Engineering Questions

1. **CMS collection structure:** One Payload collection with a content_type discriminator field, or separate collections per type? Single collection is simpler for querying the Insights index. Separate collections give cleaner field validation per type.

2. **`is_premium` and `subscription_tier` fields:** Keep in the v1 schema for future use, or omit and add later? Recommendation: include them now so the data model doesn't change when paid tiers activate. They just won't be enforced.

3. **Migration script (Payload-to-Payload):** Both old and new systems run Payload CMS. What's the approach? Direct DB migration with schema transformation, or export/import via Payload's API? Image compression: automated in the script or manual per article during analyst QA?

4. **Entity linking UI:** How do analysts select entities in the CMS when publishing? Search with autocomplete? Dropdown? Multi-select with entity name + type preview?

---

*Draft: April 4, 2026 | Restructured: April 6, 2026*
*Author: Zane*
*Next: Namkhai reviews Part 1 and confirms or modifies by Fri Apr 10. Dulguun reviews Part 2.*
