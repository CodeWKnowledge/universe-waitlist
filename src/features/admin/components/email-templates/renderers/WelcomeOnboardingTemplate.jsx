import React from 'react';
import BaseEmailLayout from './BaseEmailLayout';

// SVG Icon components — no emojis
const IconStar = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);
const IconUsers = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const IconZap = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);

export default function WelcomeOnboardingTemplate({ data, brandSettings = {}, previewMode = false }) {
  const primary = brandSettings.primary_color || '#00D084';
  const secondary = brandSettings.secondary_color || '#0a0f1d';
  const fontFamily = brandSettings.font_family || "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif";
  const textDark = '#0f172a';
  const textMid = '#475569';
  const textLight = '#94a3b8';
  const bgPage = '#f8fafc';

  const featureCards = [
    { icon: <IconStar />, title: data.feature1Title || 'You\'re on the list', desc: data.feature1Desc || 'You\'ve secured your spot. We\'ll keep you updated every step of the way.' },
    { icon: <IconUsers />, title: data.feature2Title || 'Built for students', desc: data.feature2Desc || 'A marketplace built entirely around your university life and community.' },
    { icon: <IconZap />, title: data.feature3Title || 'Early access perks', desc: data.feature3Desc || 'The earlier you are, the more rewards you unlock when we launch.' },
  ];

  return (
    <BaseEmailLayout brandSettings={brandSettings} previewMode={previewMode}>
      {/* Hero */}
      <div style={{ background: secondary, padding: '56px 40px 48px', textAlign: 'center' }}>
        <div style={{
          display: 'inline-block',
          background: `${primary}18`,
          border: `1px solid ${primary}40`,
          borderRadius: '100px',
          padding: '6px 16px',
          marginBottom: '28px',
        }}>
          <span style={{ fontSize: '12px', fontWeight: '700', color: primary, letterSpacing: '1.5px', textTransform: 'uppercase', fontFamily }}>
            {data.badgeText || 'You\'re In'}
          </span>
        </div>

        <h1 style={{
          margin: '0 0 20px 0', fontSize: '36px', fontWeight: '800',
          color: '#ffffff', lineHeight: '1.15', fontFamily, letterSpacing: '-0.5px'
        }}>
          {data.headline || 'Welcome to UniVerse.'}
        </h1>

        <p style={{
          margin: '0 auto 36px auto', maxWidth: '420px', fontSize: '17px',
          color: 'rgba(255,255,255,0.65)', lineHeight: '1.7', fontFamily
        }}>
          {data.subheadline || "You're one of the first people to join. We're building something big for university students — and you're at the center of it."}
        </p>

        {/* Position badge */}
        <div style={{
          display: 'inline-block', background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px',
          padding: '20px 40px', marginBottom: '36px'
        }}>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', fontFamily, marginBottom: '6px', letterSpacing: '0.5px' }}>YOUR WAITLIST POSITION</div>
          <div style={{ fontSize: '48px', fontWeight: '900', color: primary, fontFamily, lineHeight: 1 }}>{data.waitlistPosition || '#247'}</div>
        </div>

        <div style={{ display: 'block' }}>
          <a href={data.ctaUrl || '#'} style={{
            display: 'inline-block', background: primary, color: secondary,
            padding: '16px 40px', borderRadius: '50px', fontWeight: '800',
            fontSize: '16px', textDecoration: 'none', fontFamily, letterSpacing: '-0.2px'
          }}>
            {data.ctaText || 'View Your Dashboard'}
          </a>
        </div>
      </div>

      {/* Feature cards */}
      <div style={{ background: bgPage, padding: '48px 40px' }}>
        <h2 style={{ margin: '0 0 8px 0', fontSize: '22px', fontWeight: '800', color: textDark, fontFamily, textAlign: 'center' }}>
          {data.cardsHeadline || "Here's what to expect"}
        </h2>
        <p style={{ margin: '0 auto 32px', maxWidth: '400px', fontSize: '15px', color: textMid, lineHeight: '1.6', fontFamily, textAlign: 'center' }}>
          {data.cardsSubheadline || "We're heads-down building. Here's what's coming your way."}
        </p>

        {featureCards.map((card, i) => (
          <div key={i} style={{
            background: '#ffffff', borderRadius: '14px', padding: '24px',
            marginBottom: i < featureCards.length - 1 ? '12px' : '0',
            display: 'flex', gap: '16px', alignItems: 'flex-start',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '12px',
              background: `${primary}18`, color: primary,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
              {card.icon}
            </div>
            <div>
              <h3 style={{ margin: '0 0 6px', fontSize: '16px', fontWeight: '700', color: textDark, fontFamily }}>{card.title}</h3>
              <p style={{ margin: 0, fontSize: '14px', color: textMid, lineHeight: '1.6', fontFamily }}>{card.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Divider CTA */}
      <div style={{ background: '#ffffff', padding: '48px 40px', textAlign: 'center', borderTop: '1px solid #f1f5f9' }}>
        <p style={{ margin: '0 auto 24px', maxWidth: '380px', fontSize: '15px', color: textMid, lineHeight: '1.7', fontFamily }}>
          {data.closingText || "We'll be sending you exclusive updates as we build. Stay close — early access drops first for waitlist members."}
        </p>
        <div style={{ fontSize: '14px', color: textLight, fontFamily }}>
          — {data.signatureName || 'The UniVerse Team'}
        </div>
      </div>
    </BaseEmailLayout>
  );
}
