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
    slug: "mongolia-steel-complex-international-tender",
    title: "Mongolia Opens International Tender for Landmark Steel Complex",
    excerpt: "Mongolia launched an international tender for its $806M Steel Production Complex in Darkhan-Uul Province. The facility will produce a minimum of one million tons of steel annually, covering 60-70% of domestic needs.",
    contentType: "article",
    topics: ["Mining & Resources", "Economy"],
    author: "Enkhjin A.",
    publishedAt: "2026-04-13",
    readTime: 6,
    isPremium: false,
    entityRefs: ["darkhan-steel"],
    coverImage: "/insights/steel-complex.jpg",
  },
  {
    slug: "monthly-market-update-march-2026",
    title: "Monthly Market Update — March, 2026",
    excerpt: "Key highlights: Bank of Mongolia keeps policy rate at 12%. Mongolia appoints 37th Prime Minister and cabinet. Commodity price shock analysis and forward-looking outlook for Q2.",
    contentType: "monthly-update",
    topics: ["Economy", "Capital Markets"],
    author: "Enkhjin A.",
    publishedAt: "2026-04-08",
    readTime: 15,
    isPremium: false,
    entityRefs: ["mse"],
    coverImage: "/insights/mmu-march-2026.png",
  },
  {
    slug: "mongolia-new-cabinet-assembled",
    title: "Mongolia's New Cabinet Is Assembled. Now Comes the Hard Part.",
    excerpt: "PM Uchral N. assembled a 19-minister cabinet at 2:24 AM on April 4. Ten ministers carry over from the previous administration. Key appointments in Mining, Finance, and Energy signal policy continuity with targeted reform.",
    contentType: "article",
    topics: ["Politics & Government", "Economy"],
    author: "Tselmeg E.",
    publishedAt: "2026-04-07",
    readTime: 8,
    isPremium: false,
    entityRefs: ["oyu-tolgoi"],
    coverImage: "/insights/new-cabinet.png",
  },
  {
    slug: "three-prime-ministers-whats-next",
    title: "Three Prime Ministers in Less Than a Year: What's Next for Mongolia?",
    excerpt: "Zandanshatar's resignation reflects internal MPP tensions over power concentration. Uchral's track record on the Orano uranium deal and market reforms positions him favorably for investors.",
    contentType: "article",
    topics: ["Politics & Government", "Capital Markets"],
    author: "Zolbayar E.",
    publishedAt: "2026-03-30",
    readTime: 7,
    isPremium: false,
    entityRefs: [],
    coverImage: "/insights/three-pms.png",
  },
  {
    slug: "china-energy-transition-mongolia-strategic-role",
    title: "China's Energy Transition & Mongolia's Strategic Role",
    excerpt: "Mongolia is evolving from a peripheral neighbor into a strategic energy corridor and supplier of critical minerals — copper and rare earths — essential for renewable energy infrastructure across Northeast Asia.",
    contentType: "article",
    topics: ["Energy", "Mining & Resources"],
    author: "Enkhtaivan B.",
    publishedAt: "2026-03-05",
    readTime: 10,
    isPremium: false,
    entityRefs: ["oyu-tolgoi"],
    coverImage: "/insights/china-energy-transition.jpg",
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
    coverImage: "/insights/tsetsens-bond.png",
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
    coverImage: "/insights/mining-royalty.png",
  },
  {
    slug: "mongolia-critical-minerals-moment",
    title: "Geography is Not Destiny: Mongolia's Critical Minerals Moment",
    excerpt: "The 2026 Critical Minerals Ministerial in Washington convened 50+ nations. Mongolia possesses substantial copper, uranium, fluorspar, and rare earth deposits — but double-landlocked geography constrains autonomy.",
    contentType: "article",
    topics: ["Mining & Resources", "Politics & Government"],
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
    author: "CMM Research",
    publishedAt: "2026-01-26",
    readTime: 30,
    isPremium: true,
    entityRefs: ["tdb", "golomt-bank", "khan-bank"],
    coverImage: "/insights/dealbook-2025.jpg",
  },
  {
    slug: "mongolia-sovereign-bond-issuance",
    title: "Mongolia Sovereign Bond Issuance Signals Renewed Activity",
    excerpt: "Mongolia returns to international debt markets with a new sovereign issuance, signaling improved fiscal positioning and renewed investor appetite for Mongolian credit.",
    contentType: "article",
    topics: ["Capital Markets", "Economy"],
    author: "CMM Research",
    publishedAt: "2026-02-15",
    readTime: 6,
    isPremium: false,
    entityRefs: [],
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
