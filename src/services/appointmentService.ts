
import { supabase } from "@/integrations/supabase/client";
import { Appointment } from "@/types/appointment";
import { Tables } from "@/types/supabase";

// Função para carregar consultas
export const fetchAppointments = async (selectedProfessionalId: string | null = null) => {
  try {
    // Buscar as consultas
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
    
    if (!appointmentsData || appointmentsData.length === 0) {
      return [];
    }

    // Extrair IDs dos profissionais para buscar nomes
    const professionalIds = Array.from(new Set(appointmentsData
      .filter(apt => apt?.professional_id)
      .map(apt => apt.professional_id as string)));
    
    // Se tiver profissionais, buscar seus dados
    if (professionalIds.length > 0) {
      const { data: professionalsData, error: professionalsError } = await supabase
        .from('professionals')
        .select("id, first_name, last_name")
        .in("id", professionalIds);
      
      if (professionalsError) throw professionalsError;
      
      // Mapear IDs dos profissionais para seus nomes completos
      const professionalMap = (professionalsData || []).reduce((map, prof) => {
        map[prof.id] = `${prof.first_name || ''} ${prof.last_name || ''}`.trim() || 'Sem nome';
        return map;
      }, {} as Record<string, string>);

      // Adicionar nomes dos profissionais às consultas
      return (appointmentsData || []).map((apt: any): Appointment => {
        return {
          ...apt,
          type: apt.type as "routine" | "return" | "exam" | "emergency",
          professional_name: professionalMap[apt.professional_id || ''] || 'Profissional não encontrado'
        };
      });
    } else {
      // Caso não tenha profissionais associados
      return (appointmentsData || []).map((apt: any): Appointment => {
        return {
          ...apt,
          type: apt.type as "routine" | "return" | "exam" | "emergency",
          professional_name: 'Profissional não atribuído'
        };
      });
    }
  } catch (error) {
    console.error("Erro ao buscar consultas:", error);
    throw error;
  }
};

// Função para deletar uma consulta
export const deleteAppointment = async (id: string) => {
  try {
    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Erro ao excluir consulta:", error);
    throw error;
  }
};

// Função para atualizar uma consulta
export const updateAppointment = async (id: string, updates: Partial<Appointment>) => {
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
    return true;
  } catch (error) {
    console.error("Erro ao atualizar consulta:", error);
    throw error;
  }
};
