
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Appointment, AppointmentTypes } from "@/types/appointment";

interface AppointmentDetailsProps {
  appointment: Appointment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointmentTypes: AppointmentTypes;
}

const AppointmentDetails = ({ 
  appointment, 
  open, 
  onOpenChange,
  appointmentTypes
}: AppointmentDetailsProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Detalhes da Consulta</DialogTitle>
        </DialogHeader>
        {appointment && (
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-500">Paciente</h3>
              <p>{appointment.patient_name}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-500">Data e Hora</h3>
              <p>
                {format(new Date(appointment.date), "d 'de' MMMM, yyyy", { locale: ptBR })} às{" "}
                {format(new Date(`2000-01-01T${appointment.time}`), "HH:mm")}
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-500">Tipo de Consulta</h3>
              <p>{appointmentTypes[appointment.type]}</p>
            </div>
            {appointment.notes && (
              <div>
                <h3 className="font-medium text-gray-500">Observações</h3>
                <p>{appointment.notes}</p>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentDetails;
