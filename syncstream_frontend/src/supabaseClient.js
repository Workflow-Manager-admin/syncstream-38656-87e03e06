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
const SUPABASE_URL = typeof process !== "undefined" && process.env && process.env.REACT_APP_SUPABASE_URL
  ? process.env.REACT_APP_SUPABASE_URL
  : "https://rlnkyrtrvgvgcajqyfhe.supabase.co"; // <-- REPLACE with your Supabase URL or use env var

const SUPABASE_ANON_KEY = typeof process !== "undefined" && process.env && process.env.REACT_APP_SUPABASE_ANON_KEY
  ? process.env.REACT_APP_SUPABASE_ANON_KEY
  : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJsbmt5cnRydmd2Z2NhanF5ZmhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzMTk1MzksImV4cCI6MjA2NDg5NTUzOX0.IaZwzGGl080wFP3jxnFFcAYIGmll0flnluPkSTJJeGY"; // <-- REPLACE with your anon/public key or use env var

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
