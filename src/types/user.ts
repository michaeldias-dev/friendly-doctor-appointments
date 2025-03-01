
export interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  specialty: string | null;
  email: string;
  approved: boolean | null;
  created_at: string;
  role: string | null;
}
