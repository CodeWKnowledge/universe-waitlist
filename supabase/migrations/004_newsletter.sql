-- =============================================================================
-- 004_newsletter.sql
-- Purpose: Campaign management, audience grouping, and audience membership.
--
-- Frontend dependencies:
--   - campaignService.js        (createDraft, updateCampaign, scheduleCampaign,
--                                sendBroadcast → reads blocks, audience_id,
--                                segment_tags, schedule_date)
--   - useAdminCampaigns.js      (list, createDraft with segment_tags, deleteCampaign,
--                                updateStatus)
--   - useAdminAudiences.js      (list with subscriber count, createAudience,
--                                deleteAudience, addSubscriberToAudience)
--   - queries.js                (getCampaigns, TABLES.NEWSLETTER_CAMPAIGNS)
--
-- TABLE ORDER MATTERS:
--   audiences must be created BEFORE newsletter_campaigns because campaigns
--   holds a foreign key → audiences(id).
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. Audiences (must come first — campaigns FK references this table)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.audiences (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        TEXT NOT NULL,
    description TEXT,
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE public.audiences IS
    'Named subscriber lists used to target campaigns.';

-- ---------------------------------------------------------------------------
-- 2. Campaigns (references audiences)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.newsletter_campaigns (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Display / editorial
    title           TEXT NOT NULL,
    subject         TEXT NOT NULL,
    content         TEXT,                           -- Raw HTML or plain-text body

    -- Visual email builder stores block JSON here (EmailRenderer.jsx)
    blocks          JSONB DEFAULT '[]'::JSONB,

    -- Targeting
    segment_tags    TEXT[] DEFAULT '{}',            -- useAdminCampaigns.js: segment_tags
    audience_id     UUID REFERENCES public.audiences(id) ON DELETE SET NULL,
    segment_id      UUID,                           -- reserved for future segment table

    -- Lifecycle
    status          TEXT DEFAULT 'draft',           -- 'draft'|'scheduled'|'processing'|'sent'|'failed'
    schedule_date   TIMESTAMP WITH TIME ZONE,       -- campaignService.scheduleCampaign()

    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    CONSTRAINT campaigns_status_check CHECK (
        status IN ('draft', 'scheduled', 'processing', 'sent', 'failed')
    )
);

CREATE TRIGGER campaigns_updated_at
    BEFORE UPDATE ON public.newsletter_campaigns
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();

COMMENT ON TABLE public.newsletter_campaigns IS
    'Email campaigns: draft → scheduled → processing → sent. Blocks stored as JSONB for the visual builder.';

-- ---------------------------------------------------------------------------
-- 3. Audience membership (many-to-many: audiences ↔ subscribers)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.audience_subscribers (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    audience_id     UUID NOT NULL REFERENCES public.audiences(id)    ON DELETE CASCADE,
    subscriber_id   UUID NOT NULL REFERENCES public.subscribers(id)  ON DELETE CASCADE,
    added_at        TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Prevent duplicate membership
    CONSTRAINT audience_subscriber_unique UNIQUE (audience_id, subscriber_id)
);

COMMENT ON TABLE public.audience_subscribers IS
    'Membership table linking audiences to subscribers. Unique constraint prevents duplicates.';
