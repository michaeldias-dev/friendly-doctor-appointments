
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface SocialAnamnesis {
  id: string;
  patient_name: string;
  family_composition: string;
  housing_conditions: string;
  socioeconomic_status: string;
  support_network: string;
  observations: string;
  action_plan: string;
  next_visit: string | null;
  created_at: string;
}

export const useSocialAnamnesis = () => {
  const [anamneses, setAnamneses] = useState<SocialAnamnesis[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const loadAnamneses = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase
        .from("social_anamnesis")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setAnamneses(data || []);
    } catch (error) {
      console.error("Erro ao carregar anamneses sociais:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAnamneses();
  }, [navigate]);

  return {
    anamneses,
    isLoading,
    refreshAnamneses: loadAnamneses
  };
};
