
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { UserProfile } from "@/components/admin/UsersList";

// Definição de tipo para os usuários retornados pela API Auth do Supabase
interface AuthUser {
  id: string;
  email: string;
  [key: string]: any; // Para outras propriedades que possam existir
}

export const useAdminUsers = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const checkAdmin = async () => {
    // Verificar se o usuário atual é um administrador
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      navigate("/auth");
      return false;
    }

    // Agora verificamos a role diretamente no perfil do usuário
    const { data: userProfile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error("Erro ao verificar perfil do usuário:", profileError);
      return false;
    }

    const isUserAdmin = userProfile?.role === 'admin';
    setIsAdmin(isUserAdmin);
    
    if (!isUserAdmin) {
      navigate("/dashboard");
      toast({
        title: "Acesso negado",
        description: "Você não tem permissão para acessar esta área",
        variant: "destructive"
      });
    }
    
    return isUserAdmin;
  };

  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      // Carregar TODOS os perfis de usuários da tabela profiles incluindo pendentes
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

  const handleApprove = async (userId: string, approve: boolean) => {
    try {
      // Atualizar o status de aprovação do usuário
      const { error } = await supabase
        .from('profiles')
        .update({ approved: approve })
        .eq('id', userId);

      if (error) throw error;

      // Atualizar a lista de usuários
      await loadUsers();
      
      toast({
        title: approve ? "Usuário aprovado" : "Usuário rejeitado",
        description: approve 
          ? "O usuário agora pode acessar o sistema" 
          : "O acesso do usuário foi negado",
      });
      
      // No mundo real, aqui você enviaria um email notificando o usuário
      // sobre a aprovação ou rejeição
      const user = users.find(u => u.id === userId);
      if (user) {
        console.log(`Email seria enviado para ${user.email} informando que foi ${approve ? 'aprovado' : 'rejeitado'}`);
      }
      
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  // Configurar listener para atualizações da tabela profiles
  useEffect(() => {
    const setupRealtimeListener = async () => {
      const channel = supabase
        .channel('admin-users-changes')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'profiles' }, 
          () => {
            console.log("Mudança detectada na tabela profiles");
            // Recarregar a lista quando houver mudanças
            loadUsers();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    };

    setupRealtimeListener();
  }, [loadUsers]);

  // Verificar permissões de admin e carregar usuários
  useEffect(() => {
    const init = async () => {
      const isUserAdmin = await checkAdmin();
      if (isUserAdmin) {
        await loadUsers();
      }
    };
    
    init();

    // Configurar um intervalo para atualizar a lista de usuários periodicamente
    const intervalId = setInterval(() => {
      checkAdmin().then(isAdmin => {
        if (isAdmin) loadUsers();
      });
    }, 30000); // Atualizar a cada 30 segundos

    return () => {
      clearInterval(intervalId);
    };
  }, [loadUsers]);

  return {
    users,
    isLoading,
    isAdmin,
    handleApprove,
    refreshUsers: loadUsers
  };
};
