import { queries } from '../../lib/supabase/queries';

export const subscriberService = {
  addSubscriber: async (subscriberData) => {
    try {
      const { email, firstName, lastName, source, tags = [] } = subscriberData;
      
      const existing = await queries.getSubscriberByEmail(email);
      if (existing.data) return existing;

      return await queries.insertSubscriber({
        email,
        first_name: firstName,
        last_name: lastName,
        source: source || 'direct',
        status: 'waitlist',
        tags
      });
    } catch (error) {
      console.error('Subscriber Service Error:', error);
      throw error;
    }
  },

  getSubscriber: async (email) => {
    return await queries.getSubscriberByEmail(email);
  }
};
