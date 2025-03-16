
import { format } from "date-fns";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Appointment, AppointmentTypes } from "@/types/appointment";
import AppointmentTypeBadge from "./AppointmentTypeBadge";
import AppointmentTime from "./AppointmentTime";

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
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
          <AppointmentTypeBadge 
            type={appointment.type} 
            appointmentTypes={appointmentTypes} 
          />
          <span className="hidden sm:inline text-xs text-gray-400">•</span>
          <p className="text-sm text-gray-500">
            {appointment.professional_name}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <AppointmentTime time={appointment.time} />
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
