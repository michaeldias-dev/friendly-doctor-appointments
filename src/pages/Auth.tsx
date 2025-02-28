import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    specialty: "",
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
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
      } else {
        const { error } = await supabase.auth.signUp({
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

        if (error) throw error;

        setRegistrationComplete(true);
        
        // Limpar o formulário
        setFormData({
          email: "",
          password: "",
          firstName: "",
          lastName: "",
          specialty: "",
        });
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

  if (registrationComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white flex flex-col justify-center">
        <Link to="/" className="absolute top-6 left-6">
          <Button variant="ghost" className="text-primary-600">
            ← Voltar para início
          </Button>
        </Link>

        <div className="container max-w-md mx-auto px-6">
          <div className="bg-white rounded-2xl p-8 shadow-sm animate-in">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900">
                Registro Realizado
              </h1>
              <p className="text-gray-600 mt-2">
                Obrigado por se cadastrar! Sua solicitação foi recebida e está em análise.
              </p>
            </div>

            <div className="text-center space-y-6">
              <p>
                Um administrador irá revisar suas informações e você será notificado por email quando sua conta for aprovada.
              </p>
              <Button
                onClick={() => {
                  setRegistrationComplete(false);
                  setIsLogin(true);
                }}
                className="w-full font-semibold"
              >
                Voltar para Login
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white flex flex-col justify-center">
      <Link to="/" className="absolute top-6 left-6">
        <Button variant="ghost" className="text-primary-600">
          ← Voltar para início
        </Button>
      </Link>

      <div className="container max-w-md mx-auto px-6">
        <div className="bg-white rounded-2xl p-8 shadow-sm animate-in">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
              {isLogin ? "Bem-vindo de Volta" : "Criar Conta"}
            </h1>
            <p className="text-gray-600 mt-2">
              {isLogin ? "Entre na sua conta" : "Registre-se como médico"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Nome</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Sobrenome</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialty">Especialidade</Label>
                  <Input
                    id="specialty"
                    value={formData.specialty}
                    onChange={(e) =>
                      setFormData({ ...formData, specialty: e.target.value })
                    }
                    required
                  />
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full font-semibold"
              disabled={isLoading}
            >
              {isLoading
                ? "Processando..."
                : isLogin
                ? "Entrar"
                : "Criar Conta"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-primary-600 hover:underline"
            >
              {isLogin
                ? "Não tem uma conta? Registre-se"
                : "Já tem uma conta? Entre"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
