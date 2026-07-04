import React, { useState, useEffect } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { ViewIcon, Settings01Icon } from '@hugeicons/core-free-icons';
import { getTemplateRenderer, getTemplateEditor } from './TemplateRegistry';

export default function TemplateEditorContainer({ templateType, templateData, onChange, brandSettings = {} }) {
  const [previewMode, setPreviewMode] = useState('desktop');
  const [activeTab, setActiveTab] = useState('edit'); // edit, preview

  // Use the registry to find the components
  const RendererComponent = getTemplateRenderer(templateType);
  const EditorComponent = getTemplateEditor(templateType);

  if (!RendererComponent || !EditorComponent) {
    return <div className="p-12 text-center text-slate-500">Template type '{templateType}' not found.</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[85vh] min-h-[800px]">
      
      {/* LEFT PANEL: Editor UI */}
      <div className="lg:col-span-4 flex flex-col bg-[#0a0f1d] border border-white/5 rounded-2xl overflow-hidden flex-shrink-0">
        <div className="flex bg-white/5 border-b border-white/5">
          <button 
            onClick={() => setActiveTab('edit')} 
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest flex justify-center items-center gap-2 ${activeTab === 'edit' ? 'text-white border-b-2 border-indigo-500 bg-white/5' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <HugeiconsIcon icon={Settings01Icon} size={14}/> Template Content
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          <EditorComponent data={templateData} onChange={onChange} />
        </div>
      </div>

      {/* RIGHT PANEL: Live Preview */}
      <div className="lg:col-span-8 flex flex-col bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 relative">
        <div className="bg-white px-4 py-3 border-b border-slate-200 flex items-center justify-between shadow-sm z-10">
          <div className="text-sm font-bold text-slate-700 flex items-center gap-2">
            <HugeiconsIcon icon={ViewIcon} size={16} /> Live Preview
          </div>
          <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button 
              onClick={() => setPreviewMode('desktop')} 
              className={`px-3 py-1 rounded text-[11px] font-bold flex items-center gap-1.5 ${previewMode === 'desktop' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              💻 Desktop
            </button>
            <button 
              onClick={() => setPreviewMode('mobile')} 
              className={`px-3 py-1 rounded text-[11px] font-bold flex items-center gap-1.5 ${previewMode === 'mobile' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              📱 Mobile
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto bg-[#e2e8f0] p-4 flex justify-center pb-32">
          <div className={`transition-all duration-300 relative ${previewMode === 'mobile' ? 'w-[375px]' : 'w-full max-w-[600px]'}`}>
            <div className="bg-white shadow-xl min-h-[400px] overflow-hidden" style={{ borderRadius: previewMode === 'desktop' ? '16px' : '0' }}>
              <RendererComponent data={templateData} brandSettings={brandSettings} previewMode={true} />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
