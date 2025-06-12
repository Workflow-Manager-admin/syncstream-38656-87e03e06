import { createClient } from '@supabase/supabase-js';

// PUBLIC_INTERFACE
/**
 * Supabase client for SyncStream.
 * 
 * Best Practices:
 * - If using Create React App, Vite, or a similar tool that inlines environment variables,
 *   put REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY in a `.env` file in the project root.
 *   These will be inlined during the build process.
 * - If you are NOT using such a build tool, fill in the URL/key directly below (do NOT use process.env in the browser!).
 *
 * -----
 * For this template, if you haven't set up environment variables, just paste your credentials below:
 */
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
