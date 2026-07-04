import React from 'react';
import ProductLaunchTemplate from './renderers/ProductLaunchTemplate';
import NewsletterTemplate from './renderers/NewsletterTemplate';
import WelcomeTemplate from './renderers/WelcomeTemplate';

import ProductLaunchEditor from './editors/ProductLaunchEditor';
import NewsletterEditor from './editors/NewsletterEditor';
import WelcomeEditor from './editors/WelcomeEditor';

export const TEMPLATE_TYPES = {
  PRODUCT_LAUNCH: 'product_launch',
  NEWSLETTER: 'newsletter',
  WELCOME: 'welcome',
};

export const TEMPLATES = [
  {
    id: TEMPLATE_TYPES.PRODUCT_LAUNCH,
    name: 'Product Launch',
    description: 'A bold, high-impact announcement for new features or products. Features a large hero image and 2-column highlights.',
    icon: '🚀',
    defaultData: {
      heroImage: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=600&auto=format&fit=crop',
      headline: 'Introducing our biggest update yet.',
      subheadline: 'Tune in to see what we have been building.',
      primaryButtonText: 'Learn More',
      primaryButtonUrl: '#',
      feature1Title: 'Lightning Fast',
      feature1Desc: 'Built on a brand new architecture for speed.',
      feature2Title: 'Beautifully Designed',
      feature2Desc: 'A pixel-perfect interface that delights.',
    }
  },
  {
    id: TEMPLATE_TYPES.NEWSLETTER,
    name: 'Editorial Newsletter',
    description: 'A clean, editorial-style layout perfect for weekly updates, blog posts, and community news.',
    icon: '📰',
    defaultData: {
      headerImage: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=600&auto=format&fit=crop',
      issueNumber: 'Issue #42',
      mainTitle: 'Weekly Insights',
      mainArticle: 'Welcome to this week\'s edition. We have a lot of exciting updates to share with you...',
      readMoreText: 'Read full story',
      readMoreUrl: '#',
      sideArticle1Title: 'Industry Trends',
      sideArticle1Desc: 'What to expect in Q4.',
      sideArticle1Image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&h=200&fit=crop',
      sideArticle2Title: 'Community Spotlight',
      sideArticle2Desc: 'Highlighting our top creators.',
      sideArticle2Image: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=300&h=200&fit=crop',
    }
  },
  {
    id: TEMPLATE_TYPES.WELCOME,
    name: 'Welcome & Onboarding',
    description: 'A warm, personalized greeting to new users with clear next steps to get them started.',
    icon: '👋',
    defaultData: {
      greeting: 'Welcome to the platform, {name}!',
      introText: 'We are thrilled to have you here. Here are three quick things you can do to get started right away.',
      step1Title: 'Complete your profile',
      step1Desc: 'Add a photo and bio so people know who you are.',
      step2Title: 'Explore the dashboard',
      step2Desc: 'Check out the new features we just released.',
      step3Title: 'Join the community',
      step3Desc: 'Connect with thousands of other members.',
      callToActionText: 'Go to Dashboard',
      callToActionUrl: '#',
    }
  }
];

export function getTemplateRenderer(type) {
  switch (type) {
    case TEMPLATE_TYPES.PRODUCT_LAUNCH: return ProductLaunchTemplate;
    case TEMPLATE_TYPES.NEWSLETTER: return NewsletterTemplate;
    case TEMPLATE_TYPES.WELCOME: return WelcomeTemplate;
    default: return null;
  }
}

export function getTemplateEditor(type) {
  switch (type) {
    case TEMPLATE_TYPES.PRODUCT_LAUNCH: return ProductLaunchEditor;
    case TEMPLATE_TYPES.NEWSLETTER: return NewsletterEditor;
    case TEMPLATE_TYPES.WELCOME: return WelcomeEditor;
    default: return null;
  }
}
