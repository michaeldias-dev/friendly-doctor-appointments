
import { useState, useEffect } from 'react';
import { format, isSameDay } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Appointment, AppointmentFromDB } from '@/types/appointment';

export const useAppointments = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [appointmentDates, setAppointmentDates] = useState<Date[]>([]);
  const navigate = useNavigate();

  const loadAppointments = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase
        .from("appointments")
        .select()
        .order("date", { ascending: true })
        .order("time", { ascending: true });

      if (error) throw error;

      const validAppointments = (data || []).filter((apt): apt is AppointmentFromDB => {
        const validTypes = ["routine", "return", "exam", "emergency"];
        return validTypes.includes(apt.type);
      }).map((apt): Appointment => ({
        ...apt,
        type: apt.type as "routine" | "return" | "exam" | "emergency"
      }));

      setAppointments(validAppointments);
      
      // Extrair datas únicas para marcar no calendário
      const uniqueDates = Array.from(new Set(
        validAppointments.map(apt => apt.date)
      )).map(dateStr => new Date(dateStr));
      
      setAppointmentDates(uniqueDates);
    } catch (error) {
      console.error("Erro ao carregar consultas:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
    
    // Configurar listener para atualizações em tempo real
    const channel = supabase
      .channel('appointments-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'appointments' },
        () => {
          loadAppointments();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [navigate]);

  const filteredAppointments = appointments.filter(appointment => {
    if (!date) return false;
    return appointment.date === format(date, "yyyy-MM-dd");
  });
  
  // Função para destacar dias com consultas no calendário
  const isDayWithAppointments = (day: Date) => {
    return appointmentDates.some(appointmentDate => 
      isSameDay(day, appointmentDate)
    );
  };

  return {
    date,
    setDate,
    appointments,
    isLoading,
    selectedAppointment,
    setSelectedAppointment,
    filteredAppointments,
    isDayWithAppointments,
    loadAppointments
  };
};
