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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      live_status: {
        Row: {
          is_live: boolean
          member_id: string
          updated_at: string
        }
        Insert: {
          is_live?: boolean
          member_id: string
          updated_at?: string
        }
        Update: {
          is_live?: boolean
          member_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      recruitment_submissions: {
        Row: {
          area: string
          created_at: string
          email: string | null
          id: string
          link_rc: string | null
          nombre_nickname: string
          red_facebook: string | null
          red_instagram: string | null
          red_tiktok: string | null
          red_twitch: string | null
          red_youtube: string | null
          sobre_ti: string
        }
        Insert: {
          area: string
          created_at?: string
          email?: string | null
          id?: string
          link_rc?: string | null
          nombre_nickname: string
          red_facebook?: string | null
          red_instagram?: string | null
          red_tiktok?: string | null
          red_twitch?: string | null
          red_youtube?: string | null
          sobre_ti: string
        }
        Update: {
          area?: string
          created_at?: string
          email?: string | null
          id?: string
          link_rc?: string | null
          nombre_nickname?: string
          red_facebook?: string | null
          red_instagram?: string | null
          red_tiktok?: string | null
          red_twitch?: string | null
          red_youtube?: string | null
          sobre_ti?: string
        }
        Relationships: []
      }
      roster_members: {
        Row: {
          category: Database["public"]["Enums"]["roster_category"]
          created_at: string
          id: string
          nickname: string
          sort_order: number
        }
        Insert: {
          category: Database["public"]["Enums"]["roster_category"]
          created_at?: string
          id?: string
          nickname: string
          sort_order?: number
        }
        Update: {
          category?: Database["public"]["Enums"]["roster_category"]
          created_at?: string
          id?: string
          nickname?: string
          sort_order?: number
        }
        Relationships: []
      }
      waves_members: {
        Row: {
          bio: string
          created_at: string
          id: string
          name: string
          photo_url: string
          redes: string
          social_href: string | null
          social_label: string | null
          sort_order: number
        }
        Insert: {
          bio?: string
          created_at?: string
          id?: string
          name: string
          photo_url: string
          redes?: string
          social_href?: string | null
          social_label?: string | null
          sort_order?: number
        }
        Update: {
          bio?: string
          created_at?: string
          id?: string
          name?: string
          photo_url?: string
          redes?: string
          social_href?: string | null
          social_label?: string | null
          sort_order?: number
        }
        Relationships: []
      }
      waves_socials: {
        Row: {
          facebook_url: string | null
          name: string
          tiktok_url: string | null
          twitch_url: string | null
          updated_at: string
          x_url: string | null
          youtube_url: string | null
        }
        Insert: {
          facebook_url?: string | null
          name: string
          tiktok_url?: string | null
          twitch_url?: string | null
          updated_at?: string
          x_url?: string | null
          youtube_url?: string | null
        }
        Update: {
          facebook_url?: string | null
          name?: string
          tiktok_url?: string | null
          twitch_url?: string | null
          updated_at?: string
          x_url?: string | null
          youtube_url?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      roster_category: "crew" | "legends" | "killers"
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
      roster_category: ["crew", "legends", "killers"],
    },
  },
} as const
