# Design Brief: CMM Market IQ — Phase 2

**Client:** Capital Markets Mongolia
**Type:** AI-Native Intelligence Platform (SaaS)
**Date:** 2026-03-29
**Created by:** 910studio
**Phase:** 2 — Post-Workshop Refinement (Single Approved Direction)

---

## Workshop Outcome

Client presentation on 2026-03-29 validated a single direction: **CMM Light + Atlas typography** with stronger brand presence. The mandate: **"Creative, Sophisticated yet Corp."**

### Killed Directions
- **Mono** — "Too general"
- **Ledger** — Hard no
- **Blueprint** — Hard no
- **Pastel soft tones** — No

### Client-Ranked References
1. AlphaSense (#1 — font readability, ease on eyes)
2. Crunchbase
3. Pitchbook
4. Carta
5. Bloomberg (they love it)
6. Yahoo Finance ("the bible")

---

## Color

| Token | Value | Why |
|-------|-------|-----|
| Background | `#FAFAFF` | Subtle lavender-white. Not pure white, not pastel — branded white. |
| Background Alt | `#F2EFFC` | Stronger lavender for alternating sections. The "branding tint" the client demanded. |
| Foreground | `#0C0A1D` | Deep purple-black. Tinted, not neutral. |
| Foreground Secondary | `#44415A` | Purple-tinted gray for body text. |
| Surface | `#F0EDF9` | Lavender panels. Every surface whispers brand. |
| Surface Elevated | `#E8E4F4` | Hover/active state. More purple. |
| Border | `#D8D4EA` | Purple-tinted borders. |
| Brand (Primary) | `#3E149C` | CMM Purple. THE color. |
| Brand Hover | `#2E0F75` | Deeper purple on interaction. |
| Brand Light | `#6B4CC0` | Tags, secondary brand elements. |
| Signal (Secondary) | `#FCA311` | CMM Orange. Breaking news, CTAs, highlights. |
| Signal Hover | `#E89200` | Deeper orange. |
| Positive | `#059669` | Green for gains, success. |
| Negative | `#DC2626` | Red for losses, errors. |
| Info | `#0891B2` | Cyan for neutral info states. |

### Category Colors (Content Taxonomy)
| Category | Color | Why |
|----------|-------|-----|
| Markets | `#3E149C` | Brand purple. Markets = core identity. |
| Companies | `#0891B2` | Cyan. Distinct from markets, professional. |
| Sectors | `#059669` | Green. Growth, industry, progress. |
| Insights | `#D97706` | Warm amber. Attention, editorial weight. |
| AI | `#7C3AED` | Violet. Tech-forward, distinct from brand purple. |

### Gradient Library
| Gradient | Values | Usage |
|----------|--------|-------|
| Brand Primary | `135deg, #3E149C → #5B25C9` | Hero sections, primary CTAs |
| Brand Accent | `135deg, #3E149C → #7B4FD6 → #FCA311` | Feature highlights, brand moments |
| Signal Warm | `135deg, #FCA311 → #FFD166` | Secondary CTAs, alerts |
| Surface Fade | `180deg, #FAFAFF → #F2EFFC` | Page-level section transitions |
| Pro Dark | `160deg, #0A0720 → #1A1048 → #3E149C` | Dark mode hero, paid tier header |

### Shadow System (Brand-Tinted)
All shadows carry a purple tint — `rgba(62, 20, 156, x)` — reinforcing brand even in elevation.

```
xs:     0 1px 2px rgba(62, 20, 156, 0.04)
sm:     0 2px 4px rgba(62, 20, 156, 0.06)
md:     0 4px 12px rgba(62, 20, 156, 0.08)
lg:     0 8px 24px rgba(62, 20, 156, 0.1)
xl:     0 16px 40px rgba(62, 20, 156, 0.12)
brand:  0 4px 16px rgba(62, 20, 156, 0.2)
signal: 0 4px 16px rgba(252, 163, 17, 0.2)
```

---

## Typography

| Role | Font | Weights | Why |
|------|------|---------|-----|
| Display | Plus Jakarta Sans | 400, 500, 600, 700, 800 | Geometric precision with personality. Client loved the Atlas pairing — authoritative without being cold. |
| Body | DM Sans | 400, 500, 600, 700 | Optical sizing, exceptional readability. AlphaSense-grade legibility. |
| Mono | JetBrains Mono | 400, 500 | Financial data, tickers, AI citations. |
| Cyrillic Fallback | Inter / Golos Text | 400–700 | For Mongolian language content. |

**Scale:** 15px base, 1.25 (Major Third) ratio
**Letter spacing:** -0.03em on hero, -0.02em on h1-h3, 0.08em on labels (uppercase)
**Line height:** 1.08-1.2 on display, 1.6-1.7 on body

---

## Component Direction: Dense (Primary)

**Client chose Dense as the primary component personality.** This overrides any softer Atlas defaults from the v1 design brief. Dense = tight radii, compact padding, sharp badges, zero decorative lift. Data-first, Koyfin energy. The platform should feel like a tool, not a brochure.

All values below are the production values. If a spec in the v1 design brief conflicts with this section, Dense wins.

### Cards
- Radius: `4px` (not 12px)
- Background: `#FFFFFF` (white)
- Border: `1px solid var(--border)`
- Padding: `14px`
- Image radius: `2px`
- Shadow: `shadow-xs` (barely there)
- Hover: border → `brand-light`, shadow → `shadow-sm`, **no vertical lift** (`translateY: 0`)
- Title size: `0.9375rem` (15px — same as body, weight carries the hierarchy)

### Badges
- Radius: `2px` (razor sharp)
- Padding: `2px 6px`
- Font: `0.5625rem` (9px), weight `700`, `uppercase`
- Letter spacing: `0.06em`
- Style: muted bg + category color text

### Buttons
- Radius: `4px`
- Height: `34px` (compact)
- Primary: brand bg → white text
- Secondary: surface bg → 1px border
- Active: `scale(0.97)`

### Grid
- Gap: `12px` (tight)
- Default columns: `4`
- Section gap: `32px`

### Navigation
- Active state: `surface` background fill (no underline indicator)

### Widgets
- Background: `#FFFFFF`
- Border: `1px solid var(--border)`
- Radius: `4px`
- Padding: `14px`
- Shadow: `shadow-xs`
- Header: `bg-alt` background, `1px solid var(--border-s)`, padding `10px 14px`

### Data Tables
- Header: `bg-alt` background, `1px solid var(--border)` bottom
- Row height: `38px` (compact)
- Hover: `brand-muted` background

### Tabs
- Radius: `4px`

### Why Dense Works for MarketIQ
- Institutional users want information density, not whitespace
- 4-column grids show more entities per viewport — directory browsing is faster
- Sharp radii read as "serious tool" not "consumer app"
- Compact padding lets data tables and widgets breathe just enough without wasting screen real estate
- Zero hover-lift keeps the interface grounded — motion comes from micro-interactions (press scale, tab slides, scroll reveals), not decorative lifts

---

## Imagery & Aesthetic

- **Mood:** Light, warm-professional, colorful-with-purpose, modern, branded, balanced density
- **Mood Sentence:** "A branded finance platform that feels creative and modern — AlphaSense readability meets Bloomberg conviction, wrapped in CMM purple."
- **Texture:** None in-product. Clean. Speed is the aesthetic. Gradients carry the warmth.
- **Photography:** Minimal — news imagery is scraped/automated. Article imagery is editorial. No stock.
- **Graphics:** Data visualizations, charts, financial graphics. Brand-colored. No generic illustrations.
- **Motion:** **Level 3–4** (client mandated). Scroll-triggered reveals, spring physics on buttons, hover lifts on cards, counter animations on data, tab indicators that slide, staggered list entries, loading state animations. Motion is a requirement.

### Motion Specification
| Element | Animation | Duration | Easing |
|---------|-----------|----------|--------|
| Page sections | Fade-up on scroll | 600ms | `cubic-bezier(0.22, 1, 0.36, 1)` |
| Buttons | Scale 0.92 on press, spring return | 150ms down, 400ms up | `cubic-bezier(0.34, 1.56, 0.64, 1)` |
| Cards | Border → brand-light + shadow-sm on hover (no lift) | 300ms | ease-out |
| Data counters | Count-up animation | 1200-1500ms | Cubic ease-out |
| Stagger lists | 80ms offset between items | 400ms per item | ease-out |
| Tab indicators | Sliding underline | 300ms | ease-out |
| Toggle switches | Spring thumb slide | 300ms | bounce easing |

---

## Three-Tier Access Strategy

Dense is the baseline component system across all tiers. Tiers differ in **what's visible**, not in component personality. Same tight cards, same sharp badges, same compact tables everywhere — the access level controls content depth, not visual style.

| Tier | Vibe | What's Visible |
|------|------|----------------|
| **Public** | Dense but inviting — editorial hero, then data | Hero section, basic company info, blurred advanced data with CTA |
| **Registered** | Dense, data-forward | Full profiles, basic charts, financial summaries, blurred AI insights |
| **Paid** | Dense, full Bloomberg | Everything. AI insights, dense data rows, export, alerts, multi-column layouts |

### Visual Differentiation
- **Public:** Same Dense components. Hero section gets more breathing room (larger type, gradient accents). Below the fold, density is the same as other tiers — just with fewer data points visible.
- **Registered:** Full Dense system. More data surfaces unlocked. Charts and financial summaries appear.
- **Paid:** Full Dense system. Maximum data: AI insight panels, multi-metric rows, export controls. No component style change — just more content rendered.

---

## News/Content Architecture

| Type | Source | Treatment |
|------|--------|-----------|
| **News** | AI-aggregated (scraped) | Portal layout (Yahoo Finance). Ticker, headlines, source attribution. "AI Summary" tag. No dedicated imagery — text-driven. |
| **Articles** | Written by CMM team | Editorial layout. Featured imagery. Author attribution. Longer form. |
| **Insider News** | Premium written content | Gated to Paid tier. Star badge. Exclusive tag. |

### News Portal Pattern
- Live ticker strip (stock symbols + change %)
- Category tabs: All | Markets | Companies | Sectors | Insider
- Main story (hero) + sidebar feed
- AI-generated summary badges on aggregated content
- Source attribution on every item

---

## Inspiration

| Reference | Steal This | Adapt How |
|-----------|-----------|-----------|
| **AlphaSense** | Font readability, clean data presentation, search UX | Replace their blue with CMM purple. Add motion they lack. |
| **Bloomberg** | Data density, information hierarchy, pro-tier conviction | Only for Paid tier. Public pages stay editorial. |
| **Yahoo Finance** | News portal format, ticker bar, content categorization | Modernize with CMM's gradient/brand language. AI-aggregate instead of manual. |
| **Crunchbase** | Entity profile structure, company cards, data organization | Adapt for Mongolian market. Add tier-based visibility. |
| **Pitchbook** | Detailed financial data tables, deal flow presentation | Reference for Paid tier data density. |

---

## Anti-Preferences (Updated Post-Workshop)

### HARD NO

| Category | Banned | Why |
|----------|--------|-----|
| Color | Pastel soft tones | Client explicitly killed. Not the vibe. |
| Color | Corporate blue | Still reads "bank website." CMM is intelligence. |
| Color | Monochrome / muted | Client wants colorful. Brand-driven color, not restraint. |
| Type | Monospace-first (Space Mono) | Ledger direction killed. Mono is for data only. |
| Layout | Hero sliders / carousels | 2026. Nobody clicks slide 3. |
| Layout | Minimal/conviction-first (Notion energy) | Client rejected this explicitly. They want brand presence. |
| Imagery | Stock handshakes / boardrooms | Destroys credibility. |
| Imagery | AI-generated art | Cheap and recognizable. |
| Components | Glassmorphism | Peaked in 2022. |
| Content | "Leverage" / "synergy" / "robust" | Corporate buzzword slop. |
| Vibe | Bloomberg terminal cosplay | Dense for Paid tier, but never intimidating. |
| Vibe | Consumer fintech (Robinhood/Revolut) | Too casual for institutional desks. |
| Vibe | Template energy | If it looks bought, start over. |

### CAREFUL WITH

| Thing | Works When | Doesn't When |
|-------|-----------|-------------|
| Gradients | Simple, 2-stop, same hue family | Mesh gradients, rainbow, gradient text |
| ALL CAPS | Labels, badges, nav items | Headlines, body, long strings |
| Dark mode | Pro/paid tier option | Forced on all users |
| Data density | Paid tier with clear hierarchy | Public pages — keep those editorial |
| "AI" branding | Small badges, subtle tags | Large "AI-POWERED" banners |

### "SMELLS LIKE" TEST

- [ ] Not a template
- [ ] Not a bank website
- [ ] Not Bloomberg cosplay
- [ ] Not every other SaaS startup
- [ ] Not consumer fintech
- [ ] Feels colorful but not chaotic
- [ ] Investment banker would trust this
- [ ] Finance bro would find it engaging
- [ ] Regular user wouldn't feel intimidated on Public tier

---

## Design Philosophy: Western/Eastern Mix

Client specifically requested a blend of Western and Eastern UI design.

**Western influence (structure):**
- AlphaSense-grade readability and whitespace
- Clean typography hierarchy
- Professional component design
- Measured spacing rhythm

**Eastern influence (density + color):**
- Prominent color coding (red/green for financial data)
- Category badges and tags as primary navigation aids
- Higher information density in data views (Paid tier)
- Horizontal tab navigation layers
- Bold use of brand color throughout interface

---

*Phase 2 Design System by 910studio · March 2026*
*Direction: CMM Light + Atlas · Font: Plus Jakarta Sans + DM Sans*
*Mandate: Creative, Sophisticated yet Corp*
