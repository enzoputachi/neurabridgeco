import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { email, amount, expertId } = await req.json();
    console.log("initialize-payment payload:", { email, amount, expertId });

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) throw new Error("Unauthorized");
    console.log("auth user:", { id: user.id, role: user.role });

    // Step 1: Upsert subscription
    const { data: subscription, error: subError } = await supabaseClient
      .from("subscriptions")
      .upsert(
        {
          investor_id: user.id,
          expert_id: expertId,
          status: "pending",
          cancelled_at: null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "investor_id,expert_id" }
      )
      .select()
      .single();

    if (subError) throw subError;
    console.log("subscription row:", subscription);

    // Step 2: Initialize Paystack payment
    const paystackResponse = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${Deno.env.get("PAYSTACK_SECRET_KEY")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          amount: amount * 100,
          currency: "NGN",
          callback_url: `${Deno.env.get("FRONTEND_URL")}/payment/callback`,
          metadata: {
            subscription_id: subscription.id,
            expert_id: expertId,
            investor_id: user.id,
          },
        }),
      }
    );

    const paystackData = await paystackResponse.json();
    if (!paystackData.status) throw new Error(paystackData.message || "Payment initialization failed");

    // Step 3: Save payment record
    const { data: payment, error: dbError } = await supabaseClient
      .from("payments")
      .insert({
        investor_id: user.id,
        expert_id: expertId,
        subscription_id: subscription.id,
        amount: amount,
        currency: "NGN",
        status: "pending",
        paystack_reference: paystackData.data.reference,
      })
      .select()
      .single();

    if (dbError) throw dbError;

    return new Response(
      JSON.stringify({
        success: true,
        subscriptionId: subscription.id,
        paymentId: payment.id,
        reference: paystackData.data.reference,
        authorization_url: paystackData.data.authorization_url,
        access_code: paystackData.data.access_code,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("initialize-payment ERROR:", error);
    return new Response(
      JSON.stringify({ success: false, error: (error as Error)?.message ?? String(error) }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
    );
  }
});