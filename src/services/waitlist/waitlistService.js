import { supabase } from '../../lib/supabase/client';
import { queries } from '../../lib/supabase/queries';
import { referralService } from '../users/referralService';
import { emailService } from '../email/emailService';

const DAY_MS = 24 * 60 * 60 * 1000;

export const waitlistService = {
  joinWaitlist: async (data) => {
    try {
      const email = data.email.trim().toLowerCase();
      const names = data.name.trim().split(' ');
      const firstName = names[0];
      const lastName = names.slice(1).join(' ');

      // 1. Check if email already exists (maybeSingle — no 406 error)
      const { data: existing } = await queries.getSubscriberByEmail(email);

      if (existing) {
        // --- DUPLICATE EMAIL: compute their original queue position ---
        const { count } = await supabase
          .from('subscribers')
          .select('*', { count: 'exact', head: true })
          .lte('created_at', existing.created_at);

        const position = count || 1;
        const { data: existingReferral } = await queries.getReferralByCode(existing.id);

        return {
          ...existing,
          queue_position: position,
          referral_code: existingReferral?.referral_code,
          already_joined: true
        };
      }

      // 2. Handle incoming referral (if user came via someone's link)
      if (data.referralCode) {
        await referralService.trackConversion(data.referralCode, email);
      }

      // 3. Insert the new subscriber
      const { data: newUser, error } = await queries.insertSubscriber({
        email,
        first_name: firstName,
        last_name: lastName,
        source: 'waitlist',
        status: 'waitlist',
        tags: [
          `university:${data.university}`,
          `role:${data.role}`
        ]
      });

      if (error) throw error;

      // 4. Compute queue position
      const { count } = await supabase
        .from('subscribers')
        .select('*', { count: 'exact', head: true });

      const queuePosition = count || 1;

      // 5. Generate a unique referral code for this user
      const { data: referralData } = await referralService.createReferralCode(newUser.id, 'UNI');

      // 6. Dynamic Sequence Enrollment
      // Fetch any active sequences triggered by 'waitlist_join'
      const { data: sequences } = await supabase
        .from('email_sequences')
        .select(`
          id,
          sequence_steps(
            id,
            delay_days,
            template_id,
            email_type
          )
        `)
        .eq('trigger_event', 'waitlist_join')
        .eq('status', 'active');

      if (sequences && sequences.length > 0) {
        const now = Date.now();
        const queueEntries = [];
        const subscriberEntries = [];

        sequences.forEach(seq => {
          subscriberEntries.push({
            sequence_id: seq.id,
            subscriber_id: newUser.id,
            status: 'active'
          });

          if (seq.sequence_steps) {
            seq.sequence_steps.forEach(step => {
              queueEntries.push({
                subscriber_id: newUser.id,
                email_type: step.email_type || 'sequence_step',
                template_id: step.template_id,
                scheduled_for: new Date(now + (step.delay_days || 0) * DAY_MS).toISOString(),
                status: 'pending'
              });
            });
          }
        });

        // Fire-and-forget inserts
        if (subscriberEntries.length > 0) {
          supabase.from('sequence_subscribers').insert(subscriberEntries)
            .catch(err => console.warn('[Sequence] Failed to enroll subscriber:', err));
        }
        if (queueEntries.length > 0) {
          supabase.from('email_queue').insert(queueEntries)
            .catch(err => console.warn('[Queue] Failed to queue sequence steps:', err));
        }
      }

      return {
        ...newUser,
        queue_position: queuePosition,
        referral_code: referralData?.referral_code,
        already_joined: false
      };
    } catch (error) {
      console.error('Waitlist Service Error:', error);
      throw error;
    }
  }
};
