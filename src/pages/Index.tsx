import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Layout from "@/components/layout/Layout";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { markets } from "@/data/mockData";
import {
  ArrowRight,
  TrendingUp,
  Users,
  Shield,
  Sparkles,
  ChevronRight,
  Star,
  BookOpen,
  Globe,
  Lock,
} from "lucide-react";
import { format } from "date-fns";
import heroExpert from "@/assets/hero-expert.png";
import { usePageSEO } from "@/hooks/usePageSEO";

interface ExpertRow {
  user_id: string;
  headline: string | null;
  markets: string[] | null;
  subscription_price: number | null;
  profiles: { full_name: string | null; avatar_url: string | null } | null;
  subscriber_count?: number;
  follower_count?: number;
}

interface PostRow {
  id: string;
  content: string;
  asset: string | null;
  market: string | null;
  timeframe: string | null;
  visibility: string;
  created_at: string;
  image_url: string | null;
  expert_id: string;
  profiles: { full_name: string | null; avatar_url: string | null } | null;
}

interface MarketplaceRow {
  id: string;
  title: string;
  description: string;
  type: string;
  price: number;
  image_url: string | null;
  expert_id: string;
  profiles: { full_name: string | null; avatar_url: string | null } | null;
}

const Index = () => {
  usePageSEO({
    title: "Connect with Market Experts",
    description: "Discover trusted market experts across stocks, crypto, forex, and commodities. Subscribe for exclusive insights and educational market analysis on NeuraBridge.",
    canonical: "/",
  });
  const [experts, setExperts] = useState<ExpertRow[]>([]);
  const [posts, setPosts] = useState<PostRow[]>([]);
  const [marketplaceItems, setMarketplaceItems] = useState<MarketplaceRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [expertsRes, postsRes, itemsRes] = await Promise.all([
        supabase
          .from("expert_profiles")
          .select("user_id, headline, markets, subscription_price, profiles(full_name, avatar_url)")
          .limit(8),
        supabase
          .from("posts")
          .select("id, content, asset, market, timeframe, visibility, created_at, image_url, expert_id, profiles:expert_id(full_name, avatar_url)")
          .eq("visibility", "public")
          .order("created_at", { ascending: false })
          .limit(6),
        supabase
          .from("marketplace_items")
          .select("id, title, description, type, price, image_url, expert_id, profiles:expert_id(full_name, avatar_url)")
          .order("created_at", { ascending: false })
          .limit(4),
      ]);
      setExperts((expertsRes.data as any[]) || []);
      setPosts((postsRes.data as any[]) || []);
      setMarketplaceItems((itemsRes.data as any[]) || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <Layout>
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background" aria-label="Hero">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
        <div className="container relative py-8 md:py-16 lg:py-20">
          <div className="flex flex-col-reverse items-center gap-4 md:gap-10 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-xl text-center lg:text-left lg:pt-2">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">Expert Market Insights</span>
              </div>
              <h1 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
                Discover market experts.{" "}
                <span className="text-primary">Get insights before the market moves.</span>
              </h1>
              <p className="mt-4 text-lg text-muted-foreground md:text-xl">
                Connect with trusted analysts across stocks, crypto, forex, and more. Subscribe to their insights and stay ahead of market movements.
              </p>
              <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row lg:justify-start sm:justify-center">
                <Button size="lg" className="px-8" asChild>
                  <Link to="/experts">Browse Experts <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/auth?mode=signup&role=expert">Become an Expert</Link>
                </Button>
              </div>
            </div>
            {/* Hero image + animated finance cards */}
            <div className="relative flex-shrink-0 lg:-mt-6 lg:-mr-4">
              <img src={heroExpert} alt="Market expert" className="h-64 w-auto md:h-80 lg:h-[26rem] object-contain drop-shadow-2xl" />
              {/* Portfolio card */}
              <div className="absolute left-0 top-4 sm:-left-2 sm:top-6 lg:-left-4 lg:top-10 animate-float-1">
                <div className="rounded-xl border border-border bg-card/90 backdrop-blur-sm p-2 sm:p-3 shadow-large w-28 sm:w-36 lg:w-44">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className="flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-success/10">
                      <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-success" />
                    </div>
                    <div>
                      <p className="text-[8px] sm:text-[10px] text-muted-foreground">Portfolio</p>
                      <p className="text-xs sm:text-sm font-bold text-foreground">+24.8%</p>
                    </div>
                  </div>
                  <div className="mt-1.5 sm:mt-2 flex gap-0.5">
                    {[40, 55, 35, 60, 50, 70, 65, 80, 75, 90].map((h, i) => (
                      <div key={i} className="flex-1 rounded-sm bg-success/60" style={{ height: `${h * 0.2}px` }} />
                    ))}
                  </div>
                </div>
              </div>
              {/* Top Expert card */}
              <div className="absolute right-0 top-1/4 sm:-right-2 sm:top-[30%] lg:-right-3 lg:top-1/3 animate-float-2">
                <div className="rounded-xl border border-border bg-card/90 backdrop-blur-sm p-2 sm:p-3 shadow-large w-26 sm:w-34 lg:w-40">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className="flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-primary/10">
                      <Star className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-[8px] sm:text-[10px] text-muted-foreground">Top Expert</p>
                      <p className="text-xs sm:text-sm font-bold text-foreground">4.9 ★</p>
                    </div>
                  </div>
                  <p className="mt-1 sm:mt-1.5 text-[8px] sm:text-[10px] text-muted-foreground">2.4k subscribers</p>
                </div>
              </div>
              {/* Markets card */}
              <div className="absolute left-0 bottom-4 sm:-left-1 sm:bottom-8 lg:-left-2 lg:bottom-10 animate-float-3">
                <div className="rounded-xl border border-border bg-card/90 backdrop-blur-sm p-2 sm:p-3 shadow-large w-26 sm:w-32 lg:w-36">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className="flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-warning/10">
                      <Globe className="h-3 w-3 sm:h-4 sm:w-4 text-warning" />
                    </div>
                    <div>
                      <p className="text-[8px] sm:text-[10px] text-muted-foreground">Markets</p>
                      <p className="text-xs sm:text-sm font-bold text-foreground">12 Live</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is NeuraBridge */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">What is NeuraBridge?</h2>
            <p className="mt-4 text-lg text-muted-foreground">A discovery platform connecting retail investors with market experts across all asset classes.</p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              { icon: TrendingUp, title: "Expert Insights", desc: "Access curated market analysis from verified experts with proven track records across multiple asset classes." },
              { icon: Users, title: "Direct Subscriptions", desc: "Subscribe directly to experts you trust. Get their private insights delivered straight to your dashboard." },
              { icon: Shield, title: "Educational Content", desc: "All content is for educational purposes. No trading execution or financial advice—just pure market intelligence." },
            ].map((item) => (
              <Card key={item.title} className="bg-card/50 border-border/50">
                <CardContent className="pt-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mt-4 font-display text-lg font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Experts from DB */}
      {experts.length > 0 && (
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-2xl font-bold text-foreground md:text-3xl">Featured Experts</h2>
                <p className="mt-1 text-muted-foreground">Top analysts across all markets</p>
              </div>
              <Button variant="ghost" className="hidden sm:flex" asChild>
                <Link to="/experts">View all <ChevronRight className="ml-1 h-4 w-4" /></Link>
              </Button>
            </div>
            <div className="mt-8">
              <Carousel opts={{ align: "start", loop: true }} className="w-full">
                <CarouselContent className="-ml-4">
                  {experts.map((expert) => (
                    <CarouselItem key={expert.user_id} className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                      <Link to={`/expert/${expert.user_id}`}>
                        <Card className="h-full transition-all hover:shadow-lg hover:-translate-y-1">
                          <CardContent className="p-5">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-12 w-12">
                                <AvatarImage src={expert.profiles?.avatar_url || ""} />
                                <AvatarFallback>{(expert.profiles?.full_name || "E")[0]}</AvatarFallback>
                              </Avatar>
                              <div className="min-w-0">
                                <p className="font-semibold text-foreground truncate">{expert.profiles?.full_name || "Expert"}</p>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {expert.markets?.slice(0, 2).map((m) => (
                                    <Badge key={m} variant="secondary" className="text-xs">{m}</Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                            {expert.headline && (
                              <p className="mt-3 text-sm text-muted-foreground line-clamp-2">{expert.headline}</p>
                            )}
                            <div className="mt-3 flex items-center justify-between text-sm">
                              <span className="text-primary font-semibold">
                                {expert.subscription_price ? `$${expert.subscription_price}/mo` : "Free"}
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="hidden md:flex -left-4" />
                <CarouselNext className="hidden md:flex -right-4" />
              </Carousel>
            </div>
          </div>
        </section>
      )}

      {/* Latest Insights from DB */}
      {posts.length > 0 && (
        <section className="border-t border-border bg-muted/20 py-16 md:py-24">
          <div className="container">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-2xl font-bold text-foreground md:text-3xl">Latest Insights</h2>
                <p className="mt-1 text-muted-foreground">Recent public analysis from experts</p>
              </div>
              <Button variant="ghost" className="hidden sm:flex" asChild>
                <Link to="/insights">View all <ChevronRight className="ml-1 h-4 w-4" /></Link>
              </Button>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Card key={post.id} className="overflow-hidden">
                  {post.image_url && (
                    <div className="aspect-video overflow-hidden">
                      <img src={post.image_url} alt="" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={post.profiles?.avatar_url || ""} />
                        <AvatarFallback>{(post.profiles?.full_name || "E")[0]}</AvatarFallback>
                      </Avatar>
                      <span className="text-xs font-medium text-foreground">{post.profiles?.full_name || "Expert"}</span>
                      {post.market && <Badge variant="secondary" className="text-xs ml-auto">{post.market}</Badge>}
                    </div>
                    <p className="text-sm text-foreground line-clamp-3">{post.content}</p>
                    <p className="mt-2 text-xs text-muted-foreground">{format(new Date(post.created_at), "MMM d, yyyy")}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-6 flex justify-center sm:hidden">
              <Button variant="outline" asChild>
                <Link to="/insights">View all insights <ChevronRight className="ml-1 h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Marketplace Items from DB */}
      {marketplaceItems.length > 0 && (
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-2xl font-bold text-foreground md:text-3xl">Marketplace</h2>
                <p className="mt-1 text-muted-foreground">Courses, webinars, and opportunities from experts</p>
              </div>
              <Button variant="ghost" className="hidden sm:flex" asChild>
                <Link to="/marketplace">View all <ChevronRight className="ml-1 h-4 w-4" /></Link>
              </Button>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {marketplaceItems.map((item) => (
                <Link key={item.id} to={`/marketplace/${item.id}`}>
                  <Card className="h-full overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
                    {item.image_url && (
                      <div className="aspect-video overflow-hidden">
                        <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <CardContent className="p-4">
                      <Badge variant="secondary" className="text-xs mb-2">{item.type}</Badge>
                      <h3 className="font-semibold text-foreground text-sm line-clamp-2">{item.title}</h3>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-primary font-semibold text-sm">{item.price > 0 ? `$${item.price}` : "Free"}</span>
                        <span className="text-xs text-muted-foreground">{item.profiles?.full_name}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Explore Markets */}
      <section className="border-t border-border bg-muted/30 py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-2xl font-bold text-foreground md:text-3xl">Explore Markets</h2>
            <p className="mt-2 text-muted-foreground">Find experts specializing in your preferred asset class</p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {markets.map((market) => (
              <Link key={market.id} to={`/experts?market=${market.id}`}>
                <Card className="group h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-primary/30">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl">{market.icon}</div>
                    <h3 className="mt-3 font-display font-semibold text-foreground group-hover:text-primary transition-colors">{market.name}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">{market.description}</p>
                    <div className="mt-3 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                      Browse experts <ArrowRight className="h-3 w-3" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border bg-primary/5 py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">Ready to get started?</h2>
            <p className="mt-4 text-lg text-muted-foreground">Join thousands of investors discovering market insights from trusted experts.</p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" className="px-8" asChild>
                <Link to="/auth?mode=signup">Create Free Account <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/experts">Explore Experts</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
