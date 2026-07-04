import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { to, subject, html } = await req.json()

    if (!to || !subject || !html) {
      return new Response("Missing required fields", { status: 400, headers: corsHeaders })
    }

    const fromEmail = Deno.env.get('RESEND_FROM_EMAIL') ?? 'onboarding@resend.dev'

    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: fromEmail.includes('<') ? fromEmail : `UniVerse <${fromEmail}>`,
        to: to,
        subject: subject,
        html: html
      })
    })

    const resendData = await resendRes.json()

    if (!resendRes.ok) {
      console.error("Resend API Error:", resendData)
      return new Response(JSON.stringify({ error: resendData }), {
        status: 400, // Map upstream errors to 400 Bad Request to avoid confusing 403s
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify({ success: true, data: resendData }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error: any) {
    console.error("Send Email Error:", error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
