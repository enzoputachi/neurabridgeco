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
  subscriptionPrice: number | null;
  subscriberCount: number;
  postCount: number;
  isFeatured: boolean;
  isTrending: boolean;
  rating: number;
  ratingCount: number;
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
  image?: string;
  ratings: PostRating[];
}

export interface PostRating {
  investorId: string;
  investorName: string;
  score: number; // 1-5
  comment?: string;
}

export interface MarketplaceItem {
  id: string;
  expertId: string;
  title: string;
  description: string;
  type: "course" | "webinar" | "opportunity";
  image: string;
  price: number;
  rating: number;
  ratingCount: number;
  enrolledCount: number;
  createdAt: string;
}

export const markets: { id: Market; name: string; icon: string; description: string }[] = [
  { id: "stocks", name: "Stocks", icon: "📈", description: "Equities, ETFs, and index analysis" },
  { id: "crypto", name: "Crypto", icon: "₿", description: "Bitcoin, Ethereum, and altcoins" },
  { id: "forex", name: "Forex", icon: "💱", description: "Currency pairs and FX markets" },
  { id: "bonds", name: "Bonds", icon: "📊", description: "Fixed income and treasury analysis" },
  { id: "commodities", name: "Commodities", icon: "🛢️", description: "Gold, oil, and raw materials" },
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
    rating: 4.8,
    ratingCount: 342,
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
    rating: 4.6,
    ratingCount: 218,
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
    rating: 4.5,
    ratingCount: 156,
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
    rating: 4.3,
    ratingCount: 98,
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
    rating: 4.2,
    ratingCount: 74,
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
    rating: 4.7,
    ratingCount: 267,
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
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=400&fit=crop",
    ratings: [],
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
    image: "https://images.unsplash.com/photo-1591696205602-2f950c417cb9?w=800&h=400&fit=crop",
    ratings: [],
  },
  {
    id: "p3",
    expertId: "1",
    asset: "MSFT",
    market: "stocks",
    timeframe: "Long-term",
    content: "Deep dive into Microsoft's AI monetization strategy. Azure growth accelerating, Copilot adoption ramping. Target price increase to $480. Key risks: antitrust scrutiny and cloud margin pressure from capex.",
    isPublic: false,
    createdAt: "2024-01-13T09:00:00Z",
    image: "https://images.unsplash.com/photo-1633158829585-23ba8f7c8caf?w=800&h=400&fit=crop",
    ratings: [
      { investorId: "inv1", investorName: "Alex Turner", score: 5, comment: "Incredibly detailed analysis" },
      { investorId: "inv2", investorName: "Maria Santos", score: 4, comment: "Great insights on Azure" },
      { investorId: "inv3", investorName: "Jordan Lee", score: 5 },
    ],
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
    image: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=800&h=400&fit=crop",
    ratings: [],
  },
  {
    id: "p5",
    expertId: "2",
    asset: "ETH",
    market: "crypto",
    timeframe: "Medium-term",
    content: "Ethereum staking yields hitting 4.8% APY. The ETH/BTC ratio at 0.052 is historically a strong buy zone. Layer 2 activity surging with Base and Arbitrum leading. Expecting a ratio reversal in Q2.",
    isPublic: false,
    createdAt: "2024-01-14T16:00:00Z",
    image: "https://images.unsplash.com/photo-1622630998477-20aa696ecb05?w=800&h=400&fit=crop",
    ratings: [
      { investorId: "inv1", investorName: "Alex Turner", score: 4, comment: "Solid ETH analysis" },
      { investorId: "inv4", investorName: "Chris Blake", score: 5, comment: "Perfect timing on this call" },
    ],
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
    image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&h=400&fit=crop",
    ratings: [],
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
    image: "https://images.unsplash.com/photo-1513828583688-c52646db42da?w=800&h=400&fit=crop",
    ratings: [],
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
    image: "https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=800&h=400&fit=crop",
    ratings: [],
  },
  {
    id: "p9",
    expertId: "3",
    asset: "GBP/JPY",
    market: "forex",
    timeframe: "Medium-term",
    content: "GBP/JPY showing a descending channel. BOJ policy shift expectations driving yen strength. Key support at 185.50 with resistance at 190.20. Risk/reward favors shorts below 188.",
    isPublic: false,
    createdAt: "2024-01-12T09:30:00Z",
    image: "https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?w=800&h=400&fit=crop",
    ratings: [
      { investorId: "inv2", investorName: "Maria Santos", score: 5, comment: "Spot on analysis" },
      { investorId: "inv5", investorName: "Ryan Cooper", score: 4 },
    ],
  },
  {
    id: "p10",
    expertId: "6",
    asset: "SOL",
    market: "crypto",
    timeframe: "Short-term",
    content: "Solana ecosystem exploding with meme coin activity and DePIN projects. Network performance improved dramatically since Firedancer. Price target $280 short-term with stop at $195.",
    isPublic: false,
    createdAt: "2024-01-11T15:00:00Z",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=400&fit=crop",
    ratings: [
      { investorId: "inv1", investorName: "Alex Turner", score: 5, comment: "David's macro view is always on point" },
      { investorId: "inv3", investorName: "Jordan Lee", score: 4, comment: "Good entry levels" },
      { investorId: "inv4", investorName: "Chris Blake", score: 5 },
    ],
  },
];

export const mockMarketplaceItems: MarketplaceItem[] = [
  {
    id: "c1",
    expertId: "1",
    title: "Mastering Technical Analysis for Growth Stocks",
    description: "A comprehensive 12-module course covering chart patterns, indicators, and momentum strategies for identifying high-growth equities. Includes live trade examples and weekly assignments.",
    type: "course",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop",
    price: 199,
    rating: 4.9,
    ratingCount: 87,
    enrolledCount: 432,
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "c2",
    expertId: "2",
    title: "DeFi Deep Dive: Yield Farming to Protocol Analysis",
    description: "Learn to evaluate DeFi protocols, understand smart contract risks, and build yield farming strategies. From basics to advanced on-chain analytics.",
    type: "course",
    image: "https://images.unsplash.com/photo-1639762681057-408e52192e55?w=800&h=450&fit=crop",
    price: 249,
    rating: 4.7,
    ratingCount: 63,
    enrolledCount: 298,
    createdAt: "2024-01-05T00:00:00Z",
  },
  {
    id: "w1",
    expertId: "1",
    title: "Live: Q1 2024 Tech Earnings Preview",
    description: "Join me for a live 2-hour session breaking down expected earnings for FAANG+, semiconductors, and AI plays. Q&A included. Recording available after.",
    type: "webinar",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop",
    price: 49,
    rating: 4.8,
    ratingCount: 156,
    enrolledCount: 834,
    createdAt: "2024-01-10T00:00:00Z",
  },
  {
    id: "w2",
    expertId: "3",
    title: "Forex Masterclass: Central Bank Trading Strategies",
    description: "A live workshop on trading central bank decisions. Covers rate decision analysis, statement parsing, and positioning strategies around FOMC, ECB, and BOJ meetings.",
    type: "webinar",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=450&fit=crop",
    price: 79,
    rating: 4.6,
    ratingCount: 42,
    enrolledCount: 187,
    createdAt: "2024-01-08T00:00:00Z",
  },
  {
    id: "o1",
    expertId: "4",
    title: "Energy Sector Investment Club — Q1 2024",
    description: "Exclusive quarterly investment club focusing on energy sector opportunities. Includes 4 weekly calls, a model portfolio, and real-time trade alerts via private channel.",
    type: "opportunity",
    image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&h=450&fit=crop",
    price: 399,
    rating: 4.4,
    ratingCount: 28,
    enrolledCount: 56,
    createdAt: "2024-01-03T00:00:00Z",
  },
  {
    id: "c3",
    expertId: "6",
    title: "Cross-Asset Macro Trading: Stocks × Crypto",
    description: "Learn to trade macro themes across traditional and digital assets. Covers correlation analysis, regime detection, and portfolio construction for multi-asset strategies.",
    type: "course",
    image: "https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=800&h=450&fit=crop",
    price: 179,
    rating: 4.8,
    ratingCount: 95,
    enrolledCount: 521,
    createdAt: "2024-01-02T00:00:00Z",
  },
  {
    id: "w3",
    expertId: "5",
    title: "Bond Market Outlook 2024: Rates, Credit & Duration",
    description: "Free webinar on the fixed income landscape for 2024. Covering yield curve expectations, corporate bond spreads, and duration management strategies.",
    type: "webinar",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=450&fit=crop",
    price: 0,
    rating: 4.3,
    ratingCount: 89,
    enrolledCount: 1243,
    createdAt: "2024-01-06T00:00:00Z",
  },
  {
    id: "o2",
    expertId: "2",
    title: "Crypto Alpha Group — Monthly Membership",
    description: "Join an exclusive group of serious crypto investors. Get early access to on-chain signals, new token analysis, and weekly portfolio reviews with Marcus.",
    type: "opportunity",
    image: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=800&h=450&fit=crop",
    price: 149,
    rating: 4.5,
    ratingCount: 34,
    enrolledCount: 89,
    createdAt: "2024-01-04T00:00:00Z",
  },
];

// Mock analytics data for expert dashboard
export const mockAnalytics = {
  monthlyEarnings: [
    { month: "Aug", earnings: 1240 },
    { month: "Sep", earnings: 1890 },
    { month: "Oct", earnings: 2340 },
    { month: "Nov", earnings: 2780 },
    { month: "Dec", earnings: 3120 },
    { month: "Jan", earnings: 3650 },
  ],
  subscriberGrowth: [
    { month: "Aug", subscribers: 420, followers: 890 },
    { month: "Sep", subscribers: 510, followers: 1020 },
    { month: "Oct", subscribers: 680, followers: 1180 },
    { month: "Nov", subscribers: 820, followers: 1350 },
    { month: "Dec", subscribers: 1050, followers: 1580 },
    { month: "Jan", subscribers: 1247, followers: 1820 },
  ],
  overallRating: 4.8,
  totalRatings: 342,
  ratingBreakdown: [
    { stars: 5, count: 198 },
    { stars: 4, count: 102 },
    { stars: 3, count: 28 },
    { stars: 2, count: 10 },
    { stars: 1, count: 4 },
  ],
};

export const getExpertById = (id: string): Expert | undefined => {
  return mockExperts.find((expert) => expert.id === id);
};

export const getPostsByExpertId = (expertId: string): Post[] => {
  return mockPosts.filter((post) => post.expertId === expertId);
};

export const getMarketplaceByExpertId = (expertId: string): MarketplaceItem[] => {
  return mockMarketplaceItems.filter((item) => item.expertId === expertId);
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

export const getMarketplaceItemById = (id: string): MarketplaceItem | undefined => {
  return mockMarketplaceItems.find((item) => item.id === id);
};

export interface AppNotification {
  id: string;
  type: "follow" | "subscribe" | "message" | "rating" | "new_post";
  title: string;
  description: string;
  createdAt: string;
  read: boolean;
}

export interface MockMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  receiverId: string;
  receiverName: string;
  content: string;
  createdAt: string;
  read: boolean;
}

export interface MockSubscriber {
  id: string;
  name: string;
  avatar: string;
  subscribedAt: string;
  plan: string;
}

export const mockNotifications: AppNotification[] = [
  { id: "n1", type: "subscribe", title: "New Subscriber", description: "Alex Turner subscribed to your premium insights", createdAt: "2024-01-15T10:00:00Z", read: false },
  { id: "n2", type: "follow", title: "New Follower", description: "Maria Santos started following you", createdAt: "2024-01-15T08:00:00Z", read: false },
  { id: "n3", type: "rating", title: "New Rating", description: "Your NVDA analysis received a 5-star rating", createdAt: "2024-01-14T16:00:00Z", read: true },
  { id: "n4", type: "message", title: "New Message", description: "Jordan Lee sent you a message", createdAt: "2024-01-14T12:00:00Z", read: true },
  { id: "n5", type: "new_post", title: "New Insight", description: "Sarah Chen published a new analysis on AAPL", createdAt: "2024-01-14T09:00:00Z", read: true },
];

export const mockMessages: MockMessage[] = [
  { id: "m1", senderId: "inv1", senderName: "Alex Turner", senderAvatar: "https://images.unsplash.com/photo-1599566150163-29194dcabd9c?w=150&h=150&fit=crop&crop=face", receiverId: "1", receiverName: "Sarah Chen", content: "Great analysis on NVDA! What are your thoughts on AMD?", createdAt: "2024-01-15T10:30:00Z", read: false },
  { id: "m2", senderId: "1", senderName: "Sarah Chen", senderAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face", receiverId: "inv1", receiverName: "Alex Turner", content: "AMD is interesting but I prefer NVDA's AI moat. Will cover in my next post.", createdAt: "2024-01-15T11:00:00Z", read: true },
  { id: "m3", senderId: "inv2", senderName: "Maria Santos", senderAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face", receiverId: "1", receiverName: "Sarah Chen", content: "Do you offer 1-on-1 consultations?", createdAt: "2024-01-14T15:00:00Z", read: true },
  { id: "m4", senderId: "inv3", senderName: "Jordan Lee", senderAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face", receiverId: "2", receiverName: "Marcus Webb", content: "When do you think BTC will break $100k?", createdAt: "2024-01-15T08:00:00Z", read: false },
  { id: "m5", senderId: "2", senderName: "Marcus Webb", senderAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face", receiverId: "inv3", receiverName: "Jordan Lee", content: "On-chain metrics suggest Q2. Stay patient.", createdAt: "2024-01-15T09:00:00Z", read: true },
];

export const mockSubscribers: MockSubscriber[] = [
  { id: "inv1", name: "Alex Turner", avatar: "https://images.unsplash.com/photo-1599566150163-29194dcabd9c?w=150&h=150&fit=crop&crop=face", subscribedAt: "2024-01-01T00:00:00Z", plan: "$29/mo" },
  { id: "inv2", name: "Maria Santos", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face", subscribedAt: "2023-12-15T00:00:00Z", plan: "$29/mo" },
  { id: "inv3", name: "Jordan Lee", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face", subscribedAt: "2023-11-20T00:00:00Z", plan: "$29/mo" },
  { id: "inv4", name: "Chris Blake", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face", subscribedAt: "2024-01-10T00:00:00Z", plan: "$29/mo" },
  { id: "inv5", name: "Ryan Cooper", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face", subscribedAt: "2023-10-05T00:00:00Z", plan: "$29/mo" },
];
