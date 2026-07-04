import { queries } from '../../lib/supabase/queries';

export const referralService = {
  createReferralCode: async (userId, customPrefix = 'UNI') => {
    const code = `${customPrefix}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    return await queries.insertReferral({
      referrer_id: userId,
      referral_code: code
    });
  },

  trackConversion: async (referralCode, newSubscriberEmail) => {
    // If a waitlist user joins via a code, log the conversion.
    const { data: referral } = await queries.getReferralByCode(referralCode);
    if (!referral) return null;

    // We'll update the tracking record to show it converted.
    // Assuming Supabase RLS allows us to do this or via an RPC.
    // This is a placeholder for the actual update.
    return referral;
  }
};
