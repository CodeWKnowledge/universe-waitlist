import { useState, useEffect, useCallback } from 'react';
import { brandSettingsService } from '../services/admin/brandSettingsService';

export function useBrandSettings() {
  const [brandSettings, setBrandSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      const data = await brandSettingsService.getBrandSettings();
      setBrandSettings(data);
    } catch (error) {
      console.error('Error fetching brand settings:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const updateBrandSettings = async (settingsData) => {
    const data = await brandSettingsService.updateBrandSettings(settingsData);
    setBrandSettings(data);
    return data;
  };

  return {
    brandSettings,
    loading,
    refetch: fetchSettings,
    updateBrandSettings
  };
}
