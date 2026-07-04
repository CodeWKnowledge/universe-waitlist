import { queries } from '../../lib/supabase/queries';

export const subscriberService = {
  addSubscriber: async (subscriberData) => {
    try {
      const existing = await queries.getSubscriberByEmail(subscriberData.email);
      if (existing.data) return existing;

      return await queries.insertSubscriber({
        full_name: subscriberData.full_name,
        email: subscriberData.email,
        university: subscriberData.university,
        source: subscriberData.source || 'direct',
        status: 'active'
      });
    } catch (error) {
      console.error('Subscriber Service Error:', error);
      throw error;
    }
  }
};
