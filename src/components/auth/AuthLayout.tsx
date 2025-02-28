
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ReactNode } from "react";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

const AuthLayout = ({ title, subtitle, children }: AuthLayoutProps) => {
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
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            <p className="text-gray-600 mt-2">{subtitle}</p>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
