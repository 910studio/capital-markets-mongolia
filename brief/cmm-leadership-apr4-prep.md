# CMM Leadership Meeting Prep — Saturday, April 4

**Purpose:** Get CMM leadership aligned on everything their team needs to deliver for MarketIQ v1 launch (May 26). Walk through every decision, document, approval, and work stream that depends on CMM. Leave with owners and dates confirmed.

**Framing for the meeting:** Dev team is ready to move fast. The #1 risk to the May 26 date is the business side delivering late. This list is everything we need from CMM, organized by urgency.

---

## DECISIONS NEEDED FROM CMM

### Due Week 1 (by Fri Apr 10)

| # | Decision | What we need | Who decides | Dev default if not decided |
|---|----------|-------------|-------------|---------------------------|
| 1 | **Content types taxonomy** | Final list of content types for the Insights section. Working proposal: Articles, Monthly Updates, Press Releases, Comprehensive Guides. Need CMM to confirm or modify. | CMM team + Zane | Dev builds with the 4 types above |
| 2 | **Entity priority list** | Which 100 Mongolian entities to profile first. We need a ranked list. Recommendation: MSE-listed public companies first, then top private companies by CMM deal flow. | CMM team + Zane | All MSE-listed public companies |
| 3 | **Entity type profile structures** | Approval of the full profile layout for each entity type: Public Company, Private Company, Project (Mining/Energy), Service Provider. This means: which widgets appear on each type, what data fields each widget contains, what's shared across types vs. unique. This is the blueprint for both frontend rendering and the AI profile generation pipeline. Dulguun can't build the pipeline until he knows exactly what a "complete" profile looks like per type. Zane will present the proposed structures (based on PRD Stories 2.2-2.7). CMM approves or adjusts. | CMM team | Dev builds from PRD spec (Stories 2.2-2.7) as-is |

### Due Week 2 (by Fri Apr 17)

| # | Decision | What we need | Who decides | Dev default if not decided |
|---|----------|-------------|-------------|---------------------------|
| 4 | **Connection request qualifying questions** | What information does CMM need from an investor requesting an introduction? Current proposal: name, email, company, message, investment ticket size. Anything else? | CMM analysts | Ship with current proposal |

### Due Week 3 (by Fri Apr 24)

| # | Decision | What we need | Who decides | Dev default if not decided |
|---|----------|-------------|-------------|---------------------------|
| 5 | **Legal review of AI-generated profiles** | Can we publish AI-generated company profiles compiled from public sources? Need: approved disclaimer language, dispute resolution process (what happens if a company objects?), data protection compliance position. This must be resolved before the AI pipeline generates profiles. | CMM leadership | We launch with generic "Compiled from public sources" disclaimer + "Report an error" link. Profiles marked as unverified until legal clears. |

### Due before launch

| # | Decision | What we need | Who decides | Dev default if not decided |
|---|----------|-------------|-------------|---------------------------|
| 6 | **CRM vendor selection** | Which CRM will CMM use? Dev is building a vendor-agnostic event queue, so this doesn't block engineering. But CMM needs a CRM to actually receive and act on leads. | CMM leadership | Event queue ships generic. CRM adapter built after CMM picks a vendor. |
| 7 | **Paywall strategy approval** | Zane will propose the full paywall strategy across the platform: what's public, what's gated behind registration, what's premium. This covers Insights (metered paywall), directory (public vs gated widgets), Market Feed, events, and financial data. CMM leadership reviews and approves. Not urgent for dev (metered paywall is already specced), but the business needs to align on the monetization posture before launch. | CMM leadership (Zane proposes) | Zane's proposal ships as-is |

---

## DOCUMENTS / LEGAL DELIVERABLES

| # | Document | What it covers | Owner | Deadline | Status |
|---|----------|---------------|-------|----------|--------|
| 1 | **Terms of Service** | Platform usage terms. Must cover multi-jurisdiction users (investors in HK, Singapore, US, EU). Cannot launch without this. | CMM leadership + legal counsel | Fri May 8 (hard) | Not started? |
| 2 | **Privacy Policy** | Data collection, storage, processing. GDPR, PDPO (HK), MAS considerations. Cannot launch without this. | CMM leadership + legal counsel | Fri May 8 (hard) | Not started? |
| 3 | **AI Profile Disclaimer** | Standard disclaimer text for all AI-generated entity profiles. "Compiled from public sources. Last verified: [date]. Report an error." | CMM leadership + legal | Fri Apr 24 | Not started |
| 4 | **Financial Data Disclaimer** | Disclaimer for all pages showing financial data. "Not investment advice." Must be reviewed by securities counsel given HK/Singapore/US audience. | CMM leadership + legal | Fri Apr 24 | Not started |
| 5 | **Dispute Resolution Process** | What happens when a Mongolian company objects to their AI-generated profile. Recommended: dedicated email, correct or remove within 5 business days. | CMM leadership | Fri Apr 24 | Not started |

**Ask for the meeting:** Who is CMM's legal counsel for this? Has the engagement started? If not, this needs to start Monday. ToS/Privacy Policy is the only true launch blocker with zero workaround.

---

## APPROVALS NEEDED

| # | Approval | From whom | Deadline | Notes |
|---|----------|-----------|----------|-------|
| 1 | **PRD scope sign-off** | CMM executives (both) | Fri Apr 10 | Written, not verbal. This locks scope. New feature requests go to v1.1 backlog. |
| 2 | **AI profile legal clearance** | CMM leadership | Fri Apr 24 | Must be done before Dulguun's pipeline generates real profiles |
| 3 | **Terms of Service sign-off** | CMM leadership | Fri May 8 | Final approval before publishing |
| 4 | **Launch readiness sign-off** | CMM executives | Fri May 22 | Final go/no-go on May 26 launch |

---

## ANALYST WORK STREAMS (2 analysts)

These are the ongoing work commitments from CMM's analyst team. Leadership needs to understand the time commitment and protect analyst capacity.

### Pre-launch sprints

| Work stream | Volume | Timeline | Estimated effort |
|-------------|--------|----------|-----------------|
| **Content migration QA** | 150 articles | W3-W4 (Apr 14-25) | ~8 days at 15-20 articles/day/analyst |
| **AI profile review** | 100 entity profiles | W3-W6 (Apr 14 - May 8) | ~5 days at 10-15 profiles/day/analyst |
| **Content-entity tag review** | AI suggests which entities are mentioned in each article. Analysts review and approve/edit/remove those tags. One review per article, but it powers both directions: entity profiles show linked research, and articles show linked entity chips. | W6 (May 4-8) | ~5 min/article, batch review |
| **CMS training** | Learn Payload CMS workflows | W2 (Apr 7-11) | 30-min walkthrough from Dulguun + practice |

### Ongoing post-launch commitments

| Work stream | Cadence | Estimated effort |
|-------------|---------|-----------------|
| **News feed review + tuning** | Daily queue of low-confidence items. Also: ongoing prompt tuning for AI news pipeline (improving entity matching accuracy, reducing false positives) and crawl source maintenance (adding new sources, fixing broken ones, adjusting for site changes). This isn't "set and forget." The pipeline needs a human keeping it healthy. | ~1 hr/day minimum, more in early weeks while pipeline is being calibrated |
| **New entity profiles** | 20-30 new profiles/week | ~2 days/week (1 analyst) |
| **Content publishing + image compression** | New articles via Draft > Review > Publish. **Important:** v1 does not include server-side image compression. Dev team will build a lightweight internal compression tool for analysts to use before uploading. Every image must be run through this tool before CMS upload. Uncompressed images slow page loads and hurt SEO. Server-side compression is scoped for v1.1. | Per CMS workflow |
| **Connection request handling** | Respond to investor intro requests | Within 24 hours |
| **Event management** | Set up events, manage registrations | Per event |

**Ask for the meeting:** Can the 2 analysts be dedicated to MarketIQ during the W3-W5 crunch (Apr 14 - May 1)? That's the peak. If they're split across other CMM work, the profile/content review timeline slips and launch is at risk.

---

## GRAPHIC DESIGNER DELIVERABLES

| # | Deliverable | Deadline | Notes |
|---|-------------|----------|-------|
| 1 | Brand assets (logo, favicon, color palette) | Fri Apr 10 (W1) | Gray needs these to finalize the design system |
| 2 | Content placeholder images by type | Fri Apr 17 (W2) | Default images for articles with no cover photo |
| 3 | OG image templates | Fri May 8 (W6) | For social sharing (entity profiles, articles, events) |
| 4 | Event graphics | Fri May 8 (W6) | For any events listed at launch |
| 5 | Launch email graphics + social assets | Fri May 15 (W8) | For launch communications |

---

## ADDITIONAL DISCUSSION POINTS

### Communication Structure & Cadence

Two syncs per week. All deadlines land on Fridays so decisions can be made in the Friday workshop if needed.

- **Tuesday sync (shorter):** Focus on weekly tasks and blockers. What's in progress, what's stuck, who needs what from whom. Keep it tight.
- **Friday sync (longer, workshop format):** Joint decision-making sessions. This is where open decisions get resolved, designs get reviewed, and deliverables get approved. Decisions due that week are resolved here or they default.
- **Daily async standup:** Dev team posts updates (Slack or ClickUp). CMM analyst posts review progress. Keeps everyone visible without more meetings.
- **Single point of contact on CMM side:** Name one analyst as the day-to-day contact for Dulguun and Gray when they have quick questions about content, entities, or events. Don't route every question through executives.
- **Escalation path:** If a CMM dependency is late, Zane flags in Tuesday sync. If not resolved by that Friday's workshop, Zane goes directly to CMM exec sponsors.

**Ask:** Confirm cadence. Name the CMM day-to-day contact. Confirm who attends Tuesday and Friday syncs.

---

### Analyst Weekly Commitment

Analysts are split across other CMM work. That's understood. But we need a guaranteed weekly time commitment to MarketIQ, especially during the W3-W5 crunch (Apr 14 - May 1).

**Propose:** Agree on a specific number of hours/days per week each analyst commits to MarketIQ review work. Even 2-3 dedicated days per week per analyst during the crunch window keeps us on track. Without a commitment, review work gets deprioritized and launch slips.

**Ask:** What weekly commitment can CMM guarantee for each analyst?

---

### Scope Freeze Agreement

Sign off on scope for both v1 and v1.1.

**The reality:** If we can't ship v1 by May 26, we collapse v1 and v1.1 into a single release and ship sometime in June. Keeping two separate scope definitions only matters if we hit the May 26 date. If we miss it, we skip v1 as a standalone milestone and go straight to v1.1.

**Ask:** CMM leadership signs the scope freeze for both v1 and v1.1. This means no new feature requests into v1. Anything new goes to v1.1 backlog (or later).

---

### Beta Testing with CMM Customers

CMM wants to run beta testing with their customers before v1 launch, and is also starting user research for v2 scope.

**Proposed timeline:** Late April or early May, when the staging build has enough substance to test (directory + insights + paywall functional). This aligns with the W7 soft launch in the 9-week plan, but could start earlier with a more limited build.

**Discussion points:**
- Who selects the beta testers? CMM picks from their investor network?
- How many? (5-10 is ideal for qualitative feedback, not a load test)
- How do we collect feedback? (Structured form vs. calls vs. both)
- Is the v2 user research separate from beta testing, or combined? If CMM is already talking to customers for v2 research, can we piggyback v1 beta feedback onto those same conversations?
- Clear rule: beta feedback that fits v1 scope = fix before launch. New feature requests from beta = v1.1 or v2 backlog. No scope creep from beta.

**Ask:** Align on beta timing, who owns recruiting testers, and the feedback process.

---

## MEETING AGENDA — SATURDAY APRIL 4

### Walk-through order:

1. **PRD scope sign-off.** Walk through what's in v1, what's in v1.1, what's out. Get written sign-off. Emphasize: if we miss May 26, v1 and v1.1 collapse into one June release.

2. **Decisions.** Walk through every decision in the table. Confirm owners, agree on deadlines. Lock what can be locked today (content types, entity priority list). Note defaults for anything not decided on time.

3. **Documents and legal.** Walk through all 5 legal deliverables. Confirm legal counsel is identified and engaged. Stress that ToS/Privacy Policy is the only true launch blocker.

4. **Analyst work streams + graphic designer deliverables.** Walk through the full list. Assign PICs. Agree on weekly analyst time commitment to MarketIQ.

5. **Communication structure.** Propose Wednesday sync + daily async. Name the CMM day-to-day contact for dev team. Confirm who attends syncs.

6. **Scope freeze.** Sign off for both v1 and v1.1. New requests go to backlog.

7. **Beta testing.** Align on timing (late April / early May), who recruits testers, feedback process, and the rule that beta feedback doesn't expand v1 scope.

8. **CMM day-to-day contact.** Name one analyst as the go-to for Dulguun and Gray.

9. **Commitment check.** End with: "Are we all committed to May 26? What on this list worries you?"

### Leave the meeting with:

- [ ] PRD scope sign-off (written, both v1 and v1.1)
- [ ] Content type taxonomy confirmed
- [ ] Entity priority list confirmed (or committed date)
- [ ] Legal counsel identified and engaged
- [ ] Weekly analyst time commitment agreed
- [ ] PICs assigned for all decisions, deliverables, and work streams
- [ ] CMM day-to-day contact named
- [ ] Beta testing approach aligned
- [ ] May 26 commitment confirmed (or concerns surfaced)
