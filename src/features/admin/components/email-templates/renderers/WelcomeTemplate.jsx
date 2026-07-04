import React from 'react';
import BaseEmailLayout from './BaseEmailLayout';

export default function WelcomeTemplate({ data, brandSettings = {}, previewMode = false }) {
  const primary = brandSettings.primary_color || '#6366f1';
  const textColor = brandSettings.text_color || '#1e293b';
  const fontFamily = brandSettings.font_family || "'Inter', sans-serif";

  return (
    <BaseEmailLayout brandSettings={brandSettings} previewMode={previewMode}>
      <div style={{ padding: '64px 40px', background: '#ffffff', textAlign: 'center' }}>
        
        <div style={{ fontSize: '48px', marginBottom: '24px' }}>👋</div>
        
        <h1 style={{
          margin: '0 0 24px 0', fontSize: '32px', fontWeight: '800',
          color: textColor, lineHeight: '1.2', fontFamily, letterSpacing: '-0.5px'
        }}>
          {data.greeting}
        </h1>
        
        <p style={{
          margin: '0 auto 48px auto', maxWidth: '400px', fontSize: '18px', color: '#475569',
          lineHeight: '1.6', fontFamily
        }}>
          {data.introText}
        </p>

        <div style={{ textAlign: 'left', background: '#f8fafc', borderRadius: '16px', padding: '32px', marginBottom: '40px' }}>
          {/* Step 1 */}
          <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%', background: primary, color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', flexShrink: 0
            }}>1</div>
            <div>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '700', color: textColor, fontFamily }}>{data.step1Title}</h3>
              <p style={{ margin: '0', fontSize: '14px', color: '#64748b', lineHeight: '1.5', fontFamily }}>{data.step1Desc}</p>
            </div>
          </div>

          {/* Step 2 */}
          <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%', background: primary, color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', flexShrink: 0
            }}>2</div>
            <div>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '700', color: textColor, fontFamily }}>{data.step2Title}</h3>
              <p style={{ margin: '0', fontSize: '14px', color: '#64748b', lineHeight: '1.5', fontFamily }}>{data.step2Desc}</p>
            </div>
          </div>

          {/* Step 3 */}
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%', background: primary, color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', flexShrink: 0
            }}>3</div>
            <div>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '700', color: textColor, fontFamily }}>{data.step3Title}</h3>
              <p style={{ margin: '0', fontSize: '14px', color: '#64748b', lineHeight: '1.5', fontFamily }}>{data.step3Desc}</p>
            </div>
          </div>
        </div>

        <a href={data.callToActionUrl} style={{
          display: 'inline-block',
          background: primary,
          color: '#ffffff',
          padding: '16px 40px',
          borderRadius: '50px',
          fontWeight: '800',
          fontSize: '16px',
          textDecoration: 'none',
          boxShadow: `0 12px 32px ${primary}66`,
          transition: 'all 0.2s',
          fontFamily,
        }}>
          {data.callToActionText}
        </a>

      </div>
    </BaseEmailLayout>
  );
}
