
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Appointment } from '@/types/appointment';
import { fetchAppointments } from '@/services/appointmentService';

export const useAppointmentsLoader = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [appointmentDates, setAppointmentDates] = useState<Date[]>([]);
  const [selectedProfessionalId, setSelectedProfessionalId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const loadAppointments = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/auth");
        return;
      }

      // Verificar se o usuário está aprovado
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("approved")
        .eq("id", user.id)
        .single();

      if (profileError) throw profileError;

      if (profileData.approved !== true) {
        toast({
          title: "Acesso Negado",
          description: "Sua conta ainda não foi aprovada.",
          variant: "destructive",
        });
        navigate("/dashboard");
        return;
      }

      // Carregar consultas
      const appointmentsData = await fetchAppointments(selectedProfessionalId);
      setAppointments(appointmentsData);
      
      // Extrair datas únicas para o calendário
      if (appointmentsData.length > 0) {
        const uniqueDates = Array.from(
          new Set(appointmentsData.map(apt => apt.date))
        ).map(dateStr => new Date(dateStr));
        
        setAppointmentDates(uniqueDates);
      } else {
        setAppointmentDates([]);
      }
    } catch (error) {
      console.error("Erro ao carregar consultas:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao carregar as consultas",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
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
  }, [navigate, selectedProfessionalId]);

  useEffect(() => {
    loadAppointments();
  }, [selectedProfessionalId]);

  return {
    appointments,
    isLoading,
    appointmentDates,
    loadAppointments,
    selectedProfessionalId,
    setSelectedProfessionalId
  };
};
