import { render } from '@react-email/render';
import React from 'react';
import WelcomeEmail from '../../lib/email/react-templates/WelcomeEmail';
import { OnboardingEmail } from '../../lib/email/react-templates/OnboardingSequence';
import { supabase } from '../../lib/supabase/client';


/**
 * All email sending is routed through the `send-email` Supabase Edge Function.
 * This avoids CORS issues (Resend blocks direct browser calls) and keeps the
 * RESEND_API_KEY safely server-side only.
 */
export const emailService = {

  /**
   * Core send method — renders a React Email component to HTML and dispatches
   * it via the secure send-email Edge Function.
   */
  sendReactEmail: async ({ to, subject, Component, props }) => {
    try {
      const html = await render(React.createElement(Component, props));

      const { data, error } = await supabase.functions.invoke('send-email', {
        body: { to, subject, html }
      });

      if (error) {
        console.error('[Email] Edge Function invocation error:', error);
        return { success: false, error };
      }

      return { success: true, data };
    } catch (error) {
      console.error('[Email] Render or send error:', error);
      return { success: false, error };
    }
  },

  sendWelcomeEmail: async (email, firstName, referralCode, subscriberId, waitlistPosition, totalSignups) => {
    const unsubscribeUrl = `${window.location.origin}/preferences?token=${subscriberId}`;
    return await emailService.sendReactEmail({
      to: email,
      subject: `You're #${waitlistPosition || '...'} on the Universe waitlist`,
      Component: WelcomeEmail,
      props: {
        firstName,
        referralLink: `${window.location.origin}?ref=${referralCode}`,
        unsubscribeUrl,
        waitlistPosition,
        totalSignups,
      }
    });
  },

  sendOnboardingSequence: async (email, firstName, day, subscriberId) => {
    const subjects = {
      3: 'Why we built UniVerse',
      7: 'A sneak peek at the platform',
      14: 'Development update',
      21: 'Ready to invite your friends?'
    };

    const unsubscribeUrl = `${window.location.origin}/preferences?token=${subscriberId}`;

    return await emailService.sendReactEmail({
      to: email,
      subject: subjects[day] || 'Update from UniVerse',
      Component: OnboardingEmail,
      props: { firstName, day, unsubscribeUrl }
    });
  },

};
