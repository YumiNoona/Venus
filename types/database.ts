export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string | null;
          name: string | null;
          avatar_url: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          email?: string | null;
          name?: string | null;
          avatar_url?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          email?: string | null;
          name?: string | null;
          avatar_url?: string | null;
          created_at?: string | null;
        };
      };
      projects: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          slug: string;
          thumbnail_light: string | null;
          thumbnail_dark: string | null;
          short_description: string | null;
          long_description: string | null;
          stream_url: string | null;
          auth_type: "public" | "password" | "otp";
          password: string | null;
          published: boolean;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          slug: string;
          thumbnail_light?: string | null;
          thumbnail_dark?: string | null;
          short_description?: string | null;
          long_description?: string | null;
          stream_url?: string | null;
          auth_type?: "public" | "password" | "otp";
          password?: string | null;
          published?: boolean;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          slug?: string;
          thumbnail_light?: string | null;
          thumbnail_dark?: string | null;
          short_description?: string | null;
          long_description?: string | null;
          stream_url?: string | null;
          auth_type?: "public" | "password" | "otp";
          password?: string | null;
          published?: boolean;
          created_at?: string | null;
        };
      };
      leads: {
        Row: {
          id: string;
          project_id: string;
          name: string;
          phone: string | null;
          email: string | null;
          verified: boolean;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          project_id: string;
          name: string;
          phone?: string | null;
          email?: string | null;
          verified?: boolean;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          project_id?: string;
          name?: string;
          phone?: string | null;
          email?: string | null;
          verified?: boolean;
          created_at?: string | null;
        };
      };
      visitors: {
        Row: {
          id: string;
          project_id: string;
          lead_id: string | null;
          ip: string | null;
          device: string | null;
          visited_at: string | null;
        };
        Insert: {
          id?: string;
          project_id: string;
          lead_id?: string | null;
          ip?: string | null;
          device?: string | null;
          visited_at?: string | null;
        };
        Update: {
          id?: string;
          project_id?: string;
          lead_id?: string | null;
          ip?: string | null;
          device?: string | null;
          visited_at?: string | null;
        };
      };
    };
  };
}

