import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";

const MARKET_OPTIONS = [
  { value: "stocks", label: "Stocks", icon: "📈" },
  { value: "crypto", label: "Crypto", icon: "₿" },
  { value: "forex", label: "Forex", icon: "💱" },
  { value: "bonds", label: "Bonds", icon: "📊" },
  { value: "commodities", label: "Commodities", icon: "🛢️" },
];

const ProfileSettingsPage = () => {
  const { user, userRole, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Expert-specific
  const [bio, setBio] = useState("");
  const [credentials, setCredentials] = useState("");
  const [headline, setHeadline] = useState("");
  const [selectedMarkets, setSelectedMarkets] = useState<string[]>([]);
  const [subscriptionPrice, setSubscriptionPrice] = useState("");

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    const { data } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
    if (data) {
      setFullName(data.full_name || "");
      setUsername(data.username || "");
      setAvatarUrl(data.avatar_url || "");
    }

    if (userRole === "expert") {
      const { data: ep } = await supabase.from("expert_profiles").select("*").eq("user_id", user.id).maybeSingle();
      if (ep) {
        setBio(ep.bio || "");
        setCredentials(ep.credentials || "");
        setHeadline(ep.headline || "");
        setSelectedMarkets(ep.markets || []);
        setSubscriptionPrice(ep.subscription_price?.toString() || "0");
      }
    }
    setLoadingProfile(false);
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);

    const { error: profileError } = await supabase
      .from("profiles")
      .update({ full_name: fullName, username, avatar_url: avatarUrl })
      .eq("id", user.id);

    let expertError = null;
    if (userRole === "expert") {
      const { error } = await supabase
        .from("expert_profiles")
        .update({
          bio, credentials, headline,
          markets: selectedMarkets,
          subscription_price: parseFloat(subscriptionPrice) || 0,
        })
        .eq("user_id", user.id);
      expertError = error;
    }

    setSaving(false);
    if (profileError || expertError) {
      toast({ variant: "destructive", title: "Error", description: (profileError || expertError)?.message });
    } else {
      toast({ title: "Profile updated!", description: "Your changes have been saved." });
    }
  };

  const toggleMarket = (m: string) => {
    setSelectedMarkets((prev) => prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]);
  };

  if (authLoading || loadingProfile) {
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
      <div className="container max-w-2xl py-8 md:py-12">
        <h1 className="font-display text-3xl font-bold text-foreground mb-8">Profile Settings</h1>

        <Card>
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
            <CardDescription>Update your display picture and personal information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar */}
            <div className="flex flex-col items-center gap-4">
              <Avatar className="h-24 w-24 border-4 border-border">
                <AvatarImage src={avatarUrl} />
                <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                  {fullName?.charAt(0) || user?.email?.charAt(0) || "?"}
                </AvatarFallback>
              </Avatar>
              <ImageUpload value={avatarUrl} onChange={setAvatarUrl} folder="avatars" className="w-full max-w-xs" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your name" />
              </div>
              <div className="space-y-2">
                <Label>Username</Label>
                <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="@username" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={user?.email || ""} disabled className="bg-muted" />
              <p className="text-xs text-muted-foreground">Email cannot be changed</p>
            </div>

            {/* Expert-specific fields */}
            {userRole === "expert" && (
              <>
                <Separator />
                <h3 className="font-display font-semibold text-foreground">Expert Profile</h3>

                <div className="space-y-2">
                  <Label>Credentials</Label>
                  <Input placeholder="e.g. CFA, Former Goldman Sachs" value={credentials} onChange={(e) => setCredentials(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label>Headline</Label>
                  <Input placeholder="Your current market view in one line" value={headline} onChange={(e) => setHeadline(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label>Bio</Label>
                  <Textarea placeholder="Tell investors about your experience..." value={bio} onChange={(e) => setBio(e.target.value)} rows={4} />
                </div>

                <div className="space-y-2">
                  <Label>Markets Covered</Label>
                  <div className="flex flex-wrap gap-2">
                    {MARKET_OPTIONS.map((m) => (
                      <Badge
                        key={m.value}
                        variant={selectedMarkets.includes(m.value) ? "default" : "outline"}
                        className="cursor-pointer transition-colors"
                        onClick={() => toggleMarket(m.value)}
                      >
                        {m.icon} {m.label}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Monthly Subscription Price ($)</Label>
                  <Input type="number" min="0" step="1" placeholder="0 for free" value={subscriptionPrice} onChange={(e) => setSubscriptionPrice(e.target.value)} />
                  <p className="text-xs text-muted-foreground">Set to 0 for free access.</p>
                </div>
              </>
            )}

            <Button onClick={handleSave} disabled={saving}>
              {saving ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</>) : (<><Save className="mr-2 h-4 w-4" />Save Changes</>)}
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ProfileSettingsPage;
