
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
      // Buscar todos os perfis de usuários da tabela profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, specialty, approved, created_at, role, email')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Já que agora temos o email diretamente da tabela profiles, não precisamos fazer a chamada admin
      console.log("Perfis carregados:", profilesData);
      
      // Ordenar usuários - pendentes primeiro, depois por data mais recente
      const sortedUsers = profilesData.sort((a, b) => {
        // Usuários não aprovados primeiro (se approved é null ou false)
        if ((a.approved === null || a.approved === false) && (b.approved === true)) return -1;
        if ((a.approved === true) && (b.approved === null || b.approved === false)) return 1;
        
        // Depois por data mais recente
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });

      setUsers(sortedUsers);
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os usuários",
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
