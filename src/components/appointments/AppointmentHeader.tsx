
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import NewAppointment from "@/components/NewAppointment";
import { RefreshCw } from "lucide-react";

interface AppointmentHeaderProps {
  onSuccess: () => Promise<void>;
}

const AppointmentHeader = ({ onSuccess }: AppointmentHeaderProps) => {
  const handleRefresh = () => {
    // Força atualização da página sem uso de cache
    window.location.reload();
  };

  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-bold text-gray-900">Consultas</h1>
      <div className="flex space-x-3">
        
        <Sheet>
          <SheetTrigger asChild>
            <Button size="lg" className="px-8 text-base">Nova Consulta</Button>
          </SheetTrigger>
          <SheetContent className="w-full sm:max-w-xl md:max-w-2xl">
            <NewAppointment onSuccess={onSuccess} />
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default AppointmentHeader;
