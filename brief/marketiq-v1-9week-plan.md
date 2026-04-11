# MarketIQ v1: 9-Week Execution Plan

**Timeline:** April 1 - May 29, 2026
**Launch Target:** May 26 (flexible to June if quality isn't there)
**Scope Rule:** If May 26 slips, v1 and v1.1 collapse into a single release targeting June. No point maintaining two separate scopes if the first date is missed.
**Last Updated:** April 1, 2026 (synced with meeting prep decisions)

---

## The Core Problem This Plan Solves

**Business team blocking development.** The PRD has 6 analyst quality gates and 8 open decisions owned by CMM. If the business team delivers late, dev stalls. This plan front-loads every business dependency into Weeks 1-2 with hard deadlines and fallback defaults. If CMM misses a deadline, dev proceeds with the default and CMM can adjust later.

---

## Swim Lanes

| Lane | Person(s) | Focus |
|------|-----------|-------|
| **PM** | Zane | Scope control, decisions, QA, analytics, stakeholder management, launch prep |
| **Backend + AI** | Dulguun | Backend API, Payload CMS, AI pipelines, integrations |
| **Design Engineer** | Gray | Frontend, UI/UX, responsive, SEO, accessibility |
| **Supporting** | CMM analysts (2), graphic designer, executives (2) | Content, data review, brand assets, legal, decisions |

---

## Decision Firewall

Every open decision has a **deadline** and a **default**. If CMM doesn't decide by the deadline, dev uses the default. No blocking.

| Decision | Deadline | Default if missed | Owner |
|----------|----------|-------------------|-------|
| Content types taxonomy | Fri Apr 10 (W1) | Articles, Monthly Updates, Press Releases, Comprehensive Guides | Zane + CMM |
| Entity priority list (which 100) | Fri Apr 10 (W1) | All MSE-listed public companies first | Zane + CMM |
| Entity type profile structures | Fri Apr 10 (W1) | Dev builds from PRD spec (Stories 2.2-2.7) as-is | CMM team |
| Hosting/deployment | Fri Apr 10 (W1) | Vercel (Dulguun's call) | Dulguun |
| Email service provider | Fri Apr 10 (W1) | Resend | Dulguun |
| MSE API validation | Fri Apr 10 (W1) | If no API: manual CMS entry for stock data | Dulguun |
| Connection request qualifying questions | Fri Apr 17 (W2) | Name, email, company, message, ticket size (as in PRD) | CMM team |
| Legal review of AI profiles | Fri Apr 24 (W3) | Generic disclaimer + "Report an error" link. Profiles marked "unverified" until legal signs off. | CMM leadership |
| Market Feed gating | Fri Apr 24 (W3) | Public (Zane's recommendation) | Zane |
| OG image strategy | Fri May 1 (W5) | Zane + Gray decide dynamic vs static. If static: graphic designer creates templates. | Zane + Gray |
| Terms of Service + Privacy Policy | Fri May 8 (W6) | Cannot launch without. Escalate to CMM execs if not started by W4. | Zane + legal |
| CRM vendor | Fri May 15 (W7) | Event queue ships vendor-agnostic. CRM adapter built post-launch. | CMM leadership |
| Paywall strategy approval | Fri May 15 (W7) | Zane's proposal ships as-is | CMM leadership (Zane proposes) |
| Distribution plan | Fri May 15 (W7) | CMM network email + MIF event promotion + LinkedIn | Zane |

---

## Week-by-Week Plan

### PHASE 1: FOUNDATION (Weeks 1-3)

---

### Week 1: Apr 1-4 — Kickoff + Infrastructure + Business Decisions

**Goal:** Infrastructure up. All Week 1 decisions locked. Dev unblocked.

| Lane | Tasks |
|------|-------|
| **Zane (PM)** | Kick off project with all 4 lanes (set cadence: daily async standup, Tuesday sync for blockers/tasks, Friday sync for workshops/decisions). Lock content type taxonomy. Lock entity priority list (100 entities). Get entity type profile structures approved (all 4 types: widgets, fields, shared vs unique). Set up PostHog project. Create shared tracker for analyst quality gates. Draft analyst review playbook (checklists from PRD Section 7.1). |
| **Dulguun (Backend)** | Spike: MSE API validation (exists? accessible? data shape? redistribution license?). Decide hosting (Vercel vs self-hosted) and email provider (Resend vs SendGrid). Set up repo, CI/CD, staging environment. Initialize Payload CMS with core collections: Entities, Content, Events, Speakers, People. Set up Clerk integration (email + Google OAuth). |
| **Gray (Design)** | Design system setup: typography, color palette, spacing, component library baseline. Navigation + layout shell (Story 6.6). Landing page wireframe (Story 6.7). Mobile responsive grid. |
| **Supporting (CMM)** | **CRITICAL (all due Fri Apr 10):** Deliver content type taxonomy. Deliver entity priority list (which 100 to profile first). Approve entity type profile structures (all 4 types: which widgets, which fields, what's shared vs unique). CMM graphic designer: deliver brand assets (logo, favicon, color palette). CMM execs: sign off on PRD scope (written, not verbal). |

**Milestone:** Staging environment live. Payload CMS running. Clerk auth working. Content types locked. Entity profile structures approved.

---

### Week 2: Apr 7-11 — Content Hub + Directory Data Model

**Goal:** Insights pages functional. Directory data model built. AI pipeline work begins.

| Lane | Tasks |
|------|-------|
| **Zane (PM)** | Lock connection request qualifying questions (Fri Apr 17). Begin legal review process with CMM leadership (AI profiles). Write analyst review playbook and share with CMM analysts. Start Terms of Service draft (or engage legal counsel). |
| **Dulguun (Backend)** | Payload CMS: content publishing workflow (Draft > In Review > Published). Content API endpoints (list, detail, filter, search). Entity data model: all 4 types (Public Company, Private Company, Project, Service Provider) with layout_config. Entity API endpoints. Begin legacy content migration script (Story 1.4). Begin AI profile generation pipeline architecture (Story 2.9). |
| **Gray (Design)** | Insights index page (Story 1.1): card grid, filters, search, pagination. Content detail page (Story 1.2): rich text, entity chips, PDF download button. Landing page build (Story 6.7). Navigation integration. |
| **Supporting (CMM)** | Deliver connection request qualifying questions by Fri Apr 17. CMM analysts: familiarize with Payload CMS (Dulguun gives 30-min walkthrough). CMM graphic designer: content placeholder images by type. |

**Milestone:** Insights index + detail pages working on staging (with test content). Entity data model in CMS.

---

### Week 3: Apr 14-18 (deadlines Fri Apr 24) — Directory Frontend + Paywall + AI Pipeline v1

**Goal:** Directory browsable. Metered paywall live. AI pipeline producing draft profiles.

| Lane | Tasks |
|------|-------|
| **Zane (PM)** | Get legal review decision on AI profiles by Fri Apr 24 (escalate if needed). Decision: Market Feed gating (recommend: public). QA Insights pages on staging. Begin PostHog event instrumentation plan (which events, which properties). |
| **Dulguun (Backend)** | Metered paywall logic (Story 1.3): 3 free articles, counter, registration wall, premium content flag. Content-entity linking backend (Story 1.5): AI batch tagging script + manual CMS fallback. Run migration script on legacy content (150 articles into Payload CMS as drafts). AI profile pipeline v1: generate first batch of 20-30 draft profiles from priority list. |
| **Gray (Design)** | Directory index page (Story 2.1): card grid, filters, search, pagination. Entity profile page shell (Story 2.2): dynamic widget renderer, entity header by type. Paywall UI: article counter, inline registration wall, premium badge. |
| **Supporting (CMM)** | **ANALYST SPRINT BEGINS:** Start QA on migrated articles (target: 150 articles over W3-W4, ~15-20/day/analyst). Review first batch of AI-generated entity profiles (20-30 drafts). CMM execs: deliver legal review on AI profiles by Fri Apr 24. |

**Milestone:** Directory index browsable. Paywall working. First AI profiles in CMS for review. Migration articles in QA.

---

### PHASE 2: BUILD (Weeks 4-6)

---

### Week 4: Apr 21-25 — Entity Widgets + Events + News Pipeline

**Goal:** Entity profiles rich with widgets. Events section functional. News pipeline in dev.

| Lane | Tasks |
|------|-------|
| **Zane (PM)** | QA entity profiles (spot-check widget rendering across all 4 types). QA migrated content (sample check formatting, images, tags). Finalize PostHog instrumentation plan. Start distribution plan outline. |
| **Dulguun (Backend)** | Public company widgets backend: stock data integration (MSE API or manual fallback), financial data API. Private company widgets: self-reported financials, DealActionWidget logic. Project widgets: ProjectTechnicalWidget, OwnershipListWidget. Market Feed AI pipeline architecture (Story 3.4): source discovery, crawling, entity matching, confidence scoring. Event registration backend (Story 4.3): form submission, confirmation email, admin list. |
| **Gray (Design)** | Public company widgets (Story 2.3): stock chart (1M/3M/1Y/ALL), financial tables. Private company widgets (Story 2.4): flexible financials, DealActionWidget, CapitalStructureWidget. Project widgets (Story 2.5): technical specs table, project stage badge. Service provider profiles (Story 2.6): minimal layout. Key personnel widget (Story 2.11). Ownership list widget (Story 2.7). |
| **Supporting (CMM)** | Complete migration QA (all 150 articles reviewed, tagged, formatted by end of W4). Continue AI profile review (target: 50 profiles reviewed by end of W4). CMM analysts: begin publishing approved migrated content via CMS workflow. |

**Milestone:** All 4 entity types rendering with widgets. Events backend done. 50+ profiles reviewed. Migration QA complete.

---

### Week 5: Apr 28 - May 1 — Events Frontend + News Pipeline + Concierge

**Goal:** Events section live. News pipeline running. Connection request flow complete.

| Lane | Tasks |
|------|-------|
| **Zane (PM)** | QA events flow end-to-end (registration, confirmation email, admin list). QA connection request flow. Verify PostHog events firing correctly on staging. Check in on Terms of Service progress (must be done by W6). Prepare beta testing plan: recruit 5-10 testers via CMM network, define feedback collection process. |
| **Dulguun (Backend)** | Market Feed pipeline operational: automated news discovery, entity matching, confidence scoring, deduplication. Analyst review interface for low-confidence news items (Story 3.5). Concierge: connection request form submission, analyst email notification (Stories 5.1-5.3). CRM event payloads (Story 6.8): registration, connection request, event registration, content download. User portal backend (Story 6.2). |
| **Gray (Design)** | Events landing page (Story 4.1). Event detail page (Story 4.2): agenda, speakers, registration form. Past event archive (Story 4.4). Speaker profiles (Story 4.5). Market Feed index page (Story 3.1): feed stream, filters. News item cards (Story 3.2). Entity-news widget (Story 3.3). Connection request form UI (Story 5.1) + confirmation (Story 5.2). User portal page (Story 6.2). |
| **Supporting (CMM)** | Continue AI profile review (target: 80 profiles reviewed by end of W5). Set up first real event in CMS (MIF or next upcoming). Begin daily news feed review routine (low-confidence queue). CMM execs: Terms of Service + Privacy Policy in progress. |

**Milestone:** Events section functional. News feed live on staging. Concierge flow working. 80+ profiles reviewed.

---

### Week 6: May 4-8 — Integration + SEO + Analytics

**Goal:** All features integrated. SEO fundamentals in place. Analytics tracking live.

| Lane | Tasks |
|------|-------|
| **Zane (PM)** | Full QA pass across all pages and flows. PostHog integration QA (verify all events, user identification). Verify SEO: meta tags, OG images, structured data, sitemap. Terms of Service + Privacy Policy finalized (HARD DEADLINE). Write launch announcement draft. |
| **Dulguun (Backend)** | SEO: SSR verification across all routes, sitemap generation, robots.txt (Story 6.4). PostHog integration: page views, key events, user identification (Story 6.9). Content-entity linking: run AI tagging batch on all published content, submit for analyst review. PDF download logging (Story 1.7). Performance optimization: API response times, caching strategy. |
| **Gray (Design)** | SEO: dynamic meta tags, Open Graph per page, JSON-LD structured data. Mobile responsiveness QA across all pages (Story 6.5). Accessibility pass: keyboard navigation, axe-core audit, touch targets. Loading states: skeleton placeholders per widget. Error states: per-widget error isolation. |
| **Supporting (CMM)** | All 100 profiles reviewed and approved (HARD DEADLINE). Content-entity tags reviewed on published articles. All migrated articles published. CMM execs: Terms of Service + Privacy Policy signed off. CMM graphic designer: OG image templates, event graphics finalized. |

**Milestone:** Feature complete. 100 profiles live. 150 articles published. Analytics tracking. SEO ready. Legal docs done.

---

### PHASE 3: POLISH + LAUNCH (Weeks 7-9)

---

### Week 7: May 11-15 — Bug Fixes + Polish + Beta Testing

**Goal:** Bug bash. Performance tuning. Beta testing with CMM investor network.

| Lane | Tasks |
|------|-------|
| **Zane (PM)** | Run structured bug bash (create bug tracker, prioritize P0/P1/P2). **Beta testing begins:** Share staging build with 5-10 trusted investors recruited via CMM. Collect structured feedback. Rule: beta feedback within v1 scope = fix before launch. New feature requests = v1.1/v2 backlog. Piggyback on CMM's v2 user research conversations if possible. Finalize distribution plan. Draft monthly email digest template. CRM vendor decision deadline (or ship vendor-agnostic). |
| **Dulguun (Backend)** | Fix P0/P1 bugs from QA. Performance: load testing, database query optimization, caching. Security review: auth edge cases, rate limiting, input validation. News pipeline tuning based on first 2 weeks of data. 301 redirects from old capitalmarkets.mn URLs (Story 1.4). |
| **Gray (Design)** | Fix P0/P1 UI bugs. Polish: transitions, hover states, micro-interactions. Cross-browser testing (Chrome, Safari, Firefox, Edge). Final mobile QA on real devices. Empty state designs for all sections. |
| **Supporting (CMM)** | Analysts: daily news review routine established. Support beta testing: help recruit testers from CMM investor network, relay feedback. Begin preparing launch content (new articles, featured entities). CMM execs: review beta feedback. |

**Milestone:** Beta testing with 5-10 external investors. P0 bugs fixed. Performance acceptable.

---

### Week 8: May 18-22 — Final Polish + Launch Rehearsal

**Goal:** Production ready. Launch sequence rehearsed. All systems go.

| Lane | Tasks |
|------|-------|
| **Zane (PM)** | Incorporate beta testing feedback (scope-check: only P0 fixes, no new features). Launch rehearsal: DNS cutover plan, rollback plan, monitoring dashboard. Verify all success metrics are trackable (PostHog dashboards for primary metrics). Final stakeholder alignment with CMM execs. Pre-write launch communications (email to CMM network, LinkedIn post, event announcement). |
| **Dulguun (Backend)** | Production deployment setup. DNS/domain configuration (capitalmarkets.mn or new domain). Database backup and recovery plan. Monitoring and alerting setup. Final security hardening. Load test production environment. |
| **Gray (Design)** | Final visual polish. Favicon, loading spinner, 404 page, error pages. Print stylesheet for entity profiles (investors print these). Screenshot all pages for launch materials. |
| **Supporting (CMM)** | Analysts: all review queues cleared. Fresh content published for launch week. Event(s) set up and ready. CMM graphic designer: launch email graphics, social media assets. CMM execs: final sign-off on launch readiness. |

**Milestone:** Production environment ready. Launch rehearsal complete. All stakeholders aligned.

---

### Week 9: May 25-29 — LAUNCH

**Goal:** Ship it.

| Lane | Tasks |
|------|-------|
| **Zane (PM)** | **May 26: Launch day.** Execute launch communications (CMM network email, LinkedIn, industry channels). Monitor PostHog dashboards in real-time. Triage any launch-day issues (P0 = fix immediately, everything else = backlog). Send launch announcement to CMM stakeholders. Begin daily metrics check routine. |
| **Dulguun (Backend)** | DNS cutover. Monitor error rates, API performance, pipeline health. On-call for launch day issues. News pipeline running in production. Verify CRM event payloads firing. |
| **Gray (Design)** | Monitor for UI issues reported by real users. Quick-fix any responsive or rendering bugs. Support Zane with screenshots/recordings for launch comms. |
| **Supporting (CMM)** | Analysts: monitor news review queue actively on launch day. Respond to any connection requests within 24 hours. CMM execs: amplify launch via personal networks. Begin post-launch profile expansion (20-30 new profiles/week). |

**Milestone:** MarketIQ v1 is live.

---

## Anti-Blocking Mechanisms

These are the structural safeguards against "business team blocks dev team":

### 1. Decision Firewall (above)
Every decision has a deadline and a default. Dev never waits.

### 2. Parallel Tracks
Analyst work and dev work run in parallel, not sequentially:
- **W3-W4:** Analysts QA migrated content WHILE dev builds directory widgets
- **W3-W5:** Analysts review AI profiles WHILE dev builds events + news pipeline
- **W5+:** Analysts review news feed WHILE dev does integration + polish

### 3. Hard Handoff Points
Clear moments where business team must deliver or dev proceeds without them:

| Date | Handoff | From | To | If late |
|------|---------|------|----|---------|
| Fri Apr 10 | Content types + entity priority list + entity profile structures | CMM | Dulguun + Gray | Dev uses defaults from PRD |
| Fri Apr 17 | Connection request qualifying questions | CMM | Dulguun | Dev uses PRD proposal |
| Fri Apr 24 | Legal review on AI profiles | CMM execs | Dulguun | Launch with generic disclaimer |
| Fri May 2 | 80+ profiles reviewed | CMM analysts | Zane (QA) | Reduce launch target or slip |
| Fri May 8 | Legal docs (ToS, Privacy) | CMM execs | Zane | LAUNCH BLOCKER. Escalate. |
| Fri May 8 | All 100 profiles approved | CMM analysts | Zane | Reduce launch count |
| Fri May 15 | All review queues clear | CMM analysts | All | Launch delayed if queue backlogged |

### 4. Sync Cadence
Two syncs per week. All deadlines land on Fridays so decisions can be resolved in the Friday workshop.

**Tuesday sync (short):** Blockers and weekly task progress.
1. **Blockers** (anyone blocked by someone else? Resolve now.)
2. **Task status** (what's in progress, what's stuck?)
3. **Handoff check** (are upcoming Friday deadlines on track?)

**Friday sync (longer, workshop format):** Joint decision-making and reviews.
1. **Decisions due this week** (resolve or default)
2. **Design/content reviews** (approve deliverables)
3. **Demo** (show what shipped this week)
4. **Next week preview** (what's coming, who needs to prep?)

### 5. Escalation Path
If a CMM dependency is late:
1. Zane flags in Tuesday sync
2. If not resolved by that Friday's workshop: Zane escalates to CMM exec sponsors directly
3. If still blocked: dev proceeds with default, CMM adjusts post-launch

---

## Risk Calendar

| Week | Key Risk | Mitigation |
|------|----------|------------|
| W1 | MSE API doesn't exist or is inaccessible | Dulguun spikes Day 1. Fallback: manual CMS entry. |
| W2 | CMM doesn't deliver tech spec fields | Defaults defined in Decision Firewall. |
| W3 | Legal review delays AI pipeline start | Profiles generated with disclaimer. Legal review can happen in parallel. |
| W3-W4 | Migration QA slower than expected | Two analysts full-time. If behind, Zane triages: prioritize most-viewed articles. |
| W4-W5 | Profile review bottleneck | 10-15/day/analyst is conservative. If behind, reduce launch target to 75. |
| W6 | Terms of Service not done | LAUNCH BLOCKER. Zane escalates to CMM execs in W4 if no progress. |
| W7 | Beta testing reveals major issues | May 26 is flexible. If critical issues, v1 and v1.1 collapse into single June release. |
| W8 | Scope creep from beta feedback | Only P0 fixes. Everything else goes to v1.1 backlog. |

---

## Capacity Notes

**Dulguun** has the heaviest load: CMS setup, 3 API surfaces (content, directory, events), 2 AI pipelines (profiles, news), auth, CRM events, migration script, SEO. The plan front-loads infrastructure (W1-2), builds features (W3-5), and reserves W6-8 for integration and polish. If Dulguun falls behind, the first thing to cut is CRM event payloads (ship vendor-agnostic queue post-launch).

**Gray** has steady work throughout. The main crunch is W4-5 when multiple widget types ship simultaneously. If behind, service provider profiles (Story 2.6) are the simplest and can be a day-of build.

**CMM Analysts** peak in W3-W5 (migration QA + profile review + news review starting). This is the bottleneck. Zane should check analyst throughput daily during this window. Analysts are split across other CMM work, so a guaranteed weekly time commitment must be agreed with CMM leadership.

**Post-launch analyst reality:** The news feed pipeline is not "set and forget." It requires ongoing prompt tuning (improving entity matching accuracy, reducing false positives), crawl source maintenance (adding new sources, fixing broken ones), and daily review of low-confidence items. Budget ~1 hr/day minimum, more in early weeks while calibrating.

**Image compression:** v1 does not include server-side image compression. Dev will build a lightweight internal compression tool. Analysts must run every image through it before CMS upload. Uncompressed images degrade page speed and SEO. Server-side compression is scoped for v1.1.

---

## What "Done" Looks Like on May 26

- [ ] 100 verified entity profiles live (all 4 types)
- [ ] 150+ migrated articles published
- [ ] Metered paywall converting guests to registrations
- [ ] Market Feed running with auto-linked news
- [ ] Events section with at least 1 upcoming event
- [ ] Connection request flow working end-to-end
- [ ] PostHog tracking all primary metrics
- [ ] SEO fundamentals in place (SSR, meta tags, sitemap, structured data)
- [ ] Mobile responsive across all pages
- [ ] Terms of Service + Privacy Policy published
- [ ] 301 redirects from old capitalmarkets.mn URLs
- [ ] Auth working (email + Google OAuth via Clerk)
