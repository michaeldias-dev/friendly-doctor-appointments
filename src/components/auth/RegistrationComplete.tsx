
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface RegistrationCompleteProps {
  onBackToLogin: () => void;
}

const RegistrationComplete = ({ onBackToLogin }: RegistrationCompleteProps) => {
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
              onClick={onBackToLogin}
              className="w-full font-semibold"
            >
              Voltar para Login
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationComplete;
