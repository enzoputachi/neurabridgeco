import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import ExpertCard from "@/components/experts/ExpertCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockExperts, markets, Market } from "@/data/mockData";
import { Search, LayoutGrid, List, X } from "lucide-react";

const ExpertsDirectory = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMarket, setSelectedMarket] = useState<Market | "all">("all");
  const [priceFilter, setPriceFilter] = useState<"all" | "free" | "paid">("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredExperts = useMemo(() => {
    return mockExperts.filter((expert) => {
      // Search filter
      const matchesSearch =
        expert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        expert.credentials.toLowerCase().includes(searchQuery.toLowerCase()) ||
        expert.markets.some((m) =>
          m.toLowerCase().includes(searchQuery.toLowerCase())
        );

      // Market filter
      const matchesMarket =
        selectedMarket === "all" || expert.markets.includes(selectedMarket);

      // Price filter
      const matchesPrice =
        priceFilter === "all" ||
        (priceFilter === "free" && expert.subscriptionPrice === null) ||
        (priceFilter === "paid" && expert.subscriptionPrice !== null);

      return matchesSearch && matchesMarket && matchesPrice;
    });
  }, [searchQuery, selectedMarket, priceFilter]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedMarket("all");
    setPriceFilter("all");
  };

  const hasActiveFilters =
    searchQuery || selectedMarket !== "all" || priceFilter !== "all";

  return (
    <Layout>
      <div className="container py-8 md:py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">
            Expert Directory
          </h1>
          <p className="mt-2 text-muted-foreground">
            Discover and connect with market experts across all asset classes
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 flex-col gap-4 sm:flex-row">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search experts or markets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

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

            {/* Price Filter */}
            <Select
              value={priceFilter}
              onValueChange={(value) =>
                setPriceFilter(value as "all" | "free" | "paid")
              }
            >
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="All Prices" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-muted-foreground"
              >
                <X className="mr-1 h-4 w-4" />
                Clear filters
              </Button>
            )}
            <div className="flex rounded-lg border border-border p-1">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="h-8 w-8 p-0"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="h-8 w-8 p-0"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {searchQuery && (
              <Badge variant="secondary" className="gap-1">
                Search: {searchQuery}
                <button onClick={() => setSearchQuery("")}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {selectedMarket !== "all" && (
              <Badge variant="secondary" className="gap-1">
                Market: {markets.find((m) => m.id === selectedMarket)?.name}
                <button onClick={() => setSelectedMarket("all")}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {priceFilter !== "all" && (
              <Badge variant="secondary" className="gap-1">
                {priceFilter === "free" ? "Free only" : "Paid only"}
                <button onClick={() => setPriceFilter("all")}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </div>
        )}

        {/* Results */}
        {filteredExperts.length > 0 ? (
          <>
            <p className="mb-4 text-sm text-muted-foreground">
              {filteredExperts.length} expert{filteredExperts.length !== 1 && "s"}{" "}
              found
            </p>
            <div
              className={
                viewMode === "grid"
                  ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                  : "flex flex-col gap-4"
              }
            >
              {filteredExperts.map((expert) => (
                <ExpertCard
                  key={expert.id}
                  expert={expert}
                  variant={viewMode === "list" ? "compact" : "default"}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="rounded-lg border border-dashed border-border py-16 text-center">
            <p className="text-lg font-medium text-foreground">
              No experts found
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try adjusting your search or filters
            </p>
            <Button variant="outline" className="mt-4" onClick={clearFilters}>
              Clear all filters
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ExpertsDirectory;
