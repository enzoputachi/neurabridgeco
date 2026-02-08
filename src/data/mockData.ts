// Mock data for NeuraBridge development

export type Market = "stocks" | "crypto" | "forex" | "bonds" | "commodities";

export interface Expert {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  credentials: string;
  markets: Market[];
  headline: string;
  subscriptionPrice: number | null; // null = free
  subscriberCount: number;
  postCount: number;
  isFeatured: boolean;
  isTrending: boolean;
}

export interface Post {
  id: string;
  expertId: string;
  asset: string;
  market: Market;
  timeframe: string;
  content: string;
  isPublic: boolean;
  createdAt: string;
}

export const markets: { id: Market; name: string; icon: string; description: string }[] = [
  {
    id: "stocks",
    name: "Stocks",
    icon: "📈",
    description: "Equities, ETFs, and index analysis",
  },
  {
    id: "crypto",
    name: "Crypto",
    icon: "₿",
    description: "Bitcoin, Ethereum, and altcoins",
  },
  {
    id: "forex",
    name: "Forex",
    icon: "💱",
    description: "Currency pairs and FX markets",
  },
  {
    id: "bonds",
    name: "Bonds",
    icon: "📊",
    description: "Fixed income and treasury analysis",
  },
  {
    id: "commodities",
    name: "Commodities",
    icon: "🛢️",
    description: "Gold, oil, and raw materials",
  },
];

export const mockExperts: Expert[] = [
  {
    id: "1",
    name: "Sarah Chen",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    bio: "Former Goldman Sachs equity analyst with 15 years of experience in tech sector analysis. Specializing in growth stocks and market cycles.",
    credentials: "CFA, Former Goldman Sachs",
    markets: ["stocks"],
    headline: "Tech sector showing signs of rotation. Watch semiconductors closely.",
    subscriptionPrice: 29,
    subscriberCount: 1247,
    postCount: 156,
    isFeatured: true,
    isTrending: true,
  },
  {
    id: "2",
    name: "Marcus Webb",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    bio: "Crypto analyst and early Bitcoin adopter. Focus on on-chain metrics and DeFi protocols.",
    credentials: "Blockchain Developer, DeFi Researcher",
    markets: ["crypto"],
    headline: "BTC hash rate hitting new ATH. Accumulation phase continues.",
    subscriptionPrice: 49,
    subscriberCount: 892,
    postCount: 203,
    isFeatured: true,
    isTrending: true,
  },
  {
    id: "3",
    name: "Elena Rodriguez",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    bio: "FX trader with expertise in emerging market currencies. 12 years at major hedge funds.",
    credentials: "Former Bridgewater Associates",
    markets: ["forex"],
    headline: "EUR/USD approaching key support. Central bank divergence in play.",
    subscriptionPrice: 39,
    subscriberCount: 634,
    postCount: 98,
    isFeatured: false,
    isTrending: true,
  },
  {
    id: "4",
    name: "James Park",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    bio: "Commodities specialist with focus on energy markets. Former oil trader at Vitol.",
    credentials: "Energy Trading Expert",
    markets: ["commodities", "stocks"],
    headline: "Oil inventories declining. Watch OPEC+ meeting for direction.",
    subscriptionPrice: 35,
    subscriberCount: 421,
    postCount: 87,
    isFeatured: true,
    isTrending: false,
  },
  {
    id: "5",
    name: "Aisha Patel",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    bio: "Fixed income analyst specializing in corporate bonds and yield curve analysis.",
    credentials: "CFA, Fixed Income Specialist",
    markets: ["bonds"],
    headline: "Yield curve dynamics shifting. Duration risk increasing.",
    subscriptionPrice: null,
    subscriberCount: 312,
    postCount: 64,
    isFeatured: false,
    isTrending: false,
  },
  {
    id: "6",
    name: "David Kim",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    bio: "Multi-asset strategist covering stocks and crypto. Focus on macro trends.",
    credentials: "CFA, CMT",
    markets: ["stocks", "crypto"],
    headline: "Correlation between risk assets tightening. Volatility incoming.",
    subscriptionPrice: 59,
    subscriberCount: 756,
    postCount: 142,
    isFeatured: true,
    isTrending: true,
  },
];

export const mockPosts: Post[] = [
  {
    id: "p1",
    expertId: "1",
    asset: "NVDA",
    market: "stocks",
    timeframe: "Medium-term",
    content: "NVIDIA showing strong momentum ahead of earnings. AI demand continues to exceed expectations. Key levels to watch: support at $850, resistance at $950.",
    isPublic: true,
    createdAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "p2",
    expertId: "1",
    asset: "AAPL",
    market: "stocks",
    timeframe: "Short-term",
    content: "Apple's Vision Pro launch could be a catalyst. However, China sales weakness remains a concern. Neutral stance for now.",
    isPublic: true,
    createdAt: "2024-01-14T14:00:00Z",
  },
  {
    id: "p3",
    expertId: "1",
    asset: "MSFT",
    market: "stocks",
    timeframe: "Long-term",
    content: "[Subscribers Only] Deep dive into Microsoft's AI monetization strategy and why I'm increasing my target price...",
    isPublic: false,
    createdAt: "2024-01-13T09:00:00Z",
  },
  {
    id: "p4",
    expertId: "2",
    asset: "BTC",
    market: "crypto",
    timeframe: "Long-term",
    content: "Bitcoin ETF approval driving institutional flows. On-chain metrics suggest long-term holders accumulating aggressively.",
    isPublic: true,
    createdAt: "2024-01-15T08:00:00Z",
  },
  {
    id: "p5",
    expertId: "2",
    asset: "ETH",
    market: "crypto",
    timeframe: "Medium-term",
    content: "[Subscribers Only] Ethereum staking yields and why the ETH/BTC ratio may be at a turning point...",
    isPublic: false,
    createdAt: "2024-01-14T16:00:00Z",
  },
  {
    id: "p6",
    expertId: "3",
    asset: "EUR/USD",
    market: "forex",
    timeframe: "Short-term",
    content: "ECB and Fed policy divergence creating opportunities. Euro weakness may persist into Q2.",
    isPublic: true,
    createdAt: "2024-01-15T06:00:00Z",
  },
  {
    id: "p7",
    expertId: "4",
    asset: "Crude Oil",
    market: "commodities",
    timeframe: "Short-term",
    content: "Geopolitical tensions supporting oil prices. Brent crude finding support at $75 level.",
    isPublic: true,
    createdAt: "2024-01-14T12:00:00Z",
  },
  {
    id: "p8",
    expertId: "6",
    asset: "BTC/SPX Correlation",
    market: "crypto",
    timeframe: "Medium-term",
    content: "Risk-on/risk-off dynamics changing. Bitcoin's correlation with equities at multi-month highs.",
    isPublic: true,
    createdAt: "2024-01-15T11:00:00Z",
  },
];

export const getExpertById = (id: string): Expert | undefined => {
  return mockExperts.find((expert) => expert.id === id);
};

export const getPostsByExpertId = (expertId: string): Post[] => {
  return mockPosts.filter((post) => post.expertId === expertId);
};

export const getFeaturedExperts = (): Expert[] => {
  return mockExperts.filter((expert) => expert.isFeatured);
};

export const getTrendingExperts = (): Expert[] => {
  return mockExperts.filter((expert) => expert.isTrending);
};

export const getPublicPosts = (): Post[] => {
  return mockPosts.filter((post) => post.isPublic);
};
