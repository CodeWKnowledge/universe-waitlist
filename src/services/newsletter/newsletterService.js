import { queries } from '../../lib/supabase/queries';
import { emailService } from '../email/emailService';

export const newsletterService = {
  subscribeFromWaitlist: async (userData) => {
    try {
      // 1. Check if already subscribed (uses maybeSingle — no 406)
      const { data: existing } = await queries.getSubscriberByEmail(userData.email);
      if (existing) return existing;

      // 2. Insert into subscribers table
      const { data: subscriber, error } = await queries.insertSubscriber({
        email: userData.email,
        first_name: userData.name?.split(' ')[0] || '',
        last_name: userData.name?.split(' ').slice(1).join(' ') || '',
        source: 'waitlist',
        status: 'waitlist',
        tags: userData.university ? [`university:${userData.university}`] : []
      });

      if (error) throw error;

      // 3. Send Welcome Email (fire-and-forget — won't block waitlist success)
      emailService.sendWelcomeEmail(
        userData.email,
        userData.name?.split(' ')[0] || 'there',
        subscriber?.id || ''
      ).catch(err => console.warn('Welcome email failed (non-blocking):', err));

      return subscriber;
    } catch (error) {
      console.error('Newsletter integration failed:', error);
      // Non-blocking: waitlist join still succeeds even if this fails
      return null;
    }
  }
};
