
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Appointment } from '@/types/appointment';
import { parseISO } from 'date-fns';
import { Tables } from '@/types/supabase';

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

      // Check if user is approved
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

      // Fetch appointments
      let appointmentsQuery = supabase
        .from('appointments')
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
          congregation
        `)
        .order("date", { ascending: true })
        .order("time", { ascending: true });

      if (selectedProfessionalId && selectedProfessionalId !== "all") {
        appointmentsQuery = appointmentsQuery.eq("professional_id", selectedProfessionalId);
      }

      const { data: appointmentsData, error: appointmentsError } = await appointmentsQuery;

      if (appointmentsError) throw appointmentsError;
      
      // Make sure we have data before trying to extract professional IDs
      if (appointmentsData && appointmentsData.length > 0) {
        const professionalIds = Array.from(new Set(appointmentsData
          .filter(apt => apt?.professional_id)
          .map(apt => apt.professional_id as string)));
        
        if (professionalIds.length > 0) {
          const { data: professionalsData, error: professionalsError } = await supabase
            .from('professionals')
            .select("id, first_name, last_name")
            .in("id", professionalIds);
          
          if (professionalsError) throw professionalsError;
          
          const professionalMap = (professionalsData || []).reduce((map, prof) => {
            map[prof.id] = `${prof.first_name || ''} ${prof.last_name || ''}`.trim() || 'Sem nome';
            return map;
          }, {} as Record<string, string>);

          const validAppointments = (appointmentsData || []).map((apt: any): Appointment => {
            return {
              ...apt,
              type: apt.type as "routine" | "return" | "exam" | "emergency",
              professional_name: professionalMap[apt.professional_id || ''] || 'Profissional não encontrado'
            };
          });

          setAppointments(validAppointments);
          
          const uniqueDates = Array.from(
            new Set(validAppointments.map(apt => apt.date))
          ).map(dateStr => parseISO(dateStr));
          
          setAppointmentDates(uniqueDates);
        } else {
          // Handle case with no professionals
          const validAppointments = (appointmentsData || []).map((apt: any): Appointment => {
            return {
              ...apt,
              type: apt.type as "routine" | "return" | "exam" | "emergency",
              professional_name: 'Profissional não atribuído'
            };
          });

          setAppointments(validAppointments);
          
          const uniqueDates = Array.from(
            new Set(validAppointments.map(apt => apt.date))
          ).map(dateStr => parseISO(dateStr));
          
          setAppointmentDates(uniqueDates);
        }
      } else {
        // Handle case with no appointments
        setAppointments([]);
        setAppointmentDates([]);
      }
    } catch (error) {
      console.error("Erro ao carregar consultas:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Função para deletar uma consulta
  const deleteAppointment = async (id: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Consulta excluída com sucesso!",
      });
      
      // Recarregar as consultas após a exclusão
      loadAppointments();
      return true;
    } catch (error: any) {
      console.error("Erro ao excluir consulta:", error);
      toast({
        title: "Erro",
        description: `Não foi possível excluir a consulta: ${error.message}`,
        variant: "destructive",
      });
      return false;
    }
  };

  // Função para atualizar uma consulta
  const updateAppointment = async (id: string, updates: Partial<Appointment>) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({
          patient_name: updates.patient_name,
          date: updates.date,
          time: updates.time,
          type: updates.type,
          notes: updates.notes || null,
          congregation: updates.congregation || null,
          professional_id: updates.professional_id,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Consulta atualizada com sucesso!",
      });
      
      // Recarregar as consultas após a atualização
      loadAppointments();
      return true;
    } catch (error: any) {
      console.error("Erro ao atualizar consulta:", error);
      toast({
        title: "Erro",
        description: `Não foi possível atualizar a consulta: ${error.message}`,
        variant: "destructive",
      });
      return false;
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
    setSelectedProfessionalId,
    deleteAppointment,
    updateAppointment
  };
};
