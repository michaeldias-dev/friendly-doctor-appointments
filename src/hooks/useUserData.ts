
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { UserProfile } from "@/types/user";

export const useUserData = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      console.log("Carregando usuários...");
      
      // Fetch all profiles - RLS policies will automatically restrict access based on user role
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, specialty, approved, created_at, role, email')
        .order('created_at', { ascending: false });

      if (profilesError) {
        console.error("Erro ao buscar perfis:", profilesError);
        throw profilesError;
      }

      console.log("Perfis carregados:", profilesData);
      
      if (profilesData.length === 0) {
        console.log("Nenhum perfil encontrado");
      }
      
      // Priorizar usuários pendentes (aprovação null)
      const sortedUsers = profilesData.sort((a, b) => {
        // Pendentes primeiro (approved é null)
        if (a.approved === null && b.approved !== null) return -1;
        if (a.approved !== null && b.approved === null) return 1;
        
        // Depois rejeitados (approved é false)
        if (a.approved === false && b.approved === true) return -1;
        if (a.approved === true && b.approved === false) return 1;
        
        // Por fim, pela data mais recente
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });

      setUsers(sortedUsers);
    } catch (error: any) {
      console.error("Erro ao carregar usuários:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar a lista de usuários",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  return {
    users,
    isLoading,
    loadUsers
  };
};
