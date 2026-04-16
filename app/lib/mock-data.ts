export interface MockArticle {
  slug: string;
  title: string;
  excerpt: string;
  contentType: "article" | "monthly-update" | "investment-teaser" | "deal-insight" | "research-report" | "press-release" | "cmm-guide";
  topics: string[];
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

export interface MockEntity {
  slug: string;
  name: string;
  ticker?: string;
  sector: string;
  type: EntityType;
  description: string;
  marketCap?: string;
  price?: number;
  change?: number;
  changePercent?: number;
  isRaising?: boolean;
}

export const MOCK_ARTICLES: MockArticle[] = [
  {
    slug: "erdenet-mining-ipo-2026-what-investors-should-know",
    title: "Erdenet Mining IPO 2026: What Investors Should Know",
    excerpt: "Mongolia's largest copper-molybdenum producer is preparing for its long-anticipated IPO on the MSE. Here's the full breakdown of valuation, risks, and the political dynamics shaping the deal.",
    contentType: "deal-insight",
    topics: ["Mining & Resources", "Capital Markets"],
    author: "CMM Research",
    publishedAt: "2026-04-14",
    readTime: 12,
    isPremium: true,
    entityRefs: ["erdenet-mining", "mse"],
  },
  {
    slug: "khan-bank-q1-2026-earnings-beat-expectations",
    title: "Khan Bank Q1 2026 Earnings Beat Expectations on Lending Growth",
    excerpt: "Khan Bank reported net income of MNT 98.2B for Q1 2026, up 23% YoY, driven by strong corporate lending and digital banking revenue. NPL ratio improved to 2.1%.",
    contentType: "article",
    topics: ["Banking & Finance", "Capital Markets"],
    author: "CMM Research",
    publishedAt: "2026-04-12",
    readTime: 6,
    isPremium: false,
    entityRefs: ["khan-bank"],
  },
  {
    slug: "monthly-market-update-march-2026",
    title: "Monthly Market Update: March 2026 — MSE Rallies on Mining Optimism",
    excerpt: "The MSE Top 20 index gained 7.3% in March, its best monthly performance since October 2024. Mining stocks led the rally as copper prices hit $10,800/t and Oyu Tolgoi underground production ramps.",
    contentType: "monthly-update",
    topics: ["Capital Markets", "Economy"],
    author: "CMM Research",
    publishedAt: "2026-04-01",
    readTime: 15,
    isPremium: false,
    entityRefs: ["mse"],
  },
  {
    slug: "mongolia-green-bond-framework-esg-milestone",
    title: "Mongolia Launches Green Bond Framework — A New Chapter for ESG in the Market",
    excerpt: "The Financial Regulatory Commission approved Mongolia's first sovereign green bond framework, targeting $500M in issuance for renewable energy and sustainable mining infrastructure.",
    contentType: "article",
    topics: ["ESG & Sustainability", "Capital Markets"],
    author: "CMM Research",
    publishedAt: "2026-04-10",
    readTime: 8,
    isPremium: false,
    entityRefs: [],
  },
  {
    slug: "tdb-capital-raising-500m-expansion",
    title: "TDB Plans $500M Capital Raising for Central Asian Expansion",
    excerpt: "Trade and Development Bank is preparing a landmark capital raise through a combination of subordinated bonds and a potential secondary listing. The proceeds will fund expansion into Kyrgyzstan and Kazakhstan.",
    contentType: "investment-teaser",
    topics: ["Banking & Finance", "Capital Markets"],
    author: "CMM Research",
    publishedAt: "2026-04-08",
    readTime: 7,
    isPremium: true,
    entityRefs: ["tdb"],
  },
  {
    slug: "oyu-tolgoi-underground-reaches-commercial-production",
    title: "Oyu Tolgoi Underground Reaches Commercial Production",
    excerpt: "Rio Tinto confirmed Oyu Tolgoi's Hugo North underground block cave has achieved commercial production, a milestone that is expected to make Mongolia a top-5 global copper producer by 2028.",
    contentType: "press-release",
    topics: ["Mining & Resources"],
    author: "Rio Tinto / CMM",
    publishedAt: "2026-04-06",
    readTime: 3,
    isPremium: false,
    entityRefs: ["oyu-tolgoi", "rio-tinto"],
  },
  {
    slug: "mongolia-inflation-slows-central-bank-holds-rates",
    title: "Mongolia Inflation Slows to 5.8% — Central Bank Holds Rates at 10%",
    excerpt: "March CPI came in at 5.8% YoY, down from 6.4% in February. The Bank of Mongolia held its policy rate at 10%, citing continued uncertainty in food prices and the tugrik's depreciation against the dollar.",
    contentType: "article",
    topics: ["Economy", "Banking & Finance"],
    author: "CMM Research",
    publishedAt: "2026-04-04",
    readTime: 5,
    isPremium: false,
    entityRefs: [],
  },
  {
    slug: "and-global-digital-infrastructure-deal-flow",
    title: "AND Global's $200M Digital Infrastructure Play in Mongolia",
    excerpt: "AND Global is deploying $200M into data centers, fiber optics, and smart city infrastructure across Ulaanbaatar. The company aims to position Mongolia as a regional data hub between China and Russia.",
    contentType: "investment-teaser",
    topics: ["Technology", "Real Estate & Infrastructure"],
    author: "CMM Research",
    publishedAt: "2026-04-02",
    readTime: 9,
    isPremium: true,
    entityRefs: ["and-global"],
  },
  {
    slug: "guide-to-investing-in-mongolian-equities",
    title: "A Practical Guide to Investing in Mongolian Equities",
    excerpt: "Everything a foreign institutional investor needs to know: account setup, custody, settlement, tax, FX, and the regulatory landscape. Updated for 2026 with new FRC guidelines.",
    contentType: "cmm-guide",
    topics: ["Capital Markets"],
    author: "CMM Research",
    publishedAt: "2026-03-20",
    readTime: 20,
    isPremium: false,
    entityRefs: ["mse"],
  },
  {
    slug: "ard-financial-group-research-report-2026",
    title: "Ard Financial Group — Deep Dive: Mongolia's Fintech Conglomerate",
    excerpt: "A comprehensive analysis of Ard Financial Group's ecosystem: Ard Insurance, Ard Credit, Ard Securities, and the Ard App. Valuation, growth vectors, and risks for the MSE's most traded stock.",
    contentType: "research-report",
    topics: ["Banking & Finance", "Technology", "Capital Markets"],
    author: "CMM Research",
    publishedAt: "2026-03-15",
    readTime: 35,
    isPremium: true,
    entityRefs: ["ard-financial-group"],
  },
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
    description: "Operates Mongolia's largest coking coal deposit. Strategic supplier to Chinese and Japanese steel mills.",
    marketCap: "MNT 8.2T",
    price: 182400,
    change: 3600,
    changePercent: 2.01,
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
    description: "100MW utility-scale solar project in Dundgobi province. Part of Mongolia's 30% renewables target by 2030.",
    isRaising: true,
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
    description: "Audit, tax, and advisory services. Covers mining, banking, and public sector engagements in Mongolia.",
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

export const TOPIC_TAGS = [
  "Mining & Resources",
  "Energy",
  "Banking & Finance",
  "Capital Markets",
  "Economy",
  "Politics & Government",
  "ESG & Sustainability",
  "Technology",
  "Real Estate & Infrastructure",
  "State-Owned Enterprises",
  "Ratings & Governance",
] as const;

export const CONTENT_TYPES = [
  { value: "article", label: "Article" },
  { value: "monthly-update", label: "Monthly Update" },
  { value: "investment-teaser", label: "Investment Teaser" },
  { value: "deal-insight", label: "Deal Insight" },
  { value: "research-report", label: "Research Report" },
  { value: "press-release", label: "Press Release" },
  { value: "cmm-guide", label: "CMM Guide" },
] as const;
