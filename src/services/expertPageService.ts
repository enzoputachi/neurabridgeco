import { supabase } from "@/integrations/supabase/client";
import type { ExpertData, PostData, MarketplaceItemData } from "../types/expertPageTypes";

// ─── Read ────────────────────────────────────────────────────────────────────

export async function fetchExpertProfile(id: string): Promise<ExpertData | null> {
  const [profileRes, expertRes] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", id).maybeSingle(),
    supabase.from("expert_profiles").select("*").eq("user_id", id).maybeSingle(),
  ]);

  if (!profileRes.data || !expertRes.data) return null;

  return {
    user_id: id,
    full_name: profileRes.data.full_name,
    avatar_url: profileRes.data.avatar_url,
    bio: expertRes.data.bio,
    credentials: expertRes.data.credentials,
    headline: expertRes.data.headline,
    markets: expertRes.data.markets,
    subscription_price: expertRes.data.subscription_price,
    booking_price: (expertRes.data as any).booking_price,
  };
}

export async function fetchExpertPosts(expertId: string): Promise<PostData[]> {
  const { data } = await supabase
    .from("posts")
    .select("*")
    .eq("expert_id", expertId)
    .order("created_at", { ascending: false });

  return (data || []).map((p: any) => ({
    id: p.id,
    content: p.content,
    asset: p.asset,
    market: p.market,
    timeframe: p.timeframe,
    visibility: p.visibility,
    created_at: p.created_at,
    image_url: p.image_url || null,
  }));
}

export async function fetchMarketplaceItems(expertId: string): Promise<MarketplaceItemData[]> {
  const { data } = await supabase.from("marketplace_items").select("*").eq("expert_id", expertId);

  return (data || []).map((c: any) => ({
    id: c.id,
    title: c.title,
    description: c.description,
    type: c.type,
    image_url: c.image_url,
    price: c.price,
  }));
}

export async function fetchSubscriberCount(expertId: string): Promise<number> {
  const { data } = await supabase
    .from("subscriptions")
    .select("id")
    .eq("expert_id", expertId)
    .eq("status", "active");
  return data?.length ?? 0;
}

export async function fetchFollowerCount(expertId: string): Promise<number> {
  const { data } = await supabase.from("expert_followers").select("id").eq("expert_id", expertId);
  return data?.length ?? 0;
}

export async function fetchPostRatings(
  postIds: string[]
): Promise<{ avgRating: number; ratingCount: number } | null> {
  if (postIds.length === 0) return null;
  const { data } = await supabase.from("post_ratings").select("score").in("post_id", postIds);
  if (!data || data.length === 0) return null;
  const total = data.reduce((s, r) => s + r.score, 0);
  return { avgRating: total / data.length, ratingCount: data.length };
}

export async function fetchUserRelationship(
  userId: string,
  expertId: string
): Promise<{ isFollowing: boolean; isSubscribed: boolean }> {
  const [followRes, subRes] = await Promise.all([
    supabase
      .from("expert_followers")
      .select("id")
      .eq("follower_id", userId)
      .eq("expert_id", expertId)
      .maybeSingle(),
    supabase
      .from("subscriptions")
      .select("id")
      .eq("investor_id", userId)
      .eq("expert_id", expertId)
      .eq("status", "active")
      .maybeSingle(),
  ]);
  return { isFollowing: !!followRes.data, isSubscribed: !!subRes.data };
}

// ─── Write ───────────────────────────────────────────────────────────────────

export async function followExpert(followerId: string, expertId: string): Promise<void> {
  await supabase.from("expert_followers").insert({ follower_id: followerId, expert_id: expertId });
  await supabase.from("notifications").insert({
    user_id: expertId,
    type: "follow",
    title: "New Follower",
    description: "Someone started following you",
  });
}

export async function unfollowExpert(followerId: string, expertId: string): Promise<void> {
  await supabase.from("expert_followers").delete().eq("follower_id", followerId).eq("expert_id", expertId);
}

export async function subscribeToExpert(investorId: string, expertId: string): Promise<void> {
  const { data: existing } = await supabase
    .from("subscriptions")
    .select("id")
    .eq("investor_id", investorId)
    .eq("expert_id", expertId)
    .maybeSingle();

  if (existing) {
    await supabase.from("subscriptions").update({ status: "active" as const }).eq("id", existing.id);
  } else {
    await supabase
      .from("subscriptions")
      .insert({ investor_id: investorId, expert_id: expertId, status: "active" });
  }

  await supabase.from("notifications").insert({
    user_id: expertId,
    type: "subscribe",
    title: "New Subscriber",
    description: "You have a new subscriber!",
  });
}

export async function unsubscribeFromExpert(investorId: string, expertId: string): Promise<void> {
  await supabase
    .from("subscriptions")
    .update({ status: "cancelled" as const })
    .eq("investor_id", investorId)
    .eq("expert_id", expertId)
    .eq("status", "active");
}

// Add these two functions to expertPageService.ts

export async function createPendingPayment(
  investorId: string,
  expertId: string,
  subscriptionId: string,
  amount: number,
  paystackReference: string
): Promise<void> {
  const { error } = await supabase.from("payments").insert({
    investor_id: investorId,
    expert_id: expertId,
    subscription_id: subscriptionId,
    amount,
    currency: "NGN",
    status: "pending",
    paystack_reference: paystackReference,
  });
  if (error) throw new Error(`Failed to create payment record: ${error.message}`);
}

export async function createPendingSubscription(
  investorId: string,
  expertId: string
): Promise<string> {
  // Upsert subscription in 'pending' status — returns the id
  const { data: existing } = await supabase
    .from("subscriptions")
    .select("id")
    .eq("investor_id", investorId)
    .eq("expert_id", expertId)
    .maybeSingle();

  if (existing) {
    await supabase
      .from("subscriptions")
      .update({ status: "pending" as any })
      .eq("id", existing.id);
    return existing.id;
  }

  const { data, error } = await supabase
    .from("subscriptions")
    .insert({ investor_id: investorId, expert_id: expertId, status: "pending" as any })
    .select("id")
    .single();

  if (error || !data) throw new Error(`Failed to create subscription: ${error?.message}`);
  return data.id;
}

export async function verifyPayment(reference: string): Promise<{ success: boolean; paymentStatus: string }> {
  const { data, error } = await supabase.functions.invoke("verify-payment", {
    body: { reference },
  });
  if (error) throw new Error(`Verification failed: ${error.message}`);
  return data;
}