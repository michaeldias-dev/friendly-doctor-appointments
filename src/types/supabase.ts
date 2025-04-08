
export type Tables = {
  appointments: {
    Row: {
      id: string;
      patient_name: string;
      date: string;
      time: string;
      type: "routine" | "return" | "exam" | "emergency";
      notes: string | null;
      created_at: string;
      updated_at: string;
      professional_id: string | null;
      profile_id: string | null;
      congregation: string | null;
    }
  },
  professionals: {
    Row: {
      id: string;
      first_name: string;
      last_name: string;
      specialty: string | null;
      created_at: string;
      updated_at: string;
    }
  },
  profiles: {
    Row: {
      id: string;
      first_name: string | null;
      last_name: string | null;
      specialty: string | null;
    }
  }
}
