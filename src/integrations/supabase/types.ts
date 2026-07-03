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
      driver_locations: {
        Row: {
          driver_id: string
          heading: number | null
          lat: number
          lng: number
          online: boolean
          updated_at: string
        }
        Insert: {
          driver_id: string
          heading?: number | null
          lat: number
          lng: number
          online?: boolean
          updated_at?: string
        }
        Update: {
          driver_id?: string
          heading?: number | null
          lat?: number
          lng?: number
          online?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          name: string | null
          phone: string | null
          photo: string | null
          plate: string | null
          rating: number
          total_trips: number
          updated_at: string
          vehicle: string | null
        }
        Insert: {
          created_at?: string
          id: string
          name?: string | null
          phone?: string | null
          photo?: string | null
          plate?: string | null
          rating?: number
          total_trips?: number
          updated_at?: string
          vehicle?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string | null
          phone?: string | null
          photo?: string | null
          plate?: string | null
          rating?: number
          total_trips?: number
          updated_at?: string
          vehicle?: string | null
        }
        Relationships: []
      }
      rides: {
        Row: {
          accepted_at: string | null
          ai_reasoning: string | null
          cancellation_reason: string | null
          cancelled_at: string | null
          car_type: string | null
          completed_at: string | null
          created_at: string
          distance_km: number | null
          driver_id: string | null
          drop_lat: number | null
          drop_lng: number | null
          drop_loc: string
          duration_min: number | null
          fare_estimate: number | null
          fare_final: number | null
          id: string
          owner_id: string
          pickup: string
          pickup_lat: number | null
          pickup_lng: number | null
          share_token: string | null
          started_at: string | null
          status: string
        }
        Insert: {
          accepted_at?: string | null
          ai_reasoning?: string | null
          cancellation_reason?: string | null
          cancelled_at?: string | null
          car_type?: string | null
          completed_at?: string | null
          created_at?: string
          distance_km?: number | null
          driver_id?: string | null
          drop_lat?: number | null
          drop_lng?: number | null
          drop_loc: string
          duration_min?: number | null
          fare_estimate?: number | null
          fare_final?: number | null
          id?: string
          owner_id: string
          pickup: string
          pickup_lat?: number | null
          pickup_lng?: number | null
          share_token?: string | null
          started_at?: string | null
          status?: string
        }
        Update: {
          accepted_at?: string | null
          ai_reasoning?: string | null
          cancellation_reason?: string | null
          cancelled_at?: string | null
          car_type?: string | null
          completed_at?: string | null
          created_at?: string
          distance_km?: number | null
          driver_id?: string | null
          drop_lat?: number | null
          drop_lng?: number | null
          drop_loc?: string
          duration_min?: number | null
          fare_estimate?: number | null
          fare_final?: number | null
          id?: string
          owner_id?: string
          pickup?: string
          pickup_lat?: number | null
          pickup_lng?: number | null
          share_token?: string | null
          started_at?: string | null
          status?: string
        }
        Relationships: []
      }
      sos_incidents: {
        Row: {
          created_at: string
          id: string
          lat: number
          lng: number
          note: string | null
          resolved: boolean
          ride_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          lat: number
          lng: number
          note?: string | null
          resolved?: boolean
          ride_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          lat?: number
          lng?: number
          note?: string | null
          resolved?: boolean
          ride_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sos_incidents_ride_id_fkey"
            columns: ["ride_id"]
            isOneToOne: false
            referencedRelation: "public_trip_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sos_incidents_ride_id_fkey"
            columns: ["ride_id"]
            isOneToOne: false
            referencedRelation: "rides"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      public_trip_view: {
        Row: {
          driver_heading: number | null
          driver_id: string | null
          driver_lat: number | null
          driver_lng: number | null
          driver_name: string | null
          drop_lat: number | null
          drop_lng: number | null
          drop_loc: string | null
          id: string | null
          pickup: string | null
          pickup_lat: number | null
          pickup_lng: number | null
          plate: string | null
          rating: number | null
          share_token: string | null
          status: string | null
          vehicle: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      assign_self_role: {
        Args: { _role: Database["public"]["Enums"]["app_role"] }
        Returns: undefined
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "owner" | "driver" | "admin"
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
      app_role: ["owner", "driver", "admin"],
    },
  },
} as const
