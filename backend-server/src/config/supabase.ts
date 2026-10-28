import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_PUBLISHABLE_KEY;

let client: SupabaseClient | undefined;

export function hasSupabaseConfig(): boolean {
  return Boolean(supabaseUrl && supabaseKey);
}

export function getSupabase(): SupabaseClient {
  if (!client) {
    if (!hasSupabaseConfig()) {
      throw new Error('SUPABASE_URL and SUPABASE_SECRET_KEY must be configured');
    }
    client = createClient(supabaseUrl as string, supabaseKey as string, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }
  return client;
}
