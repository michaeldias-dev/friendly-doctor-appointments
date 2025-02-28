
import { useState, useEffect } from "react";
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

    // Na vida real, você teria uma tabela de roles ou uma flag específica para isso
    // Para simplificar, vamos considerar o primeiro usuário como admin
    const { data: firstUser } = await supabase
      .from('profiles')
      .select('id')
      .order('created_at', { ascending: true })
      .limit(1)
      .single();

    const isUserAdmin = firstUser?.id === user.id;
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

  const loadUsers = async () => {
    try {
      // Carregar usuários
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, specialty, approved, created_at')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Buscar emails separadamente
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

      // Mapear emails para perfis
      const userEmailMap = new Map<string, string>();
      
      // Tipo explícito para usuarios da auth para resolver o problema de tipagem
      if (authData?.users) {
        (authData.users as AuthUser[]).forEach(user => {
          userEmailMap.set(user.id, user.email);
        });
      }

      // Combinar dados
      const formattedUsers = profilesData.map(profile => ({
        ...profile,
        email: userEmailMap.get(profile.id) || 'Email não disponível'
      }));

      setUsers(formattedUsers);
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
  };

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

  useEffect(() => {
    const init = async () => {
      const isUserAdmin = await checkAdmin();
      if (isUserAdmin) {
        await loadUsers();
      }
    };
    
    init();
  }, [navigate]);

  return {
    users,
    isLoading,
    isAdmin,
    handleApprove
  };
};
