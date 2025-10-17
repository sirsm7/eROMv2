// src/api/supabaseClient.js
// Klien Supabase modular, ikut SOP "src/api/*".
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

if (!window.SUPABASE_URL || !window.SUPABASE_ANON_KEY) {
  console.error("SUPABASE_URL/ANON_KEY tidak ditemui. Semak script config dalam index.html.");
}

export const supa = createClient(
  window.SUPABASE_URL,
  window.SUPABASE_ANON_KEY,
  { auth: { persistSession: false, autoRefreshToken: false } }
);
