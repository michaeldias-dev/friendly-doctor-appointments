
import { format } from "date-fns";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Appointment, AppointmentTypes } from "@/types/appointment";

interface AppointmentItemProps {
  appointment: Appointment;
  onViewDetails: (appointment: Appointment) => void;
  appointmentTypes: AppointmentTypes;
}

const AppointmentItem = ({ 
  appointment, 
  onViewDetails, 
  appointmentTypes 
}: AppointmentItemProps) => {
  return (
    <div
      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
    >
      <div>
        <p className="font-medium">{appointment.patient_name}</p>
        <p className="text-sm text-gray-500">
          {appointmentTypes[appointment.type]}
        </p>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-500">
          {format(new Date(`2000-01-01T${appointment.time}`), "HH:mm")}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewDetails(appointment)}
        >
          <Eye className="h-4 w-4 mr-2" />
          Ver Detalhes
        </Button>
      </div>
    </div>
  );
};

export default AppointmentItem;
