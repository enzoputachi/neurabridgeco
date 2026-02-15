import { useState } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Calendar, CheckCircle2, Loader2 } from "lucide-react";

const BookExpertPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const expertName = (location.state as any)?.expertName || "Expert";
  const bookingPrice = (location.state as any)?.bookingPrice || 0;

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [booked, setBooked] = useState(false);

  if (!user) {
    navigate("/auth");
    return null;
  }

  const handleBook = async () => {
    if (!date || !time) {
      toast({ variant: "destructive", title: "Please select a date and time" });
      return;
    }

    setSubmitting(true);
    const scheduledAt = new Date(`${date}T${time}`).toISOString();

    const { error } = await supabase.from("bookings").insert({
      expert_id: id!,
      investor_id: user.id,
      scheduled_at: scheduledAt,
      notes: notes.trim() || null,
      status: "pending",
    });

    if (error) {
      toast({ variant: "destructive", title: "Booking failed", description: error.message });
    } else {
      // Send booking details as a message to the expert
      const messageContent = `📅 **New 1-on-1 Booking Request**\n\nDate: ${new Date(scheduledAt).toLocaleDateString()}\nTime: ${new Date(scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}\nPrice: ${bookingPrice > 0 ? `$${bookingPrice}` : "Free"}${notes.trim() ? `\nNotes: ${notes.trim()}` : ""}\n\nLooking forward to our session!`;

      await supabase.from("messages").insert({
        sender_id: user.id,
        receiver_id: id!,
        content: messageContent,
      });

      // Notify expert
      await supabase.from("notifications").insert({
        user_id: id!,
        type: "booking",
        title: "New Booking Request",
        description: `You have a new one-on-one booking request for ${new Date(scheduledAt).toLocaleDateString()}.`,
      });
      setBooked(true);
      toast({ title: "Booking submitted!", description: "The expert will review your request." });
    }
    setSubmitting(false);
  };

  if (booked) {
    return (
      <Layout>
        <div className="container max-w-lg py-16 text-center">
          <CheckCircle2 className="mx-auto h-16 w-16 text-success" />
          <h1 className="mt-4 font-display text-2xl font-bold text-foreground">Booking Submitted!</h1>
          <p className="mt-2 text-muted-foreground">
            Your one-on-one session request with {expertName} has been sent. You'll be notified once they confirm.
          </p>
          <div className="mt-6 flex gap-3 justify-center">
            <Button asChild><Link to={`/expert/${id}`}>Back to Expert</Link></Button>
            <Button variant="outline" asChild><Link to="/messages">Messages</Link></Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container max-w-lg py-8 md:py-12">
        <Link to={`/expert/${id}`} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ArrowLeft className="h-4 w-4" />Back to {expertName}
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Book a 1-on-1 Session
            </CardTitle>
            <CardDescription>
              Schedule a one-on-one session with {expertName} for ${bookingPrice}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-muted/50 p-4 text-center">
              <p className="font-display text-2xl font-bold text-foreground">${bookingPrice}</p>
              <p className="text-xs text-muted-foreground">per session</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Preferred Date</Label>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
              <div className="space-y-2">
                <Label>Preferred Time</Label>
                <Input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Notes (optional)</Label>
              <Textarea
                placeholder="What would you like to discuss?"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                maxLength={500}
              />
            </div>

            <Button onClick={handleBook} disabled={submitting} className="w-full" size="lg">
              {submitting ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Submitting...</>
              ) : (
                <>Confirm Booking – ${bookingPrice}</>
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Payment is handled separately. The expert will confirm your session.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default BookExpertPage;
