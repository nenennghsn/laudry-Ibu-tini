import { createClient } from '@supabase/supabase-js';

export const getSupabaseClient = () => {
  const url = localStorage.getItem('supabase_url');
  const key = localStorage.getItem('supabase_key');
  
  if (url && key) {
    try {
      return createClient(url, key);
    } catch (e) {
      console.error("Invalid Supabase credentials", e);
      return null;
    }
  }
  return null;
};

export const hasDbConfig = () => {
  return !!localStorage.getItem('supabase_url') && !!localStorage.getItem('supabase_key');
}