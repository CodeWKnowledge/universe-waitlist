import { supabase } from '../../lib/supabase/client';

export const templateService = {
  getTemplates: async () => {
    const { data, error } = await supabase
      .from('email_templates')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  getTemplateById: async (id) => {
    const { data, error } = await supabase
      .from('email_templates')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  createTemplate: async (templateData) => {
    const { data, error } = await supabase
      .from('email_templates')
      .insert([templateData])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  updateTemplate: async (id, templateData) => {
    const { data, error } = await supabase
      .from('email_templates')
      .update(templateData)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  deleteTemplate: async (id) => {
    const { error } = await supabase
      .from('email_templates')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return true;
  }
};
