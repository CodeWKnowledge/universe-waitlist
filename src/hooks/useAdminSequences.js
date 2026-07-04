import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase/client';

export function useAdminSequences() {
  const [sequences, setSequences] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSequences = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('email_sequences')
      .select(`
        *,
        sequence_steps(*),
        sequence_subscribers(count)
      `)
      .order('created_at', { ascending: false });

    if (!error) {
      const formatted = data.map(s => ({
        ...s,
        activeSubscribers: s.sequence_subscribers[0]?.count || 0,
        steps: s.sequence_steps.sort((a, b) => a.step_number - b.step_number)
      }));
      setSequences(formatted);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchSequences(); }, [fetchSequences]);

  const createSequence = async (name, description, triggerEvent) => {
    const { data, error } = await supabase
      .from('email_sequences')
      .insert([{ name, description, trigger_event: triggerEvent, status: 'draft' }])
      .select()
      .single();
    if (!error) await fetchSequences();
    return { data, error };
  };

  const updateSequence = async (id, updates) => {
    const { data, error } = await supabase.from('email_sequences').update(updates).eq('id', id).select().single();
    if (!error) await fetchSequences();
    return { data, error };
  };

  const updateStatus = async (id, status) => {
    await supabase.from('email_sequences').update({ status }).eq('id', id);
    await fetchSequences();
  };

  const addSequenceStep = async (sequenceId, delayDays, templateId) => {
    // Determine next step number
    const sequence = sequences.find(s => s.id === sequenceId);
    const nextStepNumber = sequence?.steps ? sequence.steps.length + 1 : 1;
    
    const { error } = await supabase.from('sequence_steps').insert([{
      sequence_id: sequenceId,
      step_number: nextStepNumber,
      delay_days: delayDays,
      template_id: templateId
    }]);
    if (!error) await fetchSequences();
  };

  const removeSequenceStep = async (stepId) => {
    const { error } = await supabase.from('sequence_steps').delete().eq('id', stepId);
    if (!error) await fetchSequences();
  };

  const updateSequenceStep = async (stepId, updates) => {
    const { error } = await supabase.from('sequence_steps').update(updates).eq('id', stepId);
    if (!error) await fetchSequences();
  };

  return { 
    sequences, 
    loading, 
    createSequence, 
    updateSequence,
    updateStatus, 
    refetch: fetchSequences,
    addSequenceStep,
    removeSequenceStep,
    updateSequenceStep
  };
}
