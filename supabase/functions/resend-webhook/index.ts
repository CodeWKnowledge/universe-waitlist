import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4"

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
const RESEND_WEBHOOK_SECRET = Deno.env.get('RESEND_WEBHOOK_SECRET')

serve(async (req) => {
  try {
    // 1. In a production environment, you should verify the webhook signature here
    // using the RESEND_WEBHOOK_SECRET. For simplicity in this beta, we'll process the payload.

    const payload = await req.json()
    const { type, data } = payload

    if (!data || !data.email_id) {
      return new Response("Invalid payload", { status: 400 })
    }

    const supabaseAdmin = createClient(
      SUPABASE_URL ?? '',
      SUPABASE_SERVICE_ROLE_KEY ?? ''
    )

    // The data.to array contains the recipient email. We use it to find the subscriber.
    const recipientEmail = data.to[0]
    
    // First, try to resolve the subscriber
    const { data: subscriber } = await supabaseAdmin
      .from('subscribers')
      .select('id')
      .eq('email', recipientEmail)
      .single()

    if (!subscriber) {
      console.log(`Subscriber not found for email: ${recipientEmail}`)
      return new Response("Subscriber not found, but webhook processed", { status: 200 })
    }

    // Process the event
    switch (type) {
      case 'email.opened':
        await supabaseAdmin
          .from('email_logs')
          .update({ opened: true })
          .eq('subscriber_id', subscriber.id)
          // Ideally we match on a campaign_id passed via tags, but here we just update all or the most recent
        break;

      case 'email.clicked':
        await supabaseAdmin
          .from('email_logs')
          .update({ clicked: true, opened: true }) // Clicking implies opening
          .eq('subscriber_id', subscriber.id)
        break;

      case 'email.bounced':
      case 'email.complained':
        // Mark the subscriber as bounced or complained so we don't send to them again
        await supabaseAdmin
          .from('subscribers')
          .update({ status: type === 'email.bounced' ? 'bounced' : 'unsubscribed' })
          .eq('id', subscriber.id)
        
        await supabaseAdmin
          .from('email_logs')
          .update({ delivery_status: 'failed' })
          .eq('subscriber_id', subscriber.id)
        break;
        
      case 'email.delivered':
        await supabaseAdmin
          .from('email_logs')
          .update({ delivery_status: 'delivered' })
          .eq('subscriber_id', subscriber.id)
        break;
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error: any) {
    console.error("Webhook Error:", error)
    return new Response(`Error: ${error.message}`, { status: 500 })
  }
})
