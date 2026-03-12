import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Expert, markets } from "@/data/mockData";
import { ArrowRight, Users, Star } from "lucide-react";

interface ExpertCardProps {
  expert: Expert;
  variant?: "default" | "compact";
}

const ExpertCard = ({ expert, variant = "default" }: ExpertCardProps) => {
  const marketNames = expert.markets
    .map((m) => markets.find((market) => market.id === m)?.name)
    .filter(Boolean);

  if (variant === "compact") {
    return (
      <Card className="group overflow-hidden transition-all duration-300 hover:shadow-large hover:-translate-y-1">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 border-2 border-border">
              <AvatarImage src={expert.avatar} alt={expert.name} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {expert.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h4 className="font-display font-semibold text-foreground truncate">
                {expert.name}
              </h4>
              <p className="text-xs text-muted-foreground truncate">
                {expert.credentials}
              </p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <Star className="h-3.5 w-3.5 text-accent fill-accent" />
              <span className="text-xs font-medium text-foreground">{expert.rating}</span>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {marketNames.map((market) => (
              <Badge key={market} variant="secondary" className="text-xs px-2 py-0.5">
                {market}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-large hover:-translate-y-1 h-full flex flex-col">
      <CardContent className="p-6 flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-start gap-4">
          <Avatar className="h-14 w-14 border-2 border-border ring-2 ring-primary/10">
            <AvatarImage src={expert.avatar} alt={expert.name} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
              {expert.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h4 className="font-display font-semibold text-lg text-foreground">
              {expert.name}
            </h4>
            <p className="text-sm text-muted-foreground">{expert.credentials}</p>
            <div className="mt-1 flex items-center gap-1">
              <Star className="h-3.5 w-3.5 text-accent fill-accent" />
              <span className="text-xs font-medium text-foreground">{expert.rating}</span>
              <span className="text-xs text-muted-foreground">({expert.ratingCount})</span>
            </div>
          </div>
        </div>

        {/* Markets */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {marketNames.map((market) => (
            <Badge key={market} variant="secondary" className="text-xs font-medium">
              {market}
            </Badge>
          ))}
        </div>

        {/* Headline */}
        <p className="mt-4 text-sm text-foreground line-clamp-2 flex-1">
          "{expert.headline}"
        </p>

        {/* Stats */}
        <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            <span>{expert.subscriberCount.toLocaleString()} subscribers</span>
          </div>
          <span>•</span>
          <span>{expert.postCount} insights</span>
        </div>

        {/* Price & CTA */}
        <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
          <div>
            {expert.subscriptionPrice ? (
              <p className="font-display font-semibold text-foreground">
                NGN{expert.subscriptionPrice}
                <span className="text-sm font-normal text-muted-foreground">/month</span>
              </p>
            ) : (
              <Badge className="bg-success/10 text-success border-success/20 hover:bg-success/20">
                Free
              </Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="group/btn text-primary hover:text-primary"
            asChild
          >
            <Link to={`/expert/${expert.id}`}>
              View Expert
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpertCard;
