export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "11.2.0 (c820efb)"
  }
  public: {
    Tables: {
      analytics_discord: {
        Row: {
          ai_threads_inactive: number
          ai_threads_opened: number
          ai_threads_resolved: number
          gh_discussions_opened: number
          gh_discussions_resolved: number
          help_threads_inactive: number | null
          help_threads_opened: number
          help_threads_resolved: number
          member_joins: number
          member_leaves: number
          messages: number
          retained_ids: string[]
          total_member_count: number
          week: string
        }
        Insert: {
          ai_threads_inactive?: number
          ai_threads_opened?: number
          ai_threads_resolved?: number
          gh_discussions_opened?: number
          gh_discussions_resolved?: number
          help_threads_inactive?: number | null
          help_threads_opened?: number
          help_threads_resolved?: number
          member_joins?: number
          member_leaves?: number
          messages?: number
          retained_ids?: string[]
          total_member_count?: number
          week: string
        }
        Update: {
          ai_threads_inactive?: number
          ai_threads_opened?: number
          ai_threads_resolved?: number
          gh_discussions_opened?: number
          gh_discussions_resolved?: number
          help_threads_inactive?: number | null
          help_threads_opened?: number
          help_threads_resolved?: number
          member_joins?: number
          member_leaves?: number
          messages?: number
          retained_ids?: string[]
          total_member_count?: number
          week?: string
        }
        Relationships: []
      }
      analytics_discord_staging: {
        Row: {
          ai_threads_inactive: number
          ai_threads_opened: number
          ai_threads_resolved: number
          gh_discussions_opened: number
          gh_discussions_resolved: number
          help_threads_inactive: number | null
          help_threads_opened: number
          help_threads_resolved: number
          member_joins: number
          member_leaves: number
          messages: number
          retained_ids: string[]
          total_member_count: number
          week: string
        }
        Insert: {
          ai_threads_inactive?: number
          ai_threads_opened?: number
          ai_threads_resolved?: number
          gh_discussions_opened?: number
          gh_discussions_resolved?: number
          help_threads_inactive?: number | null
          help_threads_opened?: number
          help_threads_resolved?: number
          member_joins?: number
          member_leaves?: number
          messages?: number
          retained_ids?: string[]
          total_member_count?: number
          week: string
        }
        Update: {
          ai_threads_inactive?: number
          ai_threads_opened?: number
          ai_threads_resolved?: number
          gh_discussions_opened?: number
          gh_discussions_resolved?: number
          help_threads_inactive?: number | null
          help_threads_opened?: number
          help_threads_resolved?: number
          member_joins?: number
          member_leaves?: number
          messages?: number
          retained_ids?: string[]
          total_member_count?: number
          week?: string
        }
        Relationships: []
      }
      analytics_discord_users: {
        Row: {
          discord_user_id: string
          help_messages: number
          messages_sent: number
          self_help_messages: number
        }
        Insert: {
          discord_user_id: string
          help_messages?: number
          messages_sent?: number
          self_help_messages?: number
        }
        Update: {
          discord_user_id?: string
          help_messages?: number
          messages_sent?: number
          self_help_messages?: number
        }
        Relationships: []
      }
      analytics_discord_users_staging: {
        Row: {
          discord_user_id: string
          help_messages: number
          messages_sent: number
          self_help_messages: number
        }
        Insert: {
          discord_user_id: string
          help_messages?: number
          messages_sent?: number
          self_help_messages?: number
        }
        Update: {
          discord_user_id?: string
          help_messages?: number
          messages_sent?: number
          self_help_messages?: number
        }
        Relationships: []
      }
      analytics_msg_internal: {
        Row: {
          message_ts: string
          slack_user_id: string | null
          timestamp: string | null
        }
        Insert: {
          message_ts: string
          slack_user_id?: string | null
          timestamp?: string | null
        }
        Update: {
          message_ts?: string
          slack_user_id?: string | null
          timestamp?: string | null
        }
        Relationships: []
      }
      analytics_msg_internal_staging: {
        Row: {
          message_ts: string
          slack_user_id: string | null
          timestamp: string | null
        }
        Insert: {
          message_ts: string
          slack_user_id?: string | null
          timestamp?: string | null
        }
        Update: {
          message_ts?: string
          slack_user_id?: string | null
          timestamp?: string | null
        }
        Relationships: []
      }
      analytics_msg_syndicated: {
        Row: {
          message_ts: string
          slack_user_id: string | null
          timestamp: string | null
        }
        Insert: {
          message_ts: string
          slack_user_id?: string | null
          timestamp?: string | null
        }
        Update: {
          message_ts?: string
          slack_user_id?: string | null
          timestamp?: string | null
        }
        Relationships: []
      }
      analytics_msg_syndicated_staging: {
        Row: {
          message_ts: string
          slack_user_id: string | null
          timestamp: string | null
        }
        Insert: {
          message_ts: string
          slack_user_id?: string | null
          timestamp?: string | null
        }
        Update: {
          message_ts?: string
          slack_user_id?: string | null
          timestamp?: string | null
        }
        Relationships: []
      }
      analytics_opptie: {
        Row: {
          created_at: string
          opportunity: number
          revenue: number
          thread_ts: string
        }
        Insert: {
          created_at?: string
          opportunity?: number
          revenue?: number
          thread_ts: string
        }
        Update: {
          created_at?: string
          opportunity?: number
          revenue?: number
          thread_ts?: string
        }
        Relationships: []
      }
      analytics_opptie_staging: {
        Row: {
          created_at: string
          opportunity: number
          revenue: number
          thread_ts: string
        }
        Insert: {
          created_at?: string
          opportunity?: number
          revenue?: number
          thread_ts: string
        }
        Update: {
          created_at?: string
          opportunity?: number
          revenue?: number
          thread_ts?: string
        }
        Relationships: []
      }
      analytics_resolutions: {
        Row: {
          slack_user_id: string | null
          thread_ts: string
          timestamp: string
        }
        Insert: {
          slack_user_id?: string | null
          thread_ts: string
          timestamp?: string
        }
        Update: {
          slack_user_id?: string | null
          thread_ts?: string
          timestamp?: string
        }
        Relationships: []
      }
      analytics_resolutions_staging: {
        Row: {
          slack_user_id: string | null
          thread_ts: string
          timestamp: string
        }
        Insert: {
          slack_user_id?: string | null
          thread_ts: string
          timestamp?: string
        }
        Update: {
          slack_user_id?: string | null
          thread_ts?: string
          timestamp?: string
        }
        Relationships: []
      }
      community_raw: {
        Row: {
          created_at: string
          id: number
          origin: string
          raw: Json
          source: string
        }
        Insert: {
          created_at?: string
          id?: number
          origin: string
          raw: Json
          source: string
        }
        Update: {
          created_at?: string
          id?: number
          origin?: string
          raw?: Json
          source?: string
        }
        Relationships: []
      }
      device_codes: {
        Row: {
          access_token: string | null
          client_id: string
          created_at: string
          expires_at: string
          hostname: string
          id: string
          project_id: string | null
          scopes: string[]
        }
        Insert: {
          access_token?: string | null
          client_id: string
          created_at?: string
          expires_at: string
          hostname: string
          id?: string
          project_id?: string | null
          scopes: string[]
        }
        Update: {
          access_token?: string | null
          client_id?: string
          created_at?: string
          expires_at?: string
          hostname?: string
          id?: string
          project_id?: string | null
          scopes?: string[]
        }
        Relationships: []
      }
      discord_csat: {
        Row: {
          rating: number
          thread_id: string
        }
        Insert: {
          rating?: number
          thread_id: string
        }
        Update: {
          rating?: number
          thread_id?: string
        }
        Relationships: []
      }
      discord_csat_staging: {
        Row: {
          rating: number
          thread_id: string
        }
        Insert: {
          rating?: number
          thread_id: string
        }
        Update: {
          rating?: number
          thread_id?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          approval_status: string | null
          city: string | null
          contact_email: string | null
          country: string | null
          created_at: string | null
          description: string | null
          dg_key: string | null
          dg_project: string | null
          end_date: string | null
          id: string
          key: string
          organizer_name: string | null
          slug: string | null
          start_date: string | null
          state: string | null
          street_address: string | null
          title: string | null
          total_days: number | null
          user_id: string | null
          website: string | null
          zip_code: string | null
        }
        Insert: {
          approval_status?: string | null
          city?: string | null
          contact_email?: string | null
          country?: string | null
          created_at?: string | null
          description?: string | null
          dg_key?: string | null
          dg_project?: string | null
          end_date?: string | null
          id?: string
          key?: string
          organizer_name?: string | null
          slug?: string | null
          start_date?: string | null
          state?: string | null
          street_address?: string | null
          title?: string | null
          total_days?: number | null
          user_id?: string | null
          website?: string | null
          zip_code?: string | null
        }
        Update: {
          approval_status?: string | null
          city?: string | null
          contact_email?: string | null
          country?: string | null
          created_at?: string | null
          description?: string | null
          dg_key?: string | null
          dg_project?: string | null
          end_date?: string | null
          id?: string
          key?: string
          organizer_name?: string | null
          slug?: string | null
          start_date?: string | null
          state?: string | null
          street_address?: string | null
          title?: string | null
          total_days?: number | null
          user_id?: string | null
          website?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
      internal_accounts: {
        Row: {
          created_at: string
          discord_id: string | null
          github_username: string | null
          slack_id: string
        }
        Insert: {
          created_at?: string
          discord_id?: string | null
          github_username?: string | null
          slack_id: string
        }
        Update: {
          created_at?: string
          discord_id?: string | null
          github_username?: string | null
          slack_id?: string
        }
        Relationships: []
      }
      internal_accounts_staging: {
        Row: {
          created_at: string
          discord_id: string | null
          github_username: string | null
          slack_id: string
        }
        Insert: {
          created_at?: string
          discord_id?: string | null
          github_username?: string | null
          slack_id: string
        }
        Update: {
          created_at?: string
          discord_id?: string | null
          github_username?: string | null
          slack_id?: string
        }
        Relationships: []
      }
      iris_keys: {
        Row: {
          dg_project_id: string
          dg_token: string
          dg_token_expiry: string
          iv: string
          tag: string
        }
        Insert: {
          dg_project_id: string
          dg_token: string
          dg_token_expiry: string
          iv: string
          tag: string
        }
        Update: {
          dg_project_id?: string
          dg_token?: string
          dg_token_expiry?: string
          iv?: string
          tag?: string
        }
        Relationships: []
      }
      knowledge_base: {
        Row: {
          answer_href: string | null
          answer_improved: string | null
          answer_raw: string | null
          answer_user: string | null
          created_at: string
          id: number
          question_href: string | null
          question_improved: string | null
          question_raw: string | null
          question_usertag: string | null
          raw_id: number | null
          source: string | null
          verified_customer: boolean | null
        }
        Insert: {
          answer_href?: string | null
          answer_improved?: string | null
          answer_raw?: string | null
          answer_user?: string | null
          created_at?: string
          id?: number
          question_href?: string | null
          question_improved?: string | null
          question_raw?: string | null
          question_usertag?: string | null
          raw_id?: number | null
          source?: string | null
          verified_customer?: boolean | null
        }
        Update: {
          answer_href?: string | null
          answer_improved?: string | null
          answer_raw?: string | null
          answer_user?: string | null
          created_at?: string
          id?: number
          question_href?: string | null
          question_improved?: string | null
          question_raw?: string | null
          question_usertag?: string | null
          raw_id?: number | null
          source?: string | null
          verified_customer?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "knowledgebase_raw_id_fkey"
            columns: ["raw_id"]
            isOneToOne: false
            referencedRelation: "community_raw"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_base_staging: {
        Row: {
          answer_href: string | null
          answer_improved: string | null
          answer_raw: string | null
          answer_user: string | null
          created_at: string
          id: number
          question_href: string | null
          question_improved: string | null
          question_raw: string | null
          question_usertag: string | null
          raw_id: number | null
          source: string | null
          verified_customer: boolean | null
        }
        Insert: {
          answer_href?: string | null
          answer_improved?: string | null
          answer_raw?: string | null
          answer_user?: string | null
          created_at?: string
          id?: number
          question_href?: string | null
          question_improved?: string | null
          question_raw?: string | null
          question_usertag?: string | null
          raw_id?: number | null
          source?: string | null
          verified_customer?: boolean | null
        }
        Update: {
          answer_href?: string | null
          answer_improved?: string | null
          answer_raw?: string | null
          answer_user?: string | null
          created_at?: string
          id?: number
          question_href?: string | null
          question_improved?: string | null
          question_raw?: string | null
          question_usertag?: string | null
          raw_id?: number | null
          source?: string | null
          verified_customer?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_base_staging_raw_id_fkey"
            columns: ["raw_id"]
            isOneToOne: false
            referencedRelation: "community_raw"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          dg_project_id: string | null
          discord_id: string | null
          discord_server_id: string | null
          discord_user: string | null
          email: string
          github_id: string | null
          github_user: string | null
          id: string | null
          points: number
          slack_workspace_id: string | null
          uuid: string
        }
        Insert: {
          dg_project_id?: string | null
          discord_id?: string | null
          discord_server_id?: string | null
          discord_user?: string | null
          email: string
          github_id?: string | null
          github_user?: string | null
          id?: string | null
          points?: number
          slack_workspace_id?: string | null
          uuid?: string
        }
        Update: {
          dg_project_id?: string | null
          discord_id?: string | null
          discord_server_id?: string | null
          discord_user?: string | null
          email?: string
          github_id?: string | null
          github_user?: string | null
          id?: string | null
          points?: number
          slack_workspace_id?: string | null
          uuid?: string
        }
        Relationships: []
      }
      saga_thread_messages: {
        Row: {
          created_at: string
          discord_message_id: string | null
          github_message_id: string | null
          slack_message_id: string
        }
        Insert: {
          created_at?: string
          discord_message_id?: string | null
          github_message_id?: string | null
          slack_message_id: string
        }
        Update: {
          created_at?: string
          discord_message_id?: string | null
          github_message_id?: string | null
          slack_message_id?: string
        }
        Relationships: []
      }
      saga_threads: {
        Row: {
          actions_ts: string | null
          closed: boolean
          created_at: string
          details_ts: string | null
          discord_thread_id: string | null
          fullpost_ts: string | null
          github_thread_id: string | null
          github_thread_number: number | null
          id: string
          slack_answer_id: string | null
          slack_thread_id: string | null
        }
        Insert: {
          actions_ts?: string | null
          closed?: boolean
          created_at?: string
          details_ts?: string | null
          discord_thread_id?: string | null
          fullpost_ts?: string | null
          github_thread_id?: string | null
          github_thread_number?: number | null
          id?: string
          slack_answer_id?: string | null
          slack_thread_id?: string | null
        }
        Update: {
          actions_ts?: string | null
          closed?: boolean
          created_at?: string
          details_ts?: string | null
          discord_thread_id?: string | null
          fullpost_ts?: string | null
          github_thread_id?: string | null
          github_thread_number?: number | null
          id?: string
          slack_answer_id?: string | null
          slack_thread_id?: string | null
        }
        Relationships: []
      }
      shortcodes: {
        Row: {
          clicks: number
          created_at: string
          id: number
          source: string | null
          target: string | null
        }
        Insert: {
          clicks?: number
          created_at?: string
          id?: number
          source?: string | null
          target?: string | null
        }
        Update: {
          clicks?: number
          created_at?: string
          id?: number
          source?: string | null
          target?: string | null
        }
        Relationships: []
      }
      slack_installs: {
        Row: {
          app_id: string | null
          auth_version: string | null
          bot_id: string | null
          bot_scopes: string | null
          bot_token: string | null
          bot_user_id: string | null
          dg_project_id: string | null
          enterprise: boolean
          enterprise_id: string | null
          enterprise_name: string | null
          id: number
          team_id: string | null
          team_name: string | null
          token_type: string | null
          user_id: string | null
          user_scopes: string | null
          user_token: string | null
        }
        Insert: {
          app_id?: string | null
          auth_version?: string | null
          bot_id?: string | null
          bot_scopes?: string | null
          bot_token?: string | null
          bot_user_id?: string | null
          dg_project_id?: string | null
          enterprise?: boolean
          enterprise_id?: string | null
          enterprise_name?: string | null
          id?: number
          team_id?: string | null
          team_name?: string | null
          token_type?: string | null
          user_id?: string | null
          user_scopes?: string | null
          user_token?: string | null
        }
        Update: {
          app_id?: string | null
          auth_version?: string | null
          bot_id?: string | null
          bot_scopes?: string | null
          bot_token?: string | null
          bot_user_id?: string | null
          dg_project_id?: string | null
          enterprise?: boolean
          enterprise_id?: string | null
          enterprise_name?: string | null
          id?: number
          team_id?: string | null
          team_name?: string | null
          token_type?: string | null
          user_id?: string | null
          user_scopes?: string | null
          user_token?: string | null
        }
        Relationships: []
      }
      thread_messages: {
        Row: {
          created_at: string
          discord_message_id: string | null
          github_message_id: string | null
          slack_message_id: string
        }
        Insert: {
          created_at?: string
          discord_message_id?: string | null
          github_message_id?: string | null
          slack_message_id: string
        }
        Update: {
          created_at?: string
          discord_message_id?: string | null
          github_message_id?: string | null
          slack_message_id?: string
        }
        Relationships: []
      }
      thread_messages_staging: {
        Row: {
          created_at: string
          discord_message_id: string | null
          github_message_id: string | null
          slack_message_id: string
        }
        Insert: {
          created_at?: string
          discord_message_id?: string | null
          github_message_id?: string | null
          slack_message_id: string
        }
        Update: {
          created_at?: string
          discord_message_id?: string | null
          github_message_id?: string | null
          slack_message_id?: string
        }
        Relationships: []
      }
      threads: {
        Row: {
          actions_ts: string | null
          closed: boolean
          created_at: string
          details_ts: string | null
          discord_thread_id: string | null
          fullpost_ts: string | null
          github_thread_id: string | null
          github_thread_number: number | null
          id: string
          slack_answer_id: string | null
          slack_thread_id: string | null
        }
        Insert: {
          actions_ts?: string | null
          closed?: boolean
          created_at?: string
          details_ts?: string | null
          discord_thread_id?: string | null
          fullpost_ts?: string | null
          github_thread_id?: string | null
          github_thread_number?: number | null
          id?: string
          slack_answer_id?: string | null
          slack_thread_id?: string | null
        }
        Update: {
          actions_ts?: string | null
          closed?: boolean
          created_at?: string
          details_ts?: string | null
          discord_thread_id?: string | null
          fullpost_ts?: string | null
          github_thread_id?: string | null
          github_thread_number?: number | null
          id?: string
          slack_answer_id?: string | null
          slack_thread_id?: string | null
        }
        Relationships: []
      }
      threads_staging: {
        Row: {
          actions_ts: string | null
          closed: boolean
          created_at: string
          details_ts: string | null
          discord_thread_id: string | null
          fullpost_ts: string | null
          github_thread_id: string | null
          github_thread_number: number | null
          id: string
          slack_answer_id: string | null
          slack_thread_id: string | null
        }
        Insert: {
          actions_ts?: string | null
          closed?: boolean
          created_at?: string
          details_ts?: string | null
          discord_thread_id?: string | null
          fullpost_ts?: string | null
          github_thread_id?: string | null
          github_thread_number?: number | null
          id?: string
          slack_answer_id?: string | null
          slack_thread_id?: string | null
        }
        Update: {
          actions_ts?: string | null
          closed?: boolean
          created_at?: string
          details_ts?: string | null
          discord_thread_id?: string | null
          fullpost_ts?: string | null
          github_thread_id?: string | null
          github_thread_number?: number | null
          id?: string
          slack_answer_id?: string | null
          slack_thread_id?: string | null
        }
        Relationships: []
      }
      transcripts: {
        Row: {
          created_at: string | null
          event_id: string | null
          id: number
          transcript: string | null
          transcript_json: Json | null
        }
        Insert: {
          created_at?: string | null
          event_id?: string | null
          id?: number
          transcript?: string | null
          transcript_json?: Json | null
        }
        Update: {
          created_at?: string | null
          event_id?: string | null
          id?: number
          transcript?: string | null
          transcript_json?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "transcripts_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      verified: {
        Row: {
          created_at: string
          discord_id: string
          opt_out: boolean
        }
        Insert: {
          created_at?: string
          discord_id: string
          opt_out: boolean
        }
        Update: {
          created_at?: string
          discord_id?: string
          opt_out?: boolean
        }
        Relationships: []
      }
      verified_staging: {
        Row: {
          created_at: string
          discord_id: string
          opt_out: boolean
        }
        Insert: {
          created_at?: string
          discord_id: string
          opt_out: boolean
        }
        Update: {
          created_at?: string
          discord_id?: string
          opt_out?: boolean
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      limit_to_one_row: {
        Args: { param: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
