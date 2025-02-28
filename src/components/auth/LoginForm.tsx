
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LoginFormProps {
  email: string;
  password: string;
  isLoading: boolean;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSwitchToRegister: () => void;
}

const LoginForm = ({
  email,
  password,
  isLoading,
  onEmailChange,
  onPasswordChange,
  onSwitchToRegister,
}: LoginFormProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          required
        />
      </div>

      <Button
        type="submit"
        className="w-full font-semibold"
        disabled={isLoading}
      >
        {isLoading ? "Processando..." : "Entrar"}
      </Button>

      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={onSwitchToRegister}
          className="text-sm text-primary-600 hover:underline"
        >
          Não tem uma conta? Registre-se
        </button>
      </div>
    </>
  );
};

export default LoginForm;
