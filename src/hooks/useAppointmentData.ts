
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Appointment, AppointmentFromDB } from '@/types/appointment';

export const useAppointmentData = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [appointmentDates, setAppointmentDates] = useState<Date[]>([]);
  const [selectedProfessionalId, setSelectedProfessionalId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const loadAppointments = async () => {
    try {
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

      // Construir a query base
      let query = supabase
        .from("appointments")
        .select(`
          id, 
          patient_name, 
          date, 
          time, 
          type, 
          notes, 
          created_at, 
          updated_at, 
          professional_id,
          profiles(first_name, last_name)
        `)
        .order("date", { ascending: true })
        .order("time", { ascending: true });

      // Aplicar filtro de profissional se selecionado
      if (selectedProfessionalId) {
        query = query.eq("professional_id", selectedProfessionalId);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Mapear os dados para incluir informações do profissional
      const validAppointments = (data || []).map((apt): Appointment => {
        let professional_name = 'Profissional não encontrado';
        
        // Adicionar verificação segura para apt.profiles
        if (apt.profiles) {
          const firstName = apt.profiles.first_name || '';
          const lastName = apt.profiles.last_name || '';
          professional_name = `${firstName} ${lastName}`.trim() || 'Sem nome';
        }
        
        return {
          ...apt,
          type: apt.type as "routine" | "return" | "exam" | "emergency",
          professional_name
        };
      });

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

  // Configurar listener para atualizações em tempo real
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
  }, [navigate]);

  // Recarregar consultas quando o profissional selecionado mudar
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
