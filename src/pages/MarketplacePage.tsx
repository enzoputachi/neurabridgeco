import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockMarketplaceItems, getExpertById } from "@/data/mockData";
import {
  Search,
  Star,
  Users,
  BookOpen,
  Video,
  Zap,
  ArrowRight,
  X,
} from "lucide-react";

const typeConfig = {
  course: { label: "Course", icon: BookOpen, color: "text-primary" },
  webinar: { label: "Webinar", icon: Video, color: "text-info" },
  opportunity: { label: "Opportunity", icon: Zap, color: "text-accent" },
};

const MarketplacePage = () => {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [priceFilter, setPriceFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    return mockMarketplaceItems.filter((item) => {
      const matchSearch =
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase());
      const matchType = typeFilter === "all" || item.type === typeFilter;
      const matchPrice =
        priceFilter === "all" ||
        (priceFilter === "free" && item.price === 0) ||
        (priceFilter === "paid" && item.price > 0);
      return matchSearch && matchType && matchPrice;
    });
  }, [search, typeFilter, priceFilter]);

  const hasFilters = search || typeFilter !== "all" || priceFilter !== "all";

  return (
    <Layout>
      <div className="container py-8 md:py-12">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">
            Marketplace
          </h1>
          <p className="mt-2 text-muted-foreground">
            Courses, webinars, and exclusive opportunities from top experts
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search courses, webinars..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="course">Courses</SelectItem>
              <SelectItem value="webinar">Webinars</SelectItem>
              <SelectItem value="opportunity">Opportunities</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priceFilter} onValueChange={setPriceFilter}>
            <SelectTrigger className="w-full sm:w-[140px]">
              <SelectValue placeholder="All Prices" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Prices</SelectItem>
              <SelectItem value="free">Free</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
            </SelectContent>
          </Select>
          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearch("");
                setTypeFilter("all");
                setPriceFilter("all");
              }}
            >
              <X className="mr-1 h-4 w-4" /> Clear
            </Button>
          )}
        </div>

        <p className="mb-4 text-sm text-muted-foreground">
          {filtered.length} item{filtered.length !== 1 && "s"} found
        </p>

        {/* Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => {
            const expert = getExpertById(item.expertId);
            const cfg = typeConfig[item.type];
            const TypeIcon = cfg.icon;

            return (
              <Card
                key={item.id}
                className="group overflow-hidden transition-all duration-300 hover:shadow-large hover:-translate-y-1 flex flex-col"
              >
                {/* Image */}
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
                  {item.price === 0 && (
                    <Badge className="absolute top-3 right-3 bg-success/90 text-success-foreground">
                      Free
                    </Badge>
                  )}
                </div>

                <CardContent className="flex flex-1 flex-col p-5">
                  <h3 className="font-display font-semibold text-foreground line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2 flex-1">
                    {item.description}
                  </p>

                  {/* Expert */}
                  {expert && (
                    <Link
                      to={`/expert/${expert.id}`}
                      className="mt-4 flex items-center gap-2 group/expert"
                    >
                      <Avatar className="h-6 w-6 border border-border">
                        <AvatarImage src={expert.avatar} />
                        <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                          {expert.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-muted-foreground group-hover/expert:text-primary transition-colors">
                        {expert.name}
                      </span>
                    </Link>
                  )}

                  {/* Stats */}
                  <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-accent fill-accent" />
                      {item.rating} ({item.ratingCount})
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {item.enrolledCount.toLocaleString()} enrolled
                    </span>
                  </div>

                  {/* Price & CTA */}
                  <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                    {item.price > 0 ? (
                      <p className="font-display font-semibold text-foreground">
                        ${item.price}
                      </p>
                    ) : (
                      <Badge className="bg-success/10 text-success border-success/20">
                        Free
                      </Badge>
                    )}
                    <Button variant="ghost" size="sm" className="text-primary" asChild>
                      <Link to={`/marketplace/${item.id}`}>
                        View Details
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="rounded-lg border border-dashed border-border py-16 text-center">
            <p className="text-lg font-medium text-foreground">No items found</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try adjusting your search or filters
            </p>
          </div>
        )}

        <p className="mt-8 text-center text-xs text-muted-foreground">
          Educational content only. Not financial advice.
        </p>
      </div>
    </Layout>
  );
};

export default MarketplacePage;
