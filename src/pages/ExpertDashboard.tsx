import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  Loader2,
  Plus,
  FileText,
  Settings,
  Users,
  TrendingUp,
  Globe,
  Lock,
  Clock,
  Trash2,
  Save,
  X,
  BarChart3,
  DollarSign,
  Star,
  ImagePlus,
  UserCheck,
} from "lucide-react";
import { format } from "date-fns";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { mockAnalytics } from "@/data/mockData";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SubscribersListCard } from "@/components/experts/SubscribersListCard";

const MARKET_OPTIONS = [
  { value: "stocks", label: "Stocks", icon: "📈" },
  { value: "crypto", label: "Crypto", icon: "₿" },
  { value: "forex", label: "Forex", icon: "💱" },
  { value: "bonds", label: "Bonds", icon: "📊" },
  { value: "commodities", label: "Commodities", icon: "🛢️" },
];

interface ExpertProfile {
  user_id: string;
  bio: string | null;
  credentials: string | null;
  headline: string | null;
  markets: string[] | null;
  subscription_price: number | null;
}

interface PostRow {
  id: string;
  content: string;
  asset: string | null;
  market: string | null;
  timeframe: string | null;
  visibility: "public" | "private";
  created_at: string;
}

const ExpertDashboard = () => {
  const { user, userRole, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [profile, setProfile] = useState<ExpertProfile | null>(null);
  const [fullName, setFullName] = useState("");
  const [posts, setPosts] = useState<PostRow[]>([]);
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [loadingData, setLoadingData] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [creatingPost, setCreatingPost] = useState(false);

  // Profile form state
  const [bio, setBio] = useState("");
  const [credentials, setCredentials] = useState("");
  const [headline, setHeadline] = useState("");
  const [selectedMarkets, setSelectedMarkets] = useState<string[]>([]);
  const [subscriptionPrice, setSubscriptionPrice] = useState("");

  // New post form state
  const [showPostForm, setShowPostForm] = useState(false);
  const [postContent, setPostContent] = useState("");
  const [postAsset, setPostAsset] = useState("");
  const [postMarket, setPostMarket] = useState("");
  const [postTimeframe, setPostTimeframe] = useState("");
  const [postVisibility, setPostVisibility] = useState<"public" | "private">("public");
  const [postImageUrl, setPostImageUrl] = useState("");

  useEffect(() => {
    if (!authLoading && (!user || userRole !== "expert")) {
      navigate("/auth");
    }
  }, [user, userRole, authLoading, navigate]);

  useEffect(() => {
    if (user && userRole === "expert") {
      fetchData();
    }
  }, [user, userRole]);

  const fetchData = async () => {
    if (!user) return;
    setLoadingData(true);

    const [profileRes, nameRes, postsRes, subsRes] = await Promise.all([
      supabase.from("expert_profiles").select("*").eq("user_id", user.id).maybeSingle(),
      supabase.from("profiles").select("full_name").eq("id", user.id).maybeSingle(),
      supabase.from("posts").select("*").eq("expert_id", user.id).order("created_at", { ascending: false }),
      supabase.from("subscriptions").select("id").eq("expert_id", user.id).eq("status", "active"),
    ]);

    if (profileRes.data) {
      setProfile(profileRes.data);
      setBio(profileRes.data.bio || "");
      setCredentials(profileRes.data.credentials || "");
      setHeadline(profileRes.data.headline || "");
      setSelectedMarkets(profileRes.data.markets || []);
      setSubscriptionPrice(profileRes.data.subscription_price?.toString() || "0");
    }

    if (nameRes.data) {
      setFullName(nameRes.data.full_name || "");
    }

    if (postsRes.data) {
      setPosts(postsRes.data as PostRow[]);
    }

    setSubscriberCount(subsRes.data?.length || 0);
    setLoadingData(false);
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setSavingProfile(true);

    const { error: profileError } = await supabase
      .from("expert_profiles")
      .update({
        bio,
        credentials,
        headline,
        markets: selectedMarkets,
        subscription_price: parseFloat(subscriptionPrice) || 0,
      })
      .eq("user_id", user.id);

    const { error: nameError } = await supabase
      .from("profiles")
      .update({ full_name: fullName })
      .eq("id", user.id);

    setSavingProfile(false);

    if (profileError || nameError) {
      toast({ variant: "destructive", title: "Error saving profile", description: (profileError || nameError)?.message });
    } else {
      toast({ title: "Profile updated", description: "Your changes have been saved." });
    }
  };

  const toggleMarket = (market: string) => {
    setSelectedMarkets((prev) =>
      prev.includes(market) ? prev.filter((m) => m !== market) : [...prev, market]
    );
  };

  const handleCreatePost = async () => {
    if (!user || !postContent.trim()) return;
    setCreatingPost(true);

    const { error } = await supabase.from("posts").insert({
      expert_id: user.id,
      content: postContent,
      asset: postAsset || null,
      market: postMarket || null,
      timeframe: postTimeframe || null,
      visibility: postVisibility,
      image_url: postImageUrl || null,
    } as any);

    setCreatingPost(false);

    if (error) {
      toast({ variant: "destructive", title: "Error creating post", description: error.message });
    } else {
      toast({ title: "Post published!", description: `Your ${postVisibility} insight has been published.` });
      setPostContent("");
      setPostAsset("");
      setPostMarket("");
      setPostTimeframe("");
      setPostVisibility("public");
      setPostImageUrl("");
      setShowPostForm(false);
      fetchData();
    }
  };

  const handleDeletePost = async (postId: string) => {
    const { error } = await supabase.from("posts").delete().eq("id", postId);
    if (error) {
      toast({ variant: "destructive", title: "Error deleting post", description: error.message });
    } else {
      toast({ title: "Post deleted" });
      setPosts((prev) => prev.filter((p) => p.id !== postId));
    }
  };

  if (authLoading || loadingData) {
    return (
      <Layout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  const totalEarnings = mockAnalytics.monthlyEarnings.reduce((sum, m) => sum + m.earnings, 0);
  const latestMonthEarnings = mockAnalytics.monthlyEarnings[mockAnalytics.monthlyEarnings.length - 1].earnings;

  return (
    <Layout>
      <div className="container py-8 md:py-12">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">
              Expert Dashboard
            </h1>
            <p className="mt-1 text-muted-foreground">
              Manage your profile, insights, and analytics
            </p>
          </div>
          <Button onClick={() => setShowPostForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Post
          </Button>
        </div>

        {/* Stats Row */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{posts.length}</p>
                <p className="text-sm text-muted-foreground">Total Posts</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/20">
                <Users className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{subscriberCount}</p>
                <p className="text-sm text-muted-foreground">Subscribers</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
                <DollarSign className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">${latestMonthEarnings.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">This Month</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-warning/10">
                <Star className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{mockAnalytics.overallRating}</p>
                <p className="text-sm text-muted-foreground">Overall Rating</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList className="flex flex-wrap h-auto gap-1">
            <TabsTrigger value="analytics">
              <BarChart3 className="mr-2 h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="posts">
              <FileText className="mr-2 h-4 w-4" />
              Posts
            </TabsTrigger>
            <TabsTrigger value="subscribers">
              <UserCheck className="mr-2 h-4 w-4" />
              Subscribers
            </TabsTrigger>
            <TabsTrigger value="profile">
              <Settings className="mr-2 h-4 w-4" />
              Profile
            </TabsTrigger>
          </TabsList>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Monthly Earnings */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-success" />
                    Monthly Earnings
                  </CardTitle>
                  <CardDescription>
                    Total: ${totalEarnings.toLocaleString()} over 6 months
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={mockAnalytics.monthlyEarnings}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                      <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `$${v}`} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                          color: "hsl(var(--foreground))",
                        }}
                        formatter={(value: number) => [`$${value}`, "Earnings"]}
                      />
                      <Bar dataKey="earnings" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Subscriber & Follower Growth */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Growth
                  </CardTitle>
                  <CardDescription>Subscribers & followers over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={mockAnalytics.subscriberGrowth}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                      <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                          color: "hsl(var(--foreground))",
                        }}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="subscribers" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3 }} />
                      <Line type="monotone" dataKey="followers" stroke="hsl(var(--accent))" strokeWidth={2} dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Rating Breakdown */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Star className="h-5 w-5 text-accent" />
                    Rating Breakdown
                  </CardTitle>
                  <CardDescription>
                    {mockAnalytics.overallRating} average from {mockAnalytics.totalRatings} ratings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-8">
                    {/* Big rating */}
                    <div className="text-center shrink-0">
                      <p className="font-display text-5xl font-bold text-foreground">
                        {mockAnalytics.overallRating}
                      </p>
                      <div className="mt-2 flex justify-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${
                              i < Math.round(mockAnalytics.overallRating)
                                ? "text-accent fill-accent"
                                : "text-muted-foreground/30"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {mockAnalytics.totalRatings} ratings
                      </p>
                    </div>
                    {/* Bars */}
                    <div className="flex-1 space-y-2">
                      {mockAnalytics.ratingBreakdown.map((row) => {
                        const pct = (row.count / mockAnalytics.totalRatings) * 100;
                        return (
                          <div key={row.stars} className="flex items-center gap-3">
                            <span className="text-sm text-muted-foreground w-12 text-right">
                              {row.stars} star
                            </span>
                            <div className="flex-1 h-3 rounded-full bg-muted overflow-hidden">
                              <div
                                className="h-full rounded-full bg-accent transition-all"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span className="text-sm text-muted-foreground w-10">
                              {row.count}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Posts Tab */}
          <TabsContent value="posts" className="space-y-4">
            {showPostForm && (
              <Card className="border-primary/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Create New Post</CardTitle>
                    <Button variant="ghost" size="icon" onClick={() => setShowPostForm(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="space-y-2">
                      <Label>Asset</Label>
                      <Input
                        placeholder="e.g. AAPL, BTC, EUR/USD"
                        value={postAsset}
                        onChange={(e) => setPostAsset(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Market</Label>
                      <Select value={postMarket} onValueChange={setPostMarket}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select market" />
                        </SelectTrigger>
                        <SelectContent>
                          {MARKET_OPTIONS.map((m) => (
                            <SelectItem key={m.value} value={m.value}>
                              {m.icon} {m.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Timeframe</Label>
                      <Select value={postTimeframe} onValueChange={setPostTimeframe}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select timeframe" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Short-term">Short-term</SelectItem>
                          <SelectItem value="Medium-term">Medium-term</SelectItem>
                          <SelectItem value="Long-term">Long-term</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Insight</Label>
                    <Textarea
                      placeholder="Share your market analysis..."
                      value={postContent}
                      onChange={(e) => setPostContent(e.target.value)}
                      rows={5}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <ImagePlus className="h-4 w-4" />
                      Image URL (optional)
                    </Label>
                    <Input
                      placeholder="https://example.com/chart-screenshot.png"
                      value={postImageUrl}
                      onChange={(e) => setPostImageUrl(e.target.value)}
                    />
                    {postImageUrl && (
                      <div className="rounded-lg overflow-hidden border border-border">
                        <img src={postImageUrl} alt="Preview" className="w-full h-32 object-cover" />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between rounded-lg border border-border p-4">
                    <div className="flex items-center gap-3">
                      {postVisibility === "public" ? (
                        <Globe className="h-5 w-5 text-success" />
                      ) : (
                        <Lock className="h-5 w-5 text-warning" />
                      )}
                      <div>
                        <p className="font-medium text-foreground">
                          {postVisibility === "public" ? "Public" : "Subscribers Only"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {postVisibility === "public"
                            ? "Visible to everyone"
                            : "Only visible to your subscribers"}
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={postVisibility === "private"}
                      onCheckedChange={(checked) => setPostVisibility(checked ? "private" : "public")}
                    />
                  </div>

                  <Button onClick={handleCreatePost} disabled={creatingPost || !postContent.trim()} className="w-full">
                    {creatingPost ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Publishing...
                      </>
                    ) : (
                      <>
                        <Plus className="mr-2 h-4 w-4" />
                        Publish Insight
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}

            {posts.length > 0 ? (
              posts.map((post) => {
                const market = MARKET_OPTIONS.find((m) => m.value === post.market);
                return (
                  <Card key={post.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex flex-wrap items-center gap-2">
                          {market && (
                            <Badge variant="outline" className="text-xs">
                              {market.icon} {market.label}
                            </Badge>
                          )}
                          {post.asset && (
                            <Badge variant="secondary" className="text-xs">{post.asset}</Badge>
                          )}
                          {post.timeframe && (
                            <Badge variant="secondary" className="text-xs">
                              <Clock className="mr-1 h-3 w-3" />
                              {post.timeframe}
                            </Badge>
                          )}
                          {post.visibility === "public" ? (
                            <Badge variant="outline" className="text-xs text-success border-success/20">
                              <Globe className="mr-1 h-3 w-3" />
                              Public
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs text-warning border-warning/20">
                              <Lock className="mr-1 h-3 w-3" />
                              Subscribers
                            </Badge>
                          )}
                        </div>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDeletePost(post.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="mt-4 text-foreground leading-relaxed">{post.content}</p>
                      <p className="mt-4 text-xs text-muted-foreground">
                        {format(new Date(post.created_at), "MMM d, yyyy 'at' h:mm a")}
                      </p>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <Card>
                <CardContent className="py-16 text-center">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <p className="mt-4 font-medium text-foreground">No posts yet</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Create your first insight to start attracting subscribers
                  </p>
                  <Button className="mt-6" onClick={() => setShowPostForm(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create First Post
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Subscribers Tab */}
          <TabsContent value="subscribers" className="space-y-4">
            <SubscribersListCard userId={user?.id || ""} />
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>Manage how your profile appears to investors</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Credentials</Label>
                    <Input
                      placeholder="e.g. CFA, Former Goldman Sachs"
                      value={credentials}
                      onChange={(e) => setCredentials(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Headline</Label>
                  <Input
                    placeholder="Your current market view in one line"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Bio</Label>
                  <Textarea
                    placeholder="Tell investors about your experience and expertise..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Markets Covered</Label>
                  <div className="flex flex-wrap gap-2">
                    {MARKET_OPTIONS.map((market) => (
                      <Badge
                        key={market.value}
                        variant={selectedMarkets.includes(market.value) ? "default" : "outline"}
                        className="cursor-pointer transition-colors"
                        onClick={() => toggleMarket(market.value)}
                      >
                        {market.icon} {market.label}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Monthly Subscription Price ($)</Label>
                  <Input
                    type="number"
                    min="0"
                    step="1"
                    placeholder="0 for free"
                    value={subscriptionPrice}
                    onChange={(e) => setSubscriptionPrice(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Set to 0 for free access. Paid subscriptions unlock private posts for your subscribers.
                  </p>
                </div>

                <Button onClick={handleSaveProfile} disabled={savingProfile}>
                  {savingProfile ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Profile
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ExpertDashboard;
