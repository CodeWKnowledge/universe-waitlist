import { createClient } from "@supabase/supabase-js";
import { supabaseConfig } from "./config";

if (!supabaseConfig.url || !supabaseConfig.anonKey) {
  console.warn(
    "Supabase configuration is missing. Please provide VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env"
  );
}

export const supabase = createClient(
  supabaseConfig.url || "https://placeholder.supabase.co",
  supabaseConfig.anonKey || "placeholder_key"
);
