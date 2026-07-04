import React, { useState, useEffect, useCallback } from 'react';
import { useAdminSequences } from '../../../hooks/useAdminSequences';
import { useAdminTemplates } from '../../../hooks/useAdminTemplates';
import { supabase } from '../../../lib/supabase/client';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  PlusSignIcon, WorkflowSquare08Icon, PlayIcon, PauseIcon,
  Mail01Icon, Clock01Icon, CheckmarkCircle02Icon, AlertCircleIcon,
  ArrowLeft01Icon, Delete01Icon, PaintBoardIcon
} from '@hugeicons/core-free-icons';
import { useBrandSettings } from '../../../hooks/useBrandSettings';
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
        style={{ width: '600px', transform: `scale(${scale})` }}
      >
        <div className="bg-[#0A0A0A] shadow-2xl overflow-hidden rounded-2xl border border-white/10 mt-4">
          <Renderer data={templateData} brandSettings={{}} previewMode={true} />
        </div>
      </div>
    </div>
  );
};

export default function AutomationsPage() {
  const { sequences, loading, createSequence, updateSequence, updateStatus, addSequenceStep, removeSequenceStep } = useAdminSequences();
  const { templates, createTemplate, updateTemplate } = useAdminTemplates();
  const { brandSettings } = useBrandSettings();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', triggerEvent: 'waitlist_join' });
  const [selectedSequence, setSelectedSequence] = useState(null);
  
  // Builder state
  const [newStepDelay, setNewStepDelay] = useState(0);
  const [showAddStep, setShowAddStep] = useState(false);
  const [addStepMode, setAddStepMode] = useState('layout'); // 'layout' or 'saved'

  // Template Editor state
  const [view, setView] = useState('list'); // 'list' | 'sequence_builder' | 'template_editor'
  const [editingStep, setEditingStep] = useState(null);
  const [templateType, setTemplateType] = useState(null);
  const [templateData, setTemplateData] = useState({});
  const [savingTemplate, setSavingTemplate] = useState(false);
  const [editingTemplateObj, setEditingTemplateObj] = useState(null);
  const [templateFormData, setTemplateFormData] = useState({ name: '', subject: '', description: '' });

  // Queue stats
  const [queueStats, setQueueStats] = useState({ pending: 0, completed: 0, failed: 0 });
  const [queueLoading, setQueueLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [processResult, setProcessResult] = useState(null);

  const fetchQueueStats = useCallback(async () => {
    setQueueLoading(true);
    const [{ count: pending }, { count: sent }, { count: failed }] = await Promise.all([
      supabase.from('email_queue').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('email_queue').select('*', { count: 'exact', head: true }).eq('status', 'sent'),
      supabase.from('email_queue').select('*', { count: 'exact', head: true }).eq('status', 'failed'),
    ]);
    setQueueStats({ pending: pending || 0, sent: sent || 0, failed: failed || 0 });
    setQueueLoading(false);
  }, []);

  useEffect(() => { fetchQueueStats(); }, [fetchQueueStats]);

  // When sequences update, also update the selected sequence if it's open
  useEffect(() => {
    if (selectedSequence) {
      const updated = sequences.find(s => s.id === selectedSequence.id);
      if (updated) setSelectedSequence(updated);
    }
  }, [sequences]);

  // View routing based on state
  useEffect(() => {
    if (editingStep) setView('template_editor');
    else if (selectedSequence) setView('sequence_builder');
    else setView('list');
  }, [selectedSequence, editingStep]);

  const handleCreate = async (e) => {
    e.preventDefault();
    const { data } = await createSequence(formData.name, formData.description, formData.triggerEvent);
    setShowForm(false);
    setFormData({ name: '', description: '', triggerEvent: 'waitlist_join' });
    if (data) setSelectedSequence(data);
  };

  const handleAddStep = async (e) => {
    e.preventDefault();
    if (!newStepTemplate) return alert('Please select a template');
    await addSequenceStep(selectedSequence.id, parseInt(newStepDelay), newStepTemplate);
    setShowAddStep(false);
    setNewStepDelay(0);
    setNewStepTemplate('');
  };

  const handleAddStepWithLayout = async (layoutId) => {
    const layoutConfig = TEMPLATES.find(t => t.id === layoutId);
    let htmlContent = '';
    const Renderer = getTemplateRenderer(layoutId);
    if (Renderer) {
      htmlContent = await render(<Renderer data={layoutConfig.defaultData} brandSettings={brandSettings} previewMode={false} />);
    }

    const payload = {
      name: `${selectedSequence.name} - Step Email`,
      subject: 'Your Subject Here',
      blocks: { type: layoutId, data: layoutConfig.defaultData },
      brand_settings: brandSettings,
      html_body: htmlContent
    };

    const { data: newTemplate, error } = await createTemplate(payload);
    if(error) return alert('Error creating template: ' + error.message);
    await addSequenceStep(selectedSequence.id, parseInt(newStepDelay), newTemplate.id);
    
    setShowAddStep(false);
    setNewStepDelay(0);
  };

  const handleEditStepDesign = (step) => {
    const stepTemplate = templates.find(t => t.id === step.template_id);
    if (!stepTemplate) return alert('Template not found.');

    let parsedType = null;
    let parsedData = {};
    if (stepTemplate.blocks && !Array.isArray(stepTemplate.blocks) && stepTemplate.blocks.type) {
      parsedType = stepTemplate.blocks.type;
      parsedData = stepTemplate.blocks.data || {};
    } else {
      parsedType = TEMPLATES[0].id;
      parsedData = TEMPLATES[0].defaultData;
    }

    setEditingStep(step);
    setEditingTemplateObj(stepTemplate);
    setTemplateType(parsedType);
    setTemplateData(parsedData);
    setTemplateFormData({ name: stepTemplate.name, subject: stepTemplate.subject, description: stepTemplate.description || '' });
  };

  const handleSaveTemplate = async () => {
    setSavingTemplate(true);
    try {
      let htmlContent = '';
      const Renderer = getTemplateRenderer(templateType);
      if (Renderer) {
        htmlContent = await render(<Renderer data={templateData} brandSettings={brandSettings} previewMode={false} />);
      }

      const payload = {
        ...templateFormData,
        blocks: { type: templateType, data: templateData },
        brand_settings: brandSettings,
        html_body: htmlContent
      };

      if (editingTemplateObj) {
        const { error } = await updateTemplate(editingTemplateObj.id, payload);
        if (error) throw error;
      } else {
        const { data: newTemplate, error } = await createTemplate(payload);
        if (error) throw error;
        await updateSequenceStep(editingStep.id, { template_id: newTemplate.id });
      }
      setEditingStep(null);
      setEditingTemplateObj(null);
    } catch (err) {
      alert(err.message);
    } finally {
      setSavingTemplate(false);
    }
  };

  const handleProcessNow = async () => {
    setProcessing(true);
    setProcessResult(null);
    try {
      const { data, error } = await supabase.functions.invoke('process-email-queue');
      if (error) throw error;
      setProcessResult({ success: true, message: `Processed ${data?.processed ?? 0} email(s) from the queue.` });
      await fetchQueueStats();
    } catch (err) {
      setProcessResult({
        success: false,
        message: err.message?.includes('Failed to send') || err.message?.includes('FunctionsFetchError')
          ? 'Edge Function not deployed yet. Run: supabase functions deploy process-email-queue --no-verify-jwt'
          : err.message || 'Unknown error'
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleCreateDraftSequence = async () => {
    const { data, error } = await createSequence('New Automation Sequence', '', 'waitlist_join');
    if (error) return alert('Could not create sequence: ' + error.message);
    if (data) {
      // Initialise with empty steps so builder renders immediately while fetchSequences re-syncs
      setSelectedSequence({ ...data, steps: [], activeSubscribers: 0 });
    }
  };

  if (view === 'template_editor') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div className="flex items-center gap-4">
            <button onClick={() => setEditingStep(null)} className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors">
              <HugeiconsIcon icon={ArrowLeft01Icon} size={20} className="text-slate-400" />
            </button>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <HugeiconsIcon icon={PaintBoardIcon} size={20} className="text-[#00D084]" />
                Edit Sequence Email
              </h2>
              <p className="text-sm text-slate-500">Step: {editingStep.delay_days === 0 ? 'Send Immediately' : `Send after ${editingStep.delay_days} day(s)`}</p>
            </div>
          </div>
          <button 
            onClick={handleSaveTemplate}
            disabled={savingTemplate}
            className="px-6 py-2 bg-[#00D084] hover:bg-[#00C16A] text-[#030712] rounded-xl text-sm font-bold transition-colors disabled:opacity-50"
          >
            {savingTemplate ? 'Saving...' : 'Save Design'}
          </button>
        </div>

        {/* Template metadata form */}
        <div className="bg-[#0a0f1d] border border-white/10 rounded-2xl p-6 grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Email Subject Line</label>
            <input
              required type="text" value={templateFormData.subject}
              onChange={e => setTemplateFormData({ ...templateFormData, subject: e.target.value })}
              className="w-full px-4 py-2 bg-[#050810] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#00D084]"
              placeholder="e.g. Welcome to UniVerse!"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Internal Template Name</label>
            <input
              required type="text" value={templateFormData.name}
              onChange={e => setTemplateFormData({ ...templateFormData, name: e.target.value })}
              className="w-full px-4 py-2 bg-[#050810] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#00D084]"
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

  if (view === 'sequence_builder') {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-4 border-b border-white/5 pb-6">
          <div className="flex items-center gap-4">
            <button onClick={() => setSelectedSequence(null)} className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors">
              <HugeiconsIcon icon={ArrowLeft01Icon} size={20} className="text-slate-400" />
            </button>
            <div className="flex-1 flex items-center gap-3">
              <input
                value={selectedSequence.name}
                onChange={e => {
                  const newName = e.target.value;
                  setSelectedSequence({ ...selectedSequence, name: newName });
                  updateSequence(selectedSequence.id, { name: newName });
                }}
                className="text-2xl font-bold text-white bg-transparent border-none outline-none focus:ring-0 px-0 py-0"
              />
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                selectedSequence.status === 'active' ? 'bg-[#00D084]/10 text-[#00D084]' :
                selectedSequence.status === 'paused' ? 'bg-amber-500/10 text-amber-400' :
                'bg-white/5 text-slate-400'
              }`}>
                {selectedSequence.status}
              </span>
            </div>
          </div>
          
          <div className="pl-14 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Description</label>
              <input
                value={selectedSequence.description || ''}
                onChange={e => {
                  const newDesc = e.target.value;
                  setSelectedSequence({ ...selectedSequence, description: newDesc });
                  updateSequence(selectedSequence.id, { description: newDesc });
                }}
                className="w-full text-sm text-slate-400 bg-transparent border-none outline-none focus:text-white transition-colors px-0 py-0"
                placeholder="Add a description..."
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Trigger Event</label>
              <select
                value={selectedSequence.trigger_event}
                onChange={e => {
                  const newTrigger = e.target.value;
                  setSelectedSequence({ ...selectedSequence, trigger_event: newTrigger });
                  updateSequence(selectedSequence.id, { trigger_event: newTrigger });
                }}
                className="text-sm text-indigo-400 bg-transparent border-none outline-none cursor-pointer focus:ring-0 px-0 py-0 appearance-none font-semibold"
              >
                <option value="waitlist_join" className="bg-slate-900 text-white">When user joins waitlist</option>
                <option value="referral_converted" className="bg-slate-900 text-white">When user's referral converts</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-[#0a0f1d] border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-white">Sequence Timeline</h3>
            <button
              onClick={() => setShowAddStep(!showAddStep)}
              className="flex items-center gap-2 px-4 py-2 bg-[#00D084] hover:bg-[#00C16A] text-[#030712] rounded-xl text-sm font-bold transition-colors"
            >
              <HugeiconsIcon icon={PlusSignIcon} size={16} /> Add Step
            </button>
          </div>

          <div className="space-y-4 relative before:absolute before:inset-y-0 before:left-[19px] before:w-[2px] before:bg-white/10">
            {selectedSequence.steps.length === 0 ? (
              <div className="pl-12 py-4 text-sm text-slate-500">No emails in this sequence. Add a step above to get started.</div>
            ) : (
              selectedSequence.steps.map((step, index) => {
                const stepTemplate = templates.find(t => t.id === step.template_id);
                let tType = TEMPLATES[0].id;
                let tData = TEMPLATES[0].defaultData;
                if (stepTemplate && stepTemplate.blocks && !Array.isArray(stepTemplate.blocks)) {
                  tType = stepTemplate.blocks.type;
                  tData = stepTemplate.blocks.data;
                }

                return (
                  <div key={step.id} className="relative pl-12 mb-8">
                    <div className="absolute left-[9px] top-4 w-[22px] h-[22px] rounded-full bg-[#050810] border-4 border-[#00D084] z-10" />
                    
                    <div className="text-xs font-bold text-[#00D084] uppercase tracking-wider mb-2">
                      {step.delay_days === 0 ? 'Send Immediately' : `Send after ${step.delay_days} day${step.delay_days > 1 ? 's' : ''}`}
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden group hover:border-[#00D084]/50 transition-all flex h-32">
                      <div className="w-48 bg-[#0a0f1d] border-r border-white/10 shrink-0 overflow-hidden relative">
                        {stepTemplate ? (
                          <div className="absolute inset-0 pointer-events-none scale-[0.4] origin-top-left w-[250%] h-[250%]">
                             <LivePreviewThumbnail templateType={tType} templateData={tData} scale={1} />
                          </div>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-4xl">📧</div>
                        )}
                      </div>
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="text-white font-semibold flex items-center gap-2 text-lg">
                            {stepTemplate ? stepTemplate.name : 'Unknown Template'}
                          </h4>
                          <p className="text-slate-400 text-sm mt-1">{stepTemplate?.subject || 'No Subject'}</p>
                        </div>
                        <div className="flex items-center gap-2 justify-end">
                          <button 
                            onClick={() => handleEditStepDesign(step)}
                            className="px-4 py-2 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 rounded-xl text-sm font-bold transition-colors flex items-center gap-2"
                          >
                            <HugeiconsIcon icon={PaintBoardIcon} size={16} />
                            Edit Design
                          </button>
                          <button 
                            onClick={() => { if(confirm('Remove this step?')) removeSequenceStep(step.id) }} 
                            className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all"
                            title="Delete Step"
                          >
                            <HugeiconsIcon icon={Delete01Icon} size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}

            {showAddStep && (
              <div className="relative pl-12 mt-4">
                <div className="absolute left-[9px] top-6 w-[22px] h-[22px] rounded-full bg-[#050810] border-4 border-indigo-500 z-10" />
                <div className="bg-[#050810] border border-indigo-500/30 rounded-2xl overflow-hidden shadow-2xl">
                  <div className="p-4 border-b border-white/5 bg-white/[0.02]">
                    <h4 className="text-sm font-bold text-white mb-4">Add New Step</h4>
                    <div className="flex gap-4 border-b border-white/10 pb-4">
                      <button 
                        type="button"
                        onClick={() => setAddStepMode('layout')}
                        className={`text-sm font-bold transition-colors ${addStepMode === 'layout' ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}
                      >
                        Premium Layouts
                      </button>
                      <button 
                        type="button"
                        onClick={() => setAddStepMode('saved')}
                        className={`text-sm font-bold transition-colors ${addStepMode === 'saved' ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}
                      >
                        Saved Templates
                      </button>
                    </div>
                  </div>

                  <div className="p-4">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Delay (Days)</label>
                    <input
                      type="number" min="0" value={newStepDelay}
                      onChange={e => setNewStepDelay(e.target.value)}
                      className="w-full md:w-64 px-4 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 mb-6"
                    />

                    {addStepMode === 'layout' ? (
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Select Layout to Start</label>
                        <div className="grid grid-cols-2 gap-4">
                          {TEMPLATES.map(t => (
                            <div 
                              key={t.id} 
                              onClick={() => handleAddStepWithLayout(t.id)}
                              className="bg-[#0a0f1d] border border-white/10 hover:border-indigo-500/50 rounded-xl overflow-hidden cursor-pointer transition-colors group"
                            >
                              <div className="h-24 bg-[#050810] overflow-hidden relative border-b border-white/5">
                                <div className="absolute inset-0 pointer-events-none scale-[0.4] origin-top-left w-[250%] h-[250%]">
                                  <LivePreviewThumbnail templateType={t.id} templateData={t.defaultData} scale={1} />
                                </div>
                              </div>
                              <div className="p-3">
                                <h4 className="text-white text-sm font-bold group-hover:text-indigo-400">{t.name}</h4>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <form onSubmit={handleAddStep}>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Select Saved Template</label>
                        <select
                          required value={newStepTemplate} onChange={e => setNewStepTemplate(e.target.value)}
                          className="w-full px-4 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 h-[42px] mb-4"
                        >
                          <option value="" className="bg-slate-900 text-white">-- Choose Template --</option>
                          {templates.map(t => (
                            <option key={t.id} value={t.id} className="bg-slate-900 text-white">{t.name}</option>
                          ))}
                        </select>
                        <div className="flex justify-end pt-2">
                          <button type="submit" className="px-4 py-2 bg-indigo-500 hover:bg-indigo-400 text-white rounded-xl text-sm font-bold transition-colors">Create Step</button>
                        </div>
                      </form>
                    )}
                  </div>
                  <div className="p-4 border-t border-white/5 flex justify-end">
                     <button type="button" onClick={() => setShowAddStep(false)} className="px-4 py-2 text-slate-400 hover:text-white text-sm font-bold">Cancel</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Automations & Sequences</h2>
          <p className="text-sm text-slate-500">Build drip campaigns that trigger automatically on subscriber events.</p>
        </div>
        <button
          onClick={handleCreateDraftSequence}
          className="flex items-center gap-2 px-4 py-2 bg-[#00D084] hover:bg-[#00C16A] text-[#030712] rounded-xl text-sm font-bold transition-colors"
        >
          <HugeiconsIcon icon={PlusSignIcon} size={16} />
          New Sequence
        </button>
      </div>

      {/* Email Queue Status Panel */}
      <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white">Email Queue Status</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Emails are scheduled here when users join the waitlist. The queue is processed automatically every 5 minutes once deployed.
            </p>
          </div>
          <button
            onClick={handleProcessNow}
            disabled={processing}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/20 rounded-xl text-xs font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processing ? (
              <span className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <HugeiconsIcon icon={PlayIcon} size={14} />
            )}
            {processing ? 'Processing...' : 'Process Queue Now'}
          </button>
        </div>

        {processResult && (
          <div className={`mb-4 px-4 py-3 rounded-xl text-xs flex items-start gap-2 ${
            processResult.success
              ? 'bg-[#00D084]/10 border border-[#00D084]/20 text-[#00D084]'
              : 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
          }`}>
            <HugeiconsIcon
              icon={processResult.success ? CheckmarkCircle02Icon : AlertCircleIcon}
              size={14}
              className="mt-0.5 flex-shrink-0"
            />
            <span>{processResult.message}</span>
          </div>
        )}

        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Pending', value: queueStats.pending, color: 'text-amber-400', bg: 'bg-amber-500/10', icon: Clock01Icon },
          { label: 'Sent', value: queueStats.sent, color: 'text-[#00D084]', bg: 'bg-[#00D084]/10', icon: CheckmarkCircle02Icon },
            { label: 'Failed', value: queueStats.failed, color: 'text-rose-400', bg: 'bg-rose-500/10', icon: AlertCircleIcon },
          ].map(stat => (
            <div key={stat.label} className={`${stat.bg} rounded-xl p-4 text-center`}>
              <HugeiconsIcon icon={stat.icon} size={18} className={`${stat.color} mx-auto mb-2`} />
              <div className={`text-2xl font-bold ${stat.color}`}>
                {queueLoading ? '—' : stat.value}
              </div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <p className="text-[10px] text-slate-600 mt-4 text-center">
          ⚠ The <span className="text-slate-400 font-mono">process-email-queue</span> Edge Function must be deployed for automated sending to work.
          See <span className="text-slate-400">docs/SUPABASE_EDGE_FUNCTIONS_GUIDE.md</span> for instructions.
        </p>
      </div>

      {/* Sequences List */}
      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading sequences...</div>
        ) : sequences.length > 0 ? (
          sequences.map(seq => (
            <div key={seq.id} className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:border-[#00D084]/50 hover:bg-white/[0.05] transition-all">
              <div className="flex items-start gap-4 cursor-pointer flex-1" onClick={() => setSelectedSequence(seq)}>
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0 mt-1">
                  <HugeiconsIcon icon={WorkflowSquare08Icon} size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg group-hover:text-[#00D084] transition-colors">{seq.name}</h3>
                  <p className="text-sm text-slate-400 mb-2">{seq.description}</p>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      seq.status === 'active' ? 'bg-[#00D084]/10 text-[#00D084]' :
                      seq.status === 'paused' ? 'bg-amber-500/10 text-amber-400' :
                      'bg-white/5 text-slate-400'
                    }`}>
                      {seq.status}
                    </span>
                    <span className="text-xs text-slate-500">Trigger: {seq.trigger_event}</span>
                    <span className="text-xs text-slate-500">•</span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <HugeiconsIcon icon={Mail01Icon} size={12} />
                      {seq.steps.length} Steps
                    </span>
                    <span className="text-xs text-slate-500">•</span>
                    <span className="text-xs text-indigo-400 font-semibold">{seq.activeSubscribers} Active Users</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {seq.status !== 'active' ? (
                  <button
                    onClick={(e) => { e.stopPropagation(); updateStatus(seq.id, 'active'); }}
                    className="p-2 text-[#00D084] hover:bg-[#00D084]/10 rounded-xl transition-colors"
                    title="Activate"
                  >
                    <HugeiconsIcon icon={PlayIcon} size={20} />
                  </button>
                ) : (
                  <button
                    onClick={(e) => { e.stopPropagation(); updateStatus(seq.id, 'paused'); }}
                    className="p-2 text-amber-400 hover:bg-amber-400/10 rounded-xl transition-colors"
                    title="Pause"
                  >
                    <HugeiconsIcon icon={PauseIcon} size={20} />
                  </button>
                )}
                <button
                  onClick={(e) => { e.stopPropagation(); setSelectedSequence(seq); }}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm font-semibold transition-colors ml-2"
                >
                  Edit Steps
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 text-center border border-white/5 border-dashed rounded-2xl text-slate-500">
            No automations found. Create your first sequence above.
          </div>
        )}
      </div>
    </div>
  );
}
