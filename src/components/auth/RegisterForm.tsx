
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface RegisterFormProps {
  formData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    specialty: string;
  };
  isLoading: boolean;
  onFieldChange: (field: string, value: string) => void;
  onSwitchToLogin: () => void;
}

const RegisterForm = ({
  formData,
  isLoading,
  onFieldChange,
  onSwitchToLogin,
}: RegisterFormProps) => {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">Nome</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => onFieldChange("firstName", e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Sobrenome</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => onFieldChange("lastName", e.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="specialty">Especialidade</Label>
        <Input
          id="specialty"
          value={formData.specialty}
          onChange={(e) => onFieldChange("specialty", e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => onFieldChange("email", e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <Input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) => onFieldChange("password", e.target.value)}
          required
        />
      </div>

      <Button
        type="submit"
        className="w-full font-semibold"
        disabled={isLoading}
      >
        {isLoading ? "Processando..." : "Criar Conta"}
      </Button>

      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-sm text-primary-600 hover:underline"
        >
          Já tem uma conta? Entre
        </button>
      </div>
    </>
  );
};

export default RegisterForm;
