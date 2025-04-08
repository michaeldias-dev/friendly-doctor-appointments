export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      appointments: {
        Row: {
          congregation: string | null
          created_at: string
          date: string
          id: string
          notes: string | null
          patient_name: string
          professional_id: string | null
          profile_id: string | null
          time: string
          type: string
          updated_at: string
        }
        Insert: {
          congregation?: string | null
          created_at?: string
          date: string
          id?: string
          notes?: string | null
          patient_name: string
          professional_id?: string | null
          profile_id?: string | null
          time: string
          type: string
          updated_at?: string
        }
        Update: {
          congregation?: string | null
          created_at?: string
          date?: string
          id?: string
          notes?: string | null
          patient_name?: string
          professional_id?: string | null
          profile_id?: string | null
          time?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
        ]
      }
      medical_records: {
        Row: {
          created_at: string
          diagnosis: string
          doctor_id: string
          id: string
          next_visit: string | null
          notes: string | null
          patient_name: string
          treatment: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          diagnosis: string
          doctor_id: string
          id?: string
          next_visit?: string | null
          notes?: string | null
          patient_name: string
          treatment: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          diagnosis?: string
          doctor_id?: string
          id?: string
          next_visit?: string | null
          notes?: string | null
          patient_name?: string
          treatment?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "medical_records_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      professionals: {
        Row: {
          created_at: string
          first_name: string
          id: string
          last_name: string
          specialty: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          first_name: string
          id?: string
          last_name: string
          specialty?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          first_name?: string
          id?: string
          last_name?: string
          specialty?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          approved: boolean | null
          bio: string | null
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          role: string | null
          specialty: string | null
          type: Database["public"]["Enums"]["user_type"] | null
          updated_at: string
        }
        Insert: {
          approved?: boolean | null
          bio?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          role?: string | null
          specialty?: string | null
          type?: Database["public"]["Enums"]["user_type"] | null
          updated_at?: string
        }
        Update: {
          approved?: boolean | null
          bio?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          role?: string | null
          specialty?: string | null
          type?: Database["public"]["Enums"]["user_type"] | null
          updated_at?: string
        }
        Relationships: []
      }
      social_anamnesis: {
        Row: {
          action_plan: string | null
          created_at: string
          family_composition: string | null
          housing_conditions: string | null
          id: string
          next_visit: string | null
          observations: string | null
          patient_name: string
          social_benefit: string | null
          social_worker_id: string
          socioeconomic_status: string | null
          support_network: string | null
          updated_at: string
        }
        Insert: {
          action_plan?: string | null
          created_at?: string
          family_composition?: string | null
          housing_conditions?: string | null
          id?: string
          next_visit?: string | null
          observations?: string | null
          patient_name: string
          social_benefit?: string | null
          social_worker_id: string
          socioeconomic_status?: string | null
          support_network?: string | null
          updated_at?: string
        }
        Update: {
          action_plan?: string | null
          created_at?: string
          family_composition?: string | null
          housing_conditions?: string | null
          id?: string
          next_visit?: string | null
          observations?: string | null
          patient_name?: string
          social_benefit?: string | null
          social_worker_id?: string
          socioeconomic_status?: string | null
          support_network?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      user_type: "doctor" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_type: ["doctor", "admin"],
    },
  },
} as const
