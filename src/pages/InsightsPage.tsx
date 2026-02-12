import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getPublicPosts,
  mockExperts,
  markets,
  Market,
  Post,
} from "@/data/mockData";
import { Clock, Globe, ArrowRight } from "lucide-react";
import { format } from "date-fns";

const InsightCard = ({ post }: { post: Post }) => {
  const expert = mockExperts.find((e) => e.id === post.expertId);
  const market = markets.find((m) => m.id === post.market);

  if (!expert) return null;

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-large hover:-translate-y-1">
      <CardContent className="p-6">
        {/* Expert Info */}
        <Link
          to={`/expert/${expert.id}`}
          className="flex items-center gap-3 group"
        >
          <Avatar className="h-10 w-10 border-2 border-border">
            <AvatarImage src={expert.avatar} alt={expert.name} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {expert.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-foreground group-hover:text-primary transition-colors">
              {expert.name}
            </p>
            <p className="text-xs text-muted-foreground">{expert.credentials}</p>
          </div>
        </Link>

        {/* Post Meta */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
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
          <Badge variant="outline" className="text-xs text-success border-success/20">
            <Globe className="mr-1 h-3 w-3" />
            Public
          </Badge>
        </div>

        {/* Image */}
        {post.image && (
          <div className="mt-4 rounded-lg overflow-hidden">
            <img
              src={post.image}
              alt={post.asset}
              className="w-full h-48 object-cover"
              loading="lazy"
            />
          </div>
        )}

        {/* Content */}
        <p className="mt-4 text-foreground leading-relaxed">{post.content}</p>

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {format(new Date(post.createdAt), "MMM d, yyyy 'at' h:mm a")}
          </p>
          <Link
            to={`/expert/${expert.id}`}
            className="text-xs text-primary hover:underline flex items-center gap-1"
          >
            View Expert
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

const InsightsPage = () => {
  const [selectedMarket, setSelectedMarket] = useState<Market | "all">("all");
  const [selectedExpert, setSelectedExpert] = useState<string>("all");
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>("all");

  const publicPosts = getPublicPosts();

  const filteredPosts = useMemo(() => {
    return publicPosts.filter((post) => {
      const matchesMarket =
        selectedMarket === "all" || post.market === selectedMarket;
      const matchesExpert =
        selectedExpert === "all" || post.expertId === selectedExpert;
      const matchesTimeframe =
        selectedTimeframe === "all" || post.timeframe === selectedTimeframe;

      return matchesMarket && matchesExpert && matchesTimeframe;
    });
  }, [publicPosts, selectedMarket, selectedExpert, selectedTimeframe]);

  const timeframes = [...new Set(publicPosts.map((p) => p.timeframe))];

  return (
    <Layout>
      <div className="container py-8 md:py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">
            Public Insights
          </h1>
          <p className="mt-2 text-muted-foreground">
            Explore market insights shared by our expert community
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row">
          {/* Market Filter */}
          <Select
            value={selectedMarket}
            onValueChange={(value) => setSelectedMarket(value as Market | "all")}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="All Markets" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Markets</SelectItem>
              {markets.map((market) => (
                <SelectItem key={market.id} value={market.id}>
                  {market.icon} {market.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Expert Filter */}
          <Select
            value={selectedExpert}
            onValueChange={setSelectedExpert}
          >
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="All Experts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Experts</SelectItem>
              {mockExperts.map((expert) => (
                <SelectItem key={expert.id} value={expert.id}>
                  {expert.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Timeframe Filter */}
          <Select
            value={selectedTimeframe}
            onValueChange={setSelectedTimeframe}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="All Timeframes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Timeframes</SelectItem>
              {timeframes.map((tf) => (
                <SelectItem key={tf} value={tf}>
                  {tf}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Results */}
        {filteredPosts.length > 0 ? (
          <>
            <p className="mb-4 text-sm text-muted-foreground">
              {filteredPosts.length} insight{filteredPosts.length !== 1 && "s"}{" "}
              found
            </p>
            <div className="grid gap-6 md:grid-cols-2">
              {filteredPosts.map((post) => (
                <InsightCard key={post.id} post={post} />
              ))}
            </div>
          </>
        ) : (
          <div className="rounded-lg border border-dashed border-border py-16 text-center">
            <p className="text-lg font-medium text-foreground">
              No insights found
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try adjusting your filters
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default InsightsPage;
