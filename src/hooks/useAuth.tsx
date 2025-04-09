
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export interface AuthFormData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  specialty: string;
}

export const useAuth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [formData, setFormData] = useState<AuthFormData>({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    specialty: "",
  });
  
  const { toast } = useToast();
  const navigate = useNavigate();

  const resetForm = () => {
    setFormData({
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      specialty: "",
    });
  };

  const handleFieldChange = (field: keyof AuthFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
  };

  const handleBackToLogin = () => {
    setRegistrationComplete(false);
    setIsLogin(true);
  };

  const handleLogin = async () => {
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
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleRegister = async () => {
    try {
      setIsLoading(true);
      
      console.log("Iniciando registro de novo usuário:", {
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        specialty: formData.specialty
      });
      
      // Primeiro criar credenciais de autenticação
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
      
      // Antes de atualizar o perfil, fazemos o login como o novo usuário para obter privilégios
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });
      
      if (signInError) {
        console.error("Erro ao fazer login automático:", signInError);
        throw signInError;
      }
      
      // Agora atualizamos o perfil com o usuário autenticado
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({ 
          id: data.user.id,
          email: formData.email,
          approved: null, // Pendente de aprovação
          specialty: formData.specialty,
          first_name: formData.firstName,
          last_name: formData.lastName,
          role: 'doctor' // Papel padrão
        });
      
      if (profileError) {
        console.error("Erro ao atualizar perfil:", profileError);
        throw profileError;
      }
      
      console.log("Perfil do usuário atualizado com sucesso");
      
      // Fazer logout do usuário após o registro bem-sucedido
      await supabase.auth.signOut();
      
      setRegistrationComplete(true);
      resetForm();
    } catch (error: any) {
      console.error("Erro durante o registro:", error);
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        await handleLogin();
      } else {
        await handleRegister();
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLogin,
    isLoading,
    registrationComplete,
    formData,
    handleSubmit,
    handleFieldChange,
    toggleAuthMode,
    handleBackToLogin,
  };
};
