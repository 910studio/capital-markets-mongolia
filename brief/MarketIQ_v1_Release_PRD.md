# PRD: CMM Market IQ v1 Release

**Version:** 1.0
**Date:** March 30, 2026
**Status:** Draft
**Owner:** Zane (PM)
**Team:** Ganaa (Design Engineer / Frontend), Dulguun (Backend / AI Developer)
**Target Release:** May 26, 2026 (flexible to June if quality isn't there)
**Last Updated:** March 30, 2026 (post-review panel update)

---

## 1. Objective & Context

### What is Market IQ?

Market IQ is an intelligence platform for global investors evaluating Mongolian capital markets. It replaces capitalmarkets.mn (the current site, which doesn't meet modern standards) with a platform built from the ground up.

CMM's core business is deal advisory and events. Market IQ adds a new revenue stream: subscriptions from investors who need structured, English-language intelligence on Mongolia. The platform serves two sides. Investors get a searchable company directory, premium research, and qualified introductions. Mongolian companies get visibility with international capital.

### What is v1?

v1 is the foundation. It launches the platform with enough value to attract users, convert guests to registered accounts, and validate the product before pricing kicks in.

v1 is not the AI-powered workspace. That's v2. v1 builds the data layer, content engine, and user base that v2's AI features will sit on top of.

### v1 Release Goals

1. Replace capitalmarkets.mn with a modern, credible platform
2. Launch a searchable directory starting with 100 verified Mongolian entity profiles, incrementally expanding post-launch
3. Migrate and modernize CMM's content library (150 articles)
4. Deliver a live market news feed linked to entities
5. Provide an events hub for MIF and other CMM events
6. Convert guest visitors to registered users through metered content access

### What v1 is NOT

- No AI conversation workspace (v2)
- No subscription payments (first two quarters are free trial, custom invoices for early clients)
- No native mobile apps
- No Mongolian language content
- No two-way CRM sync
- No watchlist or alerts system
- No bond scanner (v1.1)
- No LinkedIn OAuth (post-launch addition)

---

## 2. Personas

### Persona 1: Global Investor

**Who:** Investment banker (Associate/VP) or institutional desk analyst at a fund, asset manager, or sovereign wealth desk.

**Where:** Hong Kong, Singapore, Dubai, New York, Zurich, Mumbai, mainland China.

**Goal:** Source investable Mongolian assets, build conviction on Mongolia as an allocation, or monitor existing positions.

**Pain:** Mongolia isn't covered by Bloomberg or standard financial tools. Research is manual, scattered across Mongolian-language sources, and requires local relationships.

**How they use Market IQ:** Browse the directory, read CMM research, scan the market feed for signals, request introductions to companies.

### Persona 2: CMM Analyst (Internal Operator)

**Who:** CMM team member. Manages listings, publishes content, reviews AI-generated profiles, facilitates introductions.

**Goal:** Operate the platform efficiently and maintain data quality.

**How they use Market IQ:** Publish content in Payload CMS, review AI-generated entity profiles, process connection requests via email, manage events.

### Persona 3: Mongolian Company Representative

**Who:** CFO, CEO, or IR manager at a Mongolian company.

**Goal:** Attract foreign investment and establish credibility with global institutional investors.

**How they use Market IQ:** Discovers their company's profile on the platform. In v1, they contact CMM to update or enhance their listing. Self-service management is deferred to a later release.

---

## 3. Epics & Stories

---

### Epic 1: Insights (Content Hub)

**Business Value:** Premium content is CMM's core intellectual property. Reports and research drive SEO traffic, establish credibility with investors, and create the conversion trigger from guest to registered user. Migrating 150 legacy articles preserves existing value. The new Insights section sets the modern standard.

---

**Story 1.1: Insights Index Page**

As an investor, I need to browse and filter CMM's research library so I can find relevant intelligence quickly.

*Acceptance Criteria:*
- Insights page at `/insights` displays all published content from Payload CMS.
- Each card shows: cover image, title, content type badge, sector tags, publish date.
- Filter sidebar: content type, sector, date range.
- Content types to be finalized with CMM team. Working set: Articles, Monthly Updates, Press Releases, Comprehensive Guides.
- Default sort: publish date descending.
- Text search across titles and descriptions.
- Pagination (12 items per page).
- Page is SSR for SEO.

*Edge Cases:*
- No results for applied filters: show "No content found. Try adjusting your filters." with a Clear Filters button.
- Content with no cover image: display a default placeholder by content type.

---

**Story 1.2: Content Detail Pages**

As an investor, I need to read the full content of an article or report so I can use it in my research.

*Acceptance Criteria:*
- Detail page at `/insights/[slug]`.
- Displays: title, author, publish date, cover image, sector tags, full rich text body.
- Related entities displayed as clickable chips (auto-tagged, see Story 1.5).
- SSR for SEO.
- If a PDF file exists for the content item, show a "Download PDF" button.
- If no PDF exists, content is view-only on the web.

*Edge Cases:*
- Slug doesn't exist: return 404 with link back to Insights index.
- PDF download URL is broken: show "PDF currently unavailable" and log the error.

---

**Story 1.3: Metered Paywall (Guest-to-Registration)**

As a product, I need to convert guest visitors to registered users by gating content after a free preview.

*Acceptance Criteria:*
- Guests (not logged in) can read 3 articles before seeing a registration wall.
- Read count tracked via local storage or cookie.
- Show a subtle counter on content pages: "2 of 3 free articles remaining" so the wall doesn't feel arbitrary.
- After 3 articles, the content body is replaced inline with a registration prompt: "Create a free account to continue reading." No modal. The teaser, title, and cover image remain visible above the wall.
- Registration prompt links to Clerk signup flow.
- After successful registration, redirect the user back to the article they were reading (not the homepage).
- Select premium content (flagged by CMM in CMS) is always gated, even for the first 3 reads. Guests see title, teaser, and cover image only.
- Registered users (free tier) have unlimited access to all content during the trial period.

*Edge Cases:*
- User clears cookies: they get 3 more free reads. This is acceptable for v1. Not worth over-engineering.
- Premium content with no teaser text: display the first 200 characters of the body as the teaser.

---

**Story 1.4: Legacy Content Migration**

As CMM, I need the 150 existing articles from capitalmarkets.mn migrated to the new platform so we don't lose our content library.

*Acceptance Criteria:*
- All 150 articles migrated from existing CMS to Payload CMS.
- Content formatted to match the new design system.
- Existing URLs either preserved or redirected (301) to new slugs for SEO continuity.
- Each migrated article tagged with content type and sector.
- Migration validated: no broken images, no formatting issues, no missing content.

*Analyst Quality Gate:* Dulguun writes the bulk migration script. CMM analysts own formatting fixes, content type tagging, sector tagging, and QA validation of each migrated article. Engineering does not fix editorial issues.

*Edge Cases:*
- Articles with embedded media from third-party sources that no longer exist: replace with placeholder noting "Media unavailable."
- Articles with no clear content type: default to "Article."

---

**Story 1.5: Content-Entity Linking**

As an investor viewing an entity profile, I need to see CMM's research related to that entity so I can access all intelligence from one place.

*Acceptance Criteria:*
- Entity tagging on content runs as a supervised batch process. Dulguun runs the AI tagging script periodically. Output is reviewed before going live.
- Entity profile pages display a "CMM Research" section showing linked Insights content.
- Section shows: title, content type badge, publish date. Max 5 items, sorted by date. "View All" link if more exist.
- Content detail pages display linked entities as clickable chips that navigate to the entity profile.
- CMM analysts can also manually tag entities on content items via CMS dropdown as a fallback.

*Analyst Quality Gate:* AI-suggested entity tags are reviewed by a CMM analyst before publishing. Analysts can accept, edit, or remove tags. No auto-publish of entity links.

*Edge Cases:*
- Entity has no linked content: hide the "CMM Research" section entirely.
- Content links to an entity that has been archived or deleted: skip it in the display.

---

**Story 1.6: CMS Publishing Workflow**

As a CMM analyst, I need to publish content through Payload CMS with proper workflow so content quality is maintained.

*Acceptance Criteria:*
- Payload CMS configured with content types matching the agreed taxonomy.
- Each content item has fields: title, slug (auto-generated, editable), cover image, teaser text, body (rich text), content type, sector tags, entity references, premium toggle, PDF upload (optional), author, publish date.
- Workflow states: Draft, In Review, Published.
- Analysts can create drafts and submit for review. Admins and Owners can publish.
- Published content immediately visible on the platform.

*Analyst Quality Gate:* All content follows the Draft > In Review > Published workflow. No direct-to-publish shortcut. Analysts draft and submit; Admins/Owners review and publish.

---

**Story 1.7: PDF Downloads**

As an investor, I need to download PDF versions of reports so I can use them offline or share internally.

*Acceptance Criteria:*
- If a PDF file is uploaded alongside the content item in Payload CMS, a "Download PDF" button appears on the detail page.
- Download is available to registered users only. Guests see "Register to download."
- If no PDF is uploaded, no download button is shown. Content is web-only.
- Downloads are logged (user ID, content ID, timestamp) for analytics.

*Edge Cases:*
- Large PDFs (>50MB): ensure download doesn't timeout. Use direct file URL, not server proxy.

---

### Epic 2: Company Directory

**Business Value:** The core product. A searchable directory of 500-1000 Mongolian entities with rich, widget-based profiles. AI-generated profiles solve the cold-start problem (an empty directory has no value). Drives SEO traffic through public profiles and positions Market IQ as the definitive source for Mongolian company intelligence.

---

**Story 2.1: Directory Index Page**

As an investor, I need a filterable directory to browse all entities so I can discover opportunities by sector, type, and deal status.

*Acceptance Criteria:*
- Directory page at `/directory` displays a card grid of all entities where status is LIVE.
- Each card shows: logo, name, type badge, sector, "Actively Raising" badge if applicable.
- Filter sidebar:
  - Entity type: Public Company, Private Company, Project, Service Provider.
  - Sector: Mining, Energy, Banking, Real Estate, Technology, Agriculture, Infrastructure, Other.
  - Deal status: "Show only Actively Raising" toggle.
- Text search across entity names and descriptions (PostgreSQL full-text search).
- Results paginated: 20 per page.
- Filter state encoded in URL query parameters (bookmarkable, shareable).
- SSR for SEO.

*Edge Cases:*
- No results for filters: "No results found. Try adjusting your filters." with Clear Filters button.
- Invalid URL filter parameters: silently ignore, don't error.

---

**Story 2.2: Entity Profile Engine**

As a developer, I need a dynamic profile page system that renders different widgets based on entity type so one codebase serves all entity types.

*Acceptance Criteria:*
- Dynamic route at `/directory/[slug]`.
- Each entity has a `layout_config` that specifies which widgets to render and in what order.
- Frontend widget registry maps widget names to React components. Unknown widget names are skipped (logged, never crashes the page).
- Entity header renders differently by type:
  - PUBLIC_COMPANY: stock ticker displayed (e.g., "MSE: TTL").
  - PROJECT: project stage badge (e.g., "Feasibility Study").
  - PRIVATE_COMPANY: "Private Company" label.
  - SERVICE_PROVIDER: "Service Provider" label + specialization tags.
- All types display: logo, name, sector/industry tags, website link, description.
- Two content sections on entity profiles:
  - **CMM Content:** Analyst Insights + Related Media (from Epic 1, CMM-authored).
  - **Market News:** Auto-linked news from Market Feed (Epic 3, external sources).
- SSR for SEO.

*Edge Cases:*
- Slug doesn't exist: 404 with "Go to Directory" link.
- Entity status is not LIVE: 404 for public users. Admins can preview via admin mode.
- No logo: placeholder icon based on sector.

---

**Story 2.3: Public Company Widgets**

As an investor viewing a public company, I need to see stock data and audited financials so I can assess financial health.

*Acceptance Criteria:*
- `MarketDataWidget`: interactive stock price chart. Time range toggles: 1M, 3M, 1Y, ALL. Current price, daily change (%), and volume above the chart.
- Stock data fetched from a cached data source (MSE API). "Last Updated" timestamp visible.
- Stock chart is fully public (no gating). This is SEO content.
- `FinancialPerformanceWidget` (audited): multi-year table showing Balance Sheet, P&L, Cash Flow.
- Financial data is public during the trial period. Post-trial, gating rules TBD.

*Edge Cases:*
- No stock data available: hide the MarketDataWidget entirely.
- Cached stock data older than 7 days: display warning "Market data may be outdated. Last updated: [date]."
- No financial reports: display "Financial data not yet available."

---

**Story 2.4: Private Company Widgets**

As an investor viewing a private company, I need to see self-reported financials and fundraising info so I can evaluate private investment opportunities.

*Acceptance Criteria:*
- `FinancialPerformanceWidget` (self-reported): flexible table with available fields only (Revenue, EBITDA, Net Income, Total Assets, Total Debt, Employee Count, plus custom fields). Empty columns hidden.
- `DealActionWidget` (raising variant): displays if the entity is actively raising. Shows raising round, amount seeking, and "Request Connection" button (links to Epic 5).
- `CapitalStructureWidget`: equity round history. Bond linking deferred to v1.1 (when Bond Scanner ships).

*Edge Cases:*
- Zero financial reports: "This company has not yet shared financial data."
- Actively raising but no dollar amount: display round name with "Amount Undisclosed."

---

**Story 2.5: Project Widgets (Mining/Energy)**

As an investor viewing a mining or energy project, I need to see technical specs specific to the project type so I can evaluate the asset.

*Acceptance Criteria:*
- `ProjectTechnicalWidget` renders a key-value table from the project's tech specs.
- Adapts by project type:
  - MINING: Commodity, Resource Classification, Reserves, Grade, Life of Mine, License info.
  - ENERGY: Energy Type, Capacity (MW), PPA Status, Grid Connection.
  - Exact field lists to be finalized with CMM team.
- Project stage displayed as a colored badge in the entity header.
- Project economics section: CAPEX, IRR, NPV.
- `OwnershipListWidget` shows parent company/sponsor relationships (list format, see Story 2.7).
- `DealActionWidget` displays if entity is actively raising.

*Edge Cases:*
- Empty tech specs: "Technical specifications not yet available."
- Project type mismatch with tech spec fields: render only matching fields, log the discrepancy.

---

**Story 2.6: Service Provider Profiles**

As an investor, I need to find legal, audit, and advisory firms operating in Mongolia so I can engage support for my investment.

*Acceptance Criteria:*
- Minimal widget set: entity header with specialization tags, key personnel, contact info (email, phone, website).
- No financial widgets, no tech specs, no analyst insights.
- Fully public, no gated data. Service providers exist for discoverability, not monetization.
- Contact variant of the action widget: direct contact info, no "Request Connection" button.

*Edge Cases:*
- No team members: hide personnel widget, show header + contact only.
- No contact info: "Contact information not available. Reach out to CMM for assistance."

---

**Story 2.7: Ownership Network**

As an investor, I need to see ownership and sponsor relationships between companies and projects so I can understand the capital network.

*Acceptance Criteria:*
- `OwnershipListWidget` displays relationships as a structured list (no graph visualization in v1).
- On a company profile: shows owned/sponsored projects.
- On a project profile: shows sponsors/owners.
- Each entity name is clickable, navigates to that entity's profile.
- Relationship labels: role (Owner, Sponsor, Contractor) and ownership percentage if available.
- Fully public (no gating).

*Edge Cases:*
- Zero relationships: hide the widget.
- Relationship references a deleted/archived entity: skip it, log the orphan.

*Note:* Interactive graph visualization deferred to v1.1. List view covers the core use case and is simpler to build and maintain.

---

**~~Story 2.8: Bond Scanner~~ (Moved to v1.1)**

*Deferred to v1.1. Bond data source undefined and engineering capacity needed elsewhere. See Out of Scope section.*

---

**Story 2.9: AI Profile Generation Pipeline**

As CMM, I need entity profiles generated from public sources so the directory has value at launch.

*Acceptance Criteria:*
- Launch target: 100 verified entity profiles. Additional profiles added incrementally post-launch (target: 20-30 new profiles per week).
- AI pipeline runs as a supervised batch process. Dulguun runs the pipeline, reviews raw output, and loads candidates into CMS as DRAFT. Not a fully automated system.
- Pipeline scrapes public data (MSE filings, government registries, company websites, news) and generates structured entity profiles.
- Each generated profile includes: name, description, sector, entity type, and available financial/technical data.
- Every data point must include source attribution (e.g., "Source: MSE Annual Report 2025", "Source: Company website"). No unsourced financial figures.
- Profiles display disclaimer: "Compiled from public sources. Last verified: [date]. Report an error."
- No forward-looking statements, price targets, or advisory language in AI-generated text. This is architecturally enforced in the prompt templates.
- Profiles enter the system in DRAFT status. CMM analysts review and approve before they go LIVE.
- Technical pipeline specification owned by Dulguun (separate technical PRD).

*Analyst Quality Gate:* Every profile must be reviewed by a CMM analyst before going LIVE. Analyst checklist per profile:
1. Company name and description accurate
2. Financial figures verified against cited source
3. Sector and entity type correct
4. No hallucinated or unsourced claims
5. Disclaimer and source attributions present

Estimated analyst throughput: 10-15 profiles/day per analyst. Two analysts reviewing full-time can verify 100 profiles in ~4 days. Plan for a dedicated review sprint before launch.

*Edge Cases:*
- Insufficient public data for a meaningful profile: mark as "Insufficient Data" and skip.
- Duplicate entities detected: flag for analyst review.
- AI-generated content contains obvious errors: analyst review gate catches these before publish.
- Company disputes their profile: process via dedicated email (see Legal section). Correct or remove within 5 business days.

*Open Decision:*
- Legal review of publishing AI-generated profiles about companies without their consent. Disclaimer language and dispute resolution process to be finalized.
- Priority list of which 100 entities to profile first (recommendation: MSE-listed public companies first, then top private companies by CMM deal flow).

---

**Story 2.10: Request Connection Widget**

As an investor viewing an entity profile, I need a way to request an introduction so I can connect with the company.

*Acceptance Criteria:*
- "Request Connection" button displayed on entity profiles (except Service Providers, which show direct contact info).
- Registered users only. Guests see the button but clicking triggers a registration prompt.
- Button opens a form (form logic and submission handled by Epic 5: Concierge).
- Rate limit: 10 connection requests per user per day.

*Edge Cases:*
- Duplicate requests to the same entity are allowed (different messages may have different intent).

---

**Story 2.11: Key Personnel**

As an investor, I need to see who leads a company so I can evaluate the management team.

*Acceptance Criteria:*
- People are stored as standalone records linked to entities via roles (title, role type, start date).
- `KeyPersonnelWidget` on entity profiles shows team members: name, title, photo, short bio.
- Each person can be linked to multiple entities (e.g., a board member sitting on two companies).
- Data model supports standalone people pages in a future release. For v1, people are only visible as a widget on entity profiles.

*Edge Cases:*
- Entity has no personnel records: hide the widget.
- Person has no photo: display initials placeholder.
- Person linked to multiple entities: all associations stored, displayed contextually per entity.

---

### Epic 3: Market Feed

**Business Value:** Turns Market IQ from a static directory into a living intelligence platform. Automated news discovery and entity linking gives investors a reason to come back daily. The feed is the seed that grows into the AI-powered workspace in v2.

---

**Story 3.1: Feed Index Page**

As an investor, I need a market news feed so I can stay current on Mongolian market developments.

*Acceptance Criteria:*
- Feed page at `/feed` displays a chronological stream of news items.
- Filterable by sector, linked entity, date range.
- Each item shows: headline, source name, publish date, summary snippet, linked entity chips.
- SSR for SEO.
- Pagination or infinite scroll.

*Edge Cases:*
- No news items for applied filters: "No news found for your filters."
- Feed is empty (pipeline hasn't run yet): "Market Feed is being set up. Check back soon."

---

**Story 3.2: News Item Cards**

As an investor, I need to read news and navigate to the original source so I can get the full story.

*Acceptance Criteria:*
- News items display as cards with: headline, source, date, summary, entity chips.
- Clicking the headline or a "Read Original" link opens the original article URL in a new tab.
- Market IQ does not host the full article text. It links to the original source.
- Entity chips are clickable and navigate to the entity profile.

*Edge Cases:*
- Original source URL is broken/dead: show the card but display "Original source unavailable" instead of the link.
- News item has no linked entities: display without entity chips.

---

**Story 3.3: Entity-News Widget**

As an investor viewing an entity profile, I need to see recent news about that entity so I get a complete picture.

*Acceptance Criteria:*
- "Market News" section on entity profiles shows news items linked to that entity.
- Displayed separately from the "CMM Content" section (which shows CMM-authored insights).
- Max 5 items, sorted by date descending. "View All" link filters the feed page to that entity.
- Each item shows: headline, source, date, outbound link.

*Edge Cases:*
- Entity has no linked news: hide the "Market News" section.

---

**Story 3.4: AI News Pipeline (Automated)**

As a platform, I need an automated pipeline that discovers, processes, and links news to entities so the feed stays fresh without manual work.

*Acceptance Criteria:*
- 7-step AI-powered pipeline handles: source discovery, web crawling, content extraction, entity matching, confidence scoring, storage, and feed publishing.
- This is the one fully automated AI pipeline in v1. It runs on a schedule without manual triggering.
- Pipeline runs frequently (exact frequency to be determined after testing).
- High-confidence entity links publish automatically to the feed.
- Low-confidence entity links flagged for analyst review (see Story 3.5).
- Deduplication logic: detect and skip duplicate articles from multiple sources covering the same story.
- Technical specification owned by Dulguun (separate technical PRD).

*Note:* Unlike the profile generation pipeline (supervised batch) and content-entity tagging (supervised batch), the news pipeline must be automated because feed freshness is the core value proposition. The analyst review gate on low-confidence items (Story 3.5) provides the quality check.

---

**Story 3.5: Analyst Review Interface**

As a CMM analyst, I need to review flagged news items so I can correct entity links or remove irrelevant content.

*Acceptance Criteria:*
- Simple review interface (can be within Payload CMS or a lightweight custom view).
- Shows news items flagged as low-confidence by the pipeline.
- Analyst can: approve entity links, edit entity links, reject the news item.
- Approved items go live. Rejected items are hidden from the feed.

*Analyst Quality Gate:* Low-confidence news items do not appear in the public feed until an analyst approves them. High-confidence items publish automatically. Analysts should review the flagged queue at least once daily.

*Edge Cases:*
- High volume of flagged items: sortable by confidence score so analysts prioritize the worst matches.

---

### Epic 4: Events (MIF & Other Events)

**Business Value:** MIF (Mongolia Investment Forum) is CMM's flagship event, run 4 times a year. Events are CMM's strongest brand asset and a major lead source. The events section drives registrations, showcases credibility, and connects the platform to CMM's offline business.

---

**Story 4.1: Events Landing Page**

As a visitor, I need to see upcoming CMM events so I can decide which ones to attend.

*Acceptance Criteria:*
- Events page at `/events` displays upcoming and past events.
- Upcoming events featured prominently with: event name, date, location, short description, registration CTA.
- Past events listed below in reverse chronological order.
- Supports multiple event types (MIF, webinars, earnings calls, smaller forums). Data model is generic.
- SSR for SEO.

*Edge Cases:*
- No upcoming events: display "No upcoming events. Check back soon." with past events still visible below.

---

**Story 4.2: Event Detail Page**

As a potential attendee, I need to see full event details so I can decide whether to register.

*Acceptance Criteria:*
- Detail page at `/events/[slug]`.
- Displays: event name, date/time, location/venue, full description, agenda/schedule, speakers, sponsors (if any), registration CTA.
- Past events show the same info but with "This event has ended" and no registration CTA.
- SSR for SEO.

*Edge Cases:*
- Event with no agenda yet: hide the agenda section, show "Agenda coming soon."
- Event with no speakers listed: hide the speakers section.

---

**Story 4.3: Event Registration**

As an investor, I need to register for an event so I can secure my spot.

*Acceptance Criteria:*
- Custom registration form on the event detail page (not a third-party embed).
- Form fields configurable per event in CMS (at minimum: name, email, company, title, country).
- Confirmation email sent on successful registration.
- Registration list accessible to CMM admins in the CMS/admin.
- Registration can be open (anyone) or gated (registered platform users only), configurable per event.

*Edge Cases:*
- Registration is closed (event is full or past deadline): display "Registration closed" instead of the form.
- Duplicate registration (same email): "You're already registered for this event."
- Email delivery failure: registration still saved in the system. Log the email error.

---

**Story 4.4: Past Event Archive**

As a visitor, I need to browse past events so I can see CMM's track record and access recorded content.

*Acceptance Criteria:*
- Past events browsable from the events landing page and individually at `/events/[slug]`.
- Past event pages can include: recap/summary text, photo gallery, embedded YouTube videos (recorded sessions), speaker list.
- Content managed through Payload CMS.

*Edge Cases:*
- Past event with no recap content: show basic event info (date, location, description) only.
- Embedded YouTube video unavailable: show placeholder with "Video unavailable."

---

**Story 4.5: Speaker Profiles**

As a visitor, I need to see who's speaking at an event so I can evaluate the quality of the lineup.

*Acceptance Criteria:*
- Speaker cards on event detail pages: name, title, company, headshot, short bio.
- Where a speaker is associated with an entity in the directory, their name links to the entity profile.
- Speakers managed as a collection in Payload CMS, reusable across events.

*Edge Cases:*
- Speaker with no headshot: display initials placeholder.
- Speaker's linked entity has been archived: show speaker info without the entity link.

---

### Epic 5: Concierge (Lightweight)

**Business Value:** Converts platform engagement into qualified leads for CMM's advisory business. Every introduction is a potential deal. v1 keeps it intentionally simple: form submission triggers an email to CMM analysts. No workflow engine, no status tracking, no CRM integration. That comes later.

---

**Story 5.1: Connection Request Form**

As a registered investor, I need to request an introduction to a company so I can explore investment opportunities.

*Acceptance Criteria:*
- "Request Connection" button on entity profiles (rendered by Epic 2, Story 2.10) opens a form.
- Form fields: name (pre-filled from profile), email (pre-filled), company, message (free text), investment ticket size (optional dropdown: <$1M, $1-5M, $5-25M, $25M+).
- Registered users only. Guests cannot submit.
- Rate limit: 10 requests per user per day. After limit: "You've reached the daily request limit. Try again tomorrow."
- On submission: email sent to CMM analyst team (Story 5.3), user sees confirmation (Story 5.2).

*Edge Cases:*
- User submits a request for an entity they already requested today: allow it (different messages may have different intent).
- Form submission fails (network error): show "Something went wrong. Please try again."

---

**Story 5.2: Submission Confirmation**

As an investor, I need confirmation that my request was received so I know CMM will follow up.

*Acceptance Criteria:*
- On successful submission, display: "Your request has been submitted. A CMM team member will follow up."
- No status tracking in v1. No portal view of past requests. Fire and forget.

---

**Story 5.3: Analyst Email Notification**

As a CMM analyst, I need to receive connection request details by email so I can facilitate the introduction.

*Acceptance Criteria:*
- On form submission, an email is sent to a configurable analyst team email address.
- Email contains: requester name, email, company, message, ticket size, entity name, link to entity profile on the platform.
- Analysts handle the rest offline (email intros, calls, etc.).

*Edge Cases:*
- Email delivery fails: log the error. The request data is still stored in the database for manual retrieval.

---

### Epic 6: Supporting Infrastructure

**Business Value:** Everything that makes the platform functional. Auth, admin, portal, SEO, performance, analytics, and the foundational systems that every other epic depends on.

---

**Story 6.1: Authentication (Clerk)**

As a visitor, I need to create an account and log in so I can access registered-user features.

*Acceptance Criteria:*
- Sign up via email + password or Google OAuth. Powered by Clerk. LinkedIn OAuth deferred to post-launch.
- Registration captures: name, email, company name (optional), country (optional).
- Email verification required before accessing gated features.
- Three user roles: Owner (CMM leadership), Admin (CMM analysts), Investor (platform users).
- Session management handled by Clerk.

*Edge Cases:*
- Email already exists: "An account with this email already exists. Please log in."
- OAuth fails mid-flow: redirect to registration with "Social login failed. Please try again or use email."
- Clerk service unavailable: "Authentication service is currently unavailable. Please try again shortly."

---

**Story 6.2: User Portal**

As a registered investor, I need a basic profile page so I can manage my account.

*Acceptance Criteria:*
- Portal at `/portal`.
- View and edit: name, company name, country.
- View registered events (linked to Epic 4).
- Password change handled via Clerk's hosted UI.

*Edge Cases:*
- Email change requires verification of the new email before taking effect.

---

**Story 6.3: Admin via Payload CMS**

As a CMM admin, I need to manage content, entities, users, and events through Payload CMS.

*Acceptance Criteria:*
- Payload CMS serves as the admin panel for v1. No custom admin build.
- Admins can: manage content (Insights), manage entities (create, edit, review AI profiles), manage events, view registered users, manage speakers, manage news feed items.
- Owner and Admin roles have CMS access. Investors do not.

---

**Story 6.4: SEO Fundamentals**

As a platform, I need strong SEO foundations so organic traffic becomes a growth channel.

*Acceptance Criteria:*
- SSR on all public pages: directory, entity profiles, insights, feed, events, bonds.
- Dynamic meta tags and Open Graph per page (title, description, image).
- Structured data (JSON-LD) for entities, articles, and events.
- Auto-generated sitemap at `/sitemap.xml`.
- Clean URL structure with readable slugs.
- Robots.txt properly configured.

---

**Story 6.5: Mobile Responsiveness**

As a user on a phone or tablet, I need the platform to be functional so I can browse on any device.

*Acceptance Criteria:*
- All pages responsive across desktop, tablet, and mobile breakpoints.
- Desktop-first design (primary audience works on large screens).
- Touch-friendly interactive elements on mobile.
- Tables (financials, bonds) horizontally scrollable on small screens.
- Charts readable on mobile (simplified if needed).

---

**Story 6.6: Navigation & Layout**

As a user, I need consistent navigation so I can move between sections without confusion.

*Acceptance Criteria:*
- Global navigation bar shared across all pages: Directory, Insights, Market Feed, Events.
- User menu: login/register (guests), profile/portal/logout (registered).
- Footer with: about CMM, contact, legal links, social media.
- Consistent page layout shell across all sections.
- Mobile: hamburger menu.

---

**Story 6.7: Landing Page**

As a first-time visitor, I need to understand what Market IQ is so I can decide whether to explore further.

*Acceptance Criteria:*
- Landing page at `/`.
- Communicates: what Market IQ is, who it's for, key value propositions.
- CTAs to: browse directory, read latest insights, register.
- Highlights: number of entities listed, latest research, upcoming events.
- SSR for SEO.
- Clean, modern design consistent with the platform's visual identity.

---

**Story 6.8: CRM Event Payloads**

As CMM, I need key platform actions to fire events to our CRM so we can track user engagement and follow up.

*Acceptance Criteria:*
- Key actions fire CRM event payloads:
  - User registration (signup method, country, company).
  - Connection request submitted (entity, ticket size).
  - Event registration (event name, attendee info).
  - Content download (PDF, content ID).
- Events sent via a generic, vendor-agnostic event queue (one-way: platform to CRM).
- CRM vendor TBD. Event payloads are structured JSON, adaptable to any CRM.
- If the CRM event write fails, it must not block the user action. Log the error and retry via background job.

*Open Decision:*
- Which CRM CMM will use. The event queue is designed to be vendor-agnostic so this can be decided later.

---

**Story 6.9: PostHog Analytics Integration**

As a PM, I need product analytics so we can track user behavior and make data-driven decisions.

*Acceptance Criteria:*
- PostHog integrated across the platform.
- Page views tracked automatically.
- Key events tracked: registration, login, directory search, entity profile view, content read, PDF download, connection request, event registration, language switch.
- User identification: logged-in users identified by user ID with properties (role, company, country).

---

## 4. Success Metrics

### Primary Metrics (first 3 months post-launch)

| Metric | Target | Why it matters |
|--------|--------|----------------|
| Registered users | 500 | Validates demand and conversion from guest |
| Guest-to-registration conversion rate | > 5% | Proves the metered paywall and content drive signups |
| Entity profiles live | 100 at launch, 250+ by month 3 | Quality over quantity. Incremental growth proves the pipeline works. |
| Weekly active users (registered) | 100 | Users are coming back, not just signing up |
| Content pieces published (new + migrated) | 200+ | Content library is substantial |
| Connection requests submitted | 50 | Concierge flow is being used |
| Connection requests leading to advisory conversations | Track from day 1 | The business outcome metric. Connects platform to CMM revenue. |
| Market Feed items | 1,000+ | Feed is active and fresh |

### Secondary Metrics (tracked from day 1, targets set after 3 months of data)

| Metric | Notes |
|--------|-------|
| Pages per session | Are users exploring or bouncing? |
| Directory search usage | Which filters, which sectors are popular? |
| Content read depth | Are users reading full articles or just teasers? |
| Entity profile views per user | How deep do users go? |
| Top entities by page views | Which companies get the most attention? |
| Event registration rate | Conversion from event page view to registration |
| SEO traffic | Organic growth over time |

### How We'll Track

- PostHog for product analytics and user behavior
- Payload CMS for content metrics (publish frequency, review throughput)
- CRM event payloads for engagement tracking
- Google Search Console for SEO performance

---

## 5. Open Decisions

| Decision | Owner | Deadline | Notes |
|----------|-------|----------|-------|
| Content types taxonomy | Zane + CMM team | April 14 | Working set: Articles, Monthly Updates, Press Releases, Comprehensive Guides |
| Mining/Energy tech spec field lists | CMM team | April 14 | Exact fields for ProjectTechnicalWidget |
| CRM vendor selection | CMM leadership | Before launch | Event queue is vendor-agnostic, but need to pick a CRM |
| Payment solution research | Zane | Q3 2026 | For post-trial monetization. Custom invoices for early paying clients. |
| Legal review of AI-generated profiles | CMM leadership | April 21 | Disclaimer language, dispute resolution, data protection compliance. Must be done before AI pipeline runs. |
| Market Feed gating | Zane | Before launch | Public for SEO vs. gated for conversion. Recommendation: public. |
| Connection request qualifying questions | CMM team | April 14 | What info does CMM need to qualify an intro? |
| Hosting/deployment platform | Dulguun | April 7 (Week 1) | Vercel vs self-hosted. Payload CMS on Vercel has serverless constraints. |
| Email service provider | Dulguun | April 7 (Week 1) | Resend or SendGrid for event confirmations and analyst notifications. |
| MSE API validation | Dulguun | April 7 (Week 1) | Spike to confirm API exists, is accessible, returns needed data. Fallback: manual CMS entry. |
| Terms of Service + Privacy Policy | Zane + legal counsel | Before launch | Must cover multi-jurisdiction users (GDPR, PDPO, MAS). Cannot launch without. |
| Distribution plan | Zane | Before launch | CMM network outreach, MIF event promotion, LinkedIn/industry channels. Needed to hit 500 registration target. |
| Monthly email digest | Zane | Before launch | Low-cost re-engagement mechanism. Needed to hit 100 WAU target. Platform is used sporadically, not daily. |
| Entity profile priority list | Zane + CMM team | April 14 | Which 100 entities to profile first. Recommendation: MSE-listed public companies, then top private by deal flow. |

---

## 6. Out of Scope (Explicit)

These are explicitly not in v1. Not forgotten, just deferred.

| Feature | When |
|---------|------|
| AI Conversation Workspace | v2 |
| Subscription / payment system | Post-trial (Q3/Q4 2026) |
| QPay (Mongolian payment) | Post-trial |
| Watchlist & alerts | v2 |
| PDF export from AI workspace | v2 |
| Enterprise self-management (company reps editing their own profiles) | v2+ |
| Bond Scanner (`/bonds`) | v1.1 (data source and ingestion need definition) |
| Network Graph visualization | v1.1 (list view ships in v1, interactive graph deferred) |
| LinkedIn OAuth | Post-launch (ship with Google + email first) |
| Chinese Localization (Simplified Mandarin) | v1.1 |
| Standalone people pages (`/people/[slug]`) | v1.1 |
| Agentic monitoring / alerts engine | v2 |
| Native mobile apps | Not planned |
| Mongolian language | Cut. Chinese prioritized instead. |
| Two-way CRM sync | Not planned for v1 |

---

## 7. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| AI-generated profiles contain errors | Reputational damage to CMM's advisory business, legal exposure | Every profile verified by analyst before going LIVE. Source attribution on all data points. "Compiled from public sources" disclaimer. Legal review before pipeline runs. |
| Analyst review becomes bottleneck | Delays launch or post-launch growth | Launch target reduced to 100 profiles (4-day review sprint for 2 analysts). Post-launch cadence: 20-30 new profiles/week. |
| CMM leadership requests additional scope | Timeline slips | Scope locked in this PRD. Written sign-off from CMM executives before sprint 1. New requests go to v1.1 backlog. |
| Market Feed pipeline quality | Bad entity links, irrelevant news | Low-confidence items held for analyst review. High-confidence items auto-publish. Pipeline tuned iteratively post-launch. |
| Content migration quality | Broken formatting, missing images | Dulguun writes migration script. Analysts own QA and formatting fixes. Dedicated review sprint. |
| May 26 deadline too tight | Ship a bad v1 | Scope cuts made (bond scanner, graph viz, LinkedIn OAuth, auto-tagging). Date flexible to June if quality isn't there. |
| Financial content construed as investment advice | Regulatory action in HK/Singapore/US | No forward-looking or advisory language in AI prompts. Disclaimers on all pages with financial data. Securities regulatory opinion to be obtained. |
| MSE API unreliable or unlicensed | No stock data for public company widgets | Spike MSE API in Week 1. Fallback: manual data entry via CMS. Verify redistribution license. |

---

## 7.1 Analyst Quality Gates

Summary of all points where CMM analysts must review before content goes live:

| Gate | What | Who Reviews | Throughput Estimate |
|------|------|-------------|---------------------|
| Entity profile publish | AI-generated profiles go DRAFT to LIVE | CMM Analyst | 10-15 profiles/day/analyst |
| Content migration QA | Migrated articles checked for formatting, tags, broken media | CMM Analyst | 15-20 articles/day/analyst |
| Content-entity tagging | AI-suggested entity tags on Insights content | CMM Analyst | Reviewed at publish time, ~5 min/article |
| News feed low-confidence items | Flagged news items with uncertain entity links | CMM Analyst | Daily queue review, ~30 min/day |
| Content publishing | New Insights content goes Draft to In Review to Published | CMM Analyst (draft) + Admin/Owner (publish) | Per CMS workflow |
| Event management | Event details, speaker info, registration config | CMM Analyst | Per event setup |

*Capacity note:* Two analysts splitting these gates. Peak load is pre-launch (100 profiles + 150 migrated articles in parallel). Post-launch, the daily load is manageable: news queue review (~30 min), occasional new profiles, and standard content publishing.

---

## 8. Team & Responsibilities

| Person | Role | Owns |
|--------|------|------|
| Zane | PM | PRD, scope management, stakeholder management, PostHog setup, QA |
| Ganaa | Design Engineer | All frontend, UI/UX, responsive design, SEO implementation, accessibility (WCAG 2.1 AA baseline, keyboard navigation, axe-core in dev), loading states and error handling across all pages (skeleton placeholders per widget, per-widget error isolation, no single widget failure crashes a page) |
| Dulguun | Backend / AI Developer | Backend API, AI profile pipeline (separate technical PRD), Market Feed pipeline (separate technical PRD), Payload CMS setup, Clerk integration, CRM event queue, email service integration (Resend or SendGrid for transactional emails) |
| CMM Analysts (2) | Content & Data | Content migration, article publishing, AI profile review, Market Feed review, event management |
| CMM Graphic Designer (1) | Visual Design | Brand assets, event graphics, marketing materials |
| CMM Executives (2) | Stakeholders | Sign-off on scope, content type decisions, legal review, CRM vendor selection |

---

**Document History**

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-03-30 | Initial v1 release PRD |
| 1.1 | 2026-03-30 | Post-review panel update. Scope cuts: Bond Scanner, Network Graph viz, LinkedIn OAuth, AI auto-tagging deferred. Profile target reduced to 100 verified (from 500-1000). AI pipelines clarified: News = automated, all others = supervised batch. Analyst quality gates added throughout. Business outcome metric added. Risks updated. |
| 1.2 | 2026-03-30 | Paywall UX specified (counter, inline wall, post-reg redirect). Connection request contradiction resolved (duplicates allowed). Accessibility and loading states assigned to Ganaa. Open Decisions expanded with real deadlines and Week 1 engineering spikes. Email service and distribution plan added. |
