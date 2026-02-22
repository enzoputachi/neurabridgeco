import "@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { createHmac } from 'https://deno.land/std@0.177.0/node/crypto.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Verify the request genuinely came from Paystack
function verifyPaystackSignature(body: string, signature: string): boolean {
  const secret = Deno.env.get('PAYSTACK_SECRET_KEY') ?? ''
  const hash = createHmac('sha512', secret).update(body).digest('hex')
  return hash === signature
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  // Paystack sends POST only
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  try {
    const rawBody = await req.text()

    // Step 1: Verify webhook signature
    const signature = req.headers.get('x-paystack-signature') ?? ''
    if (!verifyPaystackSignature(rawBody, signature)) {
      console.error('Invalid Paystack webhook signature')
      return new Response('Unauthorized', { status: 401 })
    }

    const event = JSON.parse(rawBody)
    console.log('Paystack webhook event:', event.event)

    // Service role client — no user session in webhooks
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Step 2: Route by event type
    switch (event.event) {

      case 'charge.success': {
        await handleChargeSuccess(supabaseAdmin, event.data)
        break
      }

      case 'charge.failed': {
        await handleChargeFailed(supabaseAdmin, event.data)
        break
      }

      case 'refund.processed': {
        await handleRefund(supabaseAdmin, event.data)
        break
      }

      default:
        // Acknowledge events we don't handle so Paystack doesn't retry
        console.log(`Unhandled event type: ${event.event}`)
    }

    // Always return 200 quickly — Paystack will retry on non-2xx
    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error('Webhook error:', error)

    // Still return 200 to prevent Paystack from retrying a broken payload
    return new Response(
      JSON.stringify({ received: true, error: 'Internal processing error' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  }
})

// ─── Handlers ────────────────────────────────────────────────────────────────

async function handleChargeSuccess(supabase: ReturnType<typeof createClient>, data: any) {
  const reference = data.reference

  // 1. Find the payment record
  const { data: payment, error: fetchError } = await supabase
    .from('payments')
    .select('id, subscription_id, booking_id, status')
    .eq('paystack_reference', reference)
    .single()

  if (fetchError || !payment) {
    throw new Error(`Payment not found for reference ${reference}: ${fetchError?.message}`)
  }

  // Guard: skip if already processed (idempotency)
  if (payment.status === 'completed') {
    console.log(`Payment ${reference} already completed, skipping.`)
    return
  }

  // 2. Update payment to completed
  const { error: paymentUpdateError } = await supabase
    .from('payments')
    .update({
      status: 'completed',
      transaction_id: data.id?.toString(),
      payment_method: data.channel,
      completed_at: new Date().toISOString(),
    })
    .eq('id', payment.id)

  if (paymentUpdateError) {
    throw new Error(`Failed to update payment: ${paymentUpdateError.message}`)
  }

  // 3. Activate subscription if this payment is for one
  if (payment.subscription_id) {
    const { error: subError } = await supabase
      .from('subscriptions')
      .update({ status: 'active' })
      .eq('id', payment.subscription_id)

    if (subError) {
      throw new Error(`Failed to activate subscription: ${subError.message}`)
    }

    console.log(`Subscription ${payment.subscription_id} activated.`)
  }

  // 4. Handle booking payment if applicable
  if (payment.booking_id) {
    const { error: bookingError } = await supabase
      .from('bookings')
      .update({ status: 'confirmed' })  // adjust to your booking status enum
      .eq('id', payment.booking_id)

    if (bookingError) {
      throw new Error(`Failed to confirm booking: ${bookingError.message}`)
    }

    console.log(`Booking ${payment.booking_id} confirmed.`)
  }
}

async function handleChargeFailed(supabase: ReturnType<typeof createClient>, data: any) {
  const reference = data.reference

  const { data: payment, error: fetchError } = await supabase
    .from('payments')
    .select('id, subscription_id, booking_id, status')
    .eq('paystack_reference', reference)
    .single()

  if (fetchError || !payment) {
    throw new Error(`Payment not found for reference ${reference}: ${fetchError?.message}`)
  }

  if (payment.status === 'failed') {
    console.log(`Payment ${reference} already marked failed, skipping.`)
    return
  }

  // Mark payment failed
  const { error: paymentUpdateError } = await supabase
    .from('payments')
    .update({ status: 'failed' })
    .eq('id', payment.id)

  if (paymentUpdateError) {
    throw new Error(`Failed to update payment: ${paymentUpdateError.message}`)
  }

  // Mark subscription as expired if one was linked
  if (payment.subscription_id) {
    const { error: subError } = await supabase
      .from('subscriptions')
      .update({ status: 'expired' })  // adjust to your subscription_status enum
      .eq('id', payment.subscription_id)

    if (subError) {
      throw new Error(`Failed to expire subscription: ${subError.message}`)
    }
  }

  // Mark booking as cancelled if one was linked
  if (payment.booking_id) {
    const { error: bookingError } = await supabase
      .from('bookings')
      .update({ status: 'cancelled' })  // adjust to your booking status enum
      .eq('id', payment.booking_id)

    if (bookingError) {
      throw new Error(`Failed to cancel booking: ${bookingError.message}`)
    }
  }
}

async function handleRefund(supabase: ReturnType<typeof createClient>, data: any) {
  const reference = data.transaction_reference ?? data.reference

  const { error } = await supabase
    .from('payments')
    .update({ status: 'refunded' })
    .eq('paystack_reference', reference)

  if (error) {
    throw new Error(`Failed to mark payment as refunded: ${error.message}`)
  }

  console.log(`Payment ${reference} marked as refunded.`)
}