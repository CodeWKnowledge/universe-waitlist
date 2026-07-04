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
    // 1. Initialize Supabase Admin Client
    const supabaseAdmin = createClient(
      SUPABASE_URL ?? '',
      SUPABASE_SERVICE_ROLE_KEY ?? ''
    )

    // 2. Fetch Pending Emails from the Queue
    const { data: queueItems, error: queueError } = await supabaseAdmin
      .from('email_queue')
      .select(`
        id,
        status,
        campaign_id,
        template_id,
        newsletter_campaigns (
          subject,
          content
        ),
        email_templates (
          subject,
          html_body
        ),
        subscribers (
          id,
          email,
          first_name
        )
      `)
      .eq('status', 'pending')
      .limit(10) // Process in batches of 10 to avoid timeouts

    if (queueError) throw queueError
    if (!queueItems || queueItems.length === 0) {
      return new Response(JSON.stringify({ message: "No pending emails" }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    const results: any[] = []

    // 3. Process each item
    for (const item of queueItems) {
      const subscriber = item.subscribers
      let subject = "Update from UniVerse";
      let htmlContent = "";

      if (item.campaign_id && item.newsletter_campaigns) {
        subject = item.newsletter_campaigns.subject;
        htmlContent = item.newsletter_campaigns.content || generateEmailContent('campaign', subscriber.first_name);
      } else if (item.template_id && item.email_templates) {
        subject = item.email_templates.subject;
        htmlContent = item.email_templates.html_body || generateEmailContent('default', subscriber.first_name);
      } else {
        htmlContent = generateEmailContent('default', subscriber.first_name);
      }

      // Add unsubscribe link
      const unsubscribeUrl = `${Deno.env.get('PUBLIC_SITE_URL') || 'http://localhost:5173'}/preferences?token=${subscriber.id}`;
      htmlContent += `<br><br><p style="font-size:12px;color:#888;">To manage your email preferences, <a href="${unsubscribeUrl}">click here</a>.</p>`;

      const fromEmail = Deno.env.get('RESEND_FROM_EMAIL') ?? 'onboarding@resend.dev'

      // 4. Send via Resend HTTP API (Deno fetch)
      const resendRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: fromEmail.includes('<') ? fromEmail : `UniVerse <${fromEmail}>`,
          to: subscriber.email,
          subject: subject,
          html: htmlContent
        })
      })

      const resendData = await resendRes.json()

      if (resendRes.ok) {
        // 5. Mark Queue as Completed and Log it
        await supabaseAdmin
          .from('email_queue')
          .update({ status: 'sent', processed_at: new Date().toISOString() })
          .eq('id', item.id)

        await supabaseAdmin
          .from('email_logs')
          .insert([{
            subscriber_id: subscriber.id,
            campaign_id: item.campaign_id,
            email_type: 'newsletter',
            delivery_status: 'delivered'
          }])
          
        results.push({ email: subscriber.email, status: 'success' })
      } else {
        // Handle failure
        await supabaseAdmin
          .from('email_queue')
          .update({ status: 'failed', error_message: JSON.stringify(resendData) })
          .eq('id', item.id)
          
        results.push({ email: subscriber.email, status: 'failed', error: resendData })
      }
    }

    return new Response(JSON.stringify({ processed: results.length, results }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})

// --- Helper Functions ---

function getEmailSubject(type) {
  const subjects = {
    'onboarding_day_3': "Why we built UniVerse",
    'onboarding_day_7': "A sneak peek at the platform",
    'onboarding_day_14': "Development update",
    'onboarding_day_21': "Ready to invite your friends?"
  }
  return subjects[type] || "Update from UniVerse"
}

function generateEmailContent(type, firstName) {
  const contentMap = {
    'onboarding_day_3': `Hey ${firstName || 'there'}, campus commerce is broken. We built UniVerse to fix the chaos of WhatsApp groups and unverified scammers.`,
    'onboarding_day_7': `We are making incredible progress, ${firstName || 'there'}. Take a look at these upcoming marketplace features...`,
    'onboarding_day_14': `It's been two weeks since you joined the waitlist, ${firstName || 'there'}. Here is what our team has accomplished so far...`,
    'onboarding_day_21': `${firstName || 'there'}, the marketplace only works if your friends are here. Use your referral link to earn beta points!`
  }
  
  const bodyText = contentMap[type] || "We have some exciting news for you!"

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Inter', sans-serif; background-color: #f1f5f9; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; padding: 30px; border-radius: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <p>${bodyText}</p>
        <p>Best,<br>The UniVerse Team</p>
      </div>
    </body>
    </html>
  `
}
