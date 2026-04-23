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

/* ── Rich entity spec (from Entity Fields Master, Apr 23) ── */

export type DataSource = "AI-Generated" | "CMM Verified" | "Company Submitted";
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
  },
  {
    slug: "mse",
    name: "Mongolian Stock Exchange",
    ticker: "MSE",
    sector: "Capital Markets",
    type: "public_company",
    description: "Mongolia's primary securities exchange. ~200 listed companies, market cap ~MNT 10T.",
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
    name: "Golomt Bank",
    ticker: "GLMT",
    sector: "Banking & Finance",
    type: "public_company",
    description: "Mongolia's second-largest bank. Strong corporate banking and trade finance franchise.",
    marketCap: "MNT 1.6T",
    price: 28900,
    change: 350,
    changePercent: 1.22,
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
