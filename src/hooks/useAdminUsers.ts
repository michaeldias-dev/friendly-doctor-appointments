
import { useEffect } from "react";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import { useUserData } from "@/hooks/useUserData";
import { useUserApproval } from "@/hooks/useUserApproval";
import { useRealtimeUpdates } from "@/hooks/useRealtimeUpdates";

export const useAdminUsers = () => {
  const { isAdmin, checkAdmin } = useAdminCheck();
  const { users, isLoading, loadUsers } = useUserData();
  const { handleApprove } = useUserApproval(users, loadUsers);
  
  // Configurar atualizações em tempo real para a tabela profiles
  useRealtimeUpdates('profiles', loadUsers);

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
    }, 3000); // Atualizar a cada 3 segundos para ver novos registros mais rapidamente

    return () => {
      clearInterval(intervalId);
    };
  }, [checkAdmin, loadUsers]);

  return {
    users,
    isLoading,
    isAdmin,
    handleApprove,
    refreshUsers: loadUsers
  };
};
