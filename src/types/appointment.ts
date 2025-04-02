
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
  congregation?: string | null;
  profiles?: {
    first_name: string | null;
    last_name: string | null;
  } | null | any; // Adicionado 'any' para lidar com erro de tipagem
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
  congregation?: string | null;
  profiles?: {
    first_name: string | null;
    last_name: string | null;
  } | null | any; // Adicionado 'any' para lidar com erro de tipagem
}

export type AppointmentTypes = {
  routine: string;
  return: string;
  exam: string;
  emergency: string;
}
