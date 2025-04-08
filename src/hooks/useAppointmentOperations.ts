
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Appointment } from '@/types/appointment';
import { deleteAppointment as deleteAppointmentService, updateAppointment as updateAppointmentService } from '@/services/appointmentService';

export const useAppointmentOperations = (onSuccess?: () => void) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Função para deletar uma consulta
  const deleteAppointment = async (id: string) => {
    try {
      setIsLoading(true);
      await deleteAppointmentService(id);
      
      toast({
        title: "Sucesso",
        description: "Consulta excluída com sucesso!",
      });
      
      // Callback de sucesso se fornecido
      if (onSuccess) onSuccess();
      return true;
    } catch (error: any) {
      console.error("Erro ao excluir consulta:", error);
      toast({
        title: "Erro",
        description: `Não foi possível excluir a consulta: ${error.message}`,
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Função para atualizar uma consulta
  const updateAppointment = async (id: string, updates: Partial<Appointment>) => {
    try {
      setIsLoading(true);
      await updateAppointmentService(id, updates);
      
      toast({
        title: "Sucesso",
        description: "Consulta atualizada com sucesso!",
      });
      
      // Callback de sucesso se fornecido
      if (onSuccess) onSuccess();
      return true;
    } catch (error: any) {
      console.error("Erro ao atualizar consulta:", error);
      toast({
        title: "Erro",
        description: `Não foi possível atualizar a consulta: ${error.message}`,
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    deleteAppointment,
    updateAppointment
  };
};
