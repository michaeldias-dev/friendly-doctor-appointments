
import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { UserProfile } from "@/types/user";

export const useUserApproval = (users: UserProfile[], onRefresh: () => Promise<void>) => {
  const { toast } = useToast();

  const handleApprove = useCallback(async (userId: string, approve: boolean) => {
    try {
      // Atualizar o status de aprovação do usuário
      const { error } = await supabase
        .from('profiles')
        .update({ approved: approve })
        .eq('id', userId);

      if (error) throw error;

      // Atualizar a lista de usuários
      await onRefresh();
      
      toast({
        title: approve ? "Usuário aprovado" : "Usuário rejeitado",
        description: approve 
          ? "O usuário agora pode acessar o sistema" 
          : "O acesso do usuário foi negado com sucesso",
        variant: approve ? "default" : "destructive"
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
  }, [users, onRefresh, toast]);

  return {
    handleApprove
  };
};
