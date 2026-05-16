export interface MockArticle {
  slug: string;
  title: string;
  excerpt: string;
  contentType: "article" | "market-brief" | "investment-teaser" | "deal-insight" | "research-report" | "press-release";
  topics: string[];
  series?: string;
  author: string;
  publishedAt: string;
  readTime: number;
  isPremium: boolean;
  entityRefs: string[];
  coverImage?: string;
}

/* ── Directory Types ─────────────────────── */

export type EntityType = "public_company" | "private_company" | "project" | "service_provider";

export const ENTITY_TYPE_LABELS: Record<EntityType, string> = {
  public_company: "Public Company",
  private_company: "Private Company",
  project: "Project",
  service_provider: "Service Provider",
};

export const ENTITY_TYPE_FILTERS = [
  { label: "All", value: "all" },
  { label: "Public Companies", value: "public_company" },
  { label: "Private Companies", value: "private_company" },
  { label: "Projects", value: "project" },
  { label: "Service Providers", value: "service_provider" },
] as const;

export const SECTOR_LIST = [
  "Mining & Resources",
  "Banking & Finance",
  "Energy",
  "Technology",
  "Real Estate & Infrastructure",
  "Capital Markets",
  "Agriculture",
  "Professional Services",
] as const;

/** Slug ↔ label pairs. Slugs match `public.sectors` rows on the backend. */
export const SECTOR_OPTIONS = [
  { slug: "mining", label: "Mining" },
  { slug: "financial-services", label: "Financial Services" },
  { slug: "energy", label: "Energy" },
  { slug: "tech-media", label: "Technology & Media" },
  { slug: "real-estate", label: "Real Estate" },
  { slug: "infrastructure", label: "Infrastructure" },
  { slug: "consumer-services", label: "Consumer & Services" },
  { slug: "agriculture", label: "Agriculture" },
  { slug: "cashmere-textile", label: "Cashmere & Textile" },
  { slug: "conglomerate-soe", label: "Conglomerate & SOE" },
  { slug: "healthcare", label: "Healthcare" },
  { slug: "logistics", label: "Logistics" },
  { slug: "services", label: "Services" },
  { slug: "other", label: "Other" },
] as const;

export const SECTOR_SLUG_TO_LABEL: Record<string, string> = Object.fromEntries(
  SECTOR_OPTIONS.map((s) => [s.slug, s.label]),
);

/** Backend uses uppercase enum, frontend uses lowercase. */
export const ENTITY_TYPE_TO_BACKEND = {
  public_company: "PUBLIC_COMPANY",
  private_company: "PRIVATE_COMPANY",
  project: "PROJECT",
  service_provider: "SERVICE_PROVIDER",
} as const satisfies Record<EntityType, string>;

/* ── Rich entity spec (from Entity Fields Master, Apr 23) ── */

export type DataSource = "AI-Sourced" | "AI-Generated" | "CMM Verified" | "CMM Curated" | "Company Submitted";

export type AIConfidence = "high" | "medium" | "low";

export interface AISourceCitation {
  field: string;
  source: string;
  url?: string;
  confidence: AIConfidence;
}

export interface AISourceMeta {
  /** ISO date the AI pipeline last refreshed this profile */
  lastCrawled: string;
  /** Field-level provenance for analyst spot-check */
  citations: AISourceCitation[];
  /** Optional model + run ID for traceability */
  pipelineRun?: string;
}
export type ListingLocation = "LOCAL" | "FOREIGN";
export type ProjectStage = "Exploration" | "Feasibility" | "Construction" | "Operating" | "Expansion";

export interface Person {
  name: string;
  title: string;
  initials?: string;
  photo?: string;
  slug?: string;
}

export interface Shareholder {
  name: string;
  percentage: number;
  controlling?: boolean;
  slug?: string;
}

export interface Subsidiary {
  name: string;
  slug?: string;
  status?: string; // "Operating", "Construction", etc.
}

export interface Deal {
  date: string;
  amount: string;
  investors: string[];
  fundingType: "Equity" | "Debt" | "Bond" | "Syndicated Loan" | "Other";
  purpose: string;
}

export interface Download {
  title: string;
  url?: string;
  fileSize?: string;
  pages?: number;
  date?: string;
}

export interface Certification {
  name: string;
  logo?: string;
}

export interface Sustainability {
  /** Outcomes from Mongolia SDG Finance Taxonomy (12 categories) */
  outcomes: string[];
  /** UN SDGs 1-17 */
  sdgs: number[];
  esgPolicy: boolean;
  disclosure: boolean;
  transitionStrategy: boolean;
  impactTracked: boolean;
  impactVerified: boolean;
  certifications: Certification[];
}

export interface SummaryRatios {
  pe?: string;
  pb?: string;
  evEbitda?: string;
  divYield?: string;
  roe?: string;
  marketCap?: string;
}

export interface FinancialYear {
  year: string;
  pl?: Record<string, string>;
  balanceSheet?: Record<string, string>;
  cashFlow?: Record<string, string>;
}

export interface MockEntity {
  slug: string;
  name: string;
  ticker?: string;
  sector: string;
  type: EntityType;
  description: string;

  /* Market data */
  listingLocation?: ListingLocation;
  exchange?: string;
  marketCap?: string;
  price?: number;
  change?: number;
  changePercent?: number;
  volume?: string;
  lastUpdated?: string;

  /* Status */
  isRaising?: boolean;
  isFeatured?: boolean;
  dataSource?: DataSource;

  /* Header */
  logo?: string;
  website?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };

  /* Financial — BLOCKED pending Zoloo/Namkhai structure */
  summaryRatios?: SummaryRatios;
  financials?: FinancialYear[];
  financialBlocked?: boolean;

  /* Sustainability */
  sustainability?: Sustainability;

  /* Ownership */
  parentGroup?: { name: string; slug?: string };
  shareholders?: Shareholder[];
  subsidiaries?: Subsidiary[];

  /* Project-specific */
  sponsor?: { name: string; slug?: string; stake?: number };
  sponsorRepresentative?: Person;
  stage?: ProjectStage;
  location?: string;
  keyMetrics?: Record<string, string>; // flexible for Mining/Energy/Infra

  /* Service Provider-specific */
  yearEstablished?: number;
  languages?: string[];
  internationalAffiliations?: string[];
  practiceAreas?: string[];
  notableEngagements?: string[];
  notableClients?: string[];
  contactEmail?: string;
  contactPhone?: string;
  contactAddress?: string;

  /* People */
  ceo?: Person;
  executives?: Person[];
  boardMembers?: Person[];

  /* Deals */
  dealsSummary?: string;
  deals?: Deal[];

  /* Downloads */
  reports?: Download[];
  pitchDecks?: Download[];
  sustainabilityDocs?: Download[];
  investmentTeasers?: Download[];
  operationalDocs?: Download[];

  /* AI-Sourced metadata (only present when dataSource === "AI-Sourced") */
  aiMeta?: AISourceMeta;
}

export const MOCK_ARTICLES: MockArticle[] = [
  {
    slug: "mongolia-banking-sector-q1-2026-earnings-review",
    title: "Mongolia's Banking Sector: Q1 2026 Earnings Review — Who's Winning the Race?",
    excerpt: "Khan Bank posted record net income of MNT 98.2B, up 23% YoY, while Golomt Bank surprised with 18% loan growth and improved NIM. Trade and Development Bank is preparing a landmark $500M capital raise for Central Asian expansion. Meanwhile, Ard Financial Group continues to disrupt with its fintech-first model — the Ard App now processes 40% of Mongolia's mobile transactions. Mandal Insurance rounds out the sector with a quiet but steady performance in non-life premiums. The sector's aggregate ROE hit 22.4%, the highest since 2019, driven by corporate lending and digital banking revenue across all major players.",
    contentType: "research-report",
    topics: ["Banking & Finance", "Capital Markets"],
    author: "Namkhaidorj B.",
    publishedAt: "2026-04-18",
    readTime: 18,
    isPremium: true,
    entityRefs: ["khan-bank", "golomt-bank", "tdb", "ard-financial-group", "mandal-insurance"],
    coverImage: "/insights/mongolia-equities-2025.webp",
  },
  {
    slug: "mongolia-steel-complex-international-tender",
    title: "Mongolia Opens International Tender for Landmark Steel Complex",
    excerpt: "Mongolia launched an international tender for its $806M Steel Production Complex in Darkhan-Uul Province. The facility targets one million tons of annual steel output, covering 60-70% of domestic demand and reducing import dependence on Russian and Chinese steel. The government has signaled strong preference for operators that commit to integrated value chain — from iron ore processing through to finished products — with first production targeted for Q4 2028.",
    contentType: "article",
    topics: ["Mining & Resources", "Economy & Macro"],
    author: "Enkhjin A.",
    publishedAt: "2026-04-13",
    readTime: 6,
    isPremium: false,
    entityRefs: ["darkhan-steel"],
    coverImage: "/insights/steel-complex.webp",
  },
  {
    slug: "monthly-market-update-march-2026",
    title: "Monthly Market Update — March, 2026",
    excerpt: "Bank of Mongolia held the policy rate at 12%, citing persistent food-price inflation and tugrik pressure against the dollar. The month also delivered a 37th-cabinet transition under PM Uchral N. with ten ministers carrying over from the previous administration. Equity markets absorbed commodity price shocks on copper and coking coal, while MSE Top-20 finished the month flat on rotation from resources into banks. Our forward view for Q2 leans cautiously constructive.",
    contentType: "market-brief",
    topics: ["Economy & Macro", "Capital Markets"],
    series: "Monthly Market Update",
    author: "Enkhjin A.",
    publishedAt: "2026-04-08",
    readTime: 15,
    isPremium: false,
    entityRefs: ["mse"],
    coverImage: "/insights/mmu-march-2026.webp",
  },
  {
    slug: "mongolia-new-cabinet-assembled",
    title: "Mongolia's New Cabinet Is Assembled. Now Comes the Hard Part.",
    excerpt: "PM Uchral N. assembled a 19-minister cabinet at 2:24 AM on April 4 — Mongolia's third premiership in nine months. Ten ministers carry over from Zandanshatar's administration, signaling a deliberate continuity-over-replacement strategy during what Uchral characterized as a 'triple crisis' of fuel prices, commodity swings, and political fragmentation. Appointments in Mining (Damdinnyam G.), Finance (Mendsaikhan Z.), and Energy (Naidalaa B.) preview where policy will move first — with Oyu Tolgoi renegotiation, a ₮3.3T fiscal deficit, and grid reliability all on the first-100-days docket.",
    contentType: "article",
    topics: ["Policy & Regulation", "Economy & Macro"],
    author: "Tselmeg E.",
    publishedAt: "2026-04-07",
    readTime: 8,
    isPremium: false,
    entityRefs: ["oyu-tolgoi"],
    coverImage: "/insights/new-cabinet.webp",
  },
  {
    slug: "three-prime-ministers-whats-next",
    title: "Three Prime Ministers in Less Than a Year: What's Next for Mongolia?",
    excerpt: "Zandanshatar's resignation caps a bruising nine months of MPP intra-party tensions over power concentration and cabinet turnover. Uchral arrives with a track record that investors should find constructive — he delivered the Orano uranium deal, championed capital markets reform, and has signaled openness to renegotiating mining stability agreements in ways that unlock stalled foreign capital. The question for 2026: can he sustain a majority long enough to execute?",
    contentType: "article",
    topics: ["Policy & Regulation", "Capital Markets"],
    author: "Zolbayar E.",
    publishedAt: "2026-03-30",
    readTime: 7,
    isPremium: false,
    entityRefs: [],
    coverImage: "/insights/three-pms.webp",
  },
  {
    slug: "china-energy-transition-mongolia-strategic-role",
    title: "China's Energy Transition & Mongolia's Strategic Role",
    excerpt: "Mongolia is quietly evolving from a peripheral neighbor into a strategic energy corridor and anchor supplier of critical minerals — copper, rare earths, uranium — essential for renewable energy infrastructure across Northeast Asia. As China accelerates its own transition, Mongolia's positioning between supply chain diversification mandates and its historical resource base creates a rare window. The question is whether Mongolia captures the value, or becomes a transit pass-through.",
    contentType: "article",
    topics: ["Energy", "Mining & Resources"],
    author: "Enkhtaivan B.",
    publishedAt: "2026-03-05",
    readTime: 10,
    isPremium: false,
    entityRefs: ["oyu-tolgoi"],
    coverImage: "/insights/china-energy-transition.webp",
  },
  {
    slug: "tsetsens-mining-300m-bond",
    title: "Inside Tsetsens Mining and Energy's US$300 Million Landmark Bond",
    excerpt: "Mongolia's first corporate bond offering of 2026 — a US$300M senior secured issuance at 11.375% maturing 2031, listed on SGX. The central asset is the 600 MW Buuruljuut Power Plant.",
    contentType: "deal-insight",
    topics: ["Energy", "Capital Markets"],
    author: "Namkhaidorj B.",
    publishedAt: "2026-03-03",
    readTime: 12,
    isPremium: true,
    entityRefs: ["golomt-bank"],
    coverImage: "/insights/tsetsens-bond.webp",
  },
  {
    slug: "mining-royalty-rates-reform",
    title: "What Is Holding Back Foreign Investment in Mongolia's Mining Sector — and Can Royalty Rates Reform Fix It?",
    excerpt: "Mongolia's copper royalty structure — with base rates of 5% escalating to 22-30% through progressive surcharges — ranks among the world's most burdensome. Draft amendments address four key barriers.",
    contentType: "article",
    topics: ["Mining & Resources", "Capital Markets"],
    author: "Enkhjin A.",
    publishedAt: "2026-02-23",
    readTime: 9,
    isPremium: false,
    entityRefs: ["oyu-tolgoi"],
    coverImage: "/insights/mining-royalty.webp",
  },
  {
    slug: "mongolia-critical-minerals-moment",
    title: "Geography is Not Destiny: Mongolia's Critical Minerals Moment",
    excerpt: "The 2026 Critical Minerals Ministerial in Washington convened 50+ nations. Mongolia possesses substantial copper, uranium, fluorspar, and rare earth deposits — but double-landlocked geography constrains autonomy.",
    contentType: "article",
    topics: ["Mining & Resources", "Policy & Regulation"],
    author: "Ariunzaya O.",
    publishedAt: "2026-02-10",
    readTime: 11,
    isPremium: false,
    entityRefs: ["oyu-tolgoi"],
    coverImage: "/insights/critical-minerals.avif",
  },
  {
    slug: "mongolia-dealbook-2025",
    title: "Mongolia DealBook 2025: A Breakout Year for Foreign Capital",
    excerpt: "CMM's inaugural flagship report documenting Mongolia's private sector access to international capital. 40 completed transactions totaling USD 2.6 billion across 19 companies.",
    contentType: "research-report",
    topics: ["Capital Markets", "Banking & Finance"],
    series: "DealBook",
    author: "CMM Research",
    publishedAt: "2026-01-26",
    readTime: 30,
    isPremium: true,
    entityRefs: ["tdb", "golomt-bank", "khan-bank"],
    coverImage: "/insights/dealbook-2025.webp",
  },
  {
    slug: "year-copper-saved-mongolia-economy",
    title: "The Year Copper Saved Mongolia's Economy",
    excerpt: "Forces driving Mongolia's copper boom and what it means for investors. Oyu Tolgoi's underground ramp-up, record LME prices, and the structural shift in Mongolia's export composition.",
    contentType: "article",
    topics: ["Mining & Resources", "Economy & Macro"],
    author: "Enkhjin A.",
    publishedAt: "2026-02-03",
    readTime: 10,
    isPremium: false,
    entityRefs: ["oyu-tolgoi"],
    coverImage: "/insights/copper-saved-mongolia.webp",
  },
  {
    slug: "erdene-25m-bought-deal-placement",
    title: "Erdene Announces $25 Million Bought Deal Private Placement",
    excerpt: "Erdene Resource Development closes a $25M bought deal to fund Bayan Khundii expansion. The placement was oversubscribed with strong participation from existing institutional shareholders.",
    contentType: "press-release",
    topics: ["Mining & Resources", "Capital Markets"],
    author: "CMM Research",
    publishedAt: "2026-01-27",
    readTime: 3,
    isPremium: false,
    entityRefs: [],
    coverImage: "/insights/erdene-placement.webp",
  },
  {
    slug: "fmo-150m-green-finance",
    title: "FMO Mobilizes USD 150 Million to Strengthen Green Finance in Mongolia",
    excerpt: "Netherlands Development Finance Company (FMO) commits $150M in green finance facilities for Mongolian banks and NBFIs, targeting renewable energy and sustainable infrastructure lending.",
    contentType: "article",
    topics: ["ESG & Climate", "Banking & Finance"],
    author: "CMM Research",
    publishedAt: "2026-01-22",
    readTime: 5,
    isPremium: false,
    entityRefs: ["khan-bank", "tdb"],
    coverImage: "/insights/fmo-green-finance.webp",
  },
  {
    slug: "mongolia-coal-record-volumes-tough-prices",
    title: "Mongolia's Coal: Record Volumes, Tough Prices",
    excerpt: "Mongolia exported 73M tonnes of coal in 2025 — a record — but depressed Chinese coking coal prices squeezed margins. The Gashuunsukhait corridor logistics improvements partially offset pricing pressure.",
    contentType: "article",
    topics: ["Mining & Resources", "Economy & Macro"],
    author: "Enkhjin A.",
    publishedAt: "2026-01-19",
    readTime: 8,
    isPremium: false,
    entityRefs: ["tavan-tolgoi"],
    coverImage: "/insights/coal-record-volumes.webp",
  },
  {
    slug: "em-frontier-mongolia-bonds-2026-outlook",
    title: "Emerging Market, Frontier & Mongolia Bonds: 2026 Outlook",
    excerpt: "Mongolia's sovereign spread has compressed 180bps since mid-2025. We analyze the outlook for Mongolian fixed income in the context of broader EM/frontier bond markets and Fed rate trajectory.",
    contentType: "research-report",
    topics: ["Capital Markets"],
    author: "CMM Research",
    publishedAt: "2026-01-09",
    readTime: 18,
    isPremium: true,
    entityRefs: [],
    coverImage: "/insights/bonds-2026-outlook.webp",
  },
  {
    slug: "5-key-investment-themes-mongolia-2026",
    title: "5 Key Investment Themes to Watch in Mongolia in 2026",
    excerpt: "Copper ramp-up at Oyu Tolgoi, banking sector consolidation, renewable energy capex, capital markets reform, and the critical minerals geopolitical play — the five themes shaping Mongolia's investment landscape.",
    contentType: "article",
    topics: ["Capital Markets", "Economy & Macro"],
    author: "Zolbayar E.",
    publishedAt: "2025-12-15",
    readTime: 12,
    isPremium: false,
    entityRefs: ["oyu-tolgoi", "khan-bank"],
    coverImage: "/insights/5-themes-2026.webp",
  },
  {
    slug: "how-governments-emerging-markets-unlock-potential",
    title: "How Governments in Emerging Markets Can Unlock Development Potential",
    excerpt: "Turning emerging market potential into performance. A framework for institutional reform, capital market development, and strategic positioning that applies directly to Mongolia's current trajectory.",
    contentType: "article",
    topics: ["Economy & Macro", "Capital Markets"],
    author: "Zolbayar E.",
    publishedAt: "2026-02-05",
    readTime: 9,
    isPremium: false,
    entityRefs: [],
    coverImage: "/insights/emerging-markets-dev.webp",
  },
  {
    slug: "mbank-100m-debut-sgx",
    title: "M Bank Taps International Markets with USD 100M Debut Issuance on SGX",
    excerpt: "M Bank becomes the latest Mongolian bank to access offshore capital markets, pricing a $100M bond on Singapore Exchange. The issuance was 2.5x oversubscribed.",
    contentType: "deal-insight",
    topics: ["Banking & Finance", "Capital Markets"],
    author: "Namkhaidorj B.",
    publishedAt: "2025-12-10",
    readTime: 7,
    isPremium: true,
    entityRefs: [],
    coverImage: "/insights/mbank-debut.webp",
  },
  {
    slug: "missing-piece-mongolia-energy-transition",
    title: "The Missing Piece in Mongolia's Energy Transition",
    excerpt: "Mongolia's grid can't handle the renewable capacity it's building. Without transmission infrastructure and storage investment, the 30% renewables target by 2030 remains aspirational.",
    contentType: "article",
    topics: ["Energy"],
    author: "Enkhjin A.",
    publishedAt: "2025-11-20",
    readTime: 8,
    isPremium: false,
    entityRefs: [],
    coverImage: "/insights/energy-transition.webp",
  }
];

export const MOCK_ENTITIES: MockEntity[] = [
  {
    slug: "khan-bank",
    name: "Khan Bank",
    ticker: "KHAN",
    sector: "Banking & Finance",
    type: "public_company",
    description: "Mongolia's largest commercial bank by assets and branch network. Serves 80%+ of the population.",
    marketCap: "MNT 3.2T",
    price: 48200,
    change: 1200,
    changePercent: 2.55,
    website: "https://khanbank.com",
    socialLinks: {
      linkedin: "https://linkedin.com/company/khan-bank",
      facebook: "https://facebook.com/khanbank",
    },
  },
  {
    slug: "erdenet-mining",
    name: "Erdenet Mining Corporation",
    sector: "Mining & Resources",
    type: "public_company",
    description: "Mongolia's largest copper-molybdenum mining company. State-owned, IPO pending for 2026.",
    marketCap: "est. MNT 15T+",
    isRaising: true,
  },
  {
    slug: "tdb",
    name: "Trade and Development Bank",
    ticker: "TDB",
    sector: "Banking & Finance",
    type: "public_company",
    description: "Mongolia's largest bank by total assets. Major international correspondent relationships.",
    marketCap: "MNT 2.8T",
    price: 32500,
    change: -450,
    changePercent: -1.37,
    isRaising: true,
    website: "https://tdbm.mn",
    socialLinks: {
      linkedin: "https://linkedin.com/company/trade-and-development-bank",
      twitter: "https://twitter.com/tdbmongolia",
      facebook: "https://facebook.com/tdbmongolia",
    },
  },
  {
    slug: "ard-financial-group",
    name: "Ard Financial Group",
    ticker: "AARD",
    sector: "Banking & Finance",
    type: "public_company",
    description: "Fintech-first financial conglomerate. Insurance, credit, securities, and Mongolia's leading super-app.",
    marketCap: "MNT 1.9T",
    price: 1850,
    change: 45,
    changePercent: 2.49,
    website: "https://ard.mn",
    socialLinks: {
      linkedin: "https://linkedin.com/company/ard-financial-group",
      facebook: "https://facebook.com/ardholdings",
    },
  },
  {
    slug: "mse",
    name: "Mongolian Stock Exchange",
    ticker: "MSE",
    sector: "Capital Markets",
    type: "public_company",
    description: "Mongolia's primary securities exchange. ~200 listed companies, market cap ~MNT 10T.",
    website: "https://mse.mn",
    socialLinks: {
      linkedin: "https://linkedin.com/company/mongolian-stock-exchange",
      facebook: "https://facebook.com/mongolianstockexchange",
    },
  },
  {
    slug: "oyu-tolgoi",
    name: "Oyu Tolgoi LLC",
    sector: "Mining & Resources",
    type: "private_company",
    description: "One of the world's largest known copper-gold deposits. 66% Rio Tinto, 34% Government of Mongolia.",
  },
  {
    slug: "and-global",
    name: "AND Global",
    sector: "Technology",
    type: "private_company",
    description: "Digital infrastructure and smart city development company focused on Mongolia and Central Asia.",
    isRaising: true,
  },
  {
    slug: "golomt-bank",
    name: "Golomt Bank JSC",
    ticker: "GLMT",
    sector: "Banking & Finance",
    type: "public_company",
    description:
      "Golomt Bank was established on 6th March 1995 as a subsidiary of Bodi International LLC. Mongolia's second-largest commercial bank by total assets, serving 1.2M customers through 107 branches nationwide. Sole sub-custodian of JP Morgan in Mongolia, with deep correspondent banking ties to global banks and IFIs across funding, corporate bonds, and trade finance.",
    listingLocation: "LOCAL",
    exchange: "MSE",
    marketCap: "MNT 1.03T",
    price: 1270,
    change: -4,
    changePercent: -0.31,
    volume: "61,383 shares",
    lastUpdated: "Apr 21, 2026",
    isFeatured: true,
    dataSource: "CMM Verified",
    website: "https://golomtbank.com",
    socialLinks: {
      linkedin: "https://linkedin.com/company/golomt-bank",
      twitter: "https://twitter.com/golomtbank",
      facebook: "https://facebook.com/golomtbank",
    },

    /* Financials — placeholder structure, real numbers TBD */
    summaryRatios: {
      pe: "6.2x",
      pb: "0.9x",
      evEbitda: "—",
      divYield: "4.1%",
      roe: "18.7%",
      marketCap: "MNT 1.03T",
    },
    financials: [
      {
        year: "2023",
        pl: { Revenue: "1,240", "Net Income": "182", EBITDA: "—" },
        balanceSheet: { "Total Assets": "12,840", "Shareholders Equity": "1,420" },
        cashFlow: { "Operating CF": "—", "Free Cash Flow": "—" },
      },
      {
        year: "2024",
        pl: { Revenue: "1,420", "Net Income": "236", EBITDA: "—" },
        balanceSheet: { "Total Assets": "14,560", "Shareholders Equity": "1,680" },
        cashFlow: { "Operating CF": "—", "Free Cash Flow": "—" },
      },
      {
        year: "2025",
        pl: { Revenue: "1,680", "Net Income": "298", EBITDA: "—" },
        balanceSheet: { "Total Assets": "16,920", "Shareholders Equity": "1,950" },
        cashFlow: { "Operating CF": "—", "Free Cash Flow": "—" },
      },
    ],

    sustainability: {
      outcomes: [
        "Sustainable water & waste management",
        "Sustainable agriculture, land use, forestry, and ecotourism",
        "Energy efficiency",
      ],
      sdgs: [6, 7, 13, 15],
      esgPolicy: true,
      disclosure: true,
      transitionStrategy: true,
      impactTracked: true,
      impactVerified: false,
      certifications: [
        { name: "LEED Gold Standard" },
        { name: "Sustainable Green Operation Standards" },
        { name: "Joint Impact Model Foundation" },
        { name: "UN Guiding Principles on Business and Human Rights" },
        { name: "UNEP FI Principles for Responsible Banking" },
        { name: "Partnership for Carbon Accounting (PCAF)" },
        { name: "Science Based Targets Initiative (SBTi)" },
      ],
    },

    parentGroup: { name: "Golomt Financial Group LLC" },
    shareholders: [
      { name: "Golomt Financial Group LLC", percentage: 77.2, controlling: true },
      { name: "Bodi International LLC", percentage: 6.0 },
      { name: "Swiss Mo Investment AG (Switzerland)", percentage: 5.21 },
      { name: "Public Float", percentage: 11.6 },
    ],

    ceo: { name: "Odonbaatar Amarzaya", title: "Chief Executive Officer", initials: "OA" },
    executives: [
      { name: "Ganbold Galsan", title: "President", initials: "GG" },
      { name: "Sainbileg Mandakh", title: "Chief Information Officer", initials: "SM" },
      { name: "Otgon Tolya", title: "Chief Risk Officer", initials: "OT" },
      { name: "Munkhtuya Suren", title: "Director, Financial Management", initials: "MS" },
      { name: "Narankhuu Munkhbat", title: "Director, Credit Division", initials: "NM" },
      { name: "Sodbolor Bolor", title: "Director, Treasury Management", initials: "SB" },
      { name: "Sugar-Erdene Bat-Erdene", title: "Director, Corporate Banking", initials: "SE" },
      { name: "Baigalmaa Tserenjav", title: "Director, SME Banking", initials: "BT" },
      { name: "Sugar Zagdkhorloo", title: "Director, Retail Banking", initials: "SZ" },
      { name: "Battsengel Oidov", title: "Director, Digital Banking", initials: "BO" },
      { name: "Enkhzaya Bayarsaikhan", title: "Director, International Banking", initials: "EB" },
      { name: "Oyun Jadambaa", title: "Director, Digital Transformation", initials: "OJ" },
    ],
    boardMembers: [
      { name: "Munkhtsetseg Chultem", title: "Chairperson of the Board", initials: "MC" },
      { name: "Unenbat Jigjid", title: "Board Director (Nominee)", initials: "UJ" },
      { name: "Munkhtur Dagva", title: "Board Director (Nominee)", initials: "MD" },
      { name: "Ganjoloo Ochirpurev", title: "Board Director (Nominee)", initials: "GO" },
      { name: "James Bernard Dwyer", title: "Independent Director", initials: "JD" },
      { name: "Alexander Picker", title: "Independent Director", initials: "AP" },
      { name: "Robert W. van Zwieten", title: "Independent Director", initials: "RZ" },
      { name: "Hans Holzhacker", title: "Independent Director", initials: "HH" },
      { name: "Ronil Sujan", title: "Independent Director", initials: "RS" },
      { name: "Solongo Zalaa-Uul", title: "Secretary of the Board", initials: "SZ" },
      { name: "Tuya Altangerel", title: "Director of Internal Audit", initials: "TA" },
    ],

    dealsSummary: "Active in DCM with multiple syndicated facilities and listed bond issuances",
    deals: [
      {
        date: "2025-Q4",
        amount: "$120M",
        investors: ["FMO", "DEG", "Proparco"],
        fundingType: "Syndicated Loan",
        purpose: "Green finance lending pipeline",
      },
      {
        date: "2025-Q1",
        amount: "MNT 80B",
        investors: ["Domestic institutional"],
        fundingType: "Bond",
        purpose: "Tier 2 capital",
      },
    ],

    reports: [
      { title: "Golomt Bank Annual Report 2025", fileSize: "8.6 MB", pages: 92, date: "Mar 2026" },
    ],
    pitchDecks: [
      { title: "GLMT Investor Presentation Q1 2026", fileSize: "5.2 MB", pages: 28, date: "Feb 2026" },
    ],
    sustainabilityDocs: [
      { title: "GLMT ESG Report 2025", fileSize: "4.4 MB", pages: 56, date: "Jan 2026" },
    ],
    operationalDocs: [
      { title: "Pillar 3 Disclosure 2025", fileSize: "2.1 MB", pages: 36, date: "Mar 2026" },
    ],
  },
  {
    slug: "southgobi-resources",
    name: "SouthGobi Resources",
    ticker: "SGQ",
    sector: "Mining & Resources",
    type: "public_company",
    description: "Coal mining company operating the Ovoot Tolgoi mine in southern Mongolia. TSX and HKEX listed.",
    marketCap: "CAD $180M",
    price: 0.42,
    change: 0.03,
    changePercent: 7.69,
  },
  {
    slug: "mcs-group",
    name: "MCS Group",
    sector: "Real Estate & Infrastructure",
    type: "private_company",
    description: "Mongolia's largest private conglomerate. Energy, property, mining services, FMCG, and logistics.",
  },
  /* ── Additional entities for directory coverage ── */
  {
    slug: "tavan-tolgoi",
    name: "Tavan Tolgoi JSC",
    ticker: "TTL",
    sector: "Mining & Resources",
    type: "public_company",
    description: "Tavan Tolgoi JSC operates Mongolia's largest coking coal deposit in the South Gobi region. Strategic supplier to Chinese and Japanese steel mills with rail logistics infrastructure along the southern corridor.",
    listingLocation: "LOCAL",
    exchange: "MSE",
    marketCap: "MNT 8.2T",
    price: 182400,
    change: 3600,
    changePercent: 2.01,
    volume: "45,000 shares",
    lastUpdated: "Apr 5, 2026",
    isRaising: true,
    isFeatured: true,
    dataSource: "CMM Verified",
    website: "https://tavantolgoi.mn",
    /* Financial — BLOCKED */
    financialBlocked: true,
    summaryRatios: {
      pe: "8.4x",
      pb: "1.2x",
      evEbitda: "4.1x",
      divYield: "3.8%",
      roe: "16.2%",
      marketCap: "MNT 8.2T",
    },
    financials: [
      {
        year: "2023",
        pl: { Revenue: "4,820", "Net Income": "812", EBITDA: "1,940" },
        balanceSheet: { "Total Assets": "12,400", "Shareholders Equity": "5,820" },
        cashFlow: { "Operating CF": "1,240", "Free Cash Flow": "680" },
      },
      {
        year: "2024",
        pl: { Revenue: "5,340", "Net Income": "980", EBITDA: "2,180" },
        balanceSheet: { "Total Assets": "13,820", "Shareholders Equity": "6,540" },
        cashFlow: { "Operating CF": "1,480", "Free Cash Flow": "820" },
      },
      {
        year: "2025",
        pl: { Revenue: "6,120", "Net Income": "1,180", EBITDA: "2,520" },
        balanceSheet: { "Total Assets": "15,340", "Shareholders Equity": "7,380" },
        cashFlow: { "Operating CF": "1,760", "Free Cash Flow": "1,020" },
      },
    ],
    sustainability: {
      outcomes: ["Pollution prevention and control", "Sustainable mining practices"],
      sdgs: [8, 9, 13],
      esgPolicy: true,
      disclosure: true,
      transitionStrategy: false,
      impactTracked: true,
      impactVerified: false,
      certifications: [
        { name: "GRI" },
        { name: "TCFD" },
      ],
    },
    parentGroup: { name: "Erdenes Mongol Group", slug: "erdenet-mining" },
    shareholders: [
      { name: "Erdenes Mongol", percentage: 80, controlling: true },
      { name: "Free Float", percentage: 20 },
    ],
    subsidiaries: [
      { name: "Tavan Tolgoi Coal Mine", status: "Operating" },
      { name: "Tsankhi West Block", status: "Construction" },
    ],
    ceo: { name: "D. Batsuuri", title: "Chief Executive Officer", initials: "DB" },
    executives: [
      { name: "B. Enkhbayar", title: "Chief Financial Officer", initials: "BE" },
      { name: "T. Gantulga", title: "Chief Operations Officer", initials: "TG" },
    ],
    boardMembers: [
      { name: "B. Byambasaikhan", title: "Board Chair", initials: "BB" },
      { name: "T. Enkhtuvshin", title: "Independent Director", initials: "TE" },
      { name: "O. Dorjkhand", title: "Director", initials: "OD" },
    ],
    dealsSummary: "Total funding: $515M across 5 rounds",
    deals: [
      { date: "2025-Q4", amount: "$180M", investors: ["Mongolia Mining Corp"], fundingType: "Bond", purpose: "Tsankhi West expansion" },
      { date: "2024-Q3", amount: "$120M", investors: ["Sumitomo", "JBIC"], fundingType: "Syndicated Loan", purpose: "Rail infrastructure upgrade" },
      { date: "2024-Q1", amount: "$85M", investors: ["Erdenes Mongol"], fundingType: "Equity", purpose: "Working capital" },
    ],
    reports: [
      { title: "Mongolia Coal Sector Outlook 2026", fileSize: "2.4 MB", pages: 32, date: "Mar 2026" },
    ],
    pitchDecks: [
      { title: "TTL Investor Presentation Q1 2026", fileSize: "8.1 MB", pages: 24, date: "Feb 2026" },
    ],
    sustainabilityDocs: [
      { title: "TTL ESG Report 2025", fileSize: "5.6 MB", pages: 48, date: "Jan 2026" },
    ],
    investmentTeasers: [
      { title: "TTL Investment Teaser — Tsankhi West", fileSize: "1.2 MB", pages: 8, date: "Mar 2026" },
    ],
    operationalDocs: [
      { title: "TTL Annual Report 2025", fileSize: "12.4 MB", pages: 88, date: "Mar 2026" },
    ],
  },
  {
    slug: "aspire-mining",
    name: "Aspire Mining",
    ticker: "AKM",
    sector: "Mining & Resources",
    type: "public_company",
    description: "Developing the Ovoot Coking Coal Project in northern Mongolia. ASX listed.",
    marketCap: "AUD $95M",
    price: 0.085,
    change: 0.005,
    changePercent: 6.25,
    isRaising: true,
  },
  {
    slug: "petrovis",
    name: "Petrovis LLC",
    sector: "Energy",
    type: "private_company",
    description: "Mongolia's leading petroleum importer and distributor. 200+ fuel stations nationwide.",
  },
  {
    slug: "newcom-group",
    name: "Newcom Group",
    sector: "Technology",
    type: "private_company",
    description: "Diversified tech and telecoms holding. Operates Unitel, Mongolia's second-largest mobile network.",
  },
  {
    slug: "tsakhia-solar",
    name: "Tsakhia Solar Park",
    sector: "Energy",
    type: "project",
    description: "Tsakhia Solar Park is a 100MW utility-scale solar project in Dundgobi province, part of Mongolia's 30% renewables target by 2030. The project includes a dedicated 110kV substation and 22km transmission line to the Central Grid.",
    isRaising: true,
    isFeatured: true,
    dataSource: "Company Submitted",
    website: "https://tsakhiasolar.mn",
    location: "Dundgobi Province, Mongolia",
    stage: "Construction",
    keyMetrics: {
      "Installed Capacity": "100 MW",
      "Annual Generation": "180 GWh",
      "Total CAPEX": "$92M",
      "Commissioning": "Q3 2026",
      "Offtaker": "Central Grid (Mongolia)",
      "PPA Term": "25 years",
    },
    sponsor: { name: "Newcom Group", slug: "newcom-group", stake: 70 },
    sponsorRepresentative: { name: "B. Munkhzul", title: "Project Director", initials: "BM" },
    parentGroup: { name: "Newcom Group", slug: "newcom-group" },
    sustainability: {
      outcomes: ["Renewable energy generation", "Climate change mitigation"],
      sdgs: [7, 13],
      esgPolicy: true,
      disclosure: true,
      transitionStrategy: true,
      impactTracked: true,
      impactVerified: true,
      certifications: [{ name: "IFC Performance Standards" }],
    },
    ceo: { name: "B. Munkhzul", title: "Project Director", initials: "BM" },
    pitchDecks: [
      { title: "Tsakhia Solar — Project Brief", fileSize: "4.2 MB", pages: 16, date: "Feb 2026" },
    ],
    investmentTeasers: [
      { title: "Tsakhia Solar Investment Teaser", fileSize: "1.1 MB", pages: 6, date: "Mar 2026" },
    ],
  },
  {
    slug: "khanbogd-copper",
    name: "Khanbogd Copper Project",
    sector: "Mining & Resources",
    type: "project",
    description: "Early-stage copper-gold porphyry project 40km west of Oyu Tolgoi. Exploration-phase with JORC-compliant resource.",
    isRaising: true,
  },
  {
    slug: "mandal-insurance",
    name: "Mandal Insurance",
    ticker: "MNDL",
    sector: "Banking & Finance",
    type: "public_company",
    description: "Third-largest insurer in Mongolia by gross written premiums. Life, non-life, and reinsurance.",
    marketCap: "MNT 42B",
    price: 520,
    change: -8,
    changePercent: -1.52,
    website: "https://mandal.mn",
    socialLinks: {
      linkedin: "https://linkedin.com/company/mandal-insurance",
      facebook: "https://facebook.com/mandalinsurance",
    },
  },
  {
    slug: "baker-mckenzie-mongolia",
    name: "Baker McKenzie Mongolia",
    sector: "Professional Services",
    type: "service_provider",
    description: "Leading international law firm with Mongolia practice. Mining, M&A, project finance, and regulatory advisory.",
  },
  {
    slug: "kpmg-mongolia",
    name: "KPMG Mongolia",
    sector: "Professional Services",
    type: "service_provider",
    description: "KPMG Mongolia provides audit, tax, and advisory services to Mongolia's leading banks, mining companies, and public sector institutions. Part of the global KPMG network with cross-border capability across tax structuring, M&A advisory, and IFRS compliance.",
    dataSource: "CMM Verified",
    website: "https://kpmg.com/mn",
    yearEstablished: 2003,
    languages: ["English", "Mongolian", "Russian"],
    internationalAffiliations: ["KPMG Global Network", "KPMG Asia Pacific"],
    practiceAreas: [
      "Audit & Assurance",
      "Tax Advisory",
      "M&A Advisory",
      "IFRS Conversion",
      "Risk & Compliance",
      "Mining Sector Advisory",
      "Banking Sector Audit",
    ],
    notableEngagements: [
      "Lead auditor for Khan Bank (2020-present)",
      "Tax advisor on Oyu Tolgoi UDP restructuring",
      "IFRS conversion for MSE-listed companies (cohort of 12 issuers)",
    ],
    notableClients: ["Khan Bank", "Oyu Tolgoi LLC", "Erdenet Mining Corporation"],
    contactEmail: "info@kpmg.mn",
    contactPhone: "+976 11 345 678",
    contactAddress: "Blue Sky Tower, 17 Peace Ave, Ulaanbaatar 14240, Mongolia",
    ceo: { name: "Erdenechimeg B.", title: "Managing Partner", initials: "EB" },
    executives: [
      { name: "Otgonbayar T.", title: "Senior Partner — Audit", initials: "OT" },
      { name: "Battsetseg D.", title: "Senior Partner — Tax", initials: "BD" },
      { name: "Ganbold N.", title: "Senior Partner — Advisory", initials: "GN" },
    ],
    reports: [
      { title: "Mongolia Tax Card 2026", fileSize: "1.8 MB", pages: 12, date: "Jan 2026" },
      { title: "Banking Sector Annual Review 2025", fileSize: "4.2 MB", pages: 28, date: "Feb 2026" },
    ],
  },
  {
    slug: "gobi-cashmere",
    name: "Gobi Cashmere",
    ticker: "GOBI",
    sector: "Agriculture",
    type: "public_company",
    description: "Mongolia's largest vertically integrated cashmere manufacturer. From herder cooperatives to international retail.",
    marketCap: "MNT 280B",
    price: 3450,
    change: 120,
    changePercent: 3.60,
  },
  {
    slug: "hunnu-air",
    name: "Hunnu Air",
    sector: "Real Estate & Infrastructure",
    type: "private_company",
    description: "Mongolia's second airline. Regional routes connecting Ulaanbaatar to mining hubs and East Asian cities.",
  },
  {
    slug: "darkhan-steel",
    name: "Darkhan Metallurgical Plant",
    sector: "Mining & Resources",
    type: "public_company",
    description: "Mongolia's only integrated steel producer. Located in Darkhan, supplies domestic construction and infrastructure.",
    ticker: "DARK",
    marketCap: "MNT 85B",
    price: 1240,
    change: 15,
    changePercent: 1.22,
  },

  /* ── AI-Sourced profiles (fall-back tier, sparse data, claim CTAs) ── */
  {
    slug: "khar-tolgoi-mining",
    name: "Khar Tolgoi Mining JSC",
    ticker: "KHTM",
    sector: "Mining & Resources",
    type: "public_company",
    description:
      "Khar Tolgoi Mining JSC is an MSE-listed company referenced in mineral processing filings, with reported activity in fluorspar and base metals. Public disclosures suggest small-cap operations in the Selenge aimag. This profile is auto-generated from open sources and has not been verified by CMM analysts. Financial data, ownership, and corporate filings have not been reviewed.",
    listingLocation: "LOCAL",
    exchange: "MSE",
    website: "https://khartolgoi.mn",
    location: "Selenge, Mongolia",
    yearEstablished: 2007,
    dataSource: "AI-Sourced",
    aiMeta: {
      lastCrawled: "2026-05-05",
      pipelineRun: "ai-pipeline-2026-05-05-r92",
      citations: [
        { field: "name", source: "MSE listed companies registry", confidence: "high" },
        { field: "ticker", source: "MSE listed companies registry", confidence: "high" },
        { field: "exchange", source: "MSE listed companies registry", confidence: "high" },
        { field: "sector", source: "MSE sector classification", confidence: "high" },
        { field: "yearEstablished", source: "State Registration Office record", confidence: "medium" },
        { field: "location", source: "MRPAM license geo-data", confidence: "medium" },
        { field: "website", source: "Domain WHOIS + MSE filings", confidence: "medium" },
        { field: "description", source: "Synthesized from MSE filings + 3 news mentions", confidence: "low" },
      ],
    },
  },
  {
    slug: "bayan-airag-exploration",
    name: "Bayan-Airag Exploration LLC",
    sector: "Mining & Resources",
    type: "private_company",
    description:
      "Bayan-Airag Exploration LLC is a Mongolia-registered mineral exploration company reportedly holding licenses in the Govi-Altai region. Public records suggest a focus on copper-gold porphyry targets. This profile is auto-generated from open sources and has not been verified by CMM analysts.",
    website: "https://bayan-airag.mn",
    location: "Govi-Altai, Mongolia",
    yearEstablished: 2018,
    dataSource: "AI-Sourced",
    aiMeta: {
      lastCrawled: "2026-05-04",
      pipelineRun: "ai-pipeline-2026-05-04-r91",
      citations: [
        { field: "name", source: "Mongolia State Registry", confidence: "high" },
        { field: "sector", source: "Inferred from mineral license filings (MRPAM)", confidence: "high" },
        { field: "yearEstablished", source: "State Registration Office record", confidence: "high" },
        { field: "location", source: "MRPAM license geo-data", confidence: "medium" },
        { field: "website", source: "Web crawl, domain WHOIS", confidence: "medium" },
        { field: "description", source: "Generated from filings + sector context", confidence: "low" },
      ],
    },
  },
  {
    slug: "digipay-mongolia",
    name: "DigiPay Mongolia LLC",
    sector: "Technology",
    type: "private_company",
    description:
      "DigiPay Mongolia LLC appears to operate a mobile payments and merchant settlement platform serving small businesses in Ulaanbaatar. Press mentions reference partnerships with two domestic banks. Headcount and financials are not publicly disclosed. This profile is auto-generated from open sources.",
    website: "https://digipay.mn",
    location: "Ulaanbaatar, Mongolia",
    yearEstablished: 2021,
    dataSource: "AI-Sourced",
    socialLinks: {
      facebook: "https://facebook.com/digipaymn",
    },
    aiMeta: {
      lastCrawled: "2026-05-06",
      pipelineRun: "ai-pipeline-2026-05-06-r93",
      citations: [
        { field: "name", source: "Mongolia State Registry", confidence: "high" },
        { field: "sector", source: "Inferred from press coverage + website meta", confidence: "high" },
        { field: "website", source: "Domain WHOIS + Google search", confidence: "high" },
        { field: "yearEstablished", source: "State Registration Office record", confidence: "medium" },
        { field: "location", source: "Website footer + LinkedIn", confidence: "medium" },
        { field: "description", source: "Synthesized from 4 news mentions", confidence: "low" },
      ],
    },
  },
];

/* ── Contributors ──────────────────────── */

export interface MockContributor {
  slug: string;
  name: string;
  initials: string;
  role: string;
  org: string;
  bio: string;
}

export const MOCK_CONTRIBUTORS: MockContributor[] = [
  {
    slug: "enkhjin-a",
    name: "Enkhjin A.",
    initials: "EA",
    role: "Analyst",
    org: "CMM",
    bio: "Enkhjin covers mining, industrialization policy, and macroeconomic developments. Lead author on CMM's mining sector coverage and monthly market updates.",
  },
  {
    slug: "namkhaidorj-b",
    name: "Namkhaidorj B.",
    initials: "NB",
    role: "Senior Analyst",
    org: "CMM",
    bio: "Namkhaidorj specializes in fixed income, deal structuring, and capital markets transactions. Co-author of the Mongolia DealBook series.",
  },
  {
    slug: "zolbayar-e",
    name: "Zolbayar E.",
    initials: "ZE",
    role: "Political Analyst",
    org: "CMM",
    bio: "Zolbayar covers Mongolian politics, governance, and their implications for foreign investment. Previously a policy researcher at the Asia Foundation Mongolia.",
  },
  {
    slug: "tselmeg-e",
    name: "Tselmeg E.",
    initials: "TE",
    role: "Government & Policy Analyst",
    org: "CMM",
    bio: "Tselmeg covers government affairs, cabinet dynamics, and regulatory developments impacting Mongolia's investment landscape.",
  },
  {
    slug: "ariunzaya-o",
    name: "Ariunzaya O.",
    initials: "AO",
    role: "Geopolitics & Minerals Analyst",
    org: "CMM",
    bio: "Ariunzaya covers critical minerals policy, international relations, and Mongolia's positioning in global supply chains.",
  },
  {
    slug: "cmm-research",
    name: "CMM Research",
    initials: "CR",
    role: "Research Team",
    org: "CMM",
    bio: "The CMM Research team produces institutional-grade analysis on Mongolia's capital markets, covering equities, fixed income, commodities, and macroeconomic trends.",
  },
];

export const TOPIC_TAGS = [
  "Mining & Resources",
  "Energy",
  "Banking & Finance",
  "Capital Markets",
  "Economy & Macro",
  "Policy & Regulation",
  "ESG & Climate",
  "Technology",
  "Real Estate & Infrastructure",
  "State-Owned Enterprises",
  "Ratings & Governance",
  "Trade & Geopolitics",
] as const;

export const CONTENT_TYPES = [
  { value: "article", label: "Article" },
  { value: "market-brief", label: "Market Brief" },
  { value: "investment-teaser", label: "Investment Teaser" },
  { value: "deal-insight", label: "Deal Insight" },
  { value: "research-report", label: "Research Report" },
  { value: "press-release", label: "Press Release" },
] as const;

export const SERIES = [
  "Monthly Market Update",
  "DealBook",
  "Investor Guide to Mongolia",
] as const;

/* ── Events ────────────────────────────── */

export type EventStatus = "upcoming" | "past" | "registration-open" | "sold-out";
export type EventFormat = "in-person" | "virtual" | "hybrid";

export interface MockEventAgendaItem {
  time: string;
  title: string;
  speakerSlugs?: string[];
  description?: string;
  type?: "keynote" | "panel" | "presentation" | "break" | "networking";
}

export interface MockEventSponsor {
  name: string;
  tier: "platinum" | "gold" | "silver" | "partner";
  logo?: string;
}

export interface MockEvent {
  slug: string;
  title: string;
  shortName?: string;
  tagline: string;
  description: string;
  status: EventStatus;
  format: EventFormat;
  startDate: string;
  endDate?: string;
  location: string;
  venue?: string;
  city?: string;
  expectedAttendees?: number;
  presentingCompanies?: number;
  registrationCount?: number;
  registrationDeadline?: string;
  ticketPrice?: string;
  coverImage?: string;
  speakerSlugs: string[];
  sponsors?: MockEventSponsor[];
  agenda?: MockEventAgendaItem[];
  recapUrl?: string;
  replayUrl?: string;
  topics?: string[];
}

export const MOCK_EVENTS: MockEvent[] = [
  {
    slug: "mif-2026",
    title: "Mongolia Investment Forum 2026",
    shortName: "MIF 2026",
    tagline: "The annual gathering of Mongolia's capital markets",
    description:
      "MIF 2026 is the year's flagship gathering for institutional investors, sovereign funds, and Mongolia's leading corporates. Two days of keynotes, deal-flow presentations, and curated 1:1 meetings centered on the country's mining, banking, and energy growth stories.",
    status: "registration-open",
    format: "in-person",
    startDate: "2026-05-15",
    endDate: "2026-05-16",
    location: "Shangri-La Hotel, Ulaanbaatar",
    venue: "Shangri-La Ballroom",
    city: "Ulaanbaatar",
    expectedAttendees: 200,
    presentingCompanies: 40,
    registrationCount: 142,
    registrationDeadline: "2026-05-10",
    ticketPrice: "MNT 1,200,000",
    coverImage: "/events/mif-2026.png",
    speakerSlugs: ["uchral-n", "byambasaikhan-b", "khan-bank-ceo", "rio-tinto-cfo", "namkhaidorj-b-speaker"],
    sponsors: [
      { name: "Khan Bank", tier: "platinum" },
      { name: "Trade and Development Bank", tier: "platinum" },
      { name: "Rio Tinto", tier: "gold" },
      { name: "KPMG Mongolia", tier: "gold" },
      { name: "Baker McKenzie", tier: "silver" },
      { name: "Golomt Bank", tier: "silver" },
    ],
    agenda: [
      { time: "08:30", title: "Registration & Coffee", type: "break" },
      { time: "09:00", title: "Opening Keynote: Mongolia's 2026 Outlook", speakerSlugs: ["uchral-n"], type: "keynote" },
      { time: "10:00", title: "Banking Sector Panel: Capital Formation in 2026", speakerSlugs: ["khan-bank-ceo", "namkhaidorj-b-speaker"], type: "panel" },
      { time: "11:15", title: "Coffee Break", type: "break" },
      { time: "11:30", title: "Mining: Oyu Tolgoi Phase 2 & Beyond", speakerSlugs: ["rio-tinto-cfo"], type: "presentation" },
      { time: "12:30", title: "Lunch & Networking", type: "networking" },
      { time: "14:00", title: "Capital Markets Reform: Where We Are", speakerSlugs: ["byambasaikhan-b"], type: "panel" },
      { time: "15:30", title: "Investor 1:1 Sessions", type: "networking" },
      { time: "18:00", title: "Welcome Reception", type: "networking" },
    ],
    topics: ["Capital Markets", "Mining & Resources", "Banking & Finance"],
  },
  {
    slug: "mif-shanghai-2026",
    title: "Mongolia Investment Forum: Shanghai 2026",
    shortName: "MIF Shanghai 2026",
    tagline: "A high-level platform connecting Mongolian policymakers, corporates, and project sponsors with Chinese investors",
    description:
      "MIF Shanghai 2026 brings together Mongolian policymakers, corporates, and project sponsors with Chinese institutional investors and strategic partners. The forum aims to move beyond dialogue and build practical, project-based partnerships across mining and energy, emerging technologies, and project financing. A one-day program of keynote sessions, structured panels, and curated networking — held at the Grand Hyatt Shanghai.",
    status: "registration-open",
    format: "in-person",
    startDate: "2026-05-27",
    endDate: "2026-05-27",
    location: "Grand Hyatt Shanghai, China",
    venue: "Grand Hyatt Shanghai",
    city: "Shanghai",
    coverImage: "/events/mif-shanghai-2026.png",
    speakerSlugs: [
      "zolbayar-e-speaker",
      "denzendash-g-speaker",
      "chris-melville-speaker",
      "erdenedalai-o-speaker",
      "bat-orgil-m-speaker",
      "zoljargal-d-speaker",
      "soyol-erdene-t-speaker",
    ],
    agenda: [
      { time: "08:00", title: "Registration & Breakfast", type: "break" },
      { time: "09:00", title: "Opening Remarks", speakerSlugs: ["zolbayar-e-speaker"], type: "keynote" },
      { time: "09:15", title: "Session 1: Energy Transition & Industrial Modernization", speakerSlugs: ["denzendash-g-speaker", "chris-melville-speaker", "erdenedalai-o-speaker"], type: "panel" },
      { time: "10:35", title: "Networking Coffee Break", type: "break" },
      { time: "11:00", title: "Session 2: Financing Mongolia's Next Big Projects — Mining, Energy & Infrastructure", speakerSlugs: ["bat-orgil-m-speaker", "zoljargal-d-speaker", "soyol-erdene-t-speaker"], type: "panel" },
      { time: "12:45", title: "Closing Remarks", speakerSlugs: ["zolbayar-e-speaker"], type: "keynote" },
      { time: "13:00", title: "Networking Lunch", type: "networking" },
    ],
    topics: ["Capital Markets", "Mining & Resources", "Energy"],
  },
  {
    slug: "mongolia-mining-summit-2026",
    title: "Mongolia Mining & Energy Summit",
    shortName: "MMES 2026",
    tagline: "Critical minerals, copper, and the energy transition",
    description:
      "A focused one-day summit on Mongolia's role in the global critical minerals supply chain. Operator presentations, off-take negotiations, and policy briefings from the Ministry of Mining.",
    status: "registration-open",
    format: "hybrid",
    startDate: "2026-06-12",
    location: "Blue Sky Tower, Ulaanbaatar",
    venue: "Blue Sky Conference Hall",
    city: "Ulaanbaatar",
    expectedAttendees: 120,
    presentingCompanies: 18,
    registrationCount: 64,
    ticketPrice: "MNT 800,000",
    coverImage: "/events/mining-summit-2026.jpg",
    speakerSlugs: ["damdinnyam-g", "rio-tinto-cfo", "ariunzaya-o-speaker"],
    sponsors: [
      { name: "Rio Tinto", tier: "platinum" },
      { name: "Erdenes Mongol", tier: "gold" },
    ],
    topics: ["Mining & Resources", "Energy", "Policy & Regulation"],
  },
  {
    slug: "cmm-investor-day-spring-2026",
    title: "CMM Investor Day — Spring 2026",
    tagline: "Quarterly briefing for CMM members",
    description:
      "A members-only briefing covering the Q1 2026 macro picture, banking sector earnings recap, and CMM's deal pipeline outlook.",
    status: "registration-open",
    format: "virtual",
    startDate: "2026-05-28",
    location: "Online (Zoom)",
    expectedAttendees: 80,
    registrationCount: 41,
    ticketPrice: "Members only",
    coverImage: "/events/investor-day-spring.jpg",
    speakerSlugs: ["namkhaidorj-b-speaker", "ariunzaya-o-speaker"],
    topics: ["Capital Markets", "Banking & Finance"],
  },
  {
    slug: "cmm-investor-day-winter-2025",
    title: "CMM Investor Day — Winter 2025",
    tagline: "2026 outlook & 2025 deal recap",
    description:
      "Members briefing covering 2025 deal recap, 2026 themes, and the inaugural Mongolia DealBook 2025 launch.",
    status: "past",
    format: "hybrid",
    startDate: "2025-12-04",
    location: "Shangri-La Hotel, Ulaanbaatar",
    city: "Ulaanbaatar",
    expectedAttendees: 90,
    registrationCount: 88,
    speakerSlugs: ["namkhaidorj-b-speaker", "byambasaikhan-b"],
    recapUrl: "/insights/mongolia-dealbook-2025",
    replayUrl: "#",
    topics: ["Capital Markets"],
  },
  {
    slug: "mif-2025",
    title: "Mongolia Investment Forum 2025",
    shortName: "MIF 2025",
    tagline: "Last year's flagship — 180 attendees",
    description:
      "MIF 2025 brought together 180+ institutional investors and 35 presenting companies. Highlights included the launch of Mongolia DealBook and the Bank of Mongolia governor's keynote.",
    status: "past",
    format: "in-person",
    startDate: "2025-05-22",
    endDate: "2025-05-23",
    location: "Shangri-La Hotel, Ulaanbaatar",
    city: "Ulaanbaatar",
    expectedAttendees: 180,
    presentingCompanies: 35,
    registrationCount: 184,
    coverImage: "/events/mif-2025.png",
    speakerSlugs: ["khan-bank-ceo", "byambasaikhan-b"],
    recapUrl: "#",
    replayUrl: "#",
    topics: ["Capital Markets", "Banking & Finance"],
  },
  {
    slug: "esg-mongolia-2025",
    title: "ESG Mongolia 2025",
    tagline: "Sustainable finance & climate disclosure",
    description:
      "Half-day workshop on Mongolia's SDG Finance Taxonomy adoption, IFC Performance Standards, and bank-led green finance initiatives.",
    status: "past",
    format: "in-person",
    startDate: "2025-10-15",
    location: "Corporate Hotel, Ulaanbaatar",
    city: "Ulaanbaatar",
    expectedAttendees: 70,
    registrationCount: 72,
    speakerSlugs: ["ariunzaya-o-speaker"],
    recapUrl: "#",
    topics: ["ESG & Climate", "Banking & Finance"],
  },
];

/* ── Speakers ──────────────────────────── */

export interface MockSpeaker {
  slug: string;
  name: string;
  initials: string;
  title: string;
  org: string;
  orgSlug?: string;
  bio: string;
  expertise?: string[];
  photo?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  websiteUrl?: string;
}

export const MOCK_SPEAKERS: MockSpeaker[] = [
  {
    slug: "uchral-n",
    name: "Uchral N.",
    initials: "UN",
    title: "Prime Minister",
    org: "Government of Mongolia",
    bio: "Prime Minister of Mongolia since April 2026. Previously Minister of Digital Development and Communications, where he championed capital markets reform and delivered the Orano uranium agreement.",
    expertise: ["Policy & Regulation", "Capital Markets", "Foreign Investment"],
  },
  {
    slug: "byambasaikhan-b",
    name: "Byambasaikhan B.",
    initials: "BB",
    title: "Board Chair",
    org: "Tavan Tolgoi JSC",
    orgSlug: "tavan-tolgoi",
    bio: "Veteran capital markets executive. Board Chair at Tavan Tolgoi JSC and former CEO of Erdenes Mongol. Frequent contributor to CMM research on state-owned enterprises and IPO readiness.",
    expertise: ["Capital Markets", "State-Owned Enterprises", "Mining & Resources"],
  },
  {
    slug: "khan-bank-ceo",
    name: "John Bell",
    initials: "JB",
    title: "Chief Executive Officer",
    org: "Khan Bank",
    orgSlug: "khan-bank",
    bio: "CEO of Khan Bank since 2023. Previously held senior roles at HSBC and Standard Chartered across Asia. Leading Khan Bank's digital banking transformation.",
    expertise: ["Banking & Finance", "Digital Transformation"],
  },
  {
    slug: "rio-tinto-cfo",
    name: "Sarah Mitchell",
    initials: "SM",
    title: "CFO, Copper Division",
    org: "Rio Tinto",
    bio: "Leads finance for Rio Tinto's global copper portfolio, including Oyu Tolgoi. Joined Rio Tinto in 2015 from BHP.",
    expertise: ["Mining & Resources", "Capital Allocation"],
  },
  {
    slug: "damdinnyam-g",
    name: "Damdinnyam G.",
    initials: "DG",
    title: "Minister of Mining",
    org: "Government of Mongolia",
    bio: "Minister of Mining in the Uchral cabinet. Previously CEO of Erdenes Tavan Tolgoi. Architect of the 2026 royalty reform draft.",
    expertise: ["Mining & Resources", "Policy & Regulation"],
  },
  {
    slug: "namkhaidorj-b-speaker",
    name: "Namkhaidorj B.",
    initials: "NB",
    title: "Senior Analyst",
    org: "CMM",
    bio: "CMM's senior analyst covering fixed income, deal structuring, and capital markets transactions. Co-author of the Mongolia DealBook series.",
    expertise: ["Capital Markets", "Fixed Income"],
  },
  {
    slug: "ariunzaya-o-speaker",
    name: "Ariunzaya O.",
    initials: "AO",
    title: "Geopolitics & Minerals Analyst",
    org: "CMM",
    bio: "Covers critical minerals policy, international relations, and Mongolia's positioning in global supply chains.",
    expertise: ["Mining & Resources", "Geopolitics", "ESG & Climate"],
  },
  {
    slug: "zolbayar-e-speaker",
    name: "Zolbayar Enkhbaatar",
    initials: "ZE",
    title: "Founder & CEO",
    org: "Capital Markets Mongolia",
    bio: "Founder and CEO of Capital Markets Mongolia. Leads CMM's research, the Mongolia DealBook series, and institutional investor outreach across Asia.",
    photo: "/events/speakers/zolbayar-e.jpg",
  },
  {
    slug: "denzendash-g-speaker",
    name: "Denzendash Gantulga",
    initials: "DG",
    title: "Director of Mining Development",
    org: "SOBT Holding LLC",
    bio: "Leads mining development at SOBT Holding, focused on project structuring and operator partnerships across Mongolia's mining sector.",
    photo: "/events/speakers/denzendash-g.png",
  },
  {
    slug: "chris-melville-speaker",
    name: "Chris John Melville",
    initials: "CM",
    title: "Managing Partner",
    org: "Melville Erdenedalai LLP",
    bio: "Managing Partner at Melville Erdenedalai LLP, advising on cross-border M&A, project finance, and natural resources transactions in Mongolia.",
    photo: "/events/speakers/chris-melville.png",
  },
  {
    slug: "erdenedalai-o-speaker",
    name: "Erdenedalai Odkhuu",
    initials: "EO",
    title: "Partner & CEO",
    org: "Melville Erdenedalai LLP",
    bio: "Partner and CEO at Melville Erdenedalai LLP. Specializes in capital markets, mining, and infrastructure transactions for Mongolian and international clients.",
    photo: "/events/speakers/erdenedalai-o.png",
  },
  {
    slug: "bat-orgil-m-speaker",
    name: "Bat-Orgil Munkhgerel",
    initials: "BM",
    title: "CEO",
    org: "Invescore Capital LLC",
    bio: "CEO of Invescore Capital, leading deal origination and execution across Mongolian capital markets, with a focus on mining, energy, and financial services.",
    photo: "/events/speakers/bat-orgil-m.png",
  },
  {
    slug: "zoljargal-d-speaker",
    name: "Zoljargal Dashnyam",
    initials: "ZD",
    title: "Managing Partner",
    org: "Dashnyam Partners LLC",
    bio: "Managing Partner at Dashnyam Partners. Advises corporate clients and project sponsors on capital structure, financing, and cross-border investment.",
    photo: "/events/speakers/zoljargal-d.png",
  },
  {
    slug: "soyol-erdene-t-speaker",
    name: "Soyol-Erdene Tsegmid",
    initials: "ST",
    title: "Advisor",
    org: "Capital Markets Mongolia",
    bio: "Advisor at Capital Markets Mongolia, contributing to research, deal flow, and partnership development with international investors.",
    photo: "/events/speakers/soyol-erdene-t.png",
  },
];

/* ── News (Market Feed) ────────────────── */

export type NewsCategory = "markets" | "companies" | "sectors" | "policy" | "deals" | "macro";

export const NEWS_CATEGORY_LABELS: Record<NewsCategory, string> = {
  markets: "Markets",
  companies: "Companies",
  sectors: "Sectors",
  policy: "Policy",
  deals: "Deals",
  macro: "Macro",
};

export const NEWS_CATEGORY_COLORS: Record<NewsCategory, string> = {
  markets: "var(--cat-markets)",
  companies: "var(--cat-companies)",
  sectors: "var(--cat-sectors)",
  policy: "var(--brand-l)",
  deals: "var(--cat-insights)",
  macro: "var(--cat-ai)",
};

export interface MockNewsItem {
  id: string;
  headline: string;
  summary?: string;
  source: string;
  sourceUrl?: string;
  publishedAt: string;
  category: NewsCategory;
  topics?: string[];
  entitySlugs: string[];
  /** AI confidence score 0-1 from entity-matching pipeline */
  confidence: number;
  /** True when analyst has reviewed the AI tagging */
  reviewed?: boolean;
  isBreaking?: boolean;
  imageUrl?: string;
}

export const MOCK_NEWS: MockNewsItem[] = [
  {
    id: "n-001",
    headline: "MSE Top-20 Closes at 6-Month High on Banking Rally",
    summary: "The benchmark gained 1.8% on the day, led by Khan Bank (+2.5%) and Golomt Bank (+1.2%). Volume hit MNT 12.4B, well above the 30-day average.",
    source: "Bloomberg",
    publishedAt: "2026-04-27T08:42:00Z",
    category: "markets",
    topics: ["Capital Markets", "Banking & Finance"],
    entitySlugs: ["khan-bank", "golomt-bank", "mse"],
    confidence: 0.94,
    reviewed: true,
    isBreaking: true,
  },
  {
    id: "n-002",
    headline: "Khan Bank Announces MNT 50B Bond Issuance for Infrastructure Lending",
    summary: "Five-year senior secured note priced at 11.5%. Proceeds earmarked for power transmission and urban water projects.",
    source: "Reuters",
    publishedAt: "2026-04-27T07:15:00Z",
    category: "deals",
    topics: ["Banking & Finance", "Capital Markets"],
    entitySlugs: ["khan-bank"],
    confidence: 0.97,
    reviewed: true,
  },
  {
    id: "n-003",
    headline: "Oyu Tolgoi Underground Phase 2 Reaches Production Milestone",
    summary: "Rio Tinto announced first ore from Panel 2 ahead of schedule. Sustaining capex guidance held at $1.2B for 2026.",
    source: "Mining.com",
    publishedAt: "2026-04-27T05:30:00Z",
    category: "companies",
    topics: ["Mining & Resources"],
    entitySlugs: ["oyu-tolgoi"],
    confidence: 0.98,
    reviewed: true,
  },
  {
    id: "n-004",
    headline: "Cabinet Approves Updated Mining Royalty Framework",
    summary: "Draft amendments cap progressive surcharges at 18% for copper exports. Industry response cautiously positive; Erdenes Mongol awaiting written guidance.",
    source: "Montsame",
    publishedAt: "2026-04-26T22:00:00Z",
    category: "policy",
    topics: ["Mining & Resources", "Policy & Regulation"],
    entitySlugs: ["oyu-tolgoi", "erdenet-mining"],
    confidence: 0.91,
    reviewed: true,
  },
  {
    id: "n-005",
    headline: "TDB Said to Mandate Banks for $500M Eurobond Roadshow",
    summary: "Citi, JPMorgan, and Mizuho reportedly mandated for early-June marketing. Use-of-proceeds includes refinancing and Central Asian expansion capex.",
    source: "Reuters",
    publishedAt: "2026-04-26T18:45:00Z",
    category: "deals",
    topics: ["Banking & Finance", "Capital Markets"],
    entitySlugs: ["tdb"],
    confidence: 0.85,
    reviewed: true,
  },
  {
    id: "n-006",
    headline: "Mongolia's March CPI Comes In at 11.8%, Below Consensus",
    summary: "Headline inflation eased 30bps from February. Food prices remain the dominant driver. Bank of Mongolia next decision May 12.",
    source: "FT",
    publishedAt: "2026-04-26T14:20:00Z",
    category: "macro",
    topics: ["Economy & Macro"],
    entitySlugs: [],
    confidence: 0.99,
    reviewed: true,
  },
  {
    id: "n-007",
    headline: "Ard App Crosses 2M Active Users, Doubles QoQ Transaction Volume",
    summary: "Ard Financial Group's super-app reported 2.1M MAUs as of March. P2P transfer and merchant payments led growth.",
    source: "Bloomberg",
    publishedAt: "2026-04-26T11:00:00Z",
    category: "companies",
    topics: ["Technology", "Banking & Finance"],
    entitySlugs: ["ard-financial-group"],
    confidence: 0.92,
    reviewed: true,
  },
  {
    id: "n-008",
    headline: "Erdenes Tavan Tolgoi IPO Roadmap Pushed to H2 2026",
    summary: "MSE listing now targeted for September. Working group cites pending royalty framework as the main schedule risk.",
    source: "CMM Research",
    publishedAt: "2026-04-26T09:30:00Z",
    category: "companies",
    topics: ["Capital Markets", "Mining & Resources", "State-Owned Enterprises"],
    entitySlugs: ["tavan-tolgoi", "erdenet-mining"],
    confidence: 0.78,
  },
  {
    id: "n-009",
    headline: "Coking Coal Spot Hits 14-Month Low on China Steel Demand",
    summary: "Newcastle benchmark fell to $186/t. Mongolian exporters face additional pressure from rail capacity constraints at Gashuunsukhait.",
    source: "Mining.com",
    publishedAt: "2026-04-25T16:10:00Z",
    category: "sectors",
    topics: ["Mining & Resources", "Trade & Geopolitics"],
    entitySlugs: ["tavan-tolgoi"],
    confidence: 0.87,
    reviewed: true,
  },
  {
    id: "n-010",
    headline: "Tsakhia Solar Park Achieves Financial Close",
    summary: "100MW project reached financial close with $92M senior facility led by ADB. Commissioning targeted Q3 2026.",
    source: "Reuters",
    publishedAt: "2026-04-25T13:45:00Z",
    category: "deals",
    topics: ["Energy", "ESG & Climate"],
    entitySlugs: ["tsakhia-solar", "newcom-group"],
    confidence: 0.95,
    reviewed: true,
  },
  {
    id: "n-011",
    headline: "FMO Commits Additional $50M to Mongolian Green Finance Pipeline",
    summary: "Top-up follows the original $150M facility announced in January. Khan Bank and TDB are the lead intermediaries.",
    source: "Bloomberg",
    publishedAt: "2026-04-25T10:00:00Z",
    category: "deals",
    topics: ["ESG & Climate", "Banking & Finance"],
    entitySlugs: ["khan-bank", "tdb"],
    confidence: 0.93,
    reviewed: true,
  },
  {
    id: "n-012",
    headline: "Gobi Cashmere Q1 Revenue Up 14% on Premium Channel Growth",
    summary: "Direct-to-consumer revenue grew 32% YoY. EBITDA margin expanded 180bps to 18.4%.",
    source: "Bloomberg",
    publishedAt: "2026-04-24T15:30:00Z",
    category: "companies",
    topics: ["Agriculture"],
    entitySlugs: ["gobi-cashmere"],
    confidence: 0.96,
    reviewed: true,
  },
  {
    id: "n-013",
    headline: "MSE to Pilot T+2 Settlement in June",
    summary: "Mongolian Stock Exchange announced phase 1 of its settlement modernization program. Initial scope covers MSE Top-20 constituents.",
    source: "Montsame",
    publishedAt: "2026-04-24T11:15:00Z",
    category: "policy",
    topics: ["Capital Markets"],
    entitySlugs: ["mse"],
    confidence: 0.89,
    reviewed: true,
  },
  {
    id: "n-014",
    headline: "Aspire Mining Closes A$15M Placement, Resumes Ovoot Drilling",
    summary: "Funds support an extended drill campaign at the Ovoot Coking Coal Project. Lead manager: Canaccord Genuity.",
    source: "Mining.com",
    publishedAt: "2026-04-24T08:20:00Z",
    category: "deals",
    topics: ["Mining & Resources", "Capital Markets"],
    entitySlugs: ["aspire-mining"],
    confidence: 0.94,
    reviewed: true,
  },
  {
    id: "n-015",
    headline: "Bank of Mongolia Holds Policy Rate at 12%",
    summary: "Statement cited persistent food-price inflation and tugrik volatility. Next meeting May 12.",
    source: "FT",
    publishedAt: "2026-04-23T17:00:00Z",
    category: "policy",
    topics: ["Economy & Macro", "Banking & Finance"],
    entitySlugs: [],
    confidence: 0.99,
    reviewed: true,
  },
  {
    id: "n-016",
    headline: "Mongolian Properties Reports First-Quarter Pre-Sales of MNT 84B",
    summary: "Pre-sales tracked above plan. Three new projects targeted for Q3 launch in UB.",
    source: "CMM Research",
    publishedAt: "2026-04-23T12:00:00Z",
    category: "companies",
    topics: ["Real Estate & Infrastructure"],
    entitySlugs: [],
    confidence: 0.62,
  },
  {
    id: "n-017",
    headline: "Newcom & Korean Consortium Sign MoU for Wind Project",
    summary: "150MW wind farm in Sainshand. PPA framework under negotiation with Central Grid.",
    source: "Reuters",
    publishedAt: "2026-04-22T20:30:00Z",
    category: "sectors",
    topics: ["Energy", "ESG & Climate"],
    entitySlugs: ["newcom-group"],
    confidence: 0.83,
    reviewed: true,
  },
  {
    id: "n-018",
    headline: "Mandal Insurance Net Income Up 22% on Non-Life Premium Growth",
    summary: "Combined ratio improved to 92.3%. Investment income held flat YoY.",
    source: "Bloomberg",
    publishedAt: "2026-04-22T14:00:00Z",
    category: "companies",
    topics: ["Banking & Finance"],
    entitySlugs: ["mandal-insurance"],
    confidence: 0.95,
    reviewed: true,
  },
  {
    id: "n-019",
    headline: "Parliament Approves 2026 Supplementary Budget",
    summary: "MNT 1.2T supplementary budget passed final reading. Allocations weighted toward energy infrastructure and pension top-ups.",
    source: "Montsame",
    publishedAt: "2026-04-22T09:45:00Z",
    category: "policy",
    topics: ["Policy & Regulation", "Economy & Macro"],
    entitySlugs: [],
    confidence: 0.88,
    reviewed: true,
  },
  {
    id: "n-020",
    headline: "M Bank Reports Strong Trade Finance Demand From Mid-Cap Importers",
    summary: "Trade finance book grew 18% YoY in Q1. NIM held at 3.9%.",
    source: "CMM Research",
    publishedAt: "2026-04-21T16:30:00Z",
    category: "companies",
    topics: ["Banking & Finance"],
    entitySlugs: [],
    confidence: 0.71,
  },
];
