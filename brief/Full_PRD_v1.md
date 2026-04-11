# PRD: CMM Market IQ Platform v1.0

**Version:** 1.0
**Date:** February 2026
**Status:** Source of Truth -- Vendor Accountability Document
**Companion Document:** CMM System Architecture v1.0

---

## 1. Macro Objective & Scope

### Objective
Build the v1 production release of CMM Market IQ -- a dual-sided intelligence platform that aggregates vetted Mongolian market data for global investors (demand) and provides premium listing visibility for local projects and companies (supply). The platform transitions CMM from an event organizer to a tech-enabled deal maker, driving high-margin advisory services through qualified lead generation.

### In Scope
- 10 functional epics (Identity, Knowledge Bank, Deal Directory, Concierge, Supply Funnel, Admin, Monetization, Search, Events, User Portal)
- Headless CMS integration for content publishing
- Stripe + QPay payment processing
- CRM event abstraction layer (vendor-agnostic)
- Sponsorship/ad management system
- Server-side paywall enforcement
- SEO-optimized public pages (SSR)
- i18n framework (English first, Mongolian-ready structure)
- Mobile-responsive design

### Out of Scope (Strict)
- Investor profile directory (investors are not publicly listed)
- Self-service profile editing by listed companies (all entity data is CMM-managed in v1)
- Multiple subscription tiers (binary: Free vs. Subscriber vs. Enterprise manual grant)
- Two-way CRM sync (one-way: Platform → CRM only via event queue)
- Mongolian language content (i18n code structure only; no translated strings in v1)
- Native mobile applications
- Real-time chat or messaging between investors and companies
- Automated financial data import (except stock price cache via API)
- Payment upgrade/downgrade flows (not applicable; single tier)

---

## 2. System Architecture & Data Flow

Refer to companion document: **CMM System Architecture v1.0**

Covers: component architecture, database schemas, layout config engine, JSONB validation, entitlement matrix, CRM event queue, cross-epic data flows, URL routing map.

---

## 3. Epics & User Stories

---

### Epic 1: Identity & Access (The Gatekeeper)

**Business Value:** Every action on the platform requires knowing who the user is and what they've paid for. This epic establishes the authentication layer, role-based access, and the paywall enforcement system that every other epic depends on.

---

**Story 1.1:** As a visitor, I need to sign up via Email or LinkedIn/Google, so that I can access gated platform features.

*Acceptance Criteria:*
- Registration form collects: Name, Email, Company Name (optional), Country (optional).
- User can register via email + password OR LinkedIn OAuth OR Google OAuth via Clerk.
- On successful registration, a `users` record is created with `role = INVESTOR`, `subscription_tier = FREE`.
- A `USER_SIGNUP` CRM event is fired with: `{auth_provider, country, company_name}`.
- User is redirected to their portal dashboard after registration.
- Email verification is required before accessing gated features.

*Edge Cases & Error Handling:*
- If email already exists in the system, display: "An account with this email already exists. Please log in."
- If LinkedIn/Google OAuth fails mid-flow, redirect to registration page with: "Social login failed. Please try again or use email."
- If CRM event queue write fails, log the error but do NOT block registration. Event is retried by background job.
- If Clerk service is temporarily unavailable, display: "Authentication service is currently unavailable. Please try again in a few minutes." Do not offer a fallback auth method.

---

**Story 1.2:** As a free user viewing premium content, I need to see a visually clear "Locked" overlay on gated data, so that I understand the value of upgrading.

*Acceptance Criteria:*
- The NestJS Paywall Response Interceptor runs on every API response containing gated fields.
- For FREE users, the interceptor sets gated fields to `null` and adds `locked: true` to the response object.
- Gated fields include: `financial_data`, `tech_specs`, `analyst_insight.content` (truncated to 200 chars), `team_members` (for Private Companies), `capital_structure`.
- The frontend renders a blur overlay with a CTA button: "Unlock with Market IQ -- Subscribe" linking to `/pricing`.
- Financial table widgets show the table structure (headers, row labels) with cell values replaced by blurred placeholder blocks.
- The "Request Connection" button is visible to free users but clicking it opens a modal: "Subscribe to Market IQ to request introductions" with a "View Plans" button.
- Anonymous users (not logged in) see the same blur treatment as free users.

*Edge Cases & Error Handling:*
- If a user's subscription expires while they're mid-session, the next API call returns gated data. The frontend must handle the transition gracefully -- display blur overlay without a full page reload.
- If the interceptor encounters a data structure it doesn't recognize (e.g., a new widget), it must default to BLOCKING (strip the field). Never default to showing premium data.
- Rate limit the pricing page redirect to prevent abuse of the upgrade CTA as a navigation tool.

---

**Story 1.3:** As a registered user, I need to update my password and profile information, so that I can keep my account secure.

*Acceptance Criteria:*
- Profile settings page at `/portal` allows editing: Name, Company Name, Country.
- Password change is handled via Clerk's hosted UI or embedded component.
- Email change requires verification of the new email address before taking effect.
- Changes to Name, Email, or Company Name fire a `USER_UPDATED` CRM event.

*Edge Cases & Error Handling:*
- If email change is initiated but new email is already in use, display: "This email is already associated with another account."
- If password change fails Clerk's strength requirements, display Clerk's native error message.

---

**Story 1.4:** As a user navigating between the main platform and the Events subdomain (e.g., forum.cmm.mn), I need the system to recognize my session or at least track my referral source, so that my experience feels connected.

*Acceptance Criteria:*
- If SSO across subdomains is technically feasible with Clerk: implement shared session. User logs in once and is recognized on both domains.
- If SSO is not feasible: append a `ref=marketiq` query parameter to all outbound links to the events subdomain. The events subdomain must track this parameter for attribution.
- The main platform's navigation includes a link to the events subdomain that opens in a new tab.

*Edge Cases & Error Handling:*
- If the events subdomain is down, the link in the main platform's navigation must not break. Display the link normally; the browser handles the error.
- Cookie/session sharing across subdomains must comply with SameSite cookie policies. If third-party cookie restrictions prevent SSO, fall back to the referral parameter approach.

---

### Epic 2: The Knowledge Bank (Content Intelligence)

**Business Value:** Premium content is the primary engagement driver for investor subscribers and the main SEO funnel for organic traffic. Reports and news articles drive downloads (a key lead-scoring signal) and keep subscribers retained.

---

**Story 2.1:** As an investor, I need to browse and filter reports by Sector and Date, so that I can find relevant market intelligence quickly.

*Acceptance Criteria:*
- Report Library page at `/reports` displays all published content items of type REPORT and DEEP_DIVE from the Headless CMS.
- Each report card shows: Cover Image, Title, Sector Tag(s), Published Date, and a "Premium" badge if `is_premium = true`.
- Filter sidebar includes: Sector checkboxes (Mining, Energy, Banking, Real Estate, Technology, Agriculture, Other) and Date range picker.
- Reports are sorted by `published_at` descending by default.
- Page is SSR for SEO indexing.
- Pagination: 12 reports per page with "Load More" or numbered pagination.

*Edge Cases & Error Handling:*
- If the Headless CMS is temporarily unreachable, display a cached version of the report list (last successful fetch) with a subtle banner: "Content may not reflect the latest updates."
- If no reports match the applied filters, display: "No reports found for your filters. Try broadening your search." with a "Clear Filters" button.
- If a report has no cover image, display a default placeholder image per sector.

---

**Story 2.2:** As a free user, I need to read a report's Executive Summary but be blocked from accessing the full content, so that I understand the value of subscribing.

*Acceptance Criteria:*
- Report detail page at `/reports/[slug]` is SSR.
- For ALL users (including anonymous): the page displays Title, Author, Published Date, Cover Image, Sector Tags, and the `teaser_text` field (Executive Summary / first paragraph).
- For FREE/anonymous users: the full `body` is not rendered. A blur overlay appears below the teaser with CTA: "Subscribe to read the full report."
- For FREE/anonymous users: the "Download PDF" button is replaced with "Subscribe to download."
- The teaser text and metadata are fully indexable by Google.

*Edge Cases & Error Handling:*
- If a report's `teaser_text` is empty, display the first 300 characters of `body` as the teaser. The CMS should enforce `teaser_text` as required, but the frontend must handle the gap.
- If the report slug doesn't exist, return a 404 page.

---

**Story 2.3:** As a paid subscriber, I need to download full PDF reports, so that I can use the data in my investment analysis.

*Acceptance Criteria:*
- For SUBSCRIBER and ENTERPRISE users: the full report `body` renders below the teaser without any overlay.
- A "Download PDF" button is visible and functional. Clicking it initiates a browser download of the associated PDF file from the CMS.
- Every download fires a `PDF_DOWNLOAD` CRM event with: `{report_title, report_id, entity_ids}` (entity IDs from the report's `entity_references` field).
- Downloads are logged in a `download_logs` table or CRM events for the user's portal download history.

*Edge Cases & Error Handling:*
- If the PDF file URL from the CMS is broken or returns 404, display: "This PDF is currently unavailable. Please try again later." Log the error for admin notification.
- If the user's subscription expires between page load and download click, the backend must re-check entitlement before serving the file. Return 403 with: "Your subscription has expired. Please renew to download."
- Large PDFs (>50MB): ensure download does not timeout. Use streaming or pre-signed URL redirect.

---

**Story 2.4:** As an admin, when I publish a News article, I need it formatted for easy export to our newsletter tool, so that content distribution is efficient.

*Acceptance Criteria:*
- News articles published in the Headless CMS include a "Newsletter Ready" toggle.
- When toggled ON, the CMS generates a simplified HTML version of the article body (stripped of interactive elements, image-optimized) stored in a `newsletter_html` field.
- An API endpoint exists to fetch the latest "Newsletter Ready" articles in a format compatible with common newsletter tools (clean HTML or JSON).
- If a direct API integration with a specific newsletter tool is not available in v1, the admin can copy the simplified HTML from the CMS.

*Edge Cases & Error Handling:*
- If the newsletter HTML generation fails (e.g., unsupported rich text elements), flag the article in the CMS with a warning: "Newsletter format could not be auto-generated. Manual formatting required."

---

**Story 2.5:** As a user viewing an entity profile in the Deal Directory, I need to see a "Related Media" section showing linked reports and news, so that I can access all intelligence about that entity from one place.

*Acceptance Criteria:*
- The `RelatedMediaWidget` on entity profile pages queries the Headless CMS for content items where `entity_references` contains the current entity's UUID.
- Results display as a list: Title, Type badge (Report / News / Deep Dive / Press Release), Published Date.
- Reports marked `is_premium` show a lock icon for free users.
- Clicking a result navigates to the content detail page (`/reports/[slug]` or `/news/[slug]`).
- Maximum 5 items displayed, sorted by `published_at` descending. "View All" link if more exist (navigates to `/reports?entity=[slug]`).

*Edge Cases & Error Handling:*
- If the CMS is unreachable, the RelatedMediaWidget renders an empty state: "Related content is currently unavailable." It must NOT block the rest of the profile page from loading.
- If no content is linked to the entity, the widget is hidden entirely (not shown as empty).

---

### Epic 3: The Deal Directory (Supply Side)

**Business Value:** The core product. A high-performance, data-intensive directory that drives SEO traffic (public profiles), subscription revenue (gated financials), and lead generation (connection requests). Architected for speed on Mongolian 4G networks and strict security for premium financial data.

---

**Story 3.1:** As a developer, I need to build the Master Profile Engine that dynamically renders entity profiles based on a Layout Config, so that one codebase serves all entity types (Public Company, Private Company, Project, Service Provider).

*Acceptance Criteria:*
- Dynamic route at `/directory/[slug]` fetches the entity record from the API.
- The API response includes the `layout_config` JSONB field specifying which widgets to render.
- The frontend `ModuleRegistry` maps widget names to React components. Components are loaded via `next/dynamic` (code splitting) so unused widgets are not included in the bundle.
- The page renders the `EntityHeaderWidget` first (always present), then each subsequent widget in the order defined by `layout_config.widgets[]`.
- Page is Server-Side Rendered (SSR) for SEO.
- The `EntityHeaderWidget` renders differently based on entity type:
    - PUBLIC_COMPANY: Displays Stock Ticker (e.g., "MSE: TTL") next to the name.
    - PROJECT: Displays Project Stage badge (e.g., "Feasibility Study").
    - PRIVATE_COMPANY: Displays "Private Company" label.
    - SERVICE_PROVIDER: Displays "Service Provider" label + specialization tags.
- All entity types display: Logo, Name, Sector/Industry tags, Website link, Description.

*Edge Cases & Error Handling:*
- If the entity slug doesn't exist, return a proper 404 page with "Go to Directory" link.
- If the entity `status` is not `LIVE`, return 404 for public users. Admins can view DRAFT/UNDER_REVIEW entities via an admin preview mode.
- If `layout_config` contains a widget name not in the `ModuleRegistry`, skip it silently and log a warning. Never crash the page.
- If the entity has no logo, display a placeholder icon based on sector.

---

**Story 3.2:** As an investor viewing a Public Company profile, I need to see audited financial data and a stock price chart, so that I can assess the company's financial health.

*Acceptance Criteria:*
- `MarketDataWidget` renders an interactive stock price chart using Recharts or Chart.js.
- Chart data is fetched from `market_data_cache`. Time range toggles: 1D, 1W, 1M, 1Y.
- Current price, daily change (%), and volume are displayed above the chart.
- Stock chart is fully visible to ALL users (including free). This is SEO content.
- `FinancialPerformanceWidget` (AUDITED variant) displays: Balance Sheet, P&L, Cash Flow in a multi-year table format.
- Financial data is fetched from `financial_reports` where `report_type = AUDITED`.
- For FREE users: table structure is visible but all numeric cells are blurred. Backend returns `financials: null, locked: true`.
- For SUBSCRIBER/ENTERPRISE: full data rendered.
- A "Last Updated" timestamp is visible on the stock chart sourced from `market_data_cache.cached_at`.

*Edge Cases & Error Handling:*
- If `market_data_cache` has no data for this entity (MSE API never returned data): hide the `MarketDataWidget` entirely and fall back to the Private Company financial widget (self-reported data display) if `financial_reports` exist.
- If cached stock data is older than 7 days, display a warning: "Market data may be outdated. Last updated: [date]."
- If `financial_reports` has no rows for this entity, display: "Financial data not yet available" in the widget area.

---

**Story 3.3:** As an investor viewing a Private Company profile, I need to see self-reported financial data and any active fundraising information, so that I can evaluate private investment opportunities.

*Acceptance Criteria:*
- `FinancialPerformanceWidget` (SELF_REPORTED variant) displays a flexible table: Fiscal Year rows with columns for available fields (Revenue, EBITDA, Net Income, Total Assets, Total Debt, Employee Count, + up to 5 custom fields).
- Only fields with non-null values are shown. Empty columns are hidden.
- Custom fields from `financial_reports.custom_fields` JSONB render as additional columns with the `key` as the header.
- `DealActionWidget` (RAISING variant) displays if `entity.is_raising = true`:
    - Raising Round (e.g., "Series A")
    - Amount Seeking (e.g., "$5M USD")
    - "Request Introduction" button (see Epic 4 for backend flow)
- `CapitalStructureWidget` shows equity round history from `equity_rounds` table and linked bonds from `bonds` table.
- For FREE users: financial data blurred, capital structure blurred, DealActionWidget button triggers upgrade modal.

*Edge Cases & Error Handling:*
- If a Private Company has zero financial reports, display: "This company has not yet shared financial data."
- If `custom_fields` contains more than 5 entries, display only the first 5 and log a data integrity warning.
- If `is_raising = true` but `raising_amount_usd` is null, display the Raising Card without the dollar amount: "[Round Name] -- Amount Undisclosed."

---

**Story 3.4:** As an investor viewing a Mining or Energy project, I need to see technical specifications specific to the project type, so that I can evaluate the asset's potential.

*Acceptance Criteria:*
- `ProjectTechnicalWidget` reads `projects.tech_specs` JSONB and renders a key-value table.
- The widget adapts based on `projects.project_type`:
    - MINING: Displays fields like Commodity, Resource Classification, Reserves (Proven/Probable), Grade, Life of Mine, License info. (Exact field list finalized by CMM -- see Decision Log.)
    - ENERGY: Displays fields like Energy Type, Capacity (MW), PPA Status/Counterparty/Terms, Grid Connection. (Exact field list finalized by CMM -- see Decision Log.)
- Project Stage is displayed in the `EntityHeaderWidget` as a colored badge.
- Financial fields (CAPEX, IRR, NPV) from the `projects` table render in a separate "Project Economics" section within the widget.
- `DealActionWidget` displays if `entity.is_raising = true`.
- `NetworkGraphWidget` shows parent company/sponsor relationships from `project_stakeholders`.
- For FREE users: tech specs blurred, project economics blurred.

*Edge Cases & Error Handling:*
- If `tech_specs` JSONB is empty `{}` or fails validation, display: "Technical specifications not yet available for this project."
- If `project_type` is MINING but `tech_specs` contains Energy fields (data integrity issue), render only the fields matching the Mining schema and log the discrepancy.
- If `projects` row doesn't exist for a PROJECT entity (orphaned entity), display a generic "Project details coming soon" and log an error.

---

**Story 3.5:** As an investor viewing a Service Provider profile, I need to see their specialization and contact information, so that I can engage legal/audit support for my investment.

*Acceptance Criteria:*
- Service Providers render the minimal widget set: `EntityHeaderWidget` (STANDARD), `TeamWidget` (PARTNERS variant), `DealActionWidget` (CONTACT variant).
- The CONTACT variant of `DealActionWidget` displays: Email, Phone, Website link. No "Request Introduction" button.
- `EntityHeaderWidget` for Service Providers includes a `specialization_tags` field (rendered as pills/badges, e.g., "Mining Law", "Tax Advisory", "Audit").
- No financial widgets, no tech specs, no analyst insights, no network graph.
- Service Provider profiles are fully public (no gated data). They exist for discoverability, not monetization.

*Edge Cases & Error Handling:*
- If a Service Provider has no team members, hide the `TeamWidget` and display only header + contact.
- If contact info (email, phone, website) is entirely missing, display: "Contact information not available. Reach out to CMM for assistance."

---

**Story 3.6:** As a user viewing a Company profile, I need to see a visual representation of its ownership relationships, so that I can understand the capital network.

*Acceptance Criteria:*
- `NetworkGraphWidget` queries `project_stakeholders` table for relationships.
- On a Company profile: displays "Owned/Sponsored Projects" (outgoing edges to Projects).
- On a Project profile: displays "Sponsors/Owners" (incoming edges from Companies).
- Each node in the graph is clickable and navigates to that entity's profile page.
- Relationship labels show: Role (Owner, Sponsor, Contractor, etc.) and Ownership % if available.
- The graph is fully visible to ALL users (free and paid). This is discoverability content.
- If fewer than 3 relationships exist, render as a simple list instead of a graph visualization.

*Edge Cases & Error Handling:*
- If an entity has zero relationships, hide the widget entirely.
- If a relationship references a deleted or ARCHIVED entity, skip it in the rendering and log the orphan.
- Circular relationships (Company A owns Project B, which is sponsored by Company A) must not cause infinite loops in the graph renderer. De-duplicate edges.

---

**Story 3.7:** As an investor, I need a sortable table of active bonds with expandable details, so that I can evaluate fixed-income opportunities.

*Acceptance Criteria:*
- Bond Scanner page at `/bonds` displays a sortable, filterable table of all bonds from the `bonds` table.
- Table columns: Bond Name, Issuer (linked to Company profile), Coupon Rate, Yield, Maturity Date, Face Value, Currency, Status.
- Sortable by any column. Default sort: Maturity Date ascending.
- Filterable by: Status (Active/Matured/Defaulted), Issuer sector, Currency.
- Clicking a row expands a details drawer (slide-in panel) showing: full bond details, issuer company summary, and a link to the issuer's full profile.
- The table is visible to ALL users. Bond details in the drawer are gated for FREE users (blurred).
- Page is SSR for SEO.

*Edge Cases & Error Handling:*
- If the bonds table is empty, display: "No bonds currently listed. Check back soon."
- If a bond references an entity that no longer exists (issuer deleted), display the bond but show "Issuer: Unknown" instead of a broken link.
- If Maturity Date is null, display "N/A" in that cell.

---

**Story 3.8:** As an investor, I need a filterable directory index page to browse all entities, so that I can discover opportunities by sector, type, and deal status.

*Acceptance Criteria:*
- Directory Index page at `/directory` displays a card grid of all entities where `status = LIVE`.
- Each card shows: Logo, Name, Type badge, Sector, and "Actively Raising" badge if `is_raising = true`.
- Filter sidebar includes:
    - Entity Type checkboxes: Public Company, Private Company, Project, Service Provider.
    - Sector checkboxes: Mining, Energy, Banking, Real Estate, etc.
    - Deal Status toggle: "Show only Actively Raising" (filters where `is_raising = true`).
- A prominent banner at the top: "[X] companies actively raising capital -- [Show only raising →]" (auto-counted from database).
- Text search within the directory: searches `entities.name` and `entities.description` using PostgreSQL full-text search.
- Results paginated: 20 per page.
- Page is SSR with filter state encoded in URL query parameters (bookmarkable, shareable).

*Edge Cases & Error Handling:*
- If no entities match filters, display: "No results found. Try adjusting your filters." with a "Clear All Filters" button.
- If the database query is slow (>3s), implement server-side caching of the directory index with a 5-minute TTL.
- URL query parameter manipulation: validate all filter values server-side. Invalid values are silently ignored (do not error).

---

### Epic 4: The Concierge (Matchmaking)

**Business Value:** This is the revenue engine. The connection request workflow converts platform engagement into qualified leads for CMM's advisory business. Every intro is a potential deal. This epic owns the backend workflow; the UI trigger lives in Epic 3 and the admin review UI lives in Epic 6.

---

**Story 4.1:** As the system, when a paid subscriber submits a "Request Introduction" form on an entity profile, I need to create a tracked connection request and notify the CMM analyst team, so that the request is processed within the SLA.

*Acceptance Criteria:*
- The "Request Introduction" form (rendered by `DealActionWidget` in Epic 3) submits to the Connection Request API endpoint.
- Backend validates: user must be authenticated AND `subscription_tier` must be SUBSCRIBER or ENTERPRISE. Reject with 403 otherwise.
- A `connection_requests` record is created with `status = PENDING`.
- Form captures: Name (pre-filled from user profile), Email, Company, Message (free text), and one qualifying question (e.g., "Investment Ticket Size" -- dropdown with ranges: <$1M, $1-5M, $5-25M, $25M+). (Qualifying question TBD by CMM -- see Decision Log.)
- A `CONNECTION_REQUEST` CRM event is fired.
- An email notification is sent to the CMM analyst team (configurable email address in environment variables).
- The investor sees a confirmation: "Your request has been submitted. A CMM analyst will review it within [X] business days."

*Edge Cases & Error Handling:*
- If the user already has an active (non-resolved) connection request for the same entity, reject: "You already have a pending request for this entity."
- If the CRM event queue write fails, do NOT block the connection request creation. Log error and retry via background job.
- If the email notification fails to send, log error. The connection request still exists in the database and will appear in the admin queue.
- Rate limit: maximum 10 connection requests per user per day. Display: "You've reached the daily request limit. Please try again tomorrow."

---

**Story 4.2:** As the system, I need to manage the connection request lifecycle through defined states with notifications, so that investors and analysts have visibility into the process.

*Acceptance Criteria:*
- Connection request status transitions follow the state machine defined in the Architecture Document:
    - `PENDING` → `UNDER_REVIEW` (analyst assigns to self)
    - `UNDER_REVIEW` → `APPROVED` (analyst approves)
    - `UNDER_REVIEW` → `REJECTED` (analyst rejects with reason)
    - `APPROVED` → `INTRO_MADE` (analyst sends intro email to both parties)
- Each status change updates `connection_requests.updated_at`.
- When status changes to `APPROVED`: system sends email to investor: "Your introduction request to [Entity Name] has been approved. A CMM representative will facilitate the introduction."
- When status changes to `REJECTED`: system sends email to investor: "Your introduction request to [Entity Name] could not be facilitated at this time." (No reason shared externally.)
- When status changes to `INTRO_MADE`: system sends email to both investor and entity contact (sourced from `team_members` or admin-configured email) with a warm introduction template.
- The investor can view their connection request history and current statuses in their portal (Epic 10).

*Edge Cases & Error Handling:*
- If an analyst tries to transition a request to an invalid state (e.g., PENDING → INTRO_MADE), the API rejects with 400: "Invalid status transition."
- If the target entity has been ARCHIVED since the request was made, the analyst must be notified: "This entity is no longer active." Analyst can still reject the request with an appropriate message.
- If introduction emails bounce (invalid recipient), log the bounce and flag the connection request in the admin panel for manual follow-up.

---

### Epic 5: The Supply Funnel (Listing Portal)

**Business Value:** The supply-side intake mechanism. Companies and projects apply for listing through a structured process that ensures data quality and generates revenue (vetting fee + listing fee). CMM maintains full control over what goes live in the directory.

---

**Story 5.1:** As a project owner or company representative, I need to apply for a listing via a multi-step form, so that I can get my company/project visible to global investors.

*Acceptance Criteria:*
- "Apply for Listing" link in the site footer navigates to `/apply`.
- User must be logged in. If not, redirect to registration with a return URL to `/apply`.
- Multi-step wizard with progress indicator:
    - **Step 1 -- General Info:** Company/Project Name, Entity Type (Private Company / Project / Service Provider), Sector, Industry, Description, Website, Logo Upload.
    - **Step 2 -- Financial Info:** Fiscal Year, Revenue, EBITDA, Net Income, + up to 5 custom financial fields. (For Projects: CAPEX, IRR, NPV instead.)
    - **Step 3 -- Uploads:** Pitch Deck (required), Business License (required), Financial Statements (optional), Other documents. All files uploaded to AWS S3 private bucket.
    - **Step 4 -- Review & Submit:** Summary of all entered data. User confirms and submits.
- On submit: `listing_applications` record created with `status = SUBMITTED`, `application_data` JSONB stores all form data.
- `LISTING_APPLICATION` CRM event fired.
- User is redirected to listing status page in their portal.

*Edge Cases & Error Handling:*
- If the user navigates away mid-wizard, save progress as `status = DRAFT`. User can resume from their portal.
- File upload size limit: 25MB per file, 100MB total per application. Display: "File exceeds the 25MB limit. Please compress or split the file."
- Allowed file types: PDF, DOCX, XLSX, PNG, JPG. Reject others with: "Unsupported file type. Please upload PDF, DOCX, XLSX, PNG, or JPG."
- If S3 upload fails, display: "File upload failed. Please try again." Do not submit the application with missing files.
- If the user already has a SUBMITTED or UNDER_REVIEW application, block new submissions: "You already have an active listing application. Check its status in your portal."

---

**Story 5.2:** As a project owner, I need to securely upload confidential documents as part of my listing application, so that my pitch deck and licenses are protected.

*Acceptance Criteria:*
- All uploaded files are stored in an AWS S3 **private** bucket. They are NOT publicly accessible via URL.
- Files are only accessible via temporary signed URLs generated by the backend. Signed URLs expire after 15 minutes.
- Only the applicant user, assigned analyst, and admin users can request signed URLs for these files.
- Files are not indexed by search engines (no public URL, `robots.txt` exclusion on any file-serving endpoints).
- File metadata is stored in `data_room_files` table.

*Edge Cases & Error Handling:*
- If a signed URL is requested after expiry, generate a new one (not an error -- transparent to the user).
- If the S3 bucket is unreachable, display: "Document service is temporarily unavailable." Do not expose S3 error details to the user.
- Virus/malware scanning: if feasible in v1, scan uploaded files before storing. If not feasible, flag as a v2 requirement but ensure all files are served as downloads (never rendered inline in the browser) to reduce risk.

---

**Story 5.3:** As a project owner, after applying for a listing, I need to pay a vetting fee so that my application is reviewed by a CMM analyst.

*Acceptance Criteria:*
- After application submission (`status = SUBMITTED`), the user is presented with a QPay QR code for the vetting fee.
- Vetting fee amount is configured in the admin panel (not hardcoded).
- On payment confirmation from QPay callback: `listing_applications.vetting_fee_paid = true`, `status = VETTING_FEE_PAID`.
- Email notification sent to CMM analyst team: "New listing application ready for review: [Company Name]."
- If the user does not pay within 30 days, the application `status` transitions to `EXPIRED` via background job.

*Edge Cases & Error Handling:*
- If QPay callback fails or is delayed: provide a manual "I've already paid" button that flags the application for admin verification.
- If the QR code expires (QPay-specific timeout), generate a new one on page refresh.
- If the user pays twice (duplicate payment), log the duplicate and flag for admin reconciliation. Do not create a second application.

---

**Story 5.4:** As a project owner, I need to see the status of my listing application, so that I know what's happening with my submission.

*Acceptance Criteria:*
- Listing status is visible in the User Portal at `/portal/listing`.
- Displays: Application Name, Entity Type, Current Status (with visual state indicator), Submitted Date, Assigned Analyst Name (if applicable).
- Status values displayed in user-friendly language:
    - DRAFT → "Incomplete -- Resume your application"
    - SUBMITTED → "Submitted -- Awaiting vetting fee payment"
    - VETTING_FEE_PAID → "Payment received -- In queue for analyst review"
    - UNDER_REVIEW → "Under review by [Analyst Name]"
    - INFO_REQUESTED → "Action needed -- CMM has requested additional information"
    - APPROVED → "Approved -- Listing fee invoice pending"
    - REJECTED → "Not approved" (with analyst's external-facing reason if provided)
- If `status = INFO_REQUESTED`, display the analyst's message and a form to submit additional information or documents.
- This page is read-only. The user cannot edit the original application data after submission.

*Edge Cases & Error Handling:*
- If the user has no listing applications, display: "You haven't applied for a listing yet. [Apply Now →]."
- If the assigned analyst is removed from the system, display "CMM Team" instead of the analyst's name.

---

### Epic 6: Admin Command Center

**Business Value:** The internal operations hub. Without this, CMM cannot manage listings, publish content, vet connection requests, grant subscriptions, or manage advertising. This is the tool that makes CMM the "managed marketplace" operator.

---

**Story 6.1:** As an admin, I need to review pending listing applications and approve or reject them, so that only quality entities appear in the public directory.

*Acceptance Criteria:*
- Admin page at `/admin/listings` displays all listing applications in a filterable queue.
- Queue columns: Company Name, Entity Type, Sector, Status, Submitted Date, Assigned Analyst, Vetting Fee Paid.
- Filter by: Status, Entity Type, Assigned Analyst.
- Clicking an application opens a detail view showing: all `application_data`, uploaded documents (via signed S3 URLs), applicant user info.
- Admin actions:
    - **Assign to Analyst:** Select from list of ANALYST users.
    - **Request More Info:** Write a message that the applicant sees in their portal. Status → `INFO_REQUESTED`.
    - **Approve:** Creates a new `entities` record from `application_data`. Status → `APPROVED`. Admin then configures `layout_config`, sets entity `status = LIVE`, and invoices listing fee separately.
    - **Reject:** Write an external-facing reason. Status → `REJECTED`. Email sent to applicant.
- All admin actions are logged in an audit trail (admin user, action, timestamp, application_id).

*Edge Cases & Error Handling:*
- If an admin tries to approve an application without the vetting fee paid, block: "Vetting fee has not been confirmed for this application."
- If entity creation fails (e.g., duplicate slug), display error to admin and allow slug modification before retry.
- If two admins view the same application simultaneously, optimistic locking: the second admin to save sees "This application has been updated by another user. Please refresh."

---

**Story 6.2:** As an admin or content writer, I need to publish Reports, News, and manage Homepage featured content via the Headless CMS, so that the Knowledge Bank stays fresh.

*Acceptance Criteria:*
- Content management is performed in the Headless CMS admin panel (Strapi/Sanity).
- Content types configured: Report, News, Deep Dive, Press Release (as defined in Architecture Document).
- Each content item requires: Title, Slug (auto-generated), Type, Sector Tags, Body (rich text), and `is_premium` flag.
- The `entity_references` field allows admins to link content to one or more entity UUIDs from PostgreSQL. The CMS provides a search/autocomplete to find entities by name.
- The "Featured" widget on the Homepage is driven by `is_featured = true` on content items. Only one item per type should be featured at a time.
- Content preview is available before publishing.

*Edge Cases & Error Handling:*
- If an `entity_reference` UUID no longer exists in PostgreSQL (entity deleted), the CMS should display a warning but not block publishing. The `RelatedMediaWidget` will simply not show it.
- If two writers edit the same content item simultaneously, the CMS's native conflict resolution applies (last-write-wins or merge, depending on CMS choice).
- If the slug is already taken, auto-append a numeric suffix (e.g., `mongolian-gold-report-2`).

---

**Story 6.3:** As an admin, I need to manually activate a subscription for a user who paid via bank transfer or is an enterprise client, so that institutional clients get immediate access.

*Acceptance Criteria:*
- Admin page at `/admin/users` shows a searchable list of all users.
- Admin can view any user's profile: Name, Email, Role, Subscription Tier, Registration Date, Login Count, Download Count.
- Admin action: **Grant Subscription** -- Creates a `subscriptions` record with `payment_provider = MANUAL`, `status = ACTIVE`, configurable `expires_at` (or null for indefinite).
- Admin action: **Revoke Subscription** -- Sets subscription `status = CANCELLED` and user `subscription_tier = FREE`.
- Admin action: **Change User Role** -- Modify role (e.g., promote to ANALYST, set to COMPANY_REP).
- User sees their updated tier immediately on next page load (no logout/login required).

*Edge Cases & Error Handling:*
- If admin grants a subscription to a user who already has an active Stripe subscription, display warning: "This user has an existing Stripe subscription. Manual grant will override. Proceed?" (The system should stack: use the higher-access tier.)
- If admin revokes a subscription for a user mid-session, the paywall interceptor applies on the next API call. In-progress page views are not interrupted.
- All admin user actions logged in audit trail.

---

**Story 6.4:** As an admin, I need to author and publish Analyst Insight notes for entity profiles, so that CMM's expertise adds qualitative value to the directory.

*Acceptance Criteria:*
- Admin page at `/admin/insights` allows creating/editing Analyst Insights.
- Each insight is linked to one entity (selected via entity search/autocomplete).
- Content is authored in a rich text editor (Markdown or WYSIWYG).
- Publish toggle: DRAFT vs PUBLISHED. Only published insights appear on entity profiles.
- Published insights render in the `AnalystInsightWidget` on the entity's profile page.
- For FREE users: first 200 characters visible, rest blurred.
- Author attribution: displays the analyst's name on the widget.

*Edge Cases & Error Handling:*
- If multiple insights exist for the same entity, display only the most recent published one. Older insights are archived but retained in the database.
- If an insight is published for an entity that is not `LIVE`, the insight is saved but not rendered (no public profile to display on). Display a warning to the admin.
- If the linked entity is deleted, the insight becomes orphaned. Display in admin with a "Entity deleted" warning. Do not auto-delete insights.

---

**Story 6.5:** As an admin, I need to manage sponsorship banners (upload, schedule, track), so that CMM can sell ad space and promote internal events.

*Acceptance Criteria:*
- Admin page at `/admin/banners` displays all banners in a table: Title, Zone, Start Date, End Date, Impressions, Clicks, CTR, Is Active.
- Admin can create a new banner: Upload Image, Set Destination URL, Select Zone (HOMEPAGE_HERO, SIDEBAR, REPORT_FOOTER, DIRECTORY_BANNER), Set Start/End Dates, Toggle "Is Internal."
- Banners auto-expire after `end_date` (daily background job sets `is_active = false`).
- If no paid banner is active for a zone, the system falls back to the most recent "Is Internal" banner for that zone.
- Impression count increments every time the banner is rendered (server-side count, not client-side).
- Click count increments on click-through (backend endpoint for redirect tracking).
- Banners are served as first-party `<img>` tags (not `<script>` tags) to bypass ad blockers.

*Edge Cases & Error Handling:*
- If multiple active banners exist for the same zone at the same time, display the one with the most recent `start_date`. Do not rotate (v1 simplicity).
- If the banner image URL is broken (CDN issue), display nothing for that zone (no broken image icon). Log the error.
- If no banner exists for a zone (paid or internal), render nothing.
- Image requirements: provide guidelines in the admin UI. Recommended dimensions per zone. Max file size: 2MB.

---

**Story 6.6:** As an analyst, I need to view and manage pending connection requests, so that I can vet and facilitate investor introductions.

*Acceptance Criteria:*
- Admin page at `/admin/connections` displays all connection requests in a filterable queue.
- Queue columns: Investor Name, Investor Email, Target Entity, Qualifying Answer, Status, Created Date, Assigned Analyst.
- Filter by: Status, Assigned Analyst.
- Clicking a request opens a detail view: full investor info (from `users`), target entity summary, message, qualifying answer, analyst notes field.
- Analyst actions:
    - **Assign to Self:** Sets `assigned_analyst_id` to current user. Status → `UNDER_REVIEW`.
    - **Approve:** Status → `APPROVED`. Triggers investor notification email.
    - **Reject:** Write reason (internal only). Status → `REJECTED`. Triggers investor notification.
    - **Mark Intro Made:** Status → `INTRO_MADE`. Triggers intro email to both parties.
- Analyst can add internal notes at any stage (visible only in admin).

*Edge Cases & Error Handling:*
- If two analysts try to assign the same request to themselves simultaneously, first-write-wins. Second analyst sees: "This request has already been assigned to [Analyst Name]."
- If the investor's account has been deleted since the request was made, flag the request: "Requesting user no longer active." Analyst can still reject/archive.
- Connection requests older than 90 days without resolution should surface a warning: "This request has been open for [X] days."

---

### Epic 7: Monetization & Compliance

**Business Value:** Revenue infrastructure. Handles all payment processing for investor subscriptions (Stripe), local payments (QPay), and enterprise invoicing. Every dollar of platform revenue flows through this epic.

---

**Story 7.1:** As a foreign investor, I need to pay in USD via credit card to subscribe instantly, so that I can access premium data without delay.

*Acceptance Criteria:*
- Pricing page at `/pricing` displays: Free tier features vs. Subscriber tier features in a comparison table.
- "Subscribe" button for Monthly and Annual plans redirects to Stripe Checkout.
- Stripe Checkout handles: card input, SCA/3DS authentication, payment confirmation.
- On successful payment (Stripe webhook: `checkout.session.completed`):
    - `subscriptions` record created: `type = INVESTOR_SUBSCRIPTION`, `payment_provider = STRIPE`, `status = ACTIVE`.
    - `users.subscription_tier` updated to `SUBSCRIBER`.
    - `SUBSCRIPTION_CREATED` CRM event fired.
- User is redirected back to the platform with immediate access to premium content.
- Subscription amounts and currencies are configured via environment variables (not hardcoded).

*Edge Cases & Error Handling:*
- If the Stripe webhook is delayed (eventual consistency): the user may land back on the platform before subscription is active. Display: "Payment received! Your access is being activated. This may take up to 60 seconds." Poll the backend every 5 seconds for up to 2 minutes.
- If the Stripe webhook fails entirely (network issue): implement webhook retry logic. Stripe retries automatically for up to 72 hours. The backend must handle idempotent webhook processing (do not create duplicate subscriptions).
- If the user's card is declined, Stripe Checkout handles the error display. No custom error handling needed on our side.
- If the user closes the browser during Stripe Checkout, no subscription is created. No orphaned state.

---

**Story 7.2:** As a Mongolian user (investor or company), I need to pay in MNT using my local banking app via QR code, so that I can subscribe or pay listing fees without needing a foreign credit card.

*Acceptance Criteria:*
- For local investor subscriptions: a "Pay with QPay" option appears alongside Stripe on the pricing page.
- For listing vetting fees: QPay QR is generated during the application flow (Epic 5.3).
- QPay integration generates a QR code image containing the payment request. User scans with their banking app.
- On payment confirmation (QPay callback/webhook):
    - `subscriptions` record created with `payment_provider = QPAY`.
    - User's subscription tier updated.
    - CRM event fired.
- QR code is displayed in the user's portal (for subscriptions) or in the application wizard (for vetting fees).
- Payment amount in MNT is configured in admin (exchange rate managed manually by CMM).

*Edge Cases & Error Handling:*
- QPay QR codes have an expiration window (typically 10-30 minutes). Display a countdown timer. On expiry: "QR code expired. [Generate New QR]" button.
- If QPay callback is delayed beyond 5 minutes after QR generation, display: "Payment is being verified. If you've already paid, please wait or contact support."
- If QPay callback confirms payment but the backend fails to create the subscription, log a critical error and trigger an admin notification for manual resolution.
- Duplicate payment callbacks: idempotent processing. If subscription already exists for this QPay transaction ID, ignore the duplicate.

---

**Story 7.3:** As an institutional investor, I need to request an invoice to pay via wire transfer, so that my organization can follow its standard procurement process.

*Acceptance Criteria:*
- On the Pricing page, an "Enterprise / Invoice" option is available alongside Stripe and QPay.
- Clicking it opens a form: Organization Name, Contact Person, Email, Billing Address, Number of Seats (optional).
- On submission: a `FORM_SUBMIT` CRM event is fired with `form_type = INVOICE_REQUEST`.
- An email notification is sent to the CMM sales team.
- The user sees: "Thank you. Our team will send you an invoice within 2 business days."
- CMM admin manually creates the subscription via Epic 6.3 after payment is confirmed offline.

*Edge Cases & Error Handling:*
- This is a manual flow. No automated payment processing.
- If the user submits the form multiple times, de-duplicate by email in the CRM event queue (or accept multiple submissions -- CMM sales team handles).

---

**Story 7.4:** As the system, I need to handle subscription expiry and cancellation cleanly, so that access is revoked when payment stops.

*Acceptance Criteria:*
- **Stripe Cancellation:** When a user cancels via Stripe's customer portal (or via our portal's "Cancel Subscription" button which redirects to Stripe): Stripe webhook `customer.subscription.deleted` fires → `subscriptions.status = CANCELLED`, `subscriptions.cancelled_at = NOW()`, `users.subscription_tier = FREE`.
- **Stripe Expiry (payment failure):** Stripe webhook `invoice.payment_failed` fires → `subscriptions.status = PAST_DUE`. After Stripe's retry period exhausts → `customer.subscription.deleted` fires → same cancellation flow.
- **QPay Expiry:** QPay subscriptions have a fixed `expires_at` date. A daily background job checks for expired QPay subscriptions and sets `status = EXPIRED`, `users.subscription_tier = FREE`.
- **Manual/Enterprise:** Admin can revoke at any time via Epic 6.3. Or set an `expires_at` date that the background job enforces.
- `SUBSCRIPTION_CANCELLED` CRM event fired on any cancellation/expiry.
- User receives email: "Your Market IQ subscription has ended. You still have access to free content. [Resubscribe →]."

*Edge Cases & Error Handling:*
- If a user has BOTH a Stripe subscription and a manual admin grant, and the Stripe subscription cancels: check if the manual subscription is still active before downgrading the user. Only downgrade if ALL subscriptions are inactive.
- If the expiry background job fails to run (server issue), subscriptions remain active until the next successful run. This is acceptable for short outages but must trigger an admin alert if the job hasn't run in >48 hours.
- Grace period: Consider a 3-day grace period after payment failure before revoking access. Stripe handles this with its retry schedule. For QPay: add 3 days to `expires_at` as buffer.

---

### Epic 8: Search & Discovery (The Glue)

**Business Value:** The connective tissue that turns four separate sections (Directory, Knowledge Bank, Events, Bonds) into one unified platform. If users can't find what they're looking for in one search, the platform feels fragmented.

---

**Story 8.1:** As a user, I need to search for keywords and see results categorized by type, so that I can find any entity, report, or news article from one place.

*Acceptance Criteria:*
- Global search bar in the top navigation, available on all pages.
- Search input triggers results after 3+ characters (debounced, 300ms).
- Results are categorized into tabs: All, Companies/Projects, Reports, News, Bonds.
- Each result shows: Name/Title, Type badge, Sector (if applicable), brief excerpt with search term highlighted.
- "All" tab shows top 3 results from each category.
- Clicking a result navigates to the detail page (`/directory/[slug]`, `/reports/[slug]`, `/news/[slug]`, `/bonds`).
- Full search results page at `/search?q=[term]` with pagination and type filtering.
- SSR for the results page (shareable, bookmarkable URL).

*Edge Cases & Error Handling:*
- If no results match, display: "No results found for '[term]'. Try a different keyword."
- Special characters in search input must be sanitized to prevent SQL injection. Use parameterized queries.
- If the search query is empty or only whitespace, display: "Please enter a search term."
- If the search backend is slow (>2s), display results progressively -- show entity results first (from PostgreSQL), then CMS results (from headless CMS API) as they load.

---

**Story 8.2:** As an investor on the directory page, I need to combine multiple filters to narrow results, so that I can find exactly the type of opportunity I'm looking for.

*Acceptance Criteria:*
- Filters on `/directory` can be combined: Entity Type + Sector + Deal Status ("Actively Raising") + Text Search.
- All active filters are displayed as removable chips above the results.
- Filter state is reflected in URL query parameters: `/directory?type=PROJECT&sector=MINING&raising=true&q=gold`.
- Filter changes do not trigger a full page reload. Client-side filtering with API calls.
- Result count updates dynamically: "Showing [X] results."

*Edge Cases & Error Handling:*
- If a filter combination returns zero results, all filters remain applied. Display: "No results match your filters."
- If URL contains invalid filter values (e.g., `type=INVALID`), silently ignore the invalid parameters and apply only valid ones.

---

**Story 8.3:** As a user viewing a Project, I need to see a link to its parent Company (and vice versa), so that I can navigate the ownership structure.

*Acceptance Criteria:*
- On a Project profile: the `NetworkGraphWidget` and/or a "Parent Company" section shows linked companies from `project_stakeholders` with their roles and ownership percentages. Each company name is a clickable link to `/directory/[company-slug]`.
- On a Company profile: an "Active Projects" section shows linked projects. Each project name is a clickable link to `/directory/[project-slug]`.
- These relationships are bi-directional by nature of the `project_stakeholders` junction table.

*Edge Cases & Error Handling:*
- If a project has no parent company (orphan project), display: "Ownership information not yet available."
- If a company has no projects, hide the "Active Projects" section entirely.

---

### Epic 9: Events (The Signpost)

**Business Value:** CMM's existing business is events (conferences, forums). The platform must serve as a promotional channel for these events, driving registrations to the dedicated events subdomain. This is a lightweight epic -- the heavy lifting is on the subdomain.

---

**Story 9.1:** As a user, I need to see a list of upcoming and past CMM events, so that I can discover networking and learning opportunities.

*Acceptance Criteria:*
- Events page at `/events` displays all events from the `events` table.
- Upcoming events sorted by `event_date` ascending. Past events below, sorted descending.
- Each event card shows: Title, Date, Location, Topic, Image.
- A "Register" button links to `registration_url` (events subdomain) and opens in a new tab.
- Page is SSR.

*Edge Cases & Error Handling:*
- If no upcoming events exist, display: "No upcoming events. Check back soon or browse past events below."
- If `registration_url` is null (registration not yet open), display "Coming Soon" instead of the Register button.
- Past events should have their Register button replaced with "View Recap" (if a link exists) or hidden entirely.

---

**Story 9.2:** As a user clicking "Register" on an event, I need to be redirected to the dedicated events subdomain, so that I can complete registration on the specialized platform.

*Acceptance Criteria:*
- All "Register" and "View Details" links on event cards open the `registration_url` in a new tab.
- The link appends a `?ref=marketiq` query parameter for attribution tracking on the subdomain.
- No inline registration. The CMM Market IQ platform does not host the registration form.

*Edge Cases & Error Handling:*
- If the events subdomain is down, the user will see the subdomain's error page. This is outside Market IQ's control. No fallback needed on our side.

---

**Story 9.3:** As an admin, I need to feature the next major event on the Homepage, so that it gets maximum visibility to platform visitors.

*Acceptance Criteria:*
- The Homepage includes a "Featured Event" widget that displays the event where `is_featured = true`.
- Widget shows: Event Image, Title, Date, Location, and a prominent "Register Now" CTA button.
- Only one event can be featured at a time. Setting `is_featured = true` on one event automatically sets it to `false` on all others.
- Admin manages this via the Admin panel or directly in the `events` table.

*Edge Cases & Error Handling:*
- If no event is featured, hide the widget entirely on the Homepage. Do not show an empty placeholder.
- If the featured event's date has passed, the daily background job should automatically un-feature it. Alternatively, the admin must manually update.

---

### Epic 10: User Portal (The Dashboard)

**Business Value:** The authenticated user's home base. Everything a user needs to manage their relationship with the platform: subscription, downloads, bookmarks, connection requests, and listing status. A well-designed portal reduces support tickets and increases self-service engagement.

---

**Story 10.1:** As a paid subscriber, I need a dashboard showing my recent activity, so that I can track my engagement with the platform.

*Acceptance Criteria:*
- User Portal at `/portal` is the default landing page after login.
- Dashboard shows:
    - **Quick Stats:** Number of reports downloaded, Number of entities bookmarked, Number of connection requests (with status breakdown).
    - **Recent Downloads:** Last 5 downloaded reports with links. "View All" navigates to `/portal/downloads`.
    - **Recent Bookmarks:** Last 5 bookmarked entities with links. "View All" navigates to `/portal/bookmarks`.
    - **Pending Connection Requests:** Any requests in PENDING or UNDER_REVIEW status.
- For FREE users: dashboard shows the same structure but with upgrade CTAs where premium features would be: "Download reports to track them here. [Subscribe →]."
- Left-side navigation: Dashboard, Downloads, Bookmarks, Connections, Subscription, Listing (visible only if `role = COMPANY_REP`).

*Edge Cases & Error Handling:*
- For new users with no activity, display a welcome message: "Welcome to Market IQ. Start by exploring the [Directory →] or [Report Library →]."
- If data loading fails for any section, display: "Unable to load [section]. Please refresh." Do not block the entire portal.

---

**Story 10.2:** As a subscriber, I need to view and manage my subscription, so that I can understand my billing and cancel if needed.

*Acceptance Criteria:*
- Subscription page at `/portal/subscription` shows:
    - Current Plan (Monthly/Annual), Status (Active/Past Due/Cancelled), Next Billing Date, Amount, Payment Method.
    - For Stripe subscribers: "Manage Subscription" button redirects to Stripe's Customer Portal (handles card updates, cancellation, billing history).
    - For QPay subscribers: displays current plan status and `expires_at` date. "Renew" button generates a new QPay QR code.
- For FREE users: this page shows the comparison table from `/pricing` with "Upgrade Now" CTA.
- For ENTERPRISE users: this page displays "Your access is managed by your organization. For questions, contact CMM." No billing details. No cancel button.

*Edge Cases & Error Handling:*
- If Stripe Customer Portal session creation fails, display: "Unable to open billing management. Please try again or contact support."
- If user has both a Stripe subscription and a manual admin grant, show both with clear labels. The higher-access tier is active.

---

**Story 10.3:** As a subscriber, I need to see my download history, so that I can re-access reports I've previously downloaded.

*Acceptance Criteria:*
- Download History page at `/portal/downloads` shows a list of all downloaded reports.
- Each row: Report Title (linked to report detail page), Download Date, Sector Tag.
- Sorted by download date descending.
- Paginated: 20 per page.

*Edge Cases & Error Handling:*
- If a downloaded report has been unpublished from the CMS, the title is still shown but the link displays: "This report is no longer available."
- If the user has no downloads, display: "You haven't downloaded any reports yet. [Browse Reports →]."

---

**Story 10.4:** As a subscriber, I need to save/bookmark entities in the directory, so that I can quickly access companies and projects I'm interested in.

*Acceptance Criteria:*
- A "Bookmark" icon on every entity profile page and every entity card in the directory index.
- Clicking the icon toggles the bookmark (add/remove) in the `user_bookmarks` table.
- Bookmarks page at `/portal/bookmarks` shows all bookmarked entities.
- Each row: Entity Name (linked), Type badge, Sector, "Actively Raising" badge if applicable.
- User can remove bookmarks from this page.
- Anonymous/free users can also bookmark (bookmark is a basic feature).

*Edge Cases & Error Handling:*
- If a bookmarked entity's status changes to ARCHIVED, the bookmark remains but displays: "[Entity Name] -- No longer listed" with a visual indicator.
- Bookmark action requires authentication. If a non-logged-in user clicks bookmark, redirect to login with return URL.

---

**Story 10.5:** As a company representative, I need to see my listing application status in my portal, so that I know where my application stands.

*Acceptance Criteria:*
- This is the portal-side rendering of Epic 5.4.
- "Listing" nav item appears in the portal sidebar ONLY if `user.role = COMPANY_REP` OR the user has at least one record in `listing_applications`.
- Page content is identical to Story 5.4 (listing status display).
- If the listing is LIVE, display a link to the public profile: "Your listing is live: [View Profile →]."

*Edge Cases & Error Handling:*
- Same as Story 5.4.

---

## 4. Non-Functional Requirements (NFRs) & Accountability

---

### NFR 1: Security & Privacy
- All Data Room files (pitch decks, licenses) must be stored in an AWS S3 **private** bucket. Access only via temporary signed URLs (15-minute expiry). Files must NOT be indexable by search engines.
- All API endpoints handling financial data or user PII must use HTTPS.
- The NestJS Paywall Interceptor operates on a **Zero Trust** model: premium data is physically stripped from the JSON response before it leaves the server. The frontend never receives data it shouldn't display.
- SQL injection prevention: all database queries use parameterized statements via the ORM (TypeORM/Prisma). No raw SQL string concatenation.
- XSS prevention: all user-submitted content (form inputs, analyst notes, descriptions) is sanitized before rendering.
- CSRF protection via Clerk's session management.
- Admin panel routes require `role = ADMIN` or `role = ANALYST` (where applicable). Standard users receive 403.
- Audit trail: all admin actions (listing approval/rejection, subscription grants/revokes, user role changes) are logged with: admin user ID, action, target, timestamp.

### NFR 2: SEO Architecture
- All public-facing pages must be Server-Side Rendered (SSR) via Next.js: Homepage, Directory Index, Entity Profiles (public sections), Report Teasers, News Articles, Bond Scanner, Events List, Static pages.
- Each SSR page must include: proper `<title>`, `<meta description>`, Open Graph tags, and canonical URLs.
- Entity profile URLs must be clean and human-readable: `/directory/oyu-tolgoi-mining` (slugified from entity name).
- A `sitemap.xml` must be auto-generated including all LIVE entity profiles, published reports, and news articles.
- `robots.txt` must allow crawling of all public pages and disallow: `/portal`, `/admin`, `/apply`, and any S3 file-serving endpoints.

### NFR 3: Performance
- Target Time-to-First-Byte (TTFB) for SSR pages: < 800ms on Mongolian 4G networks.
- External API calls (MSE, NYSE, HKEX stock prices) must load asynchronously. If an external API is down or slow, the rest of the page must still render. Display: "Market data unavailable" in the widget.
- API responses for directory listing and search: < 500ms at the 95th percentile.
- Images: use Next.js `<Image>` component for automatic optimization and lazy loading.
- CMS content: implement server-side caching (5-minute TTL) for report lists and news feeds.
- Database: index the following columns at minimum: `entities.slug`, `entities.type`, `entities.sector`, `entities.status`, `entities.is_raising`, `financial_reports.entity_id`, `connection_requests.status`, `bonds.status`.

### NFR 4: Localization Framework (i18n)
- The v1 platform is **English only**.
- However, the frontend code must use an i18n framework (e.g., `next-intl` or `react-i18next`) for all user-facing strings. No hardcoded English strings in component markup.
- All strings must be stored in a locale file (e.g., `en.json`). This ensures Mongolian language support can be added in v2 by translating the locale file without modifying component code.
- Date and number formatting must use locale-aware formatters (e.g., `Intl.NumberFormat`).

### NFR 5: Ad Blocker Proofing
- Sponsorship banners must be served as first-party content: standard `<img>` tags loading images from the platform's own domain or CDN. No external ad scripts.
- Click tracking must use a first-party API endpoint (e.g., `/api/banners/[id]/click` which redirects to the destination URL) rather than third-party tracking pixels.
- Do not name image files or CSS classes with patterns commonly blocked by ad blockers (e.g., avoid `ad-`, `banner-`, `sponsor-` in filenames and class names).

### NFR 6: Mobile Responsiveness
- All pages must be fully responsive down to 375px viewport width.
- Sidebar components (e.g., directory filters, sponsorship banners) must collapse or reposition on mobile:
    - Directory filters: collapse into a "Filter" button that opens a slide-out drawer.
    - Sponsorship banners: move from sidebar to below article/content on mobile.
- Data tables (financials, bonds): horizontal scroll on mobile with sticky first column (entity/field name).
- The stock chart widget must resize responsively. Touch interactions (pinch-to-zoom) are not required in v1.

### NFR 7: Data Accuracy
- All monetary values in the database must use `DECIMAL(15,2)` precision. No floating-point types (`FLOAT`, `DOUBLE`) for financial data.
- All monetary values in API responses must be serialized as strings (not numbers) to prevent JSON floating-point precision loss.
- Stock price data: `DECIMAL(15,4)` precision.
- Percentage values: `DECIMAL(8,4)` precision.

### NFR 8: Observability & Error Handling
- Application-level error logging (e.g., Sentry or equivalent) for both frontend and backend.
- Critical error alerts: CRM event queue failures, payment webhook failures, S3 access failures, external API outages.
- Structured logging in the backend (JSON format) for all API requests, including: user ID, endpoint, response time, status code.
- Health check endpoint at `/api/health` for uptime monitoring.

---

## 5. Miscellaneous Pages (Sitemap)

These are static or semi-static pages required for the site to function as a complete product.

### Landing Page (Homepage) -- `/`
- Dynamic widgets driven by data:
    - **Hero Section:** Headline + CTA ("Explore the Directory" / "Subscribe to Market IQ").
    - **Featured Event Widget:** From Epic 9 (`events` where `is_featured = true`).
    - **Latest News:** 3 most recent News articles from CMS.
    - **Featured Deal:** One entity where `is_raising = true` and manually featured by admin.
    - **Sponsorship Banner Zone:** HOMEPAGE_HERO zone from `sponsorship_banners`.
    - **Stats Bar:** Number of listed entities, Number of reports published, Number of qualified intros made (pulled from database counts or cached).
- SSR. Fully public.

### Advisory Services -- `/advisory`
- Static sales page describing CMM's advisory offerings: Deal Advisory, Event Sponsorship, Market Entry Consulting.
- Each service section includes a "Book Consultation" CTA that opens a form.
- Form fields: Name, Email, Company, Service of Interest (dropdown), Message.
- Form submission fires `FORM_SUBMIT` CRM event with `form_type = ADVISORY_INQUIRY`.
- SSR. Fully public.

### About Us -- `/about`
- Company history, mission statement.
- Analyst Team bios (can be managed via CMS or hardcoded for v1).
- SSR. Fully public.

### Partners -- `/partners`
- Logo grid of sponsors and partners.
- Can be managed via CMS (simple collection of: Logo Image, Company Name, Website URL) or hardcoded for v1.
- SSR. Fully public.

### Pricing -- `/pricing`
- Comparison table: Free tier vs. Subscriber tier vs. Enterprise.
- Clear feature checklist per tier (mirrors the Entitlement Matrix from Architecture Document).
- CTA buttons: "Sign Up Free", "Subscribe" (→ Stripe Checkout), "Contact Us for Enterprise" (→ Invoice Request form).
- QPay option for local subscribers.
- SSR. Fully public.

### Contact Us -- `/contact`
- Map (embedded Google Maps or static image), Physical Address, Phone Number, Email.
- Simple contact form: Name, Email, Subject, Message.
- Form submission fires `FORM_SUBMIT` CRM event with `form_type = GENERAL_INQUIRY`.
- SSR. Fully public.

### Legal / Terms & Conditions -- `/legal`
- Static text page.
- Must include disclaimer: CMM Market IQ does not provide financial advice. Data is for informational purposes only.
- SSR. Fully public.

### Privacy Policy -- `/privacy`
- Static text page.
- Must comply with Mongolian Personal Data Protection Law (2021) and, where applicable, GDPR (for EU investors).
- SSR. Fully public.

### 404 Page
- Custom error page with CMM branding.
- Message: "Page not found."
- CTA: "Go to Homepage" button.
- Must not expose stack traces, file paths, or internal error details.

---

## 6. CMM Team Decision Log

These items are pending decisions from CMM leadership. Each has a default that the vendor can use to begin development. When CMM provides the final answer, the vendor updates the implementation.

| # | Decision | Status | Default for Development | Final Answer |
|---|----------|--------|------------------------|--------------|
| 1 | Mining project tech_specs: which fields are mandatory? | PENDING | All "Required" + "Recommended" fields from reference table (provided to CMM) | |
| 2 | Energy project tech_specs: which fields are mandatory? | PENDING | All "Required" + "Recommended" fields from reference table (provided to CMM) | |
| 3 | Private Company financials: is the flexible template (base + 5 custom fields) acceptable? | PENDING | Yes. Template as defined in Architecture Doc. | |
| 4 | Connection Request qualifying question: which question to ask? | PENDING | "What is your investment ticket size?" with ranges: <$1M, $1-5M, $5-25M, $25M+ | |
| 5 | Team/Board data for Private Companies: public or gated? | PENDING | Gated (behind paywall). Not visible to free/anonymous users. | |
| 6 | Bonds: 5th entity type or embedded data? | PENDING | Embedded: sortable table at `/bonds` + detail drawer. Not a full entity type. | |
| 7 | CRM selection: HubSpot, Brevo, or other? | PENDING | Deferred. Build event queue. CRM adapter built after selection. | |
| 8 | Currency display: USD only or MNT toggle? | PENDING | USD only for v1. | |
| 9 | Listing fee pricing and payment flow | PENDING | Vetting fee via QPay at application. Listing fee invoiced manually after approval. | |
| 10 | CMS choice: Strapi or Sanity? | PENDING | Either works. Strapi if self-hosted preference. Sanity if managed service preference. | |

---

*End of PRD. This document, together with the System Architecture Document, constitutes the complete Source of Truth for v1 vendor development.*
