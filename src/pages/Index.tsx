
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Calendar, ClipboardCheck, UserCircle } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      <nav className="container mx-auto px-6 py-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary-700">MedSchedule</h1>
          <Link to="/auth">
            <Button variant="outline" className="font-medium">
              Login do Médico
            </Button>
          </Link>
        </div>
      </nav>

      <main className="container mx-auto px-6 pt-20 pb-16">
        <div className="max-w-4xl mx-auto text-center animate-in">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Gestão Simplificada de Consultas Médicas
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            Agendamentos eficientes, gestão de prontuários e atendimento aprimorado
            em uma única plataforma integrada.
          </p>
          <Link to="/login">
            <Button size="lg" className="font-semibold text-lg px-8">
              Começar Agora
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white p-6 rounded-2xl shadow-sm card-hover">
            <div className="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
              <Calendar className="h-6 w-6 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Agendamento Fácil</h3>
            <p className="text-gray-600">
              Gerencie suas consultas de forma eficiente com nossa interface intuitiva de calendário.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm card-hover">
            <div className="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
              <ClipboardCheck className="h-6 w-6 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Prontuários Médicos</h3>
            <p className="text-gray-600">
              Gerencie e acesse prontuários de pacientes com facilidade, incluindo
              preenchimento de formulários e downloads em PDF.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm card-hover">
            <div className="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
              <UserCircle className="h-6 w-6 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Perfil do Médico</h3>
            <p className="text-gray-600">
              Mantenha seu perfil profissional e gerencie sua prática de forma eficiente.
            </p>
          </div>
        </div>
      </main>

      <footer className="container mx-auto px-6 py-8 border-t">
        <div className="text-center text-gray-600">
          <p>&copy; 2024 MedSchedule. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
