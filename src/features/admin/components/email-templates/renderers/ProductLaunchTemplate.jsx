import React from 'react';
import BaseEmailLayout from './BaseEmailLayout';

export default function ProductLaunchTemplate({ data, brandSettings = {}, previewMode = false }) {
  const primary = brandSettings.primary_color || '#6366f1';
  const textColor = brandSettings.text_color || '#1e293b';
  const fontFamily = brandSettings.font_family || "'Inter', sans-serif";

  return (
    <BaseEmailLayout brandSettings={brandSettings} previewMode={previewMode}>
      {/* Hero Section */}
      <div style={{
        position: 'relative',
        minHeight: '460px',
        background: `linear-gradient(160deg, #0f172aee 0%, #0f172a99 60%), url(${data.heroImage}) center/cover no-repeat`,
        padding: '80px 40px',
        textAlign: 'center',
        overflow: 'hidden',
        borderBottom: `4px solid ${primary}`
      }}>
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '520px', margin: '0 auto' }}>
          <h1 style={{
            margin: '0 0 24px 0',
            fontSize: '48px',
            fontWeight: '900',
            color: '#ffffff',
            lineHeight: '1.1',
            letterSpacing: '-1.5px',
            fontFamily,
          }}>
            {data.headline}
          </h1>
          {data.subheadline && (
            <p style={{
              margin: '0 0 40px 0',
              fontSize: '20px',
              color: 'rgba(255,255,255,0.85)',
              lineHeight: '1.6',
              fontWeight: '400',
              fontFamily,
            }}>
              {data.subheadline}
            </p>
          )}
          {data.primaryButtonText && (
            <a href={data.primaryButtonUrl} style={{
              display: 'inline-block',
              background: primary,
              color: '#ffffff',
              padding: '16px 40px',
              borderRadius: '50px',
              fontWeight: '800',
              fontSize: '16px',
              textDecoration: 'none',
              letterSpacing: '0.5px',
              boxShadow: `0 12px 32px ${primary}66`,
              transition: 'all 0.2s',
              fontFamily,
            }}>
              {data.primaryButtonText}
            </a>
          )}
        </div>
      </div>

      {/* Two Column Features */}
      <div style={{ padding: '64px 40px', background: '#ffffff' }}>
        <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
          
          {/* Feature 1 */}
          <div style={{ flex: '1 1 200px' }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '16px',
              background: `${primary}15`, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '28px', marginBottom: '24px', color: primary
            }}>
              ⚡
            </div>
            <h3 style={{
              margin: '0 0 12px 0', fontSize: '22px', fontWeight: '800',
              color: textColor, lineHeight: '1.3', fontFamily,
            }}>
              {data.feature1Title}
            </h3>
            <p style={{
              margin: '0', fontSize: '16px', color: '#64748b',
              lineHeight: '1.7', fontFamily,
            }}>
              {data.feature1Desc}
            </p>
          </div>

          {/* Feature 2 */}
          <div style={{ flex: '1 1 200px' }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '16px',
              background: `${primary}15`, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '28px', marginBottom: '24px', color: primary
            }}>
              ✨
            </div>
            <h3 style={{
              margin: '0 0 12px 0', fontSize: '22px', fontWeight: '800',
              color: textColor, lineHeight: '1.3', fontFamily,
            }}>
              {data.feature2Title}
            </h3>
            <p style={{
              margin: '0', fontSize: '16px', color: '#64748b',
              lineHeight: '1.7', fontFamily,
            }}>
              {data.feature2Desc}
            </p>
          </div>

        </div>
      </div>
    </BaseEmailLayout>
  );
}
