import { createClient, type SupabaseClient } from '@supabase/supabase-js';

import type { Database } from '$lib/server/database.types';
import { supabaseConfig } from '$lib/server/env';

const sharedAuth = { persistSession: false, autoRefreshToken: false };

let _supabasePublic: SupabaseClient<Database> | undefined;
let _supabaseAdmin: SupabaseClient<Database> | undefined;

export const getSupabasePublic = () => {
  if (!_supabasePublic) {
    _supabasePublic = createClient<Database>(supabaseConfig.url, supabaseConfig.publishableKey, {
      auth: sharedAuth
    });
  }
  return _supabasePublic;
};

export const getSupabaseAdmin = () => {
  if (!_supabaseAdmin) {
    _supabaseAdmin = createClient<Database>(supabaseConfig.url, supabaseConfig.secretKey, {
      auth: sharedAuth
    });
  }
  return _supabaseAdmin;
};
