import { Link } from "react-router-dom";
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
import ExpertCard from "@/components/experts/ExpertCard";
import {
  mockExperts,
  getFeaturedExperts,
  getTrendingExperts,
  markets,
} from "@/data/mockData";
import {
  ArrowRight,
  TrendingUp,
  Users,
  Shield,
  Sparkles,
  ChevronRight,
} from "lucide-react";

const Index = () => {
  const featuredExperts = getFeaturedExperts();
  const trendingExperts = getTrendingExperts();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
        <div className="container relative py-20 md:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                Expert Market Insights
              </span>
            </div>
            <h1 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
              Discover market experts.{" "}
              <span className="text-primary">
                Get insights before the market moves.
              </span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground md:text-xl">
              Connect with trusted analysts across stocks, crypto, forex, and
              more. Subscribe to their insights and stay ahead of market
              movements.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" className="px-8" asChild>
                <Link to="/experts">
                  Browse Experts
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/auth?mode=signup&role=expert">
                  Become an Expert
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* What is NeuraBridge */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
              What is NeuraBridge?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              A discovery platform connecting retail investors with market
              experts across all asset classes.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <Card className="bg-card/50 border-border/50">
              <CardContent className="pt-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold text-foreground">
                  Expert Insights
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Access curated market analysis from verified experts with
                  proven track records across multiple asset classes.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50">
              <CardContent className="pt-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold text-foreground">
                  Direct Subscriptions
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Subscribe directly to experts you trust. Get their private
                  insights delivered straight to your dashboard.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50">
              <CardContent className="pt-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold text-foreground">
                  Educational Content
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  All content is for educational purposes. No trading execution
                  or financial advice—just pure market intelligence.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-y border-border bg-muted/30 py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
              How It Works
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Get started in minutes, whether you're an investor or an expert.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {/* For Investors */}
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-primary/5 p-6">
                  <h3 className="font-display text-xl font-bold text-foreground">
                    For Investors
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Find experts you trust and subscribe to their insights.
                  </p>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-sm">
                      1
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        Browse experts by market
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Explore stocks, crypto, forex, bonds, and commodities.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-sm">
                      2
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        Subscribe to unlock insights
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Get access to private posts and recommendations.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-sm">
                      3
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        Stay informed with your feed
                      </p>
                      <p className="text-sm text-muted-foreground">
                        All your subscriptions in one dashboard.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* For Experts */}
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-accent/10 p-6">
                  <h3 className="font-display text-xl font-bold text-foreground">
                    For Experts
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Share your expertise and build a subscriber base.
                  </p>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground font-semibold text-sm">
                      1
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        Create your expert profile
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Showcase your credentials and markets.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground font-semibold text-sm">
                      2
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        Publish insights & analysis
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Post public teasers and private deep-dives.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground font-semibold text-sm">
                      3
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        Grow your audience
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Earn recurring revenue from subscribers.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Experts */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground md:text-3xl">
                Featured Experts
              </h2>
              <p className="mt-1 text-muted-foreground">
                Top-rated analysts across all markets
              </p>
            </div>
            <Button variant="ghost" className="hidden sm:flex" asChild>
              <Link to="/experts">
                View all
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="mt-8">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-4">
                {featuredExperts.map((expert) => (
                  <CarouselItem
                    key={expert.id}
                    className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
                  >
                    <ExpertCard expert={expert} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex -left-4" />
              <CarouselNext className="hidden md:flex -right-4" />
            </Carousel>
          </div>

          <div className="mt-6 flex justify-center sm:hidden">
            <Button variant="outline" asChild>
              <Link to="/experts">
                View all experts
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Trending Experts */}
      <section className="border-t border-border bg-muted/20 py-16 md:py-24">
        <div className="container">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground md:text-3xl">
                Trending This Week
              </h2>
              <p className="mt-1 text-muted-foreground">
                Experts gaining traction right now
              </p>
            </div>
            <Button variant="ghost" className="hidden sm:flex" asChild>
              <Link to="/experts">
                View all
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {trendingExperts.slice(0, 4).map((expert) => (
              <ExpertCard key={expert.id} expert={expert} variant="compact" />
            ))}
          </div>
        </div>
      </section>

      {/* Popular Markets */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-2xl font-bold text-foreground md:text-3xl">
              Explore Markets
            </h2>
            <p className="mt-2 text-muted-foreground">
              Find experts specializing in your preferred asset class
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {markets.map((market) => (
              <Link key={market.id} to={`/experts?market=${market.id}`}>
                <Card className="group h-full transition-all duration-300 hover:shadow-large hover:-translate-y-1 hover:border-primary/30">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl">{market.icon}</div>
                    <h3 className="mt-3 font-display font-semibold text-foreground group-hover:text-primary transition-colors">
                      {market.name}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {market.description}
                    </p>
                    <div className="mt-3 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                      Browse experts
                      <ArrowRight className="h-3 w-3" />
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
            <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
              Ready to get started?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Join thousands of investors discovering market insights from
              trusted experts.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" className="px-8" asChild>
                <Link to="/auth?mode=signup">
                  Create Free Account
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
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
