
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulated login - Replace with actual authentication
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Sucesso",
        description: "Bem-vindo de volta, Dr. Silva!",
      });
      navigate("/dashboard");
    }, 1000);
  };

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
            <h1 className="text-2xl font-bold text-gray-900">Bem-vindo de Volta</h1>
            <p className="text-gray-600 mt-2">Entre na sua conta</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="medico@exemplo.com"
                required
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                required
                className="w-full"
              />
            </div>

            <Button
              type="submit"
              className="w-full font-semibold"
              disabled={isLoading}
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <a href="#" className="text-sm text-primary-600 hover:underline">
              Esqueceu sua senha?
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
