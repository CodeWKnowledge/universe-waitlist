import { queries } from '../../lib/supabase/queries';
import { emailService } from './emailService';

export const campaignService = {
  createDraft: async ({ title, subject, content, blocks = [], segmentTags = [], audienceId = null, segmentId = null }) => {
    return await queries.supabase
      .from('newsletter_campaigns')
      .insert([{
        title,
        subject,
        content,
        blocks,
        segment_tags: segmentTags,
        audience_id: audienceId,
        segment_id: segmentId,
        status: 'draft'
      }])
      .select()
      .single();
  },

  updateCampaign: async (campaignId, updates) => {
    return await queries.supabase
      .from('newsletter_campaigns')
      .update(updates)
      .eq('id', campaignId)
      .select()
      .single();
  },

  scheduleCampaign: async (campaignId, scheduleDate) => {
    return await queries.supabase
      .from('newsletter_campaigns')
      .update({
        status: 'scheduled',
        schedule_date: scheduleDate
      })
      .eq('id', campaignId);
  },

  sendBroadcast: async (campaignId) => {
    // 1. Fetch Campaign
    const { data: campaign, error: campErr } = await queries.supabase
      .from('newsletter_campaigns')
      .select('*')
      .eq('id', campaignId)
      .single();

    if (campErr) throw campErr;

    // 2. Fetch target subscribers
    let query = queries.supabase.from('subscribers').select('id, email, first_name');
    
    if (campaign.audience_id) {
      const { data: audSubs } = await queries.supabase
        .from('audience_subscribers')
        .select('subscriber_id')
        .eq('audience_id', campaign.audience_id);
      
      const ids = audSubs.map(s => s.subscriber_id);
      if (ids.length > 0) {
         query = query.in('id', ids);
      } else {
         throw new Error("No subscribers found in target audience.");
      }
    }

    const { data: subscribers, error: subErr } = await query;
    if (subErr) throw subErr;
    if (!subscribers || subscribers.length === 0) throw new Error("No subscribers found to send to.");

    // Update status to processing
    await queries.supabase.from('newsletter_campaigns').update({ status: 'processing' }).eq('id', campaignId);

    // 3. Queue emails
    const queueJobs = subscribers.map(sub => ({
      campaign_id: campaignId,
      subscriber_id: sub.id,
      status: 'pending'
    }));

    const { error: queueErr } = await queries.supabase.from('email_queue').insert(queueJobs);
    if (queueErr) throw queueErr;

    // 4. Log events (Initially marked as pending delivery)
    const logs = subscribers.map(sub => ({
      subscriber_id: sub.id,
      campaign_id: campaignId,
      email_type: 'newsletter',
      delivery_status: 'pending' 
    }));

    await queries.supabase.from('email_logs').insert(logs);

    return { success: true, count: subscribers.length };
  }
};
