import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { getMarketplaceItemById, getExpertById } from "@/data/mockData";
import {
  ArrowLeft,
  Star,
  Users,
  Clock,
  CheckCircle2,
  BookOpen,
  Video,
  Zap,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const typeConfig = {
  course: { label: "Course", icon: BookOpen, color: "text-primary" },
  webinar: { label: "Webinar", icon: Video, color: "text-info" },
  opportunity: { label: "Opportunity", icon: Zap, color: "text-accent" },
};

const MarketplaceDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const item = getMarketplaceItemById(id || "");
  const expert = item ? getExpertById(item.expertId) : undefined;
  const [purchasing, setPurchasing] = useState(false);
  const { toast } = useToast();

  if (!item) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground">Item not found</h1>
          <p className="mt-2 text-muted-foreground">
            The item you&apos;re looking for doesn&apos;t exist.
          </p>
          <Button className="mt-6" asChild>
            <Link to="/marketplace">Back to Marketplace</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const cfg = typeConfig[item.type];
  const TypeIcon = cfg.icon;

  const handlePurchase = () => {
    setPurchasing(true);
    setTimeout(() => {
      setPurchasing(false);
      toast({
        title: "Purchase Successful!",
        description: `You've enrolled in "${item.title}". Check your email for access details.`,
      });
    }, 1500);
  };

  return (
    <Layout>
      <div className="container py-8 md:py-12">
        <Link
          to="/marketplace"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Marketplace
        </Link>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-xl overflow-hidden">
              <img
                src={item.image}
                alt={item.title}
                className="w-full aspect-video object-cover"
              />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <Badge variant="secondary" className="gap-1">
                  <TypeIcon className={`h-3 w-3 ${cfg.color}`} />
                  {cfg.label}
                </Badge>
                <Badge variant="outline" className="gap-1">
                  <Star className="h-3 w-3 text-accent fill-accent" />
                  {item.rating} ({item.ratingCount} reviews)
                </Badge>
                <Badge variant="outline" className="gap-1">
                  <Users className="h-3 w-3" />
                  {item.enrolledCount.toLocaleString()} enrolled
                </Badge>
              </div>
              <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                {item.title}
              </h1>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </div>

            <Separator />

            <div>
              <h2 className="font-display text-lg font-semibold text-foreground mb-4">
                What You&apos;ll Learn
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  "Market analysis fundamentals",
                  "Risk management strategies",
                  "Technical & fundamental frameworks",
                  "Real-time trade examples",
                  "Portfolio construction",
                  "Exit strategy planning",
                ].map((point, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-success shrink-0 mt-0.5" />
                    <p className="text-sm text-foreground">{point}</p>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <h2 className="font-display text-lg font-semibold text-foreground mb-4">
                Course Details
              </h2>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-lg bg-muted/50 p-4 text-center">
                  <Clock className="mx-auto h-6 w-6 text-muted-foreground mb-2" />
                  <p className="font-medium text-foreground text-sm">
                    Self-Paced
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Learn at your own speed
                  </p>
                </div>
                <div className="rounded-lg bg-muted/50 p-4 text-center">
                  <BookOpen className="mx-auto h-6 w-6 text-muted-foreground mb-2" />
                  <p className="font-medium text-foreground text-sm">
                    12 Modules
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Comprehensive curriculum
                  </p>
                </div>
                <div className="rounded-lg bg-muted/50 p-4 text-center">
                  <CheckCircle2 className="mx-auto h-6 w-6 text-muted-foreground mb-2" />
                  <p className="font-medium text-foreground text-sm">
                    Certificate
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    On completion
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <Card>
                <CardContent className="p-6">
                  {item.price > 0 ? (
                    <p className="font-display text-4xl font-bold text-foreground text-center">
                      ${item.price}
                    </p>
                  ) : (
                    <Badge className="bg-success/10 text-success border-success/20 text-xl px-6 py-2 mx-auto block w-fit">
                      Free
                    </Badge>
                  )}

                  <Button
                    className="w-full mt-6"
                    size="lg"
                    onClick={handlePurchase}
                    disabled={purchasing}
                  >
                    {purchasing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : item.price > 0 ? (
                      `Enroll for $${item.price}`
                    ) : (
                      "Enroll for Free"
                    )}
                  </Button>

                  <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                      Lifetime access
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                      Certificate of completion
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                      30-day money-back guarantee
                    </li>
                    <li className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      Self-paced learning
                    </li>
                  </ul>

                  <p className="mt-4 text-xs text-center text-muted-foreground">
                    Educational content only. Not financial advice.
                  </p>
                </CardContent>
              </Card>

              {expert && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-foreground text-sm mb-4">
                      Your Instructor
                    </h3>
                    <Link
                      to={`/expert/${expert.id}`}
                      className="flex items-center gap-3 group"
                    >
                      <Avatar className="h-12 w-12 border-2 border-border">
                        <AvatarImage src={expert.avatar} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {expert.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                          {expert.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {expert.credentials}
                        </p>
                      </div>
                    </Link>
                    <p className="mt-3 text-sm text-muted-foreground line-clamp-3">
                      {expert.bio}
                    </p>
                    <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-accent fill-accent" />
                        {expert.rating}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {expert.subscriberCount.toLocaleString()} subscribers
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MarketplaceDetailPage;
