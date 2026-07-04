import { Resend } from 'resend';

// Initialize with a fallback to prevent crashing if env var is missing during frontend dev
const resendApiKey = import.meta.env.VITE_RESEND_API_KEY || 'placeholder_key';
export const emailProvider = new Resend(resendApiKey);

export const EMAIL_DEFAULTS = {
  from: 'UniVerse <hello@universe.market>',
  replyTo: 'support@universe.market'
};
