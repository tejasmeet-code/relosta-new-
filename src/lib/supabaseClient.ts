import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase =
  SUPABASE_URL && SUPABASE_ANON_KEY
    ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : null;

if (!supabase) {
  // Helpful debug message when env vars are missing (e.g., on Netlify if not set)
  console.info("Supabase client not initialized: set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.");
}

export default supabase;
