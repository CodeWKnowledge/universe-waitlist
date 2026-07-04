import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { campaignId, html } = await req.json()

    if (!campaignId || !html) {
      return new Response("Missing campaignId or html", { status: 400, headers: corsHeaders })
    }

    const supabaseAdmin = createClient(
      SUPABASE_URL ?? '',
      SUPABASE_SERVICE_ROLE_KEY ?? ''
    )

    // 1. Fetch Campaign Details
    const { data: campaign, error: campaignError } = await supabaseAdmin
      .from('newsletter_campaigns')
      .select('*')
      .eq('id', campaignId)
      .single()

    if (campaignError || !campaign) throw new Error("Campaign not found")

    // 2. Resolve Target Audience
    let subscribers: any[] = []
    if (campaign.audience_id) {
      // Get subscribers from audience
      const { data: audienceMembers } = await supabaseAdmin
        .from('audience_subscribers')
        .select('subscriber_id')
        .eq('audience_id', campaign.audience_id)
      
      const subscriberIds = audienceMembers.map(m => m.subscriber_id)
      
      if (subscriberIds.length > 0) {
        const { data } = await supabaseAdmin
          .from('subscribers')
          .select('id, email')
          .in('id', subscriberIds)
          .eq('status', 'active')
        subscribers = data || []
      }
    } else {
      // Get all active subscribers
      const { data } = await supabaseAdmin
        .from('subscribers')
        .select('id, email')
        .eq('status', 'active')
      subscribers = data || []
    }

    if (subscribers.length === 0) {
      return new Response(JSON.stringify({ success: true, sentCount: 0, message: "No active subscribers found" }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    // 3. Send via Resend Batch API
    // Resend allows up to 100 emails per batch request
    const BATCH_SIZE = 100
    let totalSent = 0

    for (let i = 0; i < subscribers.length; i += BATCH_SIZE) {
      const batch = subscribers.slice(i, i + BATCH_SIZE)
      
      const fromEmail = Deno.env.get('RESEND_FROM_EMAIL') ?? 'onboarding@resend.dev'
      
      const resendPayload = batch.map(sub => ({
        from: fromEmail.includes('<') ? fromEmail : `UniVerse <${fromEmail}>`,
        to: sub.email,
        subject: campaign.subject,
        html: html.replace('{{unsubscribe_url}}', `${Deno.env.get('PUBLIC_SITE_URL') || 'http://localhost:5173'}/preferences?token=${sub.id}`)
      }))

      const resendRes = await fetch('https://api.resend.com/emails/batch', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(resendPayload)
      })

      if (!resendRes.ok) {
        const errorData = await resendRes.json()
        console.error("Resend Batch Error:", errorData)
        // We continue with other batches even if one fails
      } else {
        const resendData = await resendRes.json()
        totalSent += batch.length
        
        // Log deliveries
        const logEntries = batch.map(sub => ({
          subscriber_id: sub.id,
          campaign_id: campaignId,
          email_type: 'newsletter',
          delivery_status: 'delivered'
        }))
        
        await supabaseAdmin.from('email_logs').insert(logEntries)
      }
    }

    // 4. Update Campaign Status
    await supabaseAdmin
      .from('newsletter_campaigns')
      .update({ status: 'sent' })
      .eq('id', campaignId)

    return new Response(JSON.stringify({ success: true, sentCount: totalSent }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error: any) {
    console.error("Broadcast Error:", error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
