
import { useState, useEffect } from 'react';
import { format, isSameDay, isSameMonth, isAfter, isBefore, parseISO } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Appointment, AppointmentFromDB } from '@/types/appointment';

export const useAppointments = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [appointmentDates, setAppointmentDates] = useState<Date[]>([]);
  const [professionals, setProfessionals] = useState<{ id: string; name: string }[]>([]);
  const [selectedProfessionalId, setSelectedProfessionalId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const loadProfessionals = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, first_name, last_name")
        .eq("approved", true)
        .order("first_name", { ascending: true });

      if (error) throw error;

      const formattedProfessionals = data.map(prof => ({
        id: prof.id,
        name: `${prof.first_name || ''} ${prof.last_name || ''}`.trim() || 'Sem nome'
      }));

      setProfessionals(formattedProfessionals);
    } catch (error) {
      console.error("Erro ao carregar profissionais:", error);
    }
  };

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
          // Garantir que profiles é um objeto válido e não null
          const profiles = apt.profiles;
          if (typeof profiles === 'object' && profiles !== null) {
            // Verificar se as propriedades first_name e last_name existem
            const firstName = 'first_name' in profiles ? profiles.first_name || '' : '';
            const lastName = 'last_name' in profiles ? profiles.last_name || '' : '';
            professional_name = `${firstName} ${lastName}`.trim() || 'Sem nome';
          }
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

  useEffect(() => {
    loadProfessionals();
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

  // Recarregar consultas quando o profissional selecionado mudar
  useEffect(() => {
    loadAppointments();
  }, [selectedProfessionalId]);

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

  // Contagem de consultas do mês atual
  const appointmentsThisMonth = appointments.filter(appointment => {
    const appointmentDate = parseISO(appointment.date);
    const today = new Date();
    return isSameMonth(appointmentDate, today);
  }).length;

  // Contagem de consultas futuras (a partir de hoje)
  const upcomingAppointments = appointments.filter(appointment => {
    const appointmentDate = parseISO(appointment.date);
    const today = new Date();
    return isAfter(appointmentDate, today) || isSameDay(appointmentDate, today);
  }).length;

  // Contagem de consultas passadas
  const pastAppointments = appointments.filter(appointment => {
    const appointmentDate = parseISO(appointment.date);
    const today = new Date();
    return isBefore(appointmentDate, today) && !isSameDay(appointmentDate, today);
  }).length;

  return {
    date,
    setDate,
    appointments,
    isLoading,
    selectedAppointment,
    setSelectedAppointment,
    filteredAppointments,
    isDayWithAppointments,
    loadAppointments,
    professionals,
    selectedProfessionalId,
    setSelectedProfessionalId,
    appointmentsThisMonth,
    upcomingAppointments,
    pastAppointments
  };
};
