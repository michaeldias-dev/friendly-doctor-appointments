
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Appointment, AppointmentTypes } from "@/types/appointment";
import AppointmentTypeBadge from "./AppointmentTypeBadge";
import DetailField from "./DetailField";

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
  if (!appointment) return null;

  const formattedDate = format(
    new Date(appointment.date), 
    "d 'de' MMMM, yyyy", 
    { locale: ptBR }
  );
  
  const formattedTime = format(
    new Date(`2000-01-01T${appointment.time}`), 
    "HH:mm"
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Detalhes da Consulta</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <DetailField label="Paciente" value={appointment.patient_name} />
          <DetailField 
            label="Profissional" 
            value={appointment.professional_name || "Não especificado"} 
          />
          {appointment.congregation && (
            <DetailField 
              label="Congregação" 
              value={appointment.congregation} 
            />
          )}
          <DetailField 
            label="Data e Hora" 
            value={`${formattedDate} às ${formattedTime}`} 
          />
          <div>
            <h3 className="font-medium text-gray-500 mb-1">Tipo de Consulta</h3>
            <AppointmentTypeBadge 
              type={appointment.type} 
              appointmentTypes={appointmentTypes} 
            />
          </div>
          {appointment.notes && (
            <DetailField label="Observações" value={appointment.notes} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentDetails;
