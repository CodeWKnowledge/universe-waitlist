import React, { useState, useEffect } from 'react';
import { useAdminCampaigns } from '../../../hooks/useAdminCampaigns';
import { useAdminAudiences } from '../../../hooks/useAdminAudiences';
import { useAdminTemplates } from '../../../hooks/useAdminTemplates';
import { useBrandSettings } from '../../../hooks/useBrandSettings';
import { HugeiconsIcon } from '@hugeicons/react';
import { PlusSignIcon, Delete01Icon, SentIcon, ArrowLeft01Icon } from '@hugeicons/core-free-icons';
import TemplateEditorContainer from '../components/email-templates/TemplateEditorContainer';
import { TEMPLATES, getTemplateRenderer } from '../components/email-templates/TemplateRegistry';
import { campaignService } from '../../../services/email/campaignService';

export default function CampaignsPage() {
  const { campaigns, loading, createDraft, deleteCampaign, updateStatus, refetch } = useAdminCampaigns();
  const { audiences } = useAdminAudiences();
  const { templates } = useAdminTemplates();
  const { brandSettings } = useBrandSettings();
  
  const [view, setView] = useState('list'); // 'list' | 'builder'
  const [editingCampaign, setEditingCampaign] = useState(null);
  
  const [formData, setFormData] = useState({ title: '', subject: '', audienceId: '', templateId: '' });
  
  const [templateType, setTemplateType] = useState(TEMPLATES[0].id);
  const [templateData, setTemplateData] = useState(TEMPLATES[0].defaultData);
  const [saving, setSaving] = useState(false);

  // Parse blocks JSONB to extract template type and data
  const parseBlocks = (blocks) => {
    let pType = TEMPLATES[0].id;
    let pData = TEMPLATES[0].defaultData;
    if (blocks && !Array.isArray(blocks) && blocks.type) {
      pType = blocks.type;
      pData = blocks.data || {};
    }
    return { pType, pData };
  };

  // When opening a campaign
  const handleEdit = (camp) => {
    setEditingCampaign(camp);
    setFormData({ title: camp.title, subject: camp.subject, audienceId: camp.audience_id || '', templateId: camp.template_id || '' });
    
    const { pType, pData } = parseBlocks(camp.blocks);
    setTemplateType(pType);
    setTemplateData(pData);
    setView('builder');
  };

  const handleNew = () => {
    setEditingCampaign(null);
    setFormData({ title: '', subject: '', audienceId: '', templateId: '' });
    setTemplateType(TEMPLATES[0].id);
    setTemplateData(TEMPLATES[0].defaultData);
    setView('builder');
  };

  const applyTemplate = (templateId) => {
    setFormData(prev => ({ ...prev, templateId }));
    if (!templateId) return;
    const t = templates.find(t => t.id === templateId);
    if (t && t.blocks) {
      const { pType, pData } = parseBlocks(t.blocks);
      setTemplateType(pType);
      setTemplateData(pData);
      if (!formData.subject) setFormData(prev => ({ ...prev, subject: t.subject }));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Import dynamically to avoid bundle bloat if possible, or just statically.
      const { renderToStaticMarkup } = await import('react-dom/server');
      const RendererComponent = getTemplateRenderer(templateType);
      let htmlContent = '';
      if (RendererComponent) {
        htmlContent = renderToStaticMarkup(
          <RendererComponent data={templateData} brandSettings={brandSettings} previewMode={false} />
        );
        // Add <!DOCTYPE html>
        htmlContent = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="margin:0;padding:0;">${htmlContent}</body></html>`;
      }

      const payload = {
        ...formData,
        audience_id: formData.audienceId || null,
        template_id: formData.templateId || null,
        blocks: { type: templateType, data: templateData },
        content: htmlContent
      };

      if (editingCampaign) {
        await campaignService.updateCampaign(editingCampaign.id, payload);
      } else {
        await createDraft(payload);
      }
      await refetch();
      setView('list');
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSend = async (campaignId) => {
    if (!confirm('Are you sure you want to broadcast this campaign?')) return;
    try {
      await campaignService.sendBroadcast(campaignId);
      alert('Broadcast dispatched successfully!');
      refetch();
    } catch (err) {
      alert(`Failed to send: ${err.message}`);
    }
  };

  if (view === 'builder') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <button onClick={() => setView('list')} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-semibold">
            <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
            Back to Campaigns
          </button>
          <div className="flex items-center gap-3">
            <button onClick={handleSave} disabled={saving} className="px-6 py-2 bg-[#00D084] hover:bg-[#00C16A] text-[#030712] rounded-xl text-sm font-bold transition-colors disabled:opacity-50">
              {saving ? 'Saving...' : 'Save Draft'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Campaign Title</label>
            <input
              type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#00D084]"
              placeholder="Summer Newsletter"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Subject Line</label>
            <input
              type="text" value={formData.subject} onChange={e => setFormData({ ...formData, subject: e.target.value })}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#00D084]"
              placeholder="Big updates inside"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Audience</label>
            <select
              value={formData.audienceId} onChange={e => setFormData({ ...formData, audienceId: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-sm text-slate-300 focus:outline-none focus:border-[#00D084] h-[42px]"
            >
              <option value="" className="bg-slate-900 text-white">All Subscribers</option>
              {audiences.map(aud => (
                <option key={aud.id} value={aud.id} className="bg-slate-900 text-white">{aud.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Load Saved Template</label>
            <select
              value={formData.templateId || ''} onChange={e => applyTemplate(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-sm text-indigo-400 focus:outline-none focus:border-[#00D084] h-[42px]"
            >
              <option value="" className="bg-slate-900 text-white">-- Start Fresh --</option>
              {templates.map(t => (
                <option key={t.id} value={t.id} className="bg-slate-900 text-white">{t.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Layout Type</label>
            <select
              value={templateType}
              onChange={e => {
                const selectedType = e.target.value;
                setTemplateType(selectedType);
                const selectedTmpl = TEMPLATES.find(t => t.id === selectedType);
                if (selectedTmpl) {
                  setTemplateData(selectedTmpl.defaultData);
                }
              }}
              className="w-full px-4 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-sm text-emerald-400 focus:outline-none focus:border-[#00D084] h-[42px]"
            >
              {TEMPLATES.map(t => (
                <option key={t.id} value={t.id} className="bg-slate-900 text-white">{t.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Builder Canvas */}
        <TemplateEditorContainer 
          templateType={templateType} 
          templateData={templateData} 
          onChange={setTemplateData} 
          brandSettings={brandSettings} 
        />
      </div>
    );
  }

  // LIST VIEW
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Email Campaigns</h2>
          <p className="text-sm text-slate-500">Create, edit, and broadcast newsletters.</p>
        </div>
        <button
          onClick={handleNew}
          className="flex items-center gap-2 px-4 py-2 bg-[#00D084] hover:bg-[#00C16A] text-[#030712] rounded-xl text-sm font-bold transition-colors"
        >
          <HugeiconsIcon icon={PlusSignIcon} size={16} />
          New Campaign
        </button>
      </div>

      <div className="grid gap-4">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading campaigns...</div>
        ) : campaigns.length > 0 ? (
          campaigns.map(camp => (
            <div key={camp.id} className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-white/10">
              <div className="flex-1 cursor-pointer" onClick={() => handleEdit(camp)}>
                <h3 className="font-bold text-white text-base hover:text-[#00D084] transition-colors">{camp.title}</h3>
                <p className="text-sm text-slate-400 mt-1">Subject: <span className="text-slate-300">{camp.subject}</span></p>
                <div className="flex items-center gap-3 mt-3">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    camp.status === 'draft' ? 'bg-amber-500/10 text-amber-400' :
                    camp.status === 'scheduled' ? 'bg-indigo-500/10 text-indigo-400' :
                    camp.status === 'processing' ? 'bg-blue-500/10 text-blue-400' :
                    'bg-[#00D084]/10 text-[#00D084]'
                  }`}>
                    {camp.status}
                  </span>
                  <span className="text-xs text-slate-500">Audience: {audiences.find(a => a.id === camp.audience_id)?.name || 'All'}</span>
                  <span className="text-xs text-slate-500">|</span>
                  <span className="text-xs text-slate-500">{new Date(camp.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {camp.status === 'draft' && (
                  <button onClick={() => handleSend(camp.id)} className="p-2 text-indigo-400 hover:bg-indigo-400/10 rounded-lg transition-colors flex items-center gap-2" title="Send Now">
                    <HugeiconsIcon icon={SentIcon} size={20} />
                  </button>
                )}
                <button onClick={() => deleteCampaign(camp.id)} className="p-2 text-rose-400 hover:bg-rose-400/10 rounded-lg transition-colors" title="Delete">
                  <HugeiconsIcon icon={Delete01Icon} size={20} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 text-center border border-white/5 border-dashed rounded-2xl text-slate-500">
            No campaigns found. Create one to get started.
          </div>
        )}
      </div>
    </div>
  );
}
