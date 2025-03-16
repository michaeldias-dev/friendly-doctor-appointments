
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useProfessionals = () => {
  const [professionals, setProfessionals] = useState<{ id: string; name: string }[]>([]);

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

  useEffect(() => {
    loadProfessionals();
  }, []);

  return { professionals };
};
