import React, { useState, useEffect } from 'react';
import { useBrandSettings } from '../../../hooks/useBrandSettings';
import { HugeiconsIcon } from '@hugeicons/react';
import { PaintBoardIcon, LinkSquare02Icon } from '@hugeicons/core-free-icons';

export default function BrandSettingsPage() {
  const { brandSettings, loading, updateBrandSettings } = useBrandSettings();
  const [formData, setFormData] = useState({
    company_name: '',
    logo_url: '',
    primary_color: '#00D084',
    secondary_color: '#050810',
    text_color: '#1e293b',
    bg_color: '#f8fafc',
    font_family: 'Inter, sans-serif',
    social_links: { twitter: '', linkedin: '', instagram: '' },
    footer_text: '',
    contact_email: '',
    address: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (brandSettings) {
      setFormData({
        id: brandSettings.id,
        company_name: brandSettings.company_name || '',
        logo_url: brandSettings.logo_url || '',
        primary_color: brandSettings.primary_color || '#00D084',
        secondary_color: brandSettings.secondary_color || '#050810',
        text_color: brandSettings.text_color || '#1e293b',
        bg_color: brandSettings.bg_color || '#f8fafc',
        font_family: brandSettings.font_family || 'Inter, sans-serif',
        social_links: brandSettings.social_links || { twitter: '', linkedin: '', instagram: '' },
        footer_text: brandSettings.footer_text || '',
        contact_email: brandSettings.contact_email || '',
        address: brandSettings.address || ''
      });
    }
  }, [brandSettings]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateBrandSettings(formData);
      alert('Brand settings saved successfully!');
    } catch (err) {
      alert(`Error saving brand settings: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading brand settings...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Brand Identity</h2>
          <p className="text-sm text-slate-500">Define global brand settings used across your email templates.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2 bg-[#00D084] hover:bg-[#00C16A] text-[#030712] rounded-xl text-sm font-bold transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Core Identity */}
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 space-y-4">
          <h3 className="font-bold text-white border-b border-white/5 pb-3 flex items-center gap-2">
            <HugeiconsIcon icon={PaintBoardIcon} size={18} />
            Core Identity
          </h3>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Company Name</label>
            <input
              type="text" value={formData.company_name} onChange={e => setFormData({ ...formData, company_name: e.target.value })}
              className="w-full px-4 py-2.5 bg-black/20 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#00D084]"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Logo URL</label>
            <input
              type="text" value={formData.logo_url} onChange={e => setFormData({ ...formData, logo_url: e.target.value })}
              className="w-full px-4 py-2.5 bg-black/20 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#00D084]"
              placeholder="https://yourwebsite.com/logo.png"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Primary Color</label>
              <div className="flex items-center gap-2">
                <input type="color" value={formData.primary_color} onChange={e => setFormData({ ...formData, primary_color: e.target.value })} className="w-8 h-8 bg-transparent border-0 p-0 cursor-pointer rounded" />
                <input type="text" value={formData.primary_color} onChange={e => setFormData({ ...formData, primary_color: e.target.value })} className="w-full px-2 py-1 bg-black/20 border border-white/10 rounded text-xs text-white uppercase" />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Secondary Color</label>
              <div className="flex items-center gap-2">
                <input type="color" value={formData.secondary_color} onChange={e => setFormData({ ...formData, secondary_color: e.target.value })} className="w-8 h-8 bg-transparent border-0 p-0 cursor-pointer rounded" />
                <input type="text" value={formData.secondary_color} onChange={e => setFormData({ ...formData, secondary_color: e.target.value })} className="w-full px-2 py-1 bg-black/20 border border-white/10 rounded text-xs text-white uppercase" />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Text Color</label>
              <div className="flex items-center gap-2">
                <input type="color" value={formData.text_color} onChange={e => setFormData({ ...formData, text_color: e.target.value })} className="w-8 h-8 bg-transparent border-0 p-0 cursor-pointer rounded" />
                <input type="text" value={formData.text_color} onChange={e => setFormData({ ...formData, text_color: e.target.value })} className="w-full px-2 py-1 bg-black/20 border border-white/10 rounded text-xs text-white uppercase" />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Background Color</label>
              <div className="flex items-center gap-2">
                <input type="color" value={formData.bg_color} onChange={e => setFormData({ ...formData, bg_color: e.target.value })} className="w-8 h-8 bg-transparent border-0 p-0 cursor-pointer rounded" />
                <input type="text" value={formData.bg_color} onChange={e => setFormData({ ...formData, bg_color: e.target.value })} className="w-full px-2 py-1 bg-black/20 border border-white/10 rounded text-xs text-white uppercase" />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Font Family</label>
            <input
              type="text" value={formData.font_family} onChange={e => setFormData({ ...formData, font_family: e.target.value })}
              className="w-full px-4 py-2.5 bg-black/20 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#00D084]"
              placeholder="Inter, sans-serif"
            />
          </div>
        </div>

        <div className="space-y-6">
          {/* Social Links */}
          <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 space-y-4">
            <h3 className="font-bold text-white border-b border-white/5 pb-3 flex items-center gap-2">
              <HugeiconsIcon icon={LinkSquare02Icon} size={18} />
              Social Links
            </h3>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Twitter / X</label>
              <input
                type="text" value={formData.social_links?.twitter || ''} onChange={e => setFormData({ ...formData, social_links: { ...formData.social_links, twitter: e.target.value } })}
                className="w-full px-4 py-2.5 bg-black/20 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#00D084]"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">LinkedIn</label>
              <input
                type="text" value={formData.social_links?.linkedin || ''} onChange={e => setFormData({ ...formData, social_links: { ...formData.social_links, linkedin: e.target.value } })}
                className="w-full px-4 py-2.5 bg-black/20 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#00D084]"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Instagram</label>
              <input
                type="text" value={formData.social_links?.instagram || ''} onChange={e => setFormData({ ...formData, social_links: { ...formData.social_links, instagram: e.target.value } })}
                className="w-full px-4 py-2.5 bg-black/20 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#00D084]"
              />
            </div>
          </div>

          {/* Footer Details */}
          <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 space-y-4">
            <h3 className="font-bold text-white border-b border-white/5 pb-3">Footer Information</h3>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Footer Text / Copyright</label>
              <input
                type="text" value={formData.footer_text} onChange={e => setFormData({ ...formData, footer_text: e.target.value })}
                className="w-full px-4 py-2.5 bg-black/20 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#00D084]"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Physical Address</label>
              <textarea
                value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-2.5 bg-black/20 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#00D084] min-h-[80px]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
