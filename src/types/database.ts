// Database types generated from Drizzle schema
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          created_at: Date;
          updated_at: Date;
        };
        Insert: {
          id?: string;
          email: string;
          name?: string | null;
          created_at?: Date;
          updated_at?: Date;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          created_at?: Date;
          updated_at?: Date;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          user_id: string;
          color: string | null;
          created_at: Date;
          updated_at: Date;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          user_id: string;
          color?: string | null;
          created_at?: Date;
          updated_at?: Date;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          user_id?: string;
          color?: string | null;
          created_at?: Date;
          updated_at?: Date;
        };
      };
      tags: {
        Row: {
          id: string;
          name: string;
          user_id: string;
          color: string | null;
          created_at: Date;
          updated_at: Date;
        };
        Insert: {
          id?: string;
          name: string;
          user_id: string;
          color?: string | null;
          created_at?: Date;
          updated_at?: Date;
        };
        Update: {
          id?: string;
          name?: string;
          user_id?: string;
          color?: string | null;
          created_at?: Date;
          updated_at?: Date;
        };
      };
      memos: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          content: string;
          summary: string | null;
          category_id: string | null;
          is_archived: boolean;
          created_at: Date;
          updated_at: Date;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          content: string;
          summary?: string | null;
          category_id?: string | null;
          is_archived?: boolean;
          created_at?: Date;
          updated_at?: Date;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          content?: string;
          summary?: string | null;
          category_id?: string | null;
          is_archived?: boolean;
          created_at?: Date;
          updated_at?: Date;
        };
      };
      memo_tags: {
        Row: {
          memo_id: string;
          tag_id: string;
        };
        Insert: {
          memo_id: string;
          tag_id: string;
        };
        Update: {
          memo_id?: string;
          tag_id?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

// Extended types for relationships
export interface MemoWithRelations {
  id: string;
  user_id: string;
  title: string;
  content: string;
  summary: string | null;
  category_id: string | null;
  is_archived: boolean;
  created_at: Date;
  updated_at: Date;
  category?: {
    id: string;
    name: string;
    description: string | null;
    user_id: string;
    color: string | null;
    created_at: Date;
    updated_at: Date;
  } | null;
  tags?: Array<{
    id: string;
    name: string;
    user_id: string;
    color: string | null;
    created_at: Date;
    updated_at: Date;
  }>;
}

export interface UserDashboard {
  user: {
    id: string;
    email: string;
    name: string | null;
    created_at: Date;
    updated_at: Date;
  };
  stats: {
    memoCount: number;
    categoryCount: number;
    tagCount: number;
  };
  recentMemos: Array<{
    id: string;
    user_id: string;
    title: string;
    content: string;
    summary: string | null;
    category_id: string | null;
    is_archived: boolean;
    created_at: Date;
    updated_at: Date;
  }>;
}

// Query result types
export interface MemoSearchResult {
  id: string;
  title: string;
  content: string;
  summary: string | null;
  category_id: string | null;
  is_archived: boolean;
  created_at: Date;
  updated_at: Date;
  category_name?: string | null;
  tag_names?: string[];
}

// Pagination types
export interface PaginationOptions {
  limit?: number;
  offset?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}
