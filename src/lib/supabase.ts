import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Database types (will be generated later with Drizzle)
export type Database = {
  // TODO: Add database types when schema is defined
};

// Auth types
export type AuthUser = {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
};

// Helper functions
export const getSupabaseClient = () => {
  return supabase;
};

export const getSupabaseAuth = () => {
  return supabase.auth;
};

export const getSupabaseDb = () => {
  return supabase.from;
};
