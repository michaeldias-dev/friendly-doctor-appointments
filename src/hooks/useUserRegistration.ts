
import { supabase } from "@/integrations/supabase/client";
import { AuthFormData } from "@/types/auth";
import { useToast } from "@/hooks/use-toast";

export const useUserRegistration = () => {
  const { toast } = useToast();

  const registerUser = async (formData: AuthFormData) => {
    try {
      console.log("Iniciando registro de novo usuário:", {
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        specialty: formData.specialty
      });
      
      // Passo 1: Criar o usuário na autenticação
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            specialty: formData.specialty,
          },
        },
      });

      if (error) {
        console.error("Erro ao criar usuário:", error);
        throw error;
      }

      console.log("Usuário criado com sucesso:", data);

      // Verificar se o usuário foi criado corretamente
      if (!data?.user?.id) {
        throw new Error("Erro ao criar o usuário: ID de usuário não disponível");
      }
      
      // O trigger handle_new_user() no Supabase já vai criar o perfil automaticamente
      // então não precisamos mais tentar inserir manualmente
      
      // Fazemos logout após o registro para que o usuário precise fazer login explicitamente
      await supabase.auth.signOut();
      
      // Informar ao usuário que o cadastro foi concluído e está pendente de aprovação
      toast({
        title: "Registro concluído",
        description: "Seu cadastro foi recebido e está em análise. Você receberá um email quando sua conta for aprovada.",
      });
      
      return { success: true };
    } catch (error: any) {
      console.error("Erro durante o registro:", error);
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  return { registerUser };
};
