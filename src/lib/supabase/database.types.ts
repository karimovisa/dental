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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      appointments: {
        Row: {
          appointment_date: string
          comment: string | null
          created_at: string
          doctor_id: string
          end_time: string
          id: string
          parent_appointment_id: string | null
          patient_id: string | null
          patient_name: string
          patient_phone: string
          service_id: string | null
          source: string
          start_time: string
          status: string
        }
        Insert: {
          appointment_date: string
          comment?: string | null
          created_at?: string
          doctor_id: string
          end_time: string
          id?: string
          parent_appointment_id?: string | null
          patient_id?: string | null
          patient_name: string
          patient_phone: string
          service_id?: string | null
          source?: string
          start_time: string
          status?: string
        }
        Update: {
          appointment_date?: string
          comment?: string | null
          created_at?: string
          doctor_id?: string
          end_time?: string
          id?: string
          parent_appointment_id?: string | null
          patient_id?: string | null
          patient_name?: string
          patient_phone?: string
          service_id?: string | null
          source?: string
          start_time?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_parent_appointment_id_fkey"
            columns: ["parent_appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      before_after_cases: {
        Row: {
          after_image_url: string
          before_image_url: string
          caption: string | null
          caption_ru: string | null
          caption_uz: string | null
          created_at: string
          display_order: number
          id: string
          is_published: boolean
        }
        Insert: {
          after_image_url: string
          before_image_url: string
          caption?: string | null
          caption_ru?: string | null
          caption_uz?: string | null
          created_at?: string
          display_order?: number
          id?: string
          is_published?: boolean
        }
        Update: {
          after_image_url?: string
          before_image_url?: string
          caption?: string | null
          caption_ru?: string | null
          caption_uz?: string | null
          created_at?: string
          display_order?: number
          id?: string
          is_published?: boolean
        }
        Relationships: []
      }
      certificates: {
        Row: {
          created_at: string
          display_order: number
          id: string
          image_url: string
          is_published: boolean
          title: string | null
          title_ru: string | null
          title_uz: string | null
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: string
          image_url: string
          is_published?: boolean
          title?: string | null
          title_ru?: string | null
          title_uz?: string | null
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          image_url?: string
          is_published?: boolean
          title?: string | null
          title_ru?: string | null
          title_uz?: string | null
        }
        Relationships: []
      }
      clinic_settings: {
        Row: {
          address: string | null
          booking_requires_approval: boolean
          cancellation_cutoff_hours: number
          clinic_name: string | null
          email: string | null
          facebook_url: string | null
          id: number
          instagram_url: string | null
          logo_url: string | null
          map_embed_url: string | null
          phone: string | null
          slot_granularity_minutes: number
          tagline: string | null
          telegram_url: string | null
          working_hours: Json | null
          working_hours_note: string | null
          working_hours_note_ru: string | null
          working_hours_note_uz: string | null
        }
        Insert: {
          address?: string | null
          booking_requires_approval?: boolean
          cancellation_cutoff_hours?: number
          clinic_name?: string | null
          email?: string | null
          facebook_url?: string | null
          id?: number
          instagram_url?: string | null
          logo_url?: string | null
          map_embed_url?: string | null
          phone?: string | null
          slot_granularity_minutes?: number
          tagline?: string | null
          telegram_url?: string | null
          working_hours?: Json | null
          working_hours_note?: string | null
          working_hours_note_ru?: string | null
          working_hours_note_uz?: string | null
        }
        Update: {
          address?: string | null
          booking_requires_approval?: boolean
          cancellation_cutoff_hours?: number
          clinic_name?: string | null
          email?: string | null
          facebook_url?: string | null
          id?: number
          instagram_url?: string | null
          logo_url?: string | null
          map_embed_url?: string | null
          phone?: string | null
          slot_granularity_minutes?: number
          tagline?: string | null
          telegram_url?: string | null
          working_hours?: Json | null
          working_hours_note?: string | null
          working_hours_note_ru?: string | null
          working_hours_note_uz?: string | null
        }
        Relationships: []
      }
      doctor_availability_override: {
        Row: {
          date: string
          doctor_id: string
          end_time: string | null
          id: string
          is_day_off: boolean
          start_time: string | null
        }
        Insert: {
          date: string
          doctor_id: string
          end_time?: string | null
          id?: string
          is_day_off?: boolean
          start_time?: string | null
        }
        Update: {
          date?: string
          doctor_id?: string
          end_time?: string | null
          id?: string
          is_day_off?: boolean
          start_time?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "doctor_availability_override_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
        ]
      }
      doctor_weekly_schedule: {
        Row: {
          doctor_id: string
          end_time: string
          id: string
          start_time: string
          weekday: number
        }
        Insert: {
          doctor_id: string
          end_time: string
          id?: string
          start_time: string
          weekday: number
        }
        Update: {
          doctor_id?: string
          end_time?: string
          id?: string
          start_time?: string
          weekday?: number
        }
        Relationships: [
          {
            foreignKeyName: "doctor_weekly_schedule_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
        ]
      }
      doctors: {
        Row: {
          bio: string | null
          bio_ru: string | null
          bio_uz: string | null
          created_at: string
          display_order: number
          experience_years: number | null
          id: string
          image_url: string | null
          is_active: boolean
          name: string
          specialization: string | null
          specialization_ru: string | null
          specialization_uz: string | null
        }
        Insert: {
          bio?: string | null
          bio_ru?: string | null
          bio_uz?: string | null
          created_at?: string
          display_order?: number
          experience_years?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          name: string
          specialization?: string | null
          specialization_ru?: string | null
          specialization_uz?: string | null
        }
        Update: {
          bio?: string | null
          bio_ru?: string | null
          bio_uz?: string | null
          created_at?: string
          display_order?: number
          experience_years?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          name?: string
          specialization?: string | null
          specialization_ru?: string | null
          specialization_uz?: string | null
        }
        Relationships: []
      }
      faqs: {
        Row: {
          answer: string
          answer_ru: string | null
          answer_uz: string | null
          display_order: number
          id: string
          is_published: boolean
          question: string
          question_ru: string | null
          question_uz: string | null
        }
        Insert: {
          answer: string
          answer_ru?: string | null
          answer_uz?: string | null
          display_order?: number
          id?: string
          is_published?: boolean
          question: string
          question_ru?: string | null
          question_uz?: string | null
        }
        Update: {
          answer?: string
          answer_ru?: string | null
          answer_uz?: string | null
          display_order?: number
          id?: string
          is_published?: boolean
          question?: string
          question_ru?: string | null
          question_uz?: string | null
        }
        Relationships: []
      }
      gallery_images: {
        Row: {
          caption: string | null
          caption_ru: string | null
          caption_uz: string | null
          created_at: string
          display_order: number
          id: string
          image_url: string
          is_published: boolean
        }
        Insert: {
          caption?: string | null
          caption_ru?: string | null
          caption_uz?: string | null
          created_at?: string
          display_order?: number
          id?: string
          image_url: string
          is_published?: boolean
        }
        Update: {
          caption?: string | null
          caption_ru?: string | null
          caption_uz?: string | null
          created_at?: string
          display_order?: number
          id?: string
          image_url?: string
          is_published?: boolean
        }
        Relationships: []
      }
      patients: {
        Row: {
          first_seen: string
          full_name: string
          id: string
          notes: string | null
          phone: string
        }
        Insert: {
          first_seen?: string
          full_name: string
          id?: string
          notes?: string | null
          phone: string
        }
        Update: {
          first_seen?: string
          full_name?: string
          id?: string
          notes?: string | null
          phone?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          created_at: string
          display_order: number
          id: string
          is_published: boolean
          patient_name: string
          photo_url: string | null
          rating: number | null
          source: string | null
          text: string | null
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: string
          is_published?: boolean
          patient_name: string
          photo_url?: string | null
          rating?: number | null
          source?: string | null
          text?: string | null
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          is_published?: boolean
          patient_name?: string
          photo_url?: string | null
          rating?: number | null
          source?: string | null
          text?: string | null
        }
        Relationships: []
      }
      services: {
        Row: {
          booking_type: string
          buffer_minutes: number
          created_at: string
          description: string | null
          description_ru: string | null
          description_uz: string | null
          display_order: number
          duration_minutes: number
          icon: string | null
          id: string
          is_published: boolean
          price: number | null
          title: string
          title_ru: string | null
          title_uz: string | null
        }
        Insert: {
          booking_type?: string
          buffer_minutes?: number
          created_at?: string
          description?: string | null
          description_ru?: string | null
          description_uz?: string | null
          display_order?: number
          duration_minutes: number
          icon?: string | null
          id?: string
          is_published?: boolean
          price?: number | null
          title: string
          title_ru?: string | null
          title_uz?: string | null
        }
        Update: {
          booking_type?: string
          buffer_minutes?: number
          created_at?: string
          description?: string | null
          description_ru?: string | null
          description_uz?: string | null
          display_order?: number
          duration_minutes?: number
          icon?: string | null
          id?: string
          is_published?: boolean
          price?: number | null
          title?: string
          title_ru?: string | null
          title_uz?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cancel_booking: {
        Args: { p_appointment_id: string; p_phone: string }
        Returns: undefined
      }
      create_booking: {
        Args: {
          p_comment?: string
          p_date: string
          p_doctor_id: string
          p_patient_name: string
          p_patient_phone: string
          p_service_id: string
          p_start: string
        }
        Returns: {
          appointment_id: string
          status: string
        }[]
      }
      get_available_slots: {
        Args: { p_date: string; p_doctor_id: string; p_service_id: string }
        Returns: {
          slot_end: string
          slot_start: string
        }[]
      }
      get_booking: {
        Args: { p_appointment_id: string; p_phone: string }
        Returns: {
          appointment_date: string
          can_modify: boolean
          doctor_id: string
          id: string
          service_id: string
          service_title: string
          start_time: string
          status: string
        }[]
      }
      normalize_uz_phone: { Args: { p_phone: string }; Returns: string }
      reschedule_booking: {
        Args: {
          p_appointment_id: string
          p_new_date: string
          p_new_start: string
          p_phone: string
          p_reason?: string
        }
        Returns: {
          appointment_id: string
          status: string
        }[]
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
