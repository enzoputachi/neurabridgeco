import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { UserCheck } from "lucide-react";
import { format } from "date-fns";

interface Subscriber {
  id: string;
  name: string | null;
  avatar: string | null;
  subscribedAt: string;
}

export function SubscribersListCard({ userId }: { userId: string }) {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);

  useEffect(() => {
    if (userId) fetchSubscribers();
  }, [userId]);

  const fetchSubscribers = async () => {
    const { data: subs } = await supabase
      .from("subscriptions")
      .select("investor_id, created_at")
      .eq("expert_id", userId)
      .eq("status", "active");

    if (!subs || subs.length === 0) {
      setSubscribers([]);
      return;
    }

    const investorIds = subs.map((s) => s.investor_id);
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name, avatar_url")
      .in("id", investorIds);

    setSubscribers(
      subs.map((s) => {
        const p = profiles?.find((pr) => pr.id === s.investor_id);
        return {
          id: s.investor_id,
          name: p?.full_name || null,
          avatar: p?.avatar_url || null,
          subscribedAt: s.created_at,
        };
      })
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <UserCheck className="h-5 w-5 text-primary" />
          Your Subscribers ({subscribers.length})
        </CardTitle>
        <CardDescription>People subscribed to your premium insights</CardDescription>
      </CardHeader>
      <CardContent>
        {subscribers.length > 0 ? (
          <div className="space-y-3">
            {subscribers.map((sub) => (
              <div key={sub.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border border-border">
                    <AvatarImage src={sub.avatar || undefined} />
                    <AvatarFallback className="bg-primary/10 text-primary text-sm">
                      {(sub.name || "?").charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-foreground text-sm">{sub.name || "Investor"}</p>
                    <p className="text-xs text-muted-foreground">
                      Since {format(new Date(sub.subscribedAt), "MMM d, yyyy")}
                    </p>
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs">Active</Badge>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-8">No subscribers yet</p>
        )}
      </CardContent>
    </Card>
  );
}
