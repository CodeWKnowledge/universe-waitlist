import React from 'react';

export default function BaseEmailLayout({ brandSettings = {}, previewMode = false, children }) {
  const primary = brandSettings.primary_color || '#6366f1';
  const secondary = brandSettings.secondary_color || '#0f172a';
  const bgColor = brandSettings.bg_color || '#f1f5f9';
  const fontFamily = brandSettings.font_family || "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif";
  const companyName = brandSettings.company_name || 'Brand';

  // ── Header ──────────────────────────────────────────────────────────────
  const header = (
    <div style={{
      background: secondary,
      padding: '24px 40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: `3px solid ${primary}`,
    }}>
      {brandSettings.logo_url ? (
        <img src={brandSettings.logo_url} alt={companyName} style={{ height: '32px' }} />
      ) : (
        <div style={{ fontSize: '20px', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.5px', fontFamily }}>{companyName}</div>
      )}
    </div>
  );

  // ── Footer ──────────────────────────────────────────────────────────────
  const footer = (
    <div style={{
      background: secondary,
      padding: '48px 40px',
      textAlign: 'center',
      fontFamily,
    }}>
      <div style={{ marginBottom: '24px' }}>
        {brandSettings.logo_url ? (
          <img src={brandSettings.logo_url} alt={companyName} style={{ height: '32px', margin: '0 auto', display: 'block', opacity: 0.8 }} />
        ) : (
          <div style={{ fontSize: '20px', fontWeight: '800', color: '#ffffff', opacity: 0.8, letterSpacing: '-0.5px' }}>{companyName}</div>
        )}
      </div>

      {brandSettings.social_links && (
        <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'center', gap: '12px' }}>
          {brandSettings.social_links.twitter && (
            <a href={brandSettings.social_links.twitter} style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: '40px', height: '40px', borderRadius: '50%',
              background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontWeight: '700', fontSize: '16px', border: '1px solid rgba(255,255,255,0.1)'
            }}>𝕏</a>
          )}
          {brandSettings.social_links.linkedin && (
            <a href={brandSettings.social_links.linkedin} style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: '40px', height: '40px', borderRadius: '50%',
              background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontWeight: '700', fontSize: '16px', border: '1px solid rgba(255,255,255,0.1)'
            }}>in</a>
          )}
          {brandSettings.social_links.instagram && (
            <a href={brandSettings.social_links.instagram} style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: '40px', height: '40px', borderRadius: '50%',
              background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontWeight: '700', fontSize: '16px', border: '1px solid rgba(255,255,255,0.1)'
            }}>📷</a>
          )}
        </div>
      )}

      <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: 'rgba(255,255,255,0.4)', lineHeight: '1.6' }}>
        {brandSettings.footer_text || `© ${new Date().getFullYear()} ${companyName}. All rights reserved.`}
      </p>
      {brandSettings.address && (
        <p style={{ margin: '0 0 16px 0', fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>{brandSettings.address}</p>
      )}
      <a href="{{unsubscribe_url}}" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', textDecoration: 'underline' }}>
        Unsubscribe
      </a>
    </div>
  );

  return (
    <div style={{
      backgroundColor: bgColor,
      minHeight: previewMode ? 'auto' : '100%',
      padding: previewMode ? '0' : '40px 0',
      fontFamily,
    }}>
      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
        backgroundColor: '#ffffff',
        borderRadius: previewMode ? '16px' : '0',
        overflow: 'hidden',
        boxShadow: previewMode ? '0 20px 80px rgba(0,0,0,0.1)' : 'none',
      }}>
        {header}
        <div style={{ backgroundColor: '#ffffff' }}>
          {children}
        </div>
        {footer}
      </div>
    </div>
  );
}
