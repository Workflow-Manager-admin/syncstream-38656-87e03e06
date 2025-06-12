import { createClient } from '@supabase/supabase-js';

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
const SUPABASE_URL =
  process.env.REACT_APP_SUPABASE_URL || "https://rlnkyrtrvgvgcajqyfhe.supabase.co";
const SUPABASE_ANON_KEY =
  process.env.REACT_APP_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJsbmt5cnRydmd2Z2NhanF5ZmhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzMTk1MzksImV4cCI6MjA2NDg5NTUzOX0.IaZwzGGl080wFP3jxnFFcAYIGmll0flnluPkSTJJeGY";

/**
 * Create the Supabase client.
 * The client will include the anon key in the Authorization and apikey headers for all requests.
 */
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  global: {
    headers: {
      // Both headers are required by Supabase REST API for all endpoints.
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
  },
});

/**
 * Helper for fetch requests (if you ever use fetch directly for Supabase REST endpoints)
 * This ensures the required Supabase headers are always included.
 * Use: await supabaseFetch(url, fetchOptions)
 */
// PUBLIC_INTERFACE
export async function supabaseFetch(url, options = {}) {
  // Clone headers to avoid mutating passed-in options
  const headers = {
    ...(options.headers || {}),
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json',
  };
  return fetch(url, { ...options, headers });
}
