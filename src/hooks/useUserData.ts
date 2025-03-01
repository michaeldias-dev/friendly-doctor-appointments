
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { UserProfile } from "@/components/admin/UsersList";

// Definição de tipo para os usuários retornados pela API Auth do Supabase
interface AuthUser {
  id: string;
  email: string;
  [key: string]: any; // Para outras propriedades que possam existir
}

export const useUserData = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      // Carregar TODOS os perfis de usuários da tabela profiles, independentemente do status de aprovação
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, specialty, approved, created_at, role')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Buscar emails separadamente da API de autenticação
      const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) {
        console.error("Erro ao buscar dados de autenticação:", authError);
        // Se não conseguirmos buscar emails, pelo menos mostramos os outros dados
        const formattedUsers = profilesData.map(profile => ({
          ...profile,
          email: 'Email não disponível'
        }));
        setUsers(formattedUsers);
        return;
      }

      // Mapear emails para perfis usando um Map para eficiência
      const userEmailMap = new Map<string, string>();
      
      if (authData?.users) {
        (authData.users as AuthUser[]).forEach(user => {
          userEmailMap.set(user.id, user.email);
        });
      }

      // Combinar dados de perfil com emails
      const formattedUsers = profilesData.map(profile => ({
        ...profile,
        email: userEmailMap.get(profile.id) || 'Email não disponível'
      }));

      // Ordenar usuários - pendentes primeiro, depois por data mais recente
      const sortedUsers = formattedUsers.sort((a, b) => {
        // Usuários não aprovados primeiro (se approved é null ou false)
        if ((a.approved === null || a.approved === false) && (b.approved === true)) return -1;
        if ((a.approved === true) && (b.approved === null || b.approved === false)) return 1;
        
        // Depois por data mais recente
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });

      console.log("Perfis carregados:", sortedUsers);
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
