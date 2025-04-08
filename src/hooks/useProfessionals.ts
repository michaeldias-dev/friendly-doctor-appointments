
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Professional } from '@/types/professional';

export const useProfessionals = () => {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(false);

  const loadProfessionals = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("id, first_name, last_name, specialty")
        .eq("approved", true)
        .order("first_name", { ascending: true });

      if (error) throw error;

      setProfessionals(data || []);
    } catch (error) {
      console.error("Erro ao carregar profissionais:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfessionals();
  }, []);

  const createProfessional = async (professional: Omit<Professional, 'id'>) => {
    try {
      setLoading(true);
      // Generate a random UUID for the new professional
      const id = crypto.randomUUID();
      
      const { error } = await supabase
        .from("profiles")
        .insert({
          id,
          first_name: professional.first_name,
          last_name: professional.last_name,
          specialty: professional.specialty,
          approved: true
        });

      if (error) throw error;
      
      // Reload professionals after creating a new one
      loadProfessionals();
      return { success: true };
    } catch (error) {
      console.error("Erro ao criar profissional:", error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const updateProfessional = async (id: string, updates: Partial<Omit<Professional, 'id'>>) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", id);

      if (error) throw error;
      
      // Reload professionals after updating
      loadProfessionals();
      return { success: true };
    } catch (error) {
      console.error("Erro ao atualizar profissional:", error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const deleteProfessional = async (id: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      // Reload professionals after deleting
      loadProfessionals();
      return { success: true };
    } catch (error) {
      console.error("Erro ao excluir profissional:", error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  return { 
    professionals, 
    loading, 
    createProfessional, 
    updateProfessional, 
    deleteProfessional,
    refresh: loadProfessionals
  };
};
