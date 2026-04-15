# MarketIQ Sitemap — v1

## Public Pages

```
/                               Homepage (hero, movers, feed, sectors, research, CTA)
├── /insights                   Research hub (filterable article grid)
│   └── /insights/[slug]        Article detail (body, sidebar, related, paywall)
├── /directory                  Company directory (search, filter by sector/type)
│   └── /directory/[slug]       Entity profile (market data, financials, personnel)
├── /feed                       Market feed (live news, AI-aggregated, category tabs)
├── /events                     Events hub (upcoming conferences, event detail)
└── /about                      About CMM (mission, team, contact)

## Auth Pages

├── /sign-in                    Magic link sign-in (Semafor-style)
├── /sign-up                    Registration (email → magic link → profile setup)
└── /account                    User profile (name, company, job level, preferences)

## Gated (Registered+)

├── /insights/[slug]            Full article access (no blur)
├── /directory/[slug]           Full entity financials
└── /feed                       Full feed history

## Gated (Paid)

├── /insights/[slug]            PDF download, AI insights
├── /directory/[slug]           Advanced data, export
└── /alerts                     Custom alerts & watchlists (v2)
```

## Content Index Routes

| Route | Content Type | Source | Count (v1) |
|-------|-------------|--------|------------|
| `/insights?type=article` | Article | CMS | ~80 |
| `/insights?type=monthly-update` | Monthly Market Update | CMS | ~12 |
| `/insights?type=investment-teaser` | Investment Teaser | CMS | ~20 |
| `/insights?type=deal-insight` | Deal Insight | CMS | ~15 |
| `/insights?type=research-report` | Research Report | CMS | ~10 |
| `/insights?type=press-release` | Press Release | CMS | ~15 |
| `/insights?type=cmm-guide` | CMM Guide | CMS | ~5 |

## Directory Index

| Sector | Count (v1) | Example Entities |
|--------|------------|------------------|
| Mining & Resources | ~30 | Erdene Resource, Turquoise Hill, SouthGobi |
| Banking & Finance | ~15 | Khan Bank, Golomt Bank, TDB |
| Energy | ~10 | MCS Energy, Petrovis, Newcom |
| Capital Markets | ~10 | MSE, MASD, brokerages |
| Real Estate & Infrastructure | ~10 | MCS Property, Mongolian Properties |
| Technology | ~8 | AND Global, Ard Financial Group |
| State-Owned Enterprises | ~10 | Erdenet Mining, MIAT, MCS |
| Other | ~10 | Diverse sectors |
