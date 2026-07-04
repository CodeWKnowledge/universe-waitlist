import React from 'react';
import BaseEmailLayout from './BaseEmailLayout';

export default function NewsletterTemplate({ data, brandSettings = {}, previewMode = false }) {
  const primary = brandSettings.primary_color || '#6366f1';
  const textColor = brandSettings.text_color || '#1e293b';
  const fontFamily = brandSettings.font_family || "'Inter', sans-serif";

  return (
    <BaseEmailLayout brandSettings={brandSettings} previewMode={previewMode}>
      {/* Header Image */}
      <img src={data.headerImage} alt="Newsletter Header" style={{
        width: '100%', height: '240px', objectFit: 'cover', display: 'block'
      }} />

      {/* Main Content */}
      <div style={{ padding: '48px 40px', background: '#ffffff' }}>
        <div style={{
          display: 'inline-block', marginBottom: '16px',
          color: primary, fontWeight: '700', fontSize: '13px',
          textTransform: 'uppercase', letterSpacing: '1px',
          borderBottom: `2px solid ${primary}`, paddingBottom: '4px'
        }}>
          {data.issueNumber}
        </div>
        
        <h1 style={{
          margin: '0 0 24px 0', fontSize: '36px', fontWeight: '800',
          color: textColor, lineHeight: '1.2', fontFamily, letterSpacing: '-1px'
        }}>
          {data.mainTitle}
        </h1>
        
        <p style={{
          margin: '0 0 32px 0', fontSize: '17px', color: '#475569',
          lineHeight: '1.7', fontFamily, whiteSpace: 'pre-wrap'
        }}>
          {data.mainArticle}
        </p>

        {data.readMoreText && (
          <a href={data.readMoreUrl} style={{
            display: 'inline-block', color: primary, fontWeight: '700',
            fontSize: '16px', textDecoration: 'none', fontFamily
          }}>
            {data.readMoreText} →
          </a>
        )}
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '0 40px' }} />

      {/* Side Articles */}
      <div style={{ padding: '48px 40px', background: '#f8fafc' }}>
        <h2 style={{
          margin: '0 0 32px 0', fontSize: '20px', fontWeight: '800',
          color: textColor, fontFamily, textTransform: 'uppercase', letterSpacing: '0.5px'
        }}>
          Also in this issue
        </h2>

        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          {/* Article 1 */}
          <div style={{ flex: '1 1 200px', background: '#ffffff', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
            <img src={data.sideArticle1Image} alt="" style={{ width: '100%', height: '140px', objectFit: 'cover', display: 'block' }} />
            <div style={{ padding: '20px' }}>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '700', color: textColor, fontFamily }}>
                {data.sideArticle1Title}
              </h3>
              <p style={{ margin: '0', fontSize: '14px', color: '#64748b', lineHeight: '1.6', fontFamily }}>
                {data.sideArticle1Desc}
              </p>
            </div>
          </div>

          {/* Article 2 */}
          <div style={{ flex: '1 1 200px', background: '#ffffff', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
            <img src={data.sideArticle2Image} alt="" style={{ width: '100%', height: '140px', objectFit: 'cover', display: 'block' }} />
            <div style={{ padding: '20px' }}>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '700', color: textColor, fontFamily }}>
                {data.sideArticle2Title}
              </h3>
              <p style={{ margin: '0', fontSize: '14px', color: '#64748b', lineHeight: '1.6', fontFamily }}>
                {data.sideArticle2Desc}
              </p>
            </div>
          </div>
        </div>
      </div>
    </BaseEmailLayout>
  );
}
