import { createClient } from '@supabase/supabase-js';

// PUBLIC_INTERFACE
/**
 * Supabase client for SyncStream.
 * Replace the placeholders below with your Supabase project's URL and anon/public key.
 */
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL || '<YOUR_SUPABASE_URL>';
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY || '<YOUR_SUPABASE_ANON_KEY>';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
