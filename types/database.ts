export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      leads: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          ip_hash: string | null
          name: string
          phone: string | null
          project_id: string
          verified: boolean | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          ip_hash?: string | null
          name: string
          phone?: string | null
          project_id: string
          verified?: boolean | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          ip_hash?: string | null
          name?: string
          phone?: string | null
          project_id?: string
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          auth_type: Database["public"]["Enums"]["project_auth"] | null
          created_at: string | null
          id: string
          lead_count: number | null
          long_description: string | null
          name: string
          password_hash: string | null
          project_password: string | null
          published: boolean | null
          remember_visitor: boolean | null
          short_description: string | null
          slug: string
          theme: string
          custom_domain: string | null
          location: string | null
          architect: string | null
          area: string | null
          year: string | null
          stream_url: string | null
          thumbnail_dark: string | null
          thumbnail_light: string | null
          updated_at: string | null
          user_id: string
          view_count: number | null
        }
        Insert: {
          auth_type?: Database["public"]["Enums"]["project_auth"] | null
          created_at?: string | null
          id?: string
          lead_count?: number | null
          long_description?: string | null
          name: string
          password_hash?: string | null
          project_password?: string | null
          published?: boolean | null
          remember_visitor?: boolean | null
          short_description?: string | null
          slug: string
          theme?: string
          custom_domain?: string | null
          location?: string | null
          architect?: string | null
          area?: string | null
          year?: string | null
          stream_url?: string | null
          thumbnail_dark?: string | null
          thumbnail_light?: string | null
          updated_at?: string | null
          user_id: string
          view_count?: number | null
        }
        Update: {
          auth_type?: Database["public"]["Enums"]["project_auth"] | null
          created_at?: string | null
          id?: string
          lead_count?: number | null
          long_description?: string | null
          name?: string
          password_hash?: string | null
          project_password?: string | null
          published?: boolean | null
          remember_visitor?: boolean | null
          short_description?: string | null
          slug?: string
          theme?: string
          custom_domain?: string | null
          location?: string | null
          architect?: string | null
          area?: string | null
          year?: string | null
          stream_url?: string | null
          thumbnail_dark?: string | null
          thumbnail_light?: string | null
          updated_at?: string | null
          user_id?: string
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          id: string
          name: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          id: string
          name?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string | null
        }
        Relationships: []
      }
      visitors: {
        Row: {
          device: string | null
          id: string
          ip_hash: string | null
          lead_id: string | null
          project_id: string
          visited_at: string | null
        }
        Insert: {
          device?: string | null
          id?: string
          ip_hash?: string | null
          lead_id?: string | null
          project_id: string
          visited_at?: string | null
        }
        Update: {
          device?: string | null
          id?: string
          ip_hash?: string | null
          lead_id?: string | null
          project_id?: string
          visited_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "visitors_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "visitors_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          plan: string
          credits: number
          projects_used: number
          status: string
          current_period_end: string | null
          created_at: string | null
          plan_updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          plan?: string
          credits?: number
          projects_used?: number
          status?: string
          current_period_end?: string | null
          created_at?: string | null
          plan_updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          plan?: string
          credits?: number
          projects_used?: number
          status?: string
          current_period_end?: string | null
          created_at?: string | null
          plan_updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      slug_redirects: {
        Row: {
          id: string
          old_slug: string
          new_slug: string
          project_id: string
          created_at: string | null
        }
        Insert: {
          id?: string
          old_slug: string
          new_slug: string
          project_id: string
          created_at?: string | null
        }
        Update: {
          id?: string
          old_slug?: string
          new_slug?: string
          project_id?: string
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "slug_redirects_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      project_auth: "public" | "password" | "otp"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      project_auth: ["public", "password", "otp"],
    },
  },
} as const
