import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import type { ExpertData, PostData, MarketplaceItemData } from "../types/expertPageTypes";
import {
  fetchExpertProfile,
  fetchExpertPosts,
  fetchMarketplaceItems,
  fetchSubscriberCount,
  fetchFollowerCount,
  fetchPostRatings,
  fetchUserRelationship,
  followExpert,
  unfollowExpert,
  subscribeToExpert,
  unsubscribeFromExpert,
} from "../services/expertPageService";

export interface UseExpertPageReturn {
  expert: ExpertData | null;
  posts: PostData[];
  courses: MarketplaceItemData[];
  isFollowing: boolean;
  isSubscribed: boolean;
  subscriberCount: number;
  followerCount: number;
  postCount: number;
  avgRating: number | null;
  ratingCount: number;
  loading: boolean;
  isSelf: boolean;
  handleFollow: () => Promise<void>;
  handleSubscribe: () => Promise<void>;
  handleMessage: () => void;
}

export function useExpertPage(id: string | undefined): UseExpertPageReturn {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [expert, setExpert] = useState<ExpertData | null>(null);
  const [posts, setPosts] = useState<PostData[]>([]);
  const [courses, setCourses] = useState<MarketplaceItemData[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [followerCount, setFollowerCount] = useState(0);
  const [postCount, setPostCount] = useState(0);
  const [avgRating, setAvgRating] = useState<number | null>(null);
  const [ratingCount, setRatingCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const isSelf = user?.id === id;

  useEffect(() => {
    if (id) loadAll();
  }, [id, user]);

  async function loadAll() {
    if (!id) return;
    setLoading(true);

    const [expertData, postList, courseList, subCount, follCount] = await Promise.all([
      fetchExpertProfile(id),
      fetchExpertPosts(id),
      fetchMarketplaceItems(id),
      fetchSubscriberCount(id),
      fetchFollowerCount(id),
    ]);

    setExpert(expertData);
    setPosts(postList);
    setPostCount(postList.length);
    setCourses(courseList);
    setSubscriberCount(subCount);
    setFollowerCount(follCount);

    // Ratings (depends on posts)
    const ratings = await fetchPostRatings(postList.map((p) => p.id));
    if (ratings) {
      setAvgRating(ratings.avgRating);
      setRatingCount(ratings.ratingCount);
    }

    // Per-user relationship state
    if (user) {
      const rel = await fetchUserRelationship(user.id, id);
      setIsFollowing(rel.isFollowing);
      setIsSubscribed(rel.isSubscribed);
    }

    setLoading(false);
  }

  // ─── Actions ───────────────────────────────────────────────────────────────

  async function handleFollow() {
    if (!user) { navigate("/auth"); return; }
    if (isSelf) { toast({ title: "Can't follow yourself" }); return; }
    if (!id) return;

    if (isFollowing) {
      await unfollowExpert(user.id, id);
      setIsFollowing(false);
      setFollowerCount((c) => c - 1);
    } else {
      await followExpert(user.id, id);
      setIsFollowing(true);
      setFollowerCount((c) => c + 1);
    }
  }

  async function handleSubscribe() {
    if (!user) { navigate("/auth"); return; }
    if (!id) return;

    if (isSubscribed) {
      await unsubscribeFromExpert(user.id, id);
      setIsSubscribed(false);
      setSubscriberCount((c) => c - 1);
      toast({ title: "Unsubscribed" });
    } else {
      await subscribeToExpert(user.id, id);
      setIsSubscribed(true);
      setSubscriberCount((c) => c + 1);
      toast({ title: "Subscribed!", description: "You now have access to private insights." });
    }
  }

  function handleMessage() {
    if (!user) { navigate("/auth"); return; }
    navigate("/messages", { state: { recipientId: id, recipientName: expert?.full_name } });
  }

  return {
    expert,
    posts,
    courses,
    isFollowing,
    isSubscribed,
    subscriberCount,
    followerCount,
    postCount,
    avgRating,
    ratingCount,
    loading,
    isSelf,
    handleFollow,
    handleSubscribe,
    handleMessage,
  };
}