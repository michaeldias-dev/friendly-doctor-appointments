
export interface Appointment {
  id: string;
  patient_name: string;
  date: string;
  time: string;
  type: "routine" | "return" | "exam" | "emergency";
  notes: string | null;
  created_at: string;
  updated_at: string;
  doctor_id: string;
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
  doctor_id: string;
}

export type AppointmentTypes = {
  routine: string;
  return: string;
  exam: string;
  emergency: string;
}
