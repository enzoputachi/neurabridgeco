import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Send, Inbox, ArrowLeft, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Conversation {
  partnerId: string;
  partnerName: string;
  partnerAvatar: string | null;
  lastMessage: string;
  lastMessageAt: string;
  unread: number;
}

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  read: boolean;
  created_at: string;
}

const MessagesPage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedThread, setSelectedThread] = useState<string | null>(null);
  const [threadMessages, setThreadMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [partnerProfiles, setPartnerProfiles] = useState<Record<string, { name: string; avatar: string | null }>>({});

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) fetchConversations();
  }, [user]);

  // Handle incoming state from ExpertPage "Send Message"
  useEffect(() => {
    const state = location.state as { recipientId?: string; recipientName?: string } | null;
    if (state?.recipientId && user) {
      setSelectedThread(state.recipientId);
    }
  }, [location.state, user]);

  useEffect(() => {
    if (selectedThread && user) fetchThreadMessages(selectedThread);
  }, [selectedThread, user]);

  // Realtime subscription
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel("messages-realtime")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, (payload) => {
        const msg = payload.new as Message;
        if (msg.sender_id === user.id || msg.receiver_id === user.id) {
          fetchConversations();
          if (selectedThread && (msg.sender_id === selectedThread || msg.receiver_id === selectedThread)) {
            setThreadMessages((prev) => [...prev, msg]);
          }
        }
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user, selectedThread]);

  const fetchConversations = async () => {
    if (!user) return;
    setLoading(true);

    const { data: messages } = await supabase
      .from("messages")
      .select("*")
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .order("created_at", { ascending: false });

    if (!messages || messages.length === 0) {
      // Check if we have a pending recipient from navigation
      const state = location.state as { recipientId?: string; recipientName?: string } | null;
      if (state?.recipientId) {
        const { data: profile } = await supabase.from("profiles").select("id, full_name, avatar_url").eq("id", state.recipientId).maybeSingle();
        if (profile) {
          setConversations([{
            partnerId: profile.id,
            partnerName: profile.full_name || "User",
            partnerAvatar: profile.avatar_url,
            lastMessage: "",
            lastMessageAt: new Date().toISOString(),
            unread: 0,
          }]);
          setSelectedThread(profile.id);
          setPartnerProfiles({ [profile.id]: { name: profile.full_name || "User", avatar: profile.avatar_url } });
        }
      }
      setLoading(false);
      return;
    }

    // Build conversations
    const convMap: Record<string, { msgs: Message[] }> = {};
    messages.forEach((msg) => {
      const partnerId = msg.sender_id === user.id ? msg.receiver_id : msg.sender_id;
      if (!convMap[partnerId]) convMap[partnerId] = { msgs: [] };
      convMap[partnerId].msgs.push(msg);
    });

    const partnerIds = Object.keys(convMap);
    const { data: profiles } = await supabase.from("profiles").select("id, full_name, avatar_url").in("id", partnerIds);

    const profileMap: Record<string, { name: string; avatar: string | null }> = {};
    profiles?.forEach((p) => {
      profileMap[p.id] = { name: p.full_name || "User", avatar: p.avatar_url };
    });
    setPartnerProfiles(profileMap);

    const convList: Conversation[] = partnerIds.map((pid) => {
      const msgs = convMap[pid].msgs;
      const lastMsg = msgs[0];
      const unread = msgs.filter((m) => m.receiver_id === user.id && !m.read).length;
      return {
        partnerId: pid,
        partnerName: profileMap[pid]?.name || "User",
        partnerAvatar: profileMap[pid]?.avatar || null,
        lastMessage: lastMsg.content,
        lastMessageAt: lastMsg.created_at,
        unread,
      };
    });

    // Add recipient from navigation if not already in conversations
    const state = location.state as { recipientId?: string; recipientName?: string } | null;
    if (state?.recipientId && !convMap[state.recipientId]) {
      const { data: profile } = await supabase.from("profiles").select("id, full_name, avatar_url").eq("id", state.recipientId).maybeSingle();
      if (profile) {
        convList.unshift({
          partnerId: profile.id,
          partnerName: profile.full_name || "User",
          partnerAvatar: profile.avatar_url,
          lastMessage: "",
          lastMessageAt: new Date().toISOString(),
          unread: 0,
        });
        profileMap[profile.id] = { name: profile.full_name || "User", avatar: profile.avatar_url };
        setPartnerProfiles(profileMap);
      }
    }

    setConversations(convList);
    setLoading(false);
  };

  const fetchThreadMessages = async (partnerId: string) => {
    if (!user) return;
    const { data } = await supabase
      .from("messages")
      .select("*")
      .or(`and(sender_id.eq.${user.id},receiver_id.eq.${partnerId}),and(sender_id.eq.${partnerId},receiver_id.eq.${user.id})`)
      .order("created_at", { ascending: true });

    setThreadMessages(data || []);

    // Mark as read
    if (data) {
      const unreadIds = data.filter((m) => m.receiver_id === user.id && !m.read).map((m) => m.id);
      if (unreadIds.length > 0) {
        await supabase.from("messages").update({ read: true }).in("id", unreadIds);
      }
    }
  };

  const handleSend = async () => {
    if (!newMessage.trim() || !selectedThread || !user) return;
    setSending(true);

    const { error } = await supabase.from("messages").insert({
      sender_id: user.id,
      receiver_id: selectedThread,
      content: newMessage.trim(),
    });

    setSending(false);
    if (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } else {
      setNewMessage("");
      // Create notification for receiver
      await supabase.from("notifications").insert({
        user_id: selectedThread,
        type: "message",
        title: "New Message",
        description: "You received a new message",
      });
    }
  };

  const selectedPartner = selectedThread ? partnerProfiles[selectedThread] : null;

  if (authLoading || loading) {
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
      <div className="container py-8 md:py-12">
        <h1 className="font-display text-3xl font-bold text-foreground mb-8">Messages</h1>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className={`lg:col-span-1 ${selectedThread ? "hidden lg:block" : ""}`}>
            <CardContent className="p-0">
              {conversations.length > 0 ? (
                conversations.map((conv) => (
                  <button
                    key={conv.partnerId}
                    onClick={() => setSelectedThread(conv.partnerId)}
                    className={`w-full flex items-center gap-3 p-4 border-b border-border last:border-0 hover:bg-muted/50 transition-colors text-left ${selectedThread === conv.partnerId ? "bg-primary/5" : ""}`}
                  >
                    <Avatar className="h-10 w-10 border border-border">
                      <AvatarImage src={conv.partnerAvatar || undefined} />
                      <AvatarFallback className="bg-primary/10 text-primary text-sm">
                        {conv.partnerName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-sm text-foreground">{conv.partnerName}</p>
                        {conv.unread > 0 && (
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                            {conv.unread}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate mt-1">{conv.lastMessage}</p>
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-8 text-center">
                  <Inbox className="mx-auto h-12 w-12 text-muted-foreground/40" />
                  <p className="mt-4 text-sm text-muted-foreground">No messages yet</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className={`lg:col-span-2 ${!selectedThread ? "hidden lg:block" : ""}`}>
            <CardContent className="p-0 flex flex-col h-[500px]">
              {selectedThread && selectedPartner ? (
                <>
                  <div className="flex items-center gap-3 p-4 border-b border-border">
                    <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSelectedThread(null)}>
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={selectedPartner.avatar || undefined} />
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        {selectedPartner.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <p className="font-medium text-sm text-foreground">{selectedPartner.name}</p>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {threadMessages.map((msg) => (
                      <div key={msg.id} className={`flex ${msg.sender_id === user?.id ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[70%] rounded-lg px-4 py-2 ${msg.sender_id === user?.id ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
                          <p className="text-sm">{msg.content}</p>
                          <p className={`text-[10px] mt-1 ${msg.sender_id === user?.id ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                            {formatDistanceToNow(new Date(msg.created_at), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 border-t border-border flex gap-2">
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    />
                    <Button size="icon" onClick={handleSend} disabled={sending}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-muted-foreground">
                  <p className="text-sm">Select a conversation to start messaging</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default MessagesPage;
