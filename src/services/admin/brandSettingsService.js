import { supabase } from '../../lib/supabase/client';

export const brandSettingsService = {
  getBrandSettings: async () => {
    const { data, error } = await supabase
      .from('brand_settings')
      .select('*')
      .single();
    
    // If no row exists yet, just return an empty object, let the UI handle defaults
    if (error && error.code !== 'PGRST116') {
      throw error;
    }
    
    return data || {};
  },

  updateBrandSettings: async (settingsData) => {
    // Attempt to update the single row
    const { data, error } = await supabase
      .from('brand_settings')
      .update(settingsData)
      .eq('id', settingsData.id) // Assuming we have the ID from the fetch
      .select()
      .single();

    if (error) {
      // If it doesn't exist, we might need to insert (though the SQL migration should handle the first insert)
      if (error.code === 'PGRST116') {
        const { data: newData, error: insertError } = await supabase
          .from('brand_settings')
          .insert([settingsData])
          .select()
          .single();
        if (insertError) throw insertError;
        return newData;
      }
      throw error;
    }
    return data;
  }
};
