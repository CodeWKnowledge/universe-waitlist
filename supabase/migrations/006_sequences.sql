-- =============================================================================
-- 006_sequences.sql
-- Purpose: Email automation sequences (drip campaigns).
--
-- Frontend dependencies:
--   - useAdminSequences.js  (SELECT email_sequences + sequence_steps(*) +
--                            sequence_subscribers(count), createSequence,
--                            updateStatus)
--   - AutomationsPage.jsx   (renders sequences list, trigger_event, steps,
--                            activeSubscribers count)
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Sequences — named automation workflows
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.email_sequences (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            TEXT NOT NULL,
    description     TEXT,
    trigger_event   TEXT NOT NULL,    -- 'waitlist_join' | 'referral_converted'
    status          TEXT DEFAULT 'draft',   -- 'draft' | 'active' | 'paused'
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    CONSTRAINT sequence_status_check CHECK (
        status IN ('draft', 'active', 'paused')
    ),
    CONSTRAINT sequence_trigger_check CHECK (
        trigger_event IN ('waitlist_join', 'referral_converted')
    )
);

CREATE TRIGGER email_sequences_updated_at
    BEFORE UPDATE ON public.email_sequences
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Sequence steps — ordered emails within a sequence
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.sequence_steps (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sequence_id     UUID NOT NULL REFERENCES public.email_sequences(id) ON DELETE CASCADE,

    step_number     INTEGER NOT NULL,        -- used for ordering in useAdminSequences.js
    email_type      TEXT NOT NULL,           -- maps to email_queue.email_type
    subject         TEXT,
    delay_days      INTEGER DEFAULT 0,       -- days after sequence start to send

    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    CONSTRAINT sequence_step_unique UNIQUE (sequence_id, step_number)
);

-- ---------------------------------------------------------------------------
-- Sequence subscribers — tracks who is enrolled in which sequence
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.sequence_subscribers (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sequence_id     UUID NOT NULL REFERENCES public.email_sequences(id)  ON DELETE CASCADE,
    subscriber_id   UUID NOT NULL REFERENCES public.subscribers(id)       ON DELETE CASCADE,
    enrolled_at     TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    current_step    INTEGER DEFAULT 0,
    status          TEXT DEFAULT 'active',   -- 'active' | 'completed' | 'unsubscribed'

    CONSTRAINT sequence_subscriber_unique UNIQUE (sequence_id, subscriber_id)
);

COMMENT ON TABLE public.email_sequences IS
    'Named drip campaign workflows triggered by subscriber events.';
COMMENT ON TABLE public.sequence_steps IS
    'Individual emails within a sequence, ordered by step_number.';
COMMENT ON TABLE public.sequence_subscribers IS
    'Enrollment tracking — one row per subscriber per sequence.';
