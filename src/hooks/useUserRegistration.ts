
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
      
      // Importante: após o registro, precisamos aguardar que o usuário seja totalmente criado no backend
      // antes de tentar inserir o perfil
      
      // Primeiro, fazemos logout do usuário recém-criado para evitar conflitos
      await supabase.auth.signOut();
      
      // Aguardamos um tempo para garantir que a criação do usuário foi concluída no backend
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Agora tentamos obter o usuário pelo ID para confirmar que ele existe
      const userId = data.user.id;
      
      // Finalmente, inserimos o perfil com os dados do usuário
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({ 
          id: userId,
          email: formData.email,
          approved: null, // Pendente de aprovação
          specialty: formData.specialty,
          first_name: formData.firstName,
          last_name: formData.lastName,
          role: 'doctor' // Papel padrão
        });
      
      if (profileError) {
        console.error("Erro ao inserir perfil:", profileError);
        throw profileError;
      }
      
      console.log("Perfil do usuário inserido com sucesso");
      
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
