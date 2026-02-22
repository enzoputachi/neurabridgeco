export interface ExpertData {
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  credentials: string | null;
  headline: string | null;
  markets: string[] | null;
  subscription_price: number | null;
  booking_price: number | null;
}

export interface PostData {
  id: string;
  content: string;
  asset: string | null;
  market: string | null;
  timeframe: string | null;
  visibility: string;
  created_at: string;
  image_url: string | null;
}

export interface MarketplaceItemData {
  id: string;
  title: string;
  description: string;
  type: string;
  image_url: string | null;
  price: number;
}