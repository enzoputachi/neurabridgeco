import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { mockMessages, type MockMessage } from "@/data/mockData";
import { Send, Inbox, ArrowLeft } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const MessagesPage = () => {
  const currentUserId = "1"; // Mock: pretend we're Sarah Chen
  const [messages] = useState<MockMessage[]>(mockMessages);
  const [selectedThread, setSelectedThread] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");

  // Group messages into conversations
  const conversations = messages.reduce<
    Record<
      string,
      {
        partnerId: string;
        partnerName: string;
        partnerAvatar: string;
        lastMessage: MockMessage;
        unread: number;
      }
    >
  >((acc, msg) => {
    const partnerId =
      msg.senderId === currentUserId ? msg.receiverId : msg.senderId;
    const partnerName =
      msg.senderId === currentUserId ? msg.receiverName : msg.senderName;
    const partnerAvatar =
      msg.senderId === currentUserId ? "" : msg.senderAvatar;

    if (
      !acc[partnerId] ||
      new Date(msg.createdAt) > new Date(acc[partnerId].lastMessage.createdAt)
    ) {
      acc[partnerId] = {
        partnerId,
        partnerName,
        partnerAvatar: partnerAvatar || acc[partnerId]?.partnerAvatar || "",
        lastMessage: msg,
        unread:
          (acc[partnerId]?.unread || 0) +
          (!msg.read && msg.receiverId === currentUserId ? 1 : 0),
      };
    } else {
      acc[partnerId].unread +=
        !msg.read && msg.receiverId === currentUserId ? 1 : 0;
    }
    return acc;
  }, {});

  const threadMessages = selectedThread
    ? messages
        .filter(
          (m) =>
            (m.senderId === selectedThread &&
              m.receiverId === currentUserId) ||
            (m.senderId === currentUserId && m.receiverId === selectedThread)
        )
        .sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        )
    : [];

  const selectedPartner = selectedThread
    ? conversations[selectedThread]
    : null;

  const handleSend = () => {
    if (!newMessage.trim()) return;
    setNewMessage("");
  };

  return (
    <Layout>
      <div className="container py-8 md:py-12">
        <h1 className="font-display text-3xl font-bold text-foreground mb-8">
          Messages
        </h1>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Conversations List */}
          <Card
            className={`lg:col-span-1 ${
              selectedThread ? "hidden lg:block" : ""
            }`}
          >
            <CardContent className="p-0">
              {Object.values(conversations).length > 0 ? (
                Object.values(conversations).map((conv) => (
                  <button
                    key={conv.partnerId}
                    onClick={() => setSelectedThread(conv.partnerId)}
                    className={`w-full flex items-center gap-3 p-4 border-b border-border last:border-0 hover:bg-muted/50 transition-colors text-left ${
                      selectedThread === conv.partnerId ? "bg-primary/5" : ""
                    }`}
                  >
                    <Avatar className="h-10 w-10 border border-border">
                      <AvatarImage src={conv.partnerAvatar} />
                      <AvatarFallback className="bg-primary/10 text-primary text-sm">
                        {conv.partnerName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-sm text-foreground">
                          {conv.partnerName}
                        </p>
                        {conv.unread > 0 && (
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                            {conv.unread}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate mt-1">
                        {conv.lastMessage.content}
                      </p>
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-8 text-center">
                  <Inbox className="mx-auto h-12 w-12 text-muted-foreground/40" />
                  <p className="mt-4 text-sm text-muted-foreground">
                    No messages yet
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Thread View */}
          <Card
            className={`lg:col-span-2 ${
              !selectedThread ? "hidden lg:block" : ""
            }`}
          >
            <CardContent className="p-0 flex flex-col h-[500px]">
              {selectedThread && selectedPartner ? (
                <>
                  <div className="flex items-center gap-3 p-4 border-b border-border">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="lg:hidden"
                      onClick={() => setSelectedThread(null)}
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={selectedPartner.partnerAvatar} />
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        {selectedPartner.partnerName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <p className="font-medium text-sm text-foreground">
                      {selectedPartner.partnerName}
                    </p>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {threadMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${
                          msg.senderId === currentUserId
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg px-4 py-2 ${
                            msg.senderId === currentUserId
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-foreground"
                          }`}
                        >
                          <p className="text-sm">{msg.content}</p>
                          <p
                            className={`text-[10px] mt-1 ${
                              msg.senderId === currentUserId
                                ? "text-primary-foreground/70"
                                : "text-muted-foreground"
                            }`}
                          >
                            {formatDistanceToNow(new Date(msg.createdAt), {
                              addSuffix: true,
                            })}
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
                    <Button size="icon" onClick={handleSend}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-muted-foreground">
                  <p className="text-sm">
                    Select a conversation to start messaging
                  </p>
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
