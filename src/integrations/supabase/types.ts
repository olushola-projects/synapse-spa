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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      admin_users: {
        Row: {
          role: string | null
          user_id: string
        }
        Insert: {
          role?: string | null
          user_id: string
        }
        Update: {
          role?: string | null
          user_id?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          id: string
          ip_address: unknown | null
          new_values: Json | null
          old_values: Json | null
          record_id: string | null
          session_id: string | null
          table_name: string | null
          timestamp: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          session_id?: string | null
          table_name?: string | null
          timestamp?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          session_id?: string | null
          table_name?: string | null
          timestamp?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      badges: {
        Row: {
          created_at: string | null
          description: string
          icon_url: string | null
          id: string
          name: string
          points: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          icon_url?: string | null
          id?: string
          name: string
          points?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          icon_url?: string | null
          id?: string
          name?: string
          points?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      business_metrics: {
        Row: {
          created_at: string | null
          id: string
          measurement_period: string | null
          metric_name: string
          metric_unit: string | null
          metric_value: number
          tags: Json | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          measurement_period?: string | null
          metric_name: string
          metric_unit?: string | null
          metric_value: number
          tags?: Json | null
        }
        Update: {
          created_at?: string | null
          id?: string
          measurement_period?: string | null
          metric_name?: string
          metric_unit?: string | null
          metric_value?: number
          tags?: Json | null
        }
        Relationships: []
      }
      classification_explanations: {
        Row: {
          classification_id: string
          confidence_factors: Json | null
          created_at: string | null
          explanation_data: Json
          explanation_type: string
          human_readable_explanation: string | null
          id: string
          regulatory_references: Json | null
          technical_explanation: Json | null
          user_id: string | null
        }
        Insert: {
          classification_id: string
          confidence_factors?: Json | null
          created_at?: string | null
          explanation_data: Json
          explanation_type: string
          human_readable_explanation?: string | null
          id?: string
          regulatory_references?: Json | null
          technical_explanation?: Json | null
          user_id?: string | null
        }
        Update: {
          classification_id?: string
          confidence_factors?: Json | null
          created_at?: string | null
          explanation_data?: Json
          explanation_type?: string
          human_readable_explanation?: string | null
          id?: string
          regulatory_references?: Json | null
          technical_explanation?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
      compliance_assessments: {
        Row: {
          assessment_data: Json
          compliance_score: number | null
          created_at: string
          entity_id: string
          fund_name: string
          id: string
          status: string
          target_article: string
          updated_at: string
          user_id: string
          validation_results: Json | null
        }
        Insert: {
          assessment_data: Json
          compliance_score?: number | null
          created_at?: string
          entity_id: string
          fund_name: string
          id?: string
          status?: string
          target_article: string
          updated_at?: string
          user_id: string
          validation_results?: Json | null
        }
        Update: {
          assessment_data?: Json
          compliance_score?: number | null
          created_at?: string
          entity_id?: string
          fund_name?: string
          id?: string
          status?: string
          target_article?: string
          updated_at?: string
          user_id?: string
          validation_results?: Json | null
        }
        Relationships: []
      }
      compliance_reports: {
        Row: {
          assessment_id: string | null
          created_at: string
          expires_at: string | null
          file_path: string | null
          generated_at: string
          id: string
          report_data: Json
          report_type: string
          user_id: string
        }
        Insert: {
          assessment_id?: string | null
          created_at?: string
          expires_at?: string | null
          file_path?: string | null
          generated_at?: string
          id?: string
          report_data: Json
          report_type: string
          user_id: string
        }
        Update: {
          assessment_id?: string | null
          created_at?: string
          expires_at?: string | null
          file_path?: string | null
          generated_at?: string
          id?: string
          report_data?: Json
          report_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "compliance_reports_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "compliance_assessments"
            referencedColumns: ["id"]
          },
        ]
      }
      data_lineage: {
        Row: {
          classification_id: string | null
          created_at: string | null
          data_sources: Json
          id: string
          processing_pipeline: string
          source_document_id: string | null
          transformation_steps: Json
          version_info: Json | null
        }
        Insert: {
          classification_id?: string | null
          created_at?: string | null
          data_sources: Json
          id?: string
          processing_pipeline: string
          source_document_id?: string | null
          transformation_steps: Json
          version_info?: Json | null
        }
        Update: {
          classification_id?: string | null
          created_at?: string | null
          data_sources?: Json
          id?: string
          processing_pipeline?: string
          source_document_id?: string | null
          transformation_steps?: Json
          version_info?: Json | null
        }
        Relationships: []
      }
      documents: {
        Row: {
          analysis_results: Json | null
          created_at: string
          document_type: string
          file_size: number | null
          file_type: string
          filename: string
          id: string
          processing_status: string
          storage_path: string
          updated_at: string
          upload_date: string
          user_id: string
        }
        Insert: {
          analysis_results?: Json | null
          created_at?: string
          document_type: string
          file_size?: number | null
          file_type: string
          filename: string
          id?: string
          processing_status?: string
          storage_path: string
          updated_at?: string
          upload_date?: string
          user_id: string
        }
        Update: {
          analysis_results?: Json | null
          created_at?: string
          document_type?: string
          file_size?: number | null
          file_type?: string
          filename?: string
          id?: string
          processing_status?: string
          storage_path?: string
          updated_at?: string
          upload_date?: string
          user_id?: string
        }
        Relationships: []
      }
      forum_posts: {
        Row: {
          category: string
          content: string
          created_at: string
          id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category: string
          content: string
          created_at?: string
          id?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          content?: string
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      llm_classification_audit: {
        Row: {
          api_key_hash: string | null
          classification_result: string
          confidence_score: number | null
          document_type: string
          explainability_data: Json | null
          id: string
          input_text: string
          llm_strategy: string
          model_version: string | null
          processing_time_ms: number | null
          regulatory_flags: Json | null
          timestamp: string | null
          user_id: string | null
        }
        Insert: {
          api_key_hash?: string | null
          classification_result: string
          confidence_score?: number | null
          document_type: string
          explainability_data?: Json | null
          id?: string
          input_text: string
          llm_strategy: string
          model_version?: string | null
          processing_time_ms?: number | null
          regulatory_flags?: Json | null
          timestamp?: string | null
          user_id?: string | null
        }
        Update: {
          api_key_hash?: string | null
          classification_result?: string
          confidence_score?: number | null
          document_type?: string
          explainability_data?: Json | null
          id?: string
          input_text?: string
          llm_strategy?: string
          model_version?: string | null
          processing_time_ms?: number | null
          regulatory_flags?: Json | null
          timestamp?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          id: string
          jurisdiction: string[] | null
          name: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          id: string
          jurisdiction?: string[] | null
          name: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          jurisdiction?: string[] | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      regulatory_updates: {
        Row: {
          description: string
          id: string
          is_featured: boolean | null
          jurisdiction: string
          published_at: string
          title: string
          url: string | null
        }
        Insert: {
          description: string
          id?: string
          is_featured?: boolean | null
          jurisdiction: string
          published_at?: string
          title: string
          url?: string | null
        }
        Update: {
          description?: string
          id?: string
          is_featured?: boolean | null
          jurisdiction?: string
          published_at?: string
          title?: string
          url?: string | null
        }
        Relationships: []
      }
      risk_assessments: {
        Row: {
          assessment_id: string | null
          created_at: string
          id: string
          identified_risks: Json | null
          mitigation_recommendations: Json | null
          risk_categories: Json
          risk_score: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          assessment_id?: string | null
          created_at?: string
          id?: string
          identified_risks?: Json | null
          mitigation_recommendations?: Json | null
          risk_categories: Json
          risk_score?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          assessment_id?: string | null
          created_at?: string
          id?: string
          identified_risks?: Json | null
          mitigation_recommendations?: Json | null
          risk_categories?: Json
          risk_score?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "risk_assessments_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "compliance_assessments"
            referencedColumns: ["id"]
          },
        ]
      }
      "SFDR Navigator Beta": {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      sfdr_audit_trail: {
        Row: {
          action_type: string
          classification_id: string | null
          confidence_score: number | null
          created_at: string | null
          data_lineage: Json | null
          decision_data: Json
          explainability_data: Json | null
          id: string
          input_hash: string | null
          output_hash: string | null
          processing_time_ms: number | null
          regulatory_basis: string | null
          retention_until: string | null
          user_id: string | null
        }
        Insert: {
          action_type: string
          classification_id?: string | null
          confidence_score?: number | null
          created_at?: string | null
          data_lineage?: Json | null
          decision_data: Json
          explainability_data?: Json | null
          id?: string
          input_hash?: string | null
          output_hash?: string | null
          processing_time_ms?: number | null
          regulatory_basis?: string | null
          retention_until?: string | null
          user_id?: string | null
        }
        Update: {
          action_type?: string
          classification_id?: string | null
          confidence_score?: number | null
          created_at?: string | null
          data_lineage?: Json | null
          decision_data?: Json
          explainability_data?: Json | null
          id?: string
          input_hash?: string | null
          output_hash?: string | null
          processing_time_ms?: number | null
          regulatory_basis?: string | null
          retention_until?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      sla_metrics: {
        Row: {
          additional_data: Json | null
          id: string
          is_breached: boolean | null
          measurement_timestamp: string | null
          metric_type: string
          metric_value: number
          service_name: string
          threshold_value: number
        }
        Insert: {
          additional_data?: Json | null
          id?: string
          is_breached?: boolean | null
          measurement_timestamp?: string | null
          metric_type: string
          metric_value: number
          service_name: string
          threshold_value: number
        }
        Update: {
          additional_data?: Json | null
          id?: string
          is_breached?: boolean | null
          measurement_timestamp?: string | null
          metric_type?: string
          metric_value?: number
          service_name?: string
          threshold_value?: number
        }
        Relationships: []
      }
      system_health_metrics: {
        Row: {
          alert_threshold_breached: boolean | null
          details: Json | null
          error_rate: number | null
          id: string
          response_time_ms: number | null
          service_name: string
          status: string
          timestamp: string | null
        }
        Insert: {
          alert_threshold_breached?: boolean | null
          details?: Json | null
          error_rate?: number | null
          id?: string
          response_time_ms?: number | null
          service_name: string
          status: string
          timestamp?: string | null
        }
        Update: {
          alert_threshold_breached?: boolean | null
          details?: Json | null
          error_rate?: number | null
          id?: string
          response_time_ms?: number | null
          service_name?: string
          status?: string
          timestamp?: string | null
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          awarded_at: string
          badge_id: string
          id: string
          user_id: string
        }
        Insert: {
          awarded_at?: string
          badge_id: string
          id?: string
          user_id: string
        }
        Update: {
          awarded_at?: string
          badge_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
        ]
      }
      waitlist: {
        Row: {
          company: string | null
          created_at: string
          email: string
          id: string
          name: string
          role: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string
          email: string
          id?: string
          name: string
          role?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          role?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
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
