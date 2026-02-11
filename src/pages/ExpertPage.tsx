import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getExpertById,
  getPostsByExpertId,
  getMarketplaceByExpertId,
  markets,
  Post,
  MarketplaceItem,
} from "@/data/mockData";
import {
  ArrowLeft,
  Lock,
  Globe,
  Clock,
  TrendingUp,
  Users,
  FileText,
  CheckCircle2,
  Star,
  BookOpen,
  Video,
  Zap,
  ArrowRight,
} from "lucide-react";
import { format } from "date-fns";

const PostCard = ({ post, isSubscribed }: { post: Post; isSubscribed: boolean }) => {
  const market = markets.find((m) => m.id === post.market);
  const canView = post.isPublic || isSubscribed;
  const avgRating =
    post.ratings.length > 0
      ? post.ratings.reduce((sum, r) => sum + r.score, 0) / post.ratings.length
      : null;

  return (
    <Card className={`overflow-hidden ${!canView ? "bg-muted/30" : ""}`}>
      <CardContent className="p-0">
        {/* Post Image */}
        {post.image && canView && (
          <div className="aspect-video overflow-hidden">
            <img
              src={post.image}
              alt={post.asset}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        )}
        {post.image && !canView && (
          <div className="aspect-video overflow-hidden relative">
            <img
              src={post.image}
              alt={post.asset}
              className="h-full w-full object-cover blur-md scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-background/40" />
          </div>
        )}

        <div className="p-6">
          {/* Post Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="text-xs">
                {market?.icon} {market?.name}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {post.asset}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                <Clock className="mr-1 h-3 w-3" />
                {post.timeframe}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              {avgRating !== null && (
                <Badge variant="outline" className="text-xs gap-1">
                  <Star className="h-3 w-3 text-accent fill-accent" />
                  {avgRating.toFixed(1)}
                </Badge>
              )}
              {post.isPublic ? (
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
          </div>

          {/* Post Content */}
          <div className="mt-4">
            {canView ? (
              <p className="text-foreground leading-relaxed">{post.content}</p>
            ) : (
              <div className="relative">
                <p className="text-foreground leading-relaxed blur-sm select-none">
                  {post.content}
                </p>
                <div className="absolute inset-0 flex items-center justify-center bg-background/60 rounded-md">
                  <div className="text-center">
                    <Lock className="mx-auto h-6 w-6 text-muted-foreground mb-2" />
                    <p className="text-sm font-medium text-foreground">Subscribers Only</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Subscribe to unlock this insight
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Ratings preview for subscribers */}
          {canView && post.ratings.length > 0 && (
            <div className="mt-4 rounded-lg bg-muted/50 p-3">
              <p className="text-xs font-medium text-muted-foreground mb-2">
                {post.ratings.length} rating{post.ratings.length !== 1 && "s"}
              </p>
              <div className="space-y-2">
                {post.ratings.slice(0, 2).map((r, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, s) => (
                        <Star
                          key={s}
                          className={`h-3 w-3 ${
                            s < r.score ? "text-accent fill-accent" : "text-muted-foreground/30"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">{r.investorName}</span>
                      {r.comment && ` — ${r.comment}`}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Post Footer */}
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground">
              {format(new Date(post.createdAt), "MMM d, yyyy 'at' h:mm a")}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const typeConfig = {
  course: { label: "Course", icon: BookOpen, color: "text-primary" },
  webinar: { label: "Webinar", icon: Video, color: "text-info" },
  opportunity: { label: "Opportunity", icon: Zap, color: "text-accent" },
};

const CourseCard = ({ item }: { item: MarketplaceItem }) => {
  const cfg = typeConfig[item.type];
  const TypeIcon = cfg.icon;

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-large hover:-translate-y-1">
      <div className="relative aspect-video overflow-hidden">
        <img
          src={item.image}
          alt={item.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <Badge className="absolute top-3 left-3 gap-1" variant="secondary">
          <TypeIcon className={`h-3 w-3 ${cfg.color}`} />
          {cfg.label}
        </Badge>
      </div>
      <CardContent className="p-5">
        <h4 className="font-display font-semibold text-foreground line-clamp-2">
          {item.title}
        </h4>
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
          {item.description}
        </p>
        <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Star className="h-3 w-3 text-accent fill-accent" />
            {item.rating} ({item.ratingCount})
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {item.enrolledCount.toLocaleString()}
          </span>
        </div>
        <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
          {item.price > 0 ? (
            <p className="font-display font-semibold text-foreground">${item.price}</p>
          ) : (
            <Badge className="bg-success/10 text-success border-success/20">Free</Badge>
          )}
          <Button variant="ghost" size="sm" className="text-primary">
            View <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const ExpertPage = () => {
  const { id } = useParams<{ id: string }>();
  const expert = getExpertById(id || "");
  const posts = getPostsByExpertId(id || "");
  const courses = getMarketplaceByExpertId(id || "");
  const isSubscribed = false;

  if (!expert) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground">Expert not found</h1>
          <p className="mt-2 text-muted-foreground">
            The expert you're looking for doesn't exist.
          </p>
          <Button className="mt-6" asChild>
            <Link to="/experts">Browse Experts</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const marketNames = expert.markets
    .map((m) => markets.find((market) => market.id === m))
    .filter(Boolean);

  return (
    <Layout>
      <div className="container py-8 md:py-12">
        <Link
          to="/experts"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Experts
        </Link>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="insights" className="space-y-6">
              <TabsList>
                <TabsTrigger value="insights">
                  <FileText className="mr-2 h-4 w-4" />
                  Insights ({posts.length})
                </TabsTrigger>
                <TabsTrigger value="courses">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Courses ({courses.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="insights" className="space-y-6">
                {posts.length > 0 ? (
                  posts.map((post) => (
                    <PostCard key={post.id} post={post} isSubscribed={isSubscribed} />
                  ))
                ) : (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
                      <p className="mt-4 text-muted-foreground">
                        No posts yet from this expert
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="courses" className="space-y-6">
                {courses.length > 0 ? (
                  <div className="grid gap-6 sm:grid-cols-2">
                    {courses.map((item) => (
                      <CourseCard key={item.id} item={item} />
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/50" />
                      <p className="mt-4 text-muted-foreground">
                        No courses yet from this expert
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Expert Panel (Sticky) */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <Avatar className="mx-auto h-20 w-20 border-4 border-border ring-4 ring-primary/10">
                      <AvatarImage src={expert.avatar} alt={expert.name} />
                      <AvatarFallback className="bg-primary/10 text-primary text-2xl font-semibold">
                        {expert.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <h1 className="mt-4 font-display text-2xl font-bold text-foreground">
                      {expert.name}
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {expert.credentials}
                    </p>
                    {/* Rating */}
                    <div className="mt-2 flex items-center justify-center gap-1">
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.round(expert.rating)
                                ? "text-accent fill-accent"
                                : "text-muted-foreground/30"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {expert.rating} ({expert.ratingCount})
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap justify-center gap-2">
                    {marketNames.map((market) => (
                      <Badge key={market?.id} variant="secondary">
                        {market?.icon} {market?.name}
                      </Badge>
                    ))}
                  </div>

                  <p className="mt-6 text-sm text-muted-foreground leading-relaxed">
                    {expert.bio}
                  </p>

                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <div className="rounded-lg bg-muted/50 p-3 text-center">
                      <div className="flex items-center justify-center gap-1 text-lg font-semibold text-foreground">
                        <Users className="h-4 w-4 text-primary" />
                        {expert.subscriberCount.toLocaleString()}
                      </div>
                      <p className="text-xs text-muted-foreground">Subscribers</p>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-3 text-center">
                      <div className="flex items-center justify-center gap-1 text-lg font-semibold text-foreground">
                        <TrendingUp className="h-4 w-4 text-primary" />
                        {expert.postCount}
                      </div>
                      <p className="text-xs text-muted-foreground">Insights</p>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  <div>
                    <div className="mb-4">
                      {expert.subscriptionPrice ? (
                        <div className="text-center">
                          <p className="font-display text-3xl font-bold text-foreground">
                            ${expert.subscriptionPrice}
                            <span className="text-lg font-normal text-muted-foreground">
                              /month
                            </span>
                          </p>
                        </div>
                      ) : (
                        <div className="text-center">
                          <Badge className="bg-success/10 text-success border-success/20 text-lg px-4 py-1">
                            Free
                          </Badge>
                        </div>
                      )}
                    </div>

                    <ul className="mb-6 space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-success" />
                        Access to all private insights
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-success" />
                        Real-time market analysis
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-success" />
                        Cancel anytime
                      </li>
                    </ul>

                    <Button className="w-full" size="lg">
                      {expert.subscriptionPrice
                        ? "Subscribe for Private Insights"
                        : "Follow for Free"}
                    </Button>

                    <p className="mt-3 text-xs text-center text-muted-foreground">
                      Educational content only. Not financial advice.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ExpertPage;
