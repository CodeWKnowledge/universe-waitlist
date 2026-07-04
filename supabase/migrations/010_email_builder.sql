-- =============================================================================
-- 010_email_builder.sql
-- Purpose: Schema upgrades for the advanced email builder and brand settings.
-- =============================================================================

-- Upgrade templates table
ALTER TABLE public.email_templates ADD COLUMN IF NOT EXISTS blocks JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.email_templates ADD COLUMN IF NOT EXISTS brand_settings JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.email_templates ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;
ALTER TABLE public.email_templates ADD COLUMN IF NOT EXISTS description TEXT;

-- Update campaigns to support linking from a template
ALTER TABLE public.newsletter_campaigns ADD COLUMN IF NOT EXISTS template_id UUID REFERENCES public.email_templates(id) ON DELETE SET NULL;

-- ---------------------------------------------------------------------------
-- Global Brand Settings (Singleton)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.brand_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name TEXT,
    logo_url TEXT,
    primary_color TEXT DEFAULT '#00D084',
    secondary_color TEXT DEFAULT '#050810',
    text_color TEXT DEFAULT '#1e293b',
    bg_color TEXT DEFAULT '#f8fafc',
    font_family TEXT DEFAULT 'Inter, sans-serif',
    social_links JSONB DEFAULT '{"twitter": "", "linkedin": "", "instagram": "", "facebook": ""}'::jsonb,
    footer_text TEXT,
    contact_email TEXT,
    address TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ensure only one row exists (Singleton Pattern)
CREATE UNIQUE INDEX IF NOT EXISTS ensure_single_brand_settings ON public.brand_settings ((true));

-- Insert default row
INSERT INTO public.brand_settings (company_name, primary_color, footer_text) 
VALUES ('UniVerse', '#00D084', '© 2026 UniVerse. All rights reserved.')
ON CONFLICT DO NOTHING;

-- Trigger for updated_at
CREATE TRIGGER brand_settings_updated_at
    BEFORE UPDATE ON public.brand_settings
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();

-- RLS
ALTER TABLE public.brand_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can read brand settings" ON public.brand_settings FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins can update brand settings" ON public.brand_settings FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can insert brand settings" ON public.brand_settings FOR INSERT WITH CHECK (public.is_admin());

-- Allow email functions to read templates and brand settings without JWT if needed (anon/service)
-- Actually, the Edge functions use service_role so they bypass RLS.
