// src/api/supabaseClient.js
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = window.SUPABASE_URL;
const SUPABASE_ANON_KEY = window.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error("Konfigurasi Supabase tidak lengkap pada window.*");
}

export const supa = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false, autoRefreshToken: false }
});
