
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Appointment } from '@/types/appointment';

export const useAppointmentData = () => {
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

      // Construir a query base para buscar consultas
      let appointmentsQuery = supabase
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
          professional_id
        `)
        .order("date", { ascending: true })
        .order("time", { ascending: true });

      // Aplicar filtro de profissional se selecionado e não for "all"
      if (selectedProfessionalId && selectedProfessionalId !== "all") {
        appointmentsQuery = appointmentsQuery.eq("professional_id", selectedProfessionalId);
      }

      const { data: appointmentsData, error: appointmentsError } = await appointmentsQuery;

      if (appointmentsError) throw appointmentsError;
      
      // Buscar os nomes dos profissionais separadamente para evitar o erro de relação
      const professionalIds = Array.from(new Set((appointmentsData || []).map(apt => apt.professional_id)));
      
      const { data: professionalsData, error: professionalsError } = await supabase
        .from("profiles")
        .select("id, first_name, last_name")
        .in("id", professionalIds);
      
      if (professionalsError) throw professionalsError;
      
      // Criar um mapa de id para nome de profissional para facilitar a busca
      const professionalMap = (professionalsData || []).reduce((map, prof) => {
        map[prof.id] = `${prof.first_name || ''} ${prof.last_name || ''}`.trim() || 'Sem nome';
        return map;
      }, {} as Record<string, string>);

      // Mapear os dados para incluir informações do profissional
      const validAppointments = (appointmentsData || []).map((apt: any): Appointment => {
        return {
          ...apt,
          type: apt.type as "routine" | "return" | "exam" | "emergency",
          professional_name: professionalMap[apt.professional_id] || 'Profissional não encontrado'
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
  }, [navigate, selectedProfessionalId]); // Adicionar selectedProfessionalId como dependência

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
