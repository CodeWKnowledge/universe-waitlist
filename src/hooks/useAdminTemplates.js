import { useState, useEffect, useCallback } from 'react';
import { templateService } from '../services/email/templateService';

export function useAdminTemplates() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTemplates = useCallback(async () => {
    try {
      setLoading(true);
      const data = await templateService.getTemplates();
      setTemplates(data || []);
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const createTemplate = async (templateData) => {
    try {
      const data = await templateService.createTemplate(templateData);
      await fetchTemplates();
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const updateTemplate = async (id, templateData) => {
    try {
      const data = await templateService.updateTemplate(id, templateData);
      await fetchTemplates();
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const deleteTemplate = async (id) => {
    await templateService.deleteTemplate(id);
    await fetchTemplates();
  };

  return {
    templates,
    loading,
    refetch: fetchTemplates,
    createTemplate,
    updateTemplate,
    deleteTemplate
  };
}
