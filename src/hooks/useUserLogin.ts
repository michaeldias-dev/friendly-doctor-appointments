
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AuthFormData } from "@/types/auth";

export const useUserLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const loginUser = async (formData: AuthFormData) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      // Verificar se o usuário está aprovado
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileError) throw profileError;

      if (profileData.approved === false) {
        await supabase.auth.signOut();
        throw new Error("Sua conta foi rejeitada pelo administrador.");
      }

      if (profileData.approved === null) {
        await supabase.auth.signOut();
        throw new Error("Sua conta ainda está em análise. Você receberá um email quando for aprovada.");
      }

      toast({
        title: "Sucesso",
        description: "Login realizado com sucesso!",
      });
      
      // Redirecionar admin para a página de admin, médicos para o dashboard
      if (profileData.role === 'admin') {
        navigate("/admin/users");
      } else {
        navigate("/dashboard");
      }
      
      return { success: true };
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  return { loginUser };
};
