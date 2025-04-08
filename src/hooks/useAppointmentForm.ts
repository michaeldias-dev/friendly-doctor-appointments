
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Professional } from "@/types/professional";

interface NewAppointmentForm {
  patientName: string;
  date: string;
  time: string;
  type: "routine" | "return" | "exam" | "emergency";
  professionalId: string;
  congregation?: string;
  notes?: string;
}

export const useAppointmentForm = (onSuccess?: () => void) => {
  const form = useForm<NewAppointmentForm>();
  const { toast } = useToast();
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfessionals = async () => {
      try {
        const { data, error } = await supabase
          .from('professionals')
          .select("id, first_name, last_name, specialty")
          .order("first_name", { ascending: true });

        if (error) throw error;
        setProfessionals(data as Professional[] || []);
      } catch (error: any) {
        console.error("Erro ao carregar profissionais:", error.message);
        toast({
          title: "Erro",
          description: "Não foi possível carregar a lista de profissionais.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfessionals();
  }, [toast]);

  const onSubmit = async (data: NewAppointmentForm) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("Usuário não autenticado");
      }

      const { error } = await supabase
        .from('appointments')
        .insert({
          professional_id: data.professionalId,
          profile_id: null,
          patient_name: data.patientName,
          date: data.date,
          time: data.time,
          type: data.type,
          congregation: data.congregation || null,
          notes: data.notes || null,
        });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Consulta agendada com sucesso!",
      });

      form.reset();
      onSuccess?.();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return {
    form,
    professionals,
    isLoading,
    onSubmit: form.handleSubmit(onSubmit)
  };
};
