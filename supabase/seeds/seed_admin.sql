-- =============================================================================
-- seeds/seed_admin.sql
-- Purpose: Insert the first admin user after initial deployment.
--
-- HOW TO USE:
--   1. Go to your Supabase Dashboard → Authentication → Users
--   2. Create a new user with your admin email + password
--   3. Copy the user's UUID from the Users table
--   4. Replace <YOUR-ADMIN-USER-UUID> below with that UUID
--   5. Run this file in the SQL Editor
--
-- After this, log in at /admin with that email and password.
-- The RequireAdmin.jsx component will verify the row exists in admin_roles.
-- =============================================================================

INSERT INTO public.admin_roles (user_id)
VALUES ('<YOUR-ADMIN-USER-UUID>')
ON CONFLICT (user_id) DO NOTHING;
