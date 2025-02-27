
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import NewAppointment from "@/components/NewAppointment";

interface AppointmentHeaderProps {
  onSuccess: () => Promise<void>;
}

const AppointmentHeader = ({ onSuccess }: AppointmentHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-bold text-gray-900">Consultas</h1>
      <Sheet>
        <SheetTrigger asChild>
          <Button>Nova Consulta</Button>
        </SheetTrigger>
        <SheetContent className="w-full sm:max-w-xl">
          <NewAppointment onSuccess={onSuccess} />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default AppointmentHeader;
