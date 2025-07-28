// Supabase Auth Types
export interface AuthUser {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface AuthSession {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  expires_at?: number;
  token_type: string;
  user: AuthUser;
}

// Supabase Error Types
export interface SupabaseError {
  message: string;
  status?: number;
  name?: string;
}

// Auth State Types
export interface AuthState {
  user: AuthUser | null;
  session: AuthSession | null;
  loading: boolean;
  error: SupabaseError | null;
}

// Database Types (will be extended with Drizzle schema)
export interface Database {
  public: {
    Tables: {
      // TODO: Add table definitions when schema is created
    };
    Views: {
      // TODO: Add view definitions
    };
    Functions: {
      // TODO: Add function definitions
    };
  };
}
