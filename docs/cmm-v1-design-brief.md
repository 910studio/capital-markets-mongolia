# Design Brief: MarketIQ v1 — Production Design System

**Client:** Capital Markets Mongolia (CMM)
**Type:** Intelligence Platform (Web App)
**Date:** 2026-04-03
**Phase:** Production (approved direction: CMM Light + Atlas)
**Design Engineer:** Gray (910studio)
**Target:** May 26, 2026

---

## Direction

**"Creative Sophisticated yet Corp"** — AlphaSense readability × Koyfin data density × CMM brand identity. Light lavender canvas with surgical brand purple. Desktop-first for institutional desk users. Data IS the design.

---

## Color

| Token | Light | Dark | Role |
|-------|-------|------|------|
| `background` | `#FAFAFD` | `#0A0720` | Page canvas |
| `background-alt` | `#F4F2FA` | `#0F0B2C` | Alternating sections, hero |
| `foreground` | `#0C0A1D` | `#F0EEFF` | Primary text |
| `foreground-secondary` | `#44415A` | `#A9A4C4` | Secondary text, descriptions |
| `surface` | `#F0EEF7` | `#141038` | Card/widget backgrounds |
| `surface-elevated` | `#EAE8F3` | `#1C1648` | Hover surfaces, skeleton pulse |
| `surface-sunken` | `#FCFBFE` | `#0C0826` | Inset areas |
| `border` | `#DDDBE8` | `rgba(240,238,255,0.1)` | Component borders |
| `border-subtle` | `#EDEBF5` | `rgba(240,238,255,0.05)` | Row dividers |
| `brand` | `#3E149C` | `#8B6CD4` | Primary brand |
| `brand-hover` | `#2E0F75` | `#A58BE0` | Brand hover state |
| `brand-muted` | `rgba(62,20,156,0.07)` | `rgba(139,108,212,0.12)` | Brand tint backgrounds |
| `signal` | `#FCA311` | `#FCA311` | High-priority CTAs, alerts |
| `positive` | `#059669` | `#34D399` | Gains, success |
| `negative` | `#DC2626` | `#F87171` | Losses, errors |
| `info` | `#0891B2` | `#22D3EE` | Neutral info |

**Category colors:** Markets (`#3E149C`), Companies (`#0891B2`), Sectors (`#059669`), Insights (`#D97706`), AI (`#7C3AED`)

**Shadows:** Brand-tinted at low opacity. `rgba(62, 20, 156, 0.04)` → `0.12` across 5 levels.

---

## Typography

| Level | Font | Weight | Size | Tracking | Use |
|-------|------|--------|------|----------|-----|
| Hero | Plus Jakarta Sans | 800 | 3.5rem | -0.035em | Landing hero only |
| H1 | Plus Jakarta Sans | 800 | 2.75rem | -0.02em | Page titles |
| H2 | Plus Jakarta Sans | 700 | 2rem | -0.02em | Section headings |
| H3 | Plus Jakarta Sans | 700 | 1.5rem | -0.01em | Card titles, widget headers |
| Body | DM Sans | 400 | 0.9375rem | normal | Body text, descriptions |
| Body bold | DM Sans | 600 | 0.9375rem | normal | Inline emphasis |
| Small | DM Sans | 400 | 0.8125rem | normal | Captions, meta |
| Data | JetBrains Mono | 500 | 0.9375rem | normal | Prices, percentages, volumes |
| Label | Plus Jakarta Sans | 600 | 0.6875rem | 0.08em uppercase | Table headers, section labels |
| Code label | JetBrains Mono | 500 | 0.6875rem | 0.06em uppercase | Timestamps, status |

---

## Component Personality

### Buttons
- Shape: `8px` radius (not pill, not square)
- Primary: brand gradient bg → white text → brand shadow
- Secondary: surface-elevated bg → 1px border → fg text
- Signal: signal gradient → dark text (high-priority CTAs only)
- Hover: `translateY(-1px)` + shadow-xl
- Active: `scale(0.97)`
- Text: Plus Jakarta Sans 600, sentence case

### Cards
- Radius: `12px`, 1px border
- Default: no shadow
- Hover: `translateY(-3px)` + shadow-lg + border → brand-light
- Accent bar: 3px top in brand color (featured content only)
- Types: content card (image + body), entity card (logo + metrics), news card (headline + meta), event card (date + details)

### Inputs
- Height: 44px, 1px border, 8px radius
- Focus: brand border + 3px brand-muted ring
- Error: negative border + shake + error text below
- Label: above, Plus Jakarta Sans 600

### Data Tables
- Header: display font, uppercase xs, secondary color, 2px bottom border
- Rows: subtle bottom border, hover → brand-muted bg
- Numbers: mono font, right-aligned, tabular-nums
- Positive/negative: semantic colors, mono 600

### Badges
- Shape: `4px` radius (sharp, not pill)
- Style: muted bg + category color text
- Plus Jakarta Sans 600, xs, slight letter-spacing
- Max 2 badges per card

---

## Page Layouts

**Global shell:** Fixed header (56px, backdrop blur) → content → footer. Max content width: 1200px.

**Nav:** Directory | Insights | Market Feed | Events — right side: search + auth + mode toggle. Mobile: hamburger.

| Page | Layout | Key patterns |
|------|--------|-------------|
| Landing `/` | Full-width hero → 3-col value strip → featured entities → latest insights → CTA banner | Hero: headline + live data card side-by-side |
| Directory `/directory` | Sidebar (260px) + 3-col card grid | Filters: entity type, sector, deal status. Sticky sidebar desktop, drawer mobile |
| Entity Profile `/directory/[slug]` | Entity header → 2-col (main widgets + sidebar stats) | Widget renderer from `layout_config`. Type-specific widget sets |
| Insights `/insights` | Sidebar filters + 3-col card grid | Filter: content type, sector, date. Metered counter top |
| Content Detail `/insights/[slug]` | Cover → narrow body (720px max) + entity chip sidebar | Paywall wall inline. PDF download bar |
| Feed `/feed` | Ticker strip → filter tabs → single-col card stream | Entity chips per card. Source attribution |
| Events `/events` | Featured hero → upcoming grid → past archive | Registration CTA prominent |
| Event Detail `/events/[slug]` | Header → agenda timeline → speaker grid → registration form | Date/location prominent |
| Portal `/portal` | Simple form layout, registered events list | Minimal |
| Connection Form | Slide panel or inline on entity profile | Pre-filled user data, ticket size dropdown |

---

## Widget System

Dynamic widget renderer: entity `layout_config` → ordered list of widget names → React component registry.

| Widget | Entity Types | Data |
|--------|-------------|------|
| `MarketDataWidget` | Public Company | Stock chart (1M/3M/1Y/ALL), price, change, volume |
| `FinancialPerformanceWidget` | Public, Private | Multi-year table: Balance Sheet, P&L, Cash Flow |
| `DealActionWidget` | Private, Project | Raising round, amount, "Request Connection" CTA |
| `CapitalStructureWidget` | Private | Equity round history |
| `ProjectTechnicalWidget` | Project (Mining/Energy) | Key-value specs table (commodity, reserves, grade, capacity) |
| `KeyPersonnelWidget` | All except minimal SP | Name, title, photo, bio grid |
| `OwnershipListWidget` | Public, Project | Owner/sponsor list with role + % |
| `CMMResearchWidget` | All | Linked Insights content (max 5, sorted by date) |
| `MarketNewsWidget` | All | Linked news items (max 5, sorted by date) |

**Widget chrome:** surface bg, 1px border, 12px radius. Header: display font 700 + optional expand/collapse.
**Loading:** pulse skeleton matching widget layout.
**Error:** inline, negative-muted bg, retry link.
**Empty:** widget hidden entirely (no chrome).

---

## State Patterns

**Loading:** Skeleton pulse (surface → surface-elevated, 1.5s ease). Widget-level independent. Button: spinner inside, disabled.

**Error:** Widget-level inline (negative-muted bg + retry). Page-level centered card. Toast: top-right, auto-dismiss 5s.

**Empty:** Widget hidden. Page: "No [items] found" + clear filters hint. Search: "No results for '[query]'".

**Paywall:** Counter top of content ("2 of 3 free articles remaining"). Wall: gradient mask → registration card inline. Premium badge on card + detail. CTA links to Clerk signup, redirects back after.

---

## Motion — Level 3 (Polished)

| Pattern | Spec |
|---------|------|
| Scroll reveal | opacity 0→1, translateY(24→0), 600ms ease-out, stagger 100ms |
| Hover lift | translateY(-2px), 150ms, shadow grow |
| Active press | scale(0.97), 100ms |
| Tab indicator | left + width transition, 300ms ease |
| Toggle | thumb translate 20px, 300ms ease-bounce |
| Counter | Number roll-up on scroll enter, 800ms |
| Skeleton | Pulse, 1.5s ease-in-out, infinite |
| Toast | Slide in from right, auto-dismiss fade 5s |

**Easing:** `cubic-bezier(0.22, 1, 0.36, 1)` (primary), `cubic-bezier(0.34, 1.56, 0.64, 1)` (bounce for toggles/buttons).

---

## Inspiration

| Reference | Steal this |
|-----------|-----------|
| **AlphaSense** | Readability. Info hierarchy. How they handle dense financial text without feeling cluttered |
| **Koyfin** | Data density done right. Chart UX. How they present multiple data types per company |
| **Linear** | Surface/elevation system. Component polish. Loading states. Dark mode execution |
| **Crunchbase** | Company directory UX. Card layouts. Filter sidebar patterns |
| **Stripe Docs** | How they explain complex information clearly. Progressive disclosure |

---

## Anti-Preferences

### HARD NO

| Category | Banned | Why |
|----------|--------|-----|
| Color | Gradients across hue families (purple→orange) | Garish. Killed in Phase 2. |
| Color | Pastels, neon | Client killed pastels. Neon = crypto energy |
| Color | Corporate blue (#0066FF) | Every other fintech |
| Type | Serifs anywhere | Client mandate: Atlas direction is all sans |
| Type | Text shadows, outlined text | 2019 energy |
| Layout | Hero sliders/carousels | It's 2026 |
| Layout | Masonry grids | Pinterest, not Bloomberg |
| Layout | Hamburger on desktop | Institutional users need visible nav |
| Motion | Bounce animations | Unprofessional for finance |
| Motion | Anything > 600ms | Feels sluggish on a trading desk |
| Imagery | Stock photos (handshakes, skylines) | Template energy |
| Imagery | Flat corporate illustrations | Humaaans/Undraw = amateur hour |
| Components | Glassmorphism | Trend trap |
| Components | Pill-shaped buttons | Too playful for institutional |
| Components | Modal on page load | Hostile UX |
| Content | "Leverage", "synergy", "delve" | Banned words |
| Content | "Submit" buttons | Use specific verbs: "Start Research", "Request Connection" |
| Vibe | Floating mockups, gradient mesh heroes | Startup landing page |
| Vibe | "Powered by AI" badges | The AI is invisible infrastructure |
| Vibe | Template flow (hero→features→testimonials→pricing) | Generic startup pattern |

---

## Tailwind Config

```typescript
// tailwind.config.ts
const config = {
  theme: {
    extend: {
      colors: {
        background: { DEFAULT: '#FAFAFD', alt: '#F4F2FA' },
        foreground: { DEFAULT: '#0C0A1D', secondary: '#44415A' },
        surface: { DEFAULT: '#F0EEF7', elevated: '#EAE8F3', sunken: '#FCFBFE' },
        border: { DEFAULT: '#DDDBE8', subtle: '#EDEBF5' },
        brand: {
          DEFAULT: '#3E149C',
          hover: '#2E0F75',
          light: '#6B4CC0',
          lighter: '#9B7EDB',
          muted: 'rgba(62, 20, 156, 0.07)',
          text: '#FFFFFF',
        },
        signal: { DEFAULT: '#FCA311', hover: '#E89200', light: '#FFD166', muted: 'rgba(252, 163, 17, 0.1)' },
        positive: { DEFAULT: '#059669', text: '#065F46', muted: 'rgba(5, 150, 105, 0.08)' },
        negative: { DEFAULT: '#DC2626', text: '#991B1B', muted: 'rgba(220, 38, 38, 0.08)' },
        info: { DEFAULT: '#0891B2', muted: 'rgba(8, 145, 178, 0.08)' },
        cat: {
          markets: '#3E149C',
          companies: '#0891B2',
          sectors: '#059669',
          insights: '#D97706',
          ai: '#7C3AED',
        },
      },
      fontFamily: {
        display: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        body: ['DM Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        xs: '0.6875rem',
        sm: '0.8125rem',
        base: '0.9375rem',
        lg: '1.0625rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
        '4xl': '2.75rem',
        hero: '3.5rem',
      },
      borderRadius: {
        xs: '4px',
        sm: '6px',
        DEFAULT: '8px',
        lg: '12px',
        xl: '16px',
      },
      boxShadow: {
        xs: '0 1px 2px rgba(62, 20, 156, 0.04)',
        sm: '0 2px 4px rgba(62, 20, 156, 0.06)',
        md: '0 4px 12px rgba(62, 20, 156, 0.08)',
        lg: '0 8px 24px rgba(62, 20, 156, 0.1)',
        xl: '0 16px 40px rgba(62, 20, 156, 0.12)',
        brand: '0 4px 16px rgba(62, 20, 156, 0.2)',
        signal: '0 4px 16px rgba(252, 163, 17, 0.2)',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.22, 1, 0.36, 1)',
        bounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
};
```

---

*Design system by 910studio for Capital Markets Mongolia. Production reference for MarketIQ v1.*
