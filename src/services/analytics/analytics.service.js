/**
 * Centralized Analytics Tracker.
 * Prepared for PostHog, Google Analytics, and custom Supabase events.
 */
class AnalyticsService {
  constructor() {
    this.isDebug = process.env.NODE_ENV !== "production";
  }

  /**
   * Dispatches a tracking event.
   * @param {string} name - Event name.
   * @param {Object} properties - Custom event attributes.
   */
  track(name, properties = {}) {
    const payload = {
      event: name,
      properties: {
        ...properties,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        referrer: document.referrer
      }
    };

    if (this.isDebug) {
      console.group(`📊 [Analytics Event]: ${name}`);
      console.log("Payload:", payload.properties);
      console.groupEnd();
    }

    // Custom Supabase or PostHog integration hooks go here:
    // if (window.posthog) window.posthog.capture(name, properties);
    // if (window.gtag) window.gtag('event', name, properties);
  }

  trackFeatureViewed(slug, email = null) {
    this.track("Feature Viewed", { slug, email });
  }

  trackFeatureClicked(slug, email = null) {
    this.track("Feature Clicked", { slug, email });
  }

  trackWaitlistJoined(email, university, queuePosition, referralCode) {
    this.track("Waitlist Joined", {
      email,
      university,
      queuePosition,
      referralCode
    });
  }

  trackReferralCopied(email, code) {
    this.track("Referral Link Copied", { email, code });
  }

  trackCtaClicked(ctaName, page = "home") {
    this.track("CTA Clicked", { ctaName, page });
  }

  trackPreviewPageVisited(slug) {
    this.track("Preview Page Visited", { slug });
  }
}

export const analytics = new AnalyticsService();
