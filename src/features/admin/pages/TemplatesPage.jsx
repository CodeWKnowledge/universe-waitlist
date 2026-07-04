import React, { useState } from 'react';
import { useAdminTemplates } from '../../../hooks/useAdminTemplates';
import { useBrandSettings } from '../../../hooks/useBrandSettings';
import { HugeiconsIcon } from '@hugeicons/react';
import { PlusSignIcon, Delete01Icon, ArrowLeft01Icon, Copy01Icon, PaintBoardIcon } from '@hugeicons/core-free-icons';
import { TEMPLATES, getTemplateRenderer } from '../components/email-templates/TemplateRegistry';
import TemplateEditorContainer from '../components/email-templates/TemplateEditorContainer';
import { render } from '@react-email/render';

const LivePreviewThumbnail = ({ templateType, templateData, scale = 0.55 }) => {
  const Renderer = getTemplateRenderer(templateType);
  if (!Renderer) return <div className="text-4xl">📧</div>;
  
  return (
    <div className="w-full h-full relative overflow-hidden bg-[#0a0f1d] flex justify-center border-b border-white/5">
      <div 
        className="absolute top-0 pointer-events-none origin-top"
        style={{ 
          width: '600px', 
          transform: `scale(${scale})`,
        }}
      >
        <div className="bg-[#0A0A0A] shadow-2xl overflow-hidden rounded-2xl border border-white/10 mt-4">
          <Renderer data={templateData} brandSettings={{}} previewMode={true} />
        </div>
      </div>
    </div>
  );
};

export default function TemplatesPage() {
  const { templates, loading, createTemplate, updateTemplate, deleteTemplate } = useAdminTemplates();
  const { brandSettings } = useBrandSettings();
  
  const [view, setView] = useState('list'); // 'list' | 'select_type' | 'builder'
  const [editingTemplate, setEditingTemplate] = useState(null);
  
  const [formData, setFormData] = useState({ name: '', subject: '', description: '' });
  
  // New state: stores the type of template and the data object
  const [templateType, setTemplateType] = useState(null);
  const [templateData, setTemplateData] = useState({});
  const [saving, setSaving] = useState(false);

  const handleEdit = (tmpl) => {
    setEditingTemplate(tmpl);
    setFormData({ name: tmpl.name, subject: tmpl.subject, description: tmpl.description || '' });
    
    // Extract type and data from the 'blocks' JSONB column
    // The previous implementation was an array. We now store `{ type: '...', data: {...} }`
    // To handle old formats, we fallback to something safe.
    let parsedType = null;
    let parsedData = {};
    if (tmpl.blocks && !Array.isArray(tmpl.blocks) && tmpl.blocks.type) {
      parsedType = tmpl.blocks.type;
      parsedData = tmpl.blocks.data || {};
    } else {
      // Legacy support or fallback to Newsletter
      parsedType = TEMPLATES[0].id;
      parsedData = TEMPLATES[0].defaultData;
    }

    setTemplateType(parsedType);
    setTemplateData(parsedData);
    setView('builder');
  };

  const handleSelectTemplateType = (templateConfig) => {
    setEditingTemplate(null);
    setFormData({ name: `New ${templateConfig.name}`, subject: 'Your Subject Here', description: '' });
    setTemplateType(templateConfig.id);
    setTemplateData(templateConfig.defaultData);
    setView('builder');
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let htmlContent = '';
      
      const Renderer = getTemplateRenderer(templateType);
      if (Renderer) {
        htmlContent = await render(<Renderer data={templateData} brandSettings={brandSettings} previewMode={false} />);
      }

      const payload = {
        ...formData,
        blocks: { type: templateType, data: templateData },
        brand_settings: brandSettings,
        html_body: htmlContent
      };

      if (editingTemplate) {
        const { error } = await updateTemplate(editingTemplate.id, payload);
        if (error) throw error;
      } else {
        const { error } = await createTemplate(payload);
        if (error) throw error;
      }
      setView('list');
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (view === 'builder') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <button onClick={() => setView('list')} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-semibold">
            <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
            Back to Templates
          </button>
          <div className="flex items-center gap-3">
            <button onClick={handleSave} disabled={saving} className="px-6 py-2 bg-[#00D084] hover:bg-[#00C16A] text-[#030712] rounded-xl text-sm font-bold transition-colors disabled:opacity-50">
              {saving ? 'Saving...' : 'Save Template'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Template Name</label>
            <input
              type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#00D084]"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Default Subject Line</label>
            <input
              type="text" value={formData.subject} onChange={e => setFormData({ ...formData, subject: e.target.value })}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#00D084]"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Description</label>
            <input
              type="text" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#00D084]"
              placeholder="e.g. For weekly product updates"
            />
          </div>
        </div>

        <TemplateEditorContainer 
          templateType={templateType} 
          templateData={templateData} 
          onChange={setTemplateData} 
          brandSettings={brandSettings} 
        />
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-12">
      
      {/* Section 1: Premium Layouts */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">Premium Layouts</h2>
            <p className="text-sm text-slate-500">Start your campaign with one of our high-converting, hard-coded layouts.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {TEMPLATES.map(t => (
            <div 
              key={t.id} 
              onClick={() => handleSelectTemplateType(t)} 
              className="bg-[#0a0f1d] border border-white/10 rounded-2xl cursor-pointer hover:border-[#00D084] hover:shadow-[0_0_30px_rgba(0,208,132,0.1)] transition-all flex flex-col overflow-hidden group"
            >
              {/* Product-like Live Preview Thumbnail */}
              <div className="h-[360px] relative w-full overflow-hidden border-b border-white/10 bg-[#050810]">
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1d] via-transparent to-transparent opacity-0 group-hover:opacity-40 transition-opacity z-10" />
                <LivePreviewThumbnail templateType={t.id} templateData={t.defaultData} scale={0.55} />
                
                {/* Hover overlay button */}
                <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="px-6 py-2.5 bg-[#00D084] text-[#030712] font-bold rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                    Use Layout
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{t.icon}</span>
                  <h3 className="text-lg font-bold text-white">{t.name}</h3>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">{t.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: Saved Templates */}
      <div className="pt-8 border-t border-white/5">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">Your Saved Templates</h2>
            <p className="text-sm text-slate-500">Manage your previously customized email designs.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full p-12 text-center text-slate-500">Loading templates...</div>
          ) : templates.length > 0 ? (
            templates.map(tmpl => {
              const tmplType = !Array.isArray(tmpl.blocks) ? tmpl.blocks?.type : null;
              const registryTmpl = TEMPLATES.find(t => t.id === tmplType);
              
              return (
                <div key={tmpl.id} className="bg-white/[0.03] border border-white/5 rounded-2xl overflow-hidden flex flex-col transition-all hover:border-white/10 hover:bg-white/[0.05]">
                  <div className="h-56 bg-[#050810] flex items-center justify-center border-b border-white/5 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1d] via-transparent to-transparent opacity-0 group-hover:opacity-40 transition-opacity z-10" />
                    {tmpl.thumbnail_url ? (
                      <img src={tmpl.thumbnail_url} alt="" className="w-full h-full object-cover opacity-80" />
                    ) : registryTmpl ? (
                      <div className="absolute inset-0 opacity-90 group-hover:opacity-100 transition-opacity">
                        <LivePreviewThumbnail templateType={tmplType} templateData={tmpl.blocks?.data || registryTmpl.defaultData} scale={0.45} />
                      </div>
                    ) : (
                      <div className="text-slate-600 flex flex-col items-center gap-2 text-center">
                        <span className="text-3xl">📧</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider">Legacy Template</span>
                      </div>
                    )}
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="font-bold text-white text-lg mb-1">{tmpl.name}</h3>
                    <p className="text-xs text-slate-400 mb-4 line-clamp-2">{tmpl.description || tmpl.subject}</p>
                    <div className="mt-auto flex items-center justify-between">
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider">{new Date(tmpl.created_at).toLocaleDateString()}</span>
                      <div className="flex gap-2">
                        <button onClick={() => {
                          setFormData({ name: `${tmpl.name} (Copy)`, subject: tmpl.subject, description: tmpl.description });
                          let tType = TEMPLATES[0].id;
                          let tData = TEMPLATES[0].defaultData;
                          if (tmpl.blocks && !Array.isArray(tmpl.blocks) && tmpl.blocks.type) {
                            tType = tmpl.blocks.type;
                            tData = tmpl.blocks.data || {};
                          }
                          setTemplateType(tType);
                          setTemplateData(tData);
                          setView('builder');
                        }} className="p-1.5 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors" title="Duplicate">
                          <HugeiconsIcon icon={Copy01Icon} size={16} />
                        </button>
                        <button onClick={() => handleEdit(tmpl)} className="p-1.5 text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 rounded-lg transition-colors" title="Edit">
                          <HugeiconsIcon icon={PaintBoardIcon} size={16} />
                        </button>
                        <button onClick={() => { if(confirm('Delete template?')) deleteTemplate(tmpl.id) }} className="p-1.5 text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 rounded-lg transition-colors" title="Delete">
                          <HugeiconsIcon icon={Delete01Icon} size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full p-12 text-center border border-white/5 border-dashed rounded-2xl text-slate-500">
              No saved templates found. Select a Premium Layout above to customize your first template!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
