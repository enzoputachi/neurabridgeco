import "@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { reference } = await req.json()

    // Authenticated client (respects RLS)
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    // Service role client for privileged writes
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get authenticated user
    const { data: { user } } = await supabaseClient.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    // Step 1: Verify payment with Paystack
    const paystackResponse = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${Deno.env.get('PAYSTACK_SECRET_KEY')}`,
        },
      }
    )

    const paystackData = await paystackResponse.json()

    if (!paystackData.status) throw new Error('Payment verification failed')

    const paymentStatus = paystackData.data.status === 'success' ? 'completed' : 'failed'

    // Step 2: Get payment record to find linked subscription / booking
    const { data: payment, error: paymentFetchError } = await supabaseAdmin
      .from('payments')
      .select('id, subscription_id, booking_id, investor_id, expert_id')
      .eq('paystack_reference', reference)
      .single()

    if (paymentFetchError || !payment) {
      throw new Error(`Could not find payment record: ${paymentFetchError?.message}`)
    }

    // Step 3: Update the payment record
    const { error: paymentUpdateError } = await supabaseAdmin
      .from('payments')
      .update({
        status: paymentStatus,
        transaction_id: paystackData.data.id?.toString(),
        payment_method: paystackData.data.channel,
        completed_at: paymentStatus === 'completed' ? new Date().toISOString() : null,
      })
      .eq('id', payment.id)

    if (paymentUpdateError) {
      throw new Error(`Failed to update payment record: ${paymentUpdateError.message}`)
    }

    // Step 4: Handle subscription based on payment status
    if (payment.subscription_id) {
      if (paymentStatus === 'completed') {
        // Activate the subscription
        const { error: subError } = await supabaseAdmin
          .from('subscriptions')
          .update({ status: 'active' })
          .eq('id', payment.subscription_id)

        if (subError) {
          throw new Error(`Failed to activate subscription: ${subError.message}`)
        }
      } else {
        // Payment failed — mark subscription as expired/cancelled
        const { error: subError } = await supabaseAdmin
          .from('subscriptions')
          .update({ status: 'expired' })
          .eq('id', payment.subscription_id)

        if (subError) {
          throw new Error(`Failed to update subscription status: ${subError.message}`)
        }
      }
    }

    // Step 5: Return response
    return new Response(
      JSON.stringify({
        success: true,
        paymentStatus,
        subscriptionId: payment.subscription_id ?? null,
        bookingId: payment.booking_id ?? null,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('verify-payment error:', error)

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: error instanceof Error && error.message === 'Unauthorized' ? 401 : 400,
      }
    )
  }
})