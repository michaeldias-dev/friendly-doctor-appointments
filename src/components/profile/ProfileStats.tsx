
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format, subMonths } from "date-fns";

export function ProfileStats() {
  const [stats, setStats] = useState({
    totalPatients: 0,
    appointmentsThisMonth: 0,
    yearsOfExperience: 0,
    isLoading: true
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) return;

        // Get user's profile for years of experience data
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
          
        // Get unique patient count
        const { data: patientsData } = await supabase
          .from("appointments")
          .select("patient_name")
          .eq("doctor_id", user.id);
          
        const uniquePatients = new Set(patientsData?.map(apt => apt.patient_name));
        
        // Get appointments for current month
        const currentMonth = format(new Date(), "yyyy-MM");
        const { data: monthlyAppointments } = await supabase
          .from("appointments")
          .select("id")
          .eq("doctor_id", user.id)
          .gte("date", format(subMonths(new Date(), 1), "yyyy-MM-dd"))
          .lte("date", format(new Date(), "yyyy-MM-dd"));
        
        // Calculate years of experience (default to profile specialty start year if available)
        const yearsOfExp = profileData?.specialty ? 
          (profileData.specialty.match(/\d{4}/) ? 
            new Date().getFullYear() - parseInt(profileData.specialty.match(/\d{4}/)[0]) : 
            profileData.bio?.match(/\d{4}/) ? 
              new Date().getFullYear() - parseInt(profileData.bio.match(/\d{4}/)[0]) : 
              0) : 
          0;

        setStats({
          totalPatients: uniquePatients.size,
          appointmentsThisMonth: monthlyAppointments?.length || 0,
          yearsOfExperience: yearsOfExp > 0 ? yearsOfExp : 0,
          isLoading: false
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
        setStats(prev => ({ ...prev, isLoading: false }));
      }
    };

    fetchStats();
  }, []);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl">Estatísticas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-primary-50 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-600 mb-1">Total de Pacientes</p>
            {stats.isLoading ? (
              <div className="h-8 w-16 mx-auto bg-gray-200 animate-pulse rounded"></div>
            ) : (
              <p className="text-xl md:text-2xl font-bold text-primary-700">{stats.totalPatients}</p>
            )}
          </div>
          <div className="bg-primary-50 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-600 mb-1">Consultas Este Mês</p>
            {stats.isLoading ? (
              <div className="h-8 w-16 mx-auto bg-gray-200 animate-pulse rounded"></div>
            ) : (
              <p className="text-xl md:text-2xl font-bold text-primary-700">{stats.appointmentsThisMonth}</p>
            )}
          </div>
          <div className="bg-primary-50 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-600 mb-1">Anos de Experiência</p>
            {stats.isLoading ? (
              <div className="h-8 w-16 mx-auto bg-gray-200 animate-pulse rounded"></div>
            ) : (
              <p className="text-xl md:text-2xl font-bold text-primary-700">{stats.yearsOfExperience}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
