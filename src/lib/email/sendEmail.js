import { emailProvider, EMAIL_DEFAULTS } from './provider';

/**
 * Sends an email using the configured provider.
 * @param {Object} options 
 * @param {string} options.to
 * @param {string} options.subject
 * @param {string} options.html
 * @returns {Promise<{success: boolean, data?: any, error?: any}>}
 */
export async function sendEmail({ to, subject, html }) {
  try {
    // In a real frontend environment, we typically don't send emails directly via Resend to avoid exposing the API key.
    // However, to satisfy the architectural requirement for the swappable provider logic:
    if (import.meta.env.VITE_RESEND_API_KEY) {
       const data = await emailProvider.emails.send({
        from: EMAIL_DEFAULTS.from,
        to,
        subject,
        html,
        reply_to: EMAIL_DEFAULTS.replyTo
      });
      return { success: true, data };
    } else {
      console.log(`[Email Mock] Sent to ${to}: ${subject}`);
      return { success: true, data: { mock: true } };
    }
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error };
  }
}
