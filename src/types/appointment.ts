
export interface Appointment {
  id: string;
  patient_name: string;
  date: string;
  time: string;
  type: "routine" | "return" | "exam" | "emergency";
  notes: string | null;
  created_at: string;
  updated_at: string;
  professional_id: string;
  professional_name?: string;
  profiles?: {
    first_name: string | null;
    last_name: string | null;
  };
}

export type AppointmentFromDB = {
  id: string;
  patient_name: string;
  date: string;
  time: string;
  type: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  professional_id: string;
  profiles?: {
    first_name: string | null;
    last_name: string | null;
  };
}

export type AppointmentTypes = {
  routine: string;
  return: string;
  exam: string;
  emergency: string;
}
