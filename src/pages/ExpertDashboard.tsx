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
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  Loader2, Plus, FileText, Users, Globe, Lock, Clock, Trash2, X,
  BarChart3, DollarSign, Star, UserCheck, BookOpen, Video, Zap,
} from "lucide-react";
import { format } from "date-fns";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";
import { SubscribersListCard } from "@/components/experts/SubscribersListCard";
import ImageUpload from "@/components/ImageUpload";

const MARKET_OPTIONS = [
  { value: "stocks", label: "Stocks", icon: "📈" },
  { value: "crypto", label: "Crypto", icon: "₿" },
  { value: "forex", label: "Forex", icon: "💱" },
  { value: "bonds", label: "Bonds", icon: "📊" },
  { value: "commodities", label: "Commodities", icon: "🛢️" },
];

interface PostRow {
  id: string;
  content: string;
  asset: string | null;
  market: string | null;
  timeframe: string | null;
  visibility: "public" | "private";
  created_at: string;
  image_url: string | null;
}

interface MarketplaceItemRow {
  id: string;
  title: string;
  description: string;
  type: string;
  price: number;
  image_url: string | null;
  created_at: string;
}

const ExpertDashboard = () => {
  const { user, userRole, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [posts, setPosts] = useState<PostRow[]>([]);
  const [courses, setCourses] = useState<MarketplaceItemRow[]>([]);
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [followerCount, setFollowerCount] = useState(0);
  const [loadingData, setLoadingData] = useState(true);
  const [creatingPost, setCreatingPost] = useState(false);

  // Post form
  const [showPostForm, setShowPostForm] = useState(false);
  const [postContent, setPostContent] = useState("");
  const [postAsset, setPostAsset] = useState("");
  const [postMarket, setPostMarket] = useState("");
  const [postTimeframe, setPostTimeframe] = useState("");
  const [postVisibility, setPostVisibility] = useState<"public" | "private">("public");
  const [postImageUrl, setPostImageUrl] = useState("");

  // Course form
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [courseTitle, setCourseTitle] = useState("");
  const [courseDesc, setCourseDesc] = useState("");
  const [courseType, setCourseType] = useState("course");
  const [coursePrice, setCoursePrice] = useState("");
  const [courseImage, setCourseImage] = useState("");
  const [creatingCourse, setCreatingCourse] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || userRole !== "expert")) navigate("/auth");
  }, [user, userRole, authLoading, navigate]);

  useEffect(() => {
    if (user && userRole === "expert") fetchData();
  }, [user, userRole]);

  const fetchData = async () => {
    if (!user) return;
    setLoadingData(true);
    const [postsRes, subsRes, followersRes, coursesRes] = await Promise.all([
      supabase.from("posts").select("*").eq("expert_id", user.id).order("created_at", { ascending: false }),
      supabase.from("subscriptions").select("id").eq("expert_id", user.id).eq("status", "active"),
      supabase.from("expert_followers").select("id").eq("expert_id", user.id),
      supabase.from("marketplace_items").select("*").eq("expert_id", user.id).order("created_at", { ascending: false }),
    ]);
    setPosts((postsRes.data as PostRow[]) || []);
    setSubscriberCount(subsRes.data?.length || 0);
    setFollowerCount(followersRes.data?.length || 0);
    setCourses((coursesRes.data as MarketplaceItemRow[]) || []);
    setLoadingData(false);
  };

  const handleCreatePost = async () => {
    if (!user || !postContent.trim()) return;
    setCreatingPost(true);
    const { error } = await supabase.from("posts").insert({
      expert_id: user.id, content: postContent, asset: postAsset || null,
      market: postMarket || null, timeframe: postTimeframe || null,
      visibility: postVisibility, image_url: postImageUrl || null,
    } as any);
    setCreatingPost(false);
    if (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } else {
      toast({ title: "Post published!" });
      setPostContent(""); setPostAsset(""); setPostMarket(""); setPostTimeframe("");
      setPostVisibility("public"); setPostImageUrl(""); setShowPostForm(false);
      fetchData();
    }
  };

  const handleDeletePost = async (postId: string) => {
    const { error } = await supabase.from("posts").delete().eq("id", postId);
    if (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } else {
      toast({ title: "Post deleted" });
      setPosts((prev) => prev.filter((p) => p.id !== postId));
    }
  };

  const handleCreateCourse = async () => {
    if (!user || !courseTitle.trim() || !courseDesc.trim()) return;
    setCreatingCourse(true);
    const { error } = await supabase.from("marketplace_items").insert({
      expert_id: user.id, title: courseTitle, description: courseDesc,
      type: courseType, price: parseFloat(coursePrice) || 0,
      image_url: courseImage || null,
    });
    setCreatingCourse(false);
    if (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } else {
      toast({ title: "Course created!" });
      setCourseTitle(""); setCourseDesc(""); setCourseType("course");
      setCoursePrice(""); setCourseImage(""); setShowCourseForm(false);
      fetchData();
    }
  };

  const handleDeleteCourse = async (id: string) => {
    const { error } = await supabase.from("marketplace_items").delete().eq("id", id);
    if (!error) {
      toast({ title: "Item deleted" });
      setCourses((prev) => prev.filter((c) => c.id !== id));
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

  return (
    <Layout>
      <div className="container py-8 md:py-12">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Expert Dashboard</h1>
            <p className="mt-1 text-muted-foreground">Manage your insights, courses, and subscribers</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setShowPostForm(true)} size="sm">
              <Plus className="mr-2 h-4 w-4" />New Post
            </Button>
            <Button onClick={() => setShowCourseForm(true)} size="sm" variant="outline">
              <Plus className="mr-2 h-4 w-4" />New Course
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="flex items-center gap-4 p-4 md:p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">{posts.length}</p>
                <p className="text-xs text-muted-foreground">Posts</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-4 md:p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20">
                <Users className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">{subscriberCount}</p>
                <p className="text-xs text-muted-foreground">Subscribers</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-4 md:p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                <UserCheck className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">{followerCount}</p>
                <p className="text-xs text-muted-foreground">Followers</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-4 md:p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-info/10">
                <BookOpen className="h-5 w-5 text-info" />
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">{courses.length}</p>
                <p className="text-xs text-muted-foreground">Courses</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="posts" className="space-y-6">
          <TabsList className="flex flex-wrap h-auto gap-1">
            <TabsTrigger value="posts"><FileText className="mr-2 h-4 w-4" />Posts</TabsTrigger>
            <TabsTrigger value="courses"><BookOpen className="mr-2 h-4 w-4" />Courses</TabsTrigger>
            <TabsTrigger value="subscribers"><UserCheck className="mr-2 h-4 w-4" />Subscribers</TabsTrigger>
            <TabsTrigger value="analytics"><BarChart3 className="mr-2 h-4 w-4" />Analytics</TabsTrigger>
          </TabsList>

          {/* Posts Tab */}
          <TabsContent value="posts" className="space-y-4">
            {showPostForm && (
              <Card className="border-primary/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Create New Post</CardTitle>
                    <Button variant="ghost" size="icon" onClick={() => setShowPostForm(false)}><X className="h-4 w-4" /></Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="space-y-2">
                      <Label>Asset</Label>
                      <Input placeholder="e.g. AAPL, BTC" value={postAsset} onChange={(e) => setPostAsset(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Market</Label>
                      <Select value={postMarket} onValueChange={setPostMarket}>
                        <SelectTrigger><SelectValue placeholder="Select market" /></SelectTrigger>
                        <SelectContent>
                          {MARKET_OPTIONS.map((m) => (<SelectItem key={m.value} value={m.value}>{m.icon} {m.label}</SelectItem>))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Timeframe</Label>
                      <Select value={postTimeframe} onValueChange={setPostTimeframe}>
                        <SelectTrigger><SelectValue placeholder="Select timeframe" /></SelectTrigger>
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
                    <Textarea placeholder="Share your market analysis..." value={postContent} onChange={(e) => setPostContent(e.target.value)} rows={5} />
                  </div>
                  <div className="space-y-2">
                    <Label>Image (optional)</Label>
                    <ImageUpload value={postImageUrl} onChange={setPostImageUrl} folder="posts" />
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-border p-4">
                    <div className="flex items-center gap-3">
                      {postVisibility === "public" ? <Globe className="h-5 w-5 text-success" /> : <Lock className="h-5 w-5 text-warning" />}
                      <div>
                        <p className="font-medium text-foreground">{postVisibility === "public" ? "Public" : "Subscribers Only"}</p>
                        <p className="text-xs text-muted-foreground">{postVisibility === "public" ? "Visible to everyone" : "Only visible to subscribers"}</p>
                      </div>
                    </div>
                    <Switch checked={postVisibility === "private"} onCheckedChange={(c) => setPostVisibility(c ? "private" : "public")} />
                  </div>
                  <Button onClick={handleCreatePost} disabled={creatingPost || !postContent.trim()} className="w-full">
                    {creatingPost ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Publishing...</> : <><Plus className="mr-2 h-4 w-4" />Publish Insight</>}
                  </Button>
                </CardContent>
              </Card>
            )}

            {posts.length > 0 ? posts.map((post) => {
              const market = MARKET_OPTIONS.find((m) => m.value === post.market);
              return (
                <Card key={post.id}>
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex flex-wrap items-center gap-2">
                        {market && <Badge variant="outline" className="text-xs">{market.icon} {market.label}</Badge>}
                        {post.asset && <Badge variant="secondary" className="text-xs">{post.asset}</Badge>}
                        {post.timeframe && <Badge variant="secondary" className="text-xs"><Clock className="mr-1 h-3 w-3" />{post.timeframe}</Badge>}
                        {post.visibility === "public" ? (
                          <Badge variant="outline" className="text-xs text-success border-success/20"><Globe className="mr-1 h-3 w-3" />Public</Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs text-warning border-warning/20"><Lock className="mr-1 h-3 w-3" />Subscribers</Badge>
                        )}
                      </div>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDeletePost(post.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    {post.image_url && (
                      <div className="mt-3 rounded-lg overflow-hidden">
                        <img src={post.image_url} alt="" className="w-full h-40 object-cover" />
                      </div>
                    )}
                    <p className="mt-3 text-foreground leading-relaxed text-sm">{post.content}</p>
                    <p className="mt-3 text-xs text-muted-foreground">{format(new Date(post.created_at), "MMM d, yyyy 'at' h:mm a")}</p>
                  </CardContent>
                </Card>
              );
            }) : (
              <Card>
                <CardContent className="py-16 text-center">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <p className="mt-4 font-medium text-foreground">No posts yet</p>
                  <Button className="mt-6" onClick={() => setShowPostForm(true)}><Plus className="mr-2 h-4 w-4" />Create First Post</Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Courses Tab */}
          <TabsContent value="courses" className="space-y-4">
            {showCourseForm && (
              <Card className="border-primary/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Create Course / Webinar</CardTitle>
                    <Button variant="ghost" size="icon" onClick={() => setShowCourseForm(false)}><X className="h-4 w-4" /></Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input placeholder="Course title" value={courseTitle} onChange={(e) => setCourseTitle(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea placeholder="Describe what students will learn..." value={courseDesc} onChange={(e) => setCourseDesc(e.target.value)} rows={4} />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Type</Label>
                      <Select value={courseType} onValueChange={setCourseType}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="course">Course</SelectItem>
                          <SelectItem value="webinar">Webinar</SelectItem>
                          <SelectItem value="opportunity">Opportunity</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Price ($)</Label>
                      <Input type="number" min="0" placeholder="0 for free" value={coursePrice} onChange={(e) => setCoursePrice(e.target.value)} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Cover Image</Label>
                    <ImageUpload value={courseImage} onChange={setCourseImage} folder="courses" />
                  </div>
                  <Button onClick={handleCreateCourse} disabled={creatingCourse || !courseTitle.trim() || !courseDesc.trim()} className="w-full">
                    {creatingCourse ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating...</> : <><Plus className="mr-2 h-4 w-4" />Create</>}
                  </Button>
                </CardContent>
              </Card>
            )}

            {courses.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {courses.map((c) => (
                  <Card key={c.id} className="overflow-hidden">
                    {c.image_url && (
                      <div className="aspect-video overflow-hidden">
                        <img src={c.image_url} alt={c.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <Badge variant="secondary" className="text-xs mb-2">{c.type}</Badge>
                          <h4 className="font-semibold text-foreground text-sm">{c.title}</h4>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{c.description}</p>
                        </div>
                        <Button variant="ghost" size="icon" className="text-destructive shrink-0" onClick={() => handleDeleteCourse(c.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="mt-2 font-semibold text-foreground">{c.price > 0 ? `$${c.price}` : "Free"}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-16 text-center">
                  <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <p className="mt-4 font-medium text-foreground">No courses yet</p>
                  <Button className="mt-6" onClick={() => setShowCourseForm(true)}><Plus className="mr-2 h-4 w-4" />Create First Course</Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Subscribers Tab */}
          <TabsContent value="subscribers" className="space-y-4">
            <SubscribersListCard userId={user?.id || ""} />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <AnalyticsSection userId={user?.id || ""} />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

function AnalyticsSection({ userId }: { userId: string }) {
  const [loading, setLoading] = useState(true);
  const [subscriberGrowth, setSubscriberGrowth] = useState<any[]>([]);
  const [ratingBreakdown, setRatingBreakdown] = useState<{ stars: number; count: number }[]>([]);
  const [avgRating, setAvgRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [totalLikes, setTotalLikes] = useState(0);
  const [totalComments, setTotalComments] = useState(0);

  useEffect(() => {
    if (!userId) return;
    const fetchAnalytics = async () => {
      setLoading(true);

      // Get all subscriptions for this expert to build growth data
      const [subsRes, ratingsRes, postsRes] = await Promise.all([
        supabase.from("subscriptions").select("created_at, status").eq("expert_id", userId),
        supabase.from("post_ratings").select("score, post_id, created_at").in(
          "post_id",
          (await supabase.from("posts").select("id").eq("expert_id", userId)).data?.map((p: any) => p.id) || []
        ),
        supabase.from("posts").select("id").eq("expert_id", userId),
      ]);

      // Build subscriber growth by month (last 6 months)
      const subs = subsRes.data || [];
      const now = new Date();
      const months: any[] = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const label = d.toLocaleString("default", { month: "short" });
        const cumulative = subs.filter(
          (s) => new Date(s.created_at) <= new Date(d.getFullYear(), d.getMonth() + 1, 0)
        ).length;
        const active = subs.filter(
          (s) =>
            new Date(s.created_at) <= new Date(d.getFullYear(), d.getMonth() + 1, 0) &&
            s.status === "active"
        ).length;
        months.push({ month: label, total: cumulative, active });
      }
      setSubscriberGrowth(months);

      // Ratings breakdown
      const ratings = ratingsRes.data || [];
      const breakdown = [5, 4, 3, 2, 1].map((s) => ({
        stars: s,
        count: ratings.filter((r: any) => r.score === s).length,
      }));
      setRatingBreakdown(breakdown);
      setTotalRatings(ratings.length);
      setAvgRating(
        ratings.length > 0 ? ratings.reduce((a: number, r: any) => a + r.score, 0) / ratings.length : 0
      );

      // Likes and comments on expert's posts
      const postIds = postsRes.data?.map((p: any) => p.id) || [];
      if (postIds.length > 0) {
        const [likesRes, commentsRes] = await Promise.all([
          supabase.from("post_likes").select("id").in("post_id", postIds),
          supabase.from("post_comments").select("id").in("post_id", postIds),
        ]);
        setTotalLikes(likesRes.data?.length || 0);
        setTotalComments(commentsRes.data?.length || 0);
      }

      setLoading(false);
    };
    fetchAnalytics();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      {/* Engagement stats */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Star className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">{avgRating.toFixed(1)}</p>
              <p className="text-xs text-muted-foreground">Avg Rating</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20">
              <Zap className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">{totalRatings}</p>
              <p className="text-xs text-muted-foreground">Ratings</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
              <Users className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">{totalLikes}</p>
              <p className="text-xs text-muted-foreground">Likes</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-info/10">
              <FileText className="h-5 w-5 text-info" />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">{totalComments}</p>
              <p className="text-xs text-muted-foreground">Comments</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Subscriber Growth</CardTitle>
            <CardDescription>Total and active subscribers over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={subscriberGrowth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="total" stroke="hsl(var(--primary))" name="Total" />
                <Line type="monotone" dataKey="active" stroke="hsl(var(--accent))" name="Active" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Rating Distribution</CardTitle>
            <CardDescription>{totalRatings} total ratings</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={ratingBreakdown}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="stars" tickFormatter={(v) => `${v}★`} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default ExpertDashboard;
