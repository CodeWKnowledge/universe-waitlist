import { supabase } from "./client";
import { TABLES } from "./constants";

export const queries = {
  // --- Subscribers ---
  insertSubscriber: async (subscriberData) => {
    return await supabase
      .from(TABLES.SUBSCRIBERS)
      .insert([subscriberData])
      .select()
      .single(); // OK here — we expect a row back after a fresh insert
  },

  // FIX: Use .maybeSingle() instead of .single()
  // .single() throws a 406 error when NO row is found.
  // .maybeSingle() returns { data: null } cleanly when no row exists.
  getSubscriberByEmail: async (email) => {
    return await supabase
      .from(TABLES.SUBSCRIBERS)
      .select("*")
      .eq("email", email)
      .maybeSingle();
  },

  getSubscriberById: async (id) => {
    return await supabase
      .from(TABLES.SUBSCRIBERS)
      .select("*")
      .eq("id", id)
      .maybeSingle();
  },

  // --- Referral Tracking ---
  insertReferral: async (referralData) => {
    return await supabase
      .from(TABLES.REFERRAL_TRACKING)
      .insert([referralData])
      .select()
      .single();
  },

  getReferralByCode: async (code) => {
    return await supabase
      .from(TABLES.REFERRAL_TRACKING)
      .select("*")
      .eq("referral_code", code)
      .maybeSingle();
  },

  getReferralsForUser: async (userId) => {
    return await supabase
      .from(TABLES.REFERRAL_TRACKING)
      .select("*")
      .eq("referrer_id", userId);
  },

  // --- Email Logs ---
  logEmailEvent: async (logData) => {
    return await supabase
      .from(TABLES.EMAIL_LOGS)
      .insert([logData]);
  },

  // --- Campaigns ---
  getCampaigns: async () => {
    return await supabase
      .from(TABLES.NEWSLETTER_CAMPAIGNS)
      .select("*")
      .order('created_at', { ascending: false });
  },

  // Expose the raw client for advanced usage (e.g. SubscriberList component)
  supabase
};
