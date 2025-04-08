
import { Appointment, AppointmentTypes } from "@/types/appointment";
import { Button } from "@/components/ui/button";
import AppointmentTime from "./AppointmentTime";
import AppointmentTypeBadge from "./AppointmentTypeBadge";

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
    <div className="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow p-4">
      <div className="flex justify-between">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-lg">{appointment.patient_name}</h3>
            <AppointmentTypeBadge type={appointment.type} types={appointmentTypes} />
          </div>
          
          <div className="text-sm text-muted-foreground mb-2">
            <AppointmentTime time={appointment.time} /> • {appointment.professional_name || "Profissional não atribuído"}
          </div>
          
          {appointment.congregation && (
            <div className="text-xs text-gray-500 mb-2">
              Congregação: {appointment.congregation}
            </div>
          )}

          {appointment.notes && appointment.notes.length > 50 ? (
            <p className="text-sm text-gray-700">
              {appointment.notes.substring(0, 50)}...
            </p>
          ) : appointment.notes ? (
            <p className="text-sm text-gray-700">{appointment.notes}</p>
          ) : null}
        </div>
      </div>
      
      <div className="mt-3 pt-2 border-t flex justify-end">
        <Button 
          variant="ghost"
          size="sm" 
          onClick={() => onViewDetails(appointment)}
        >
          Ver detalhes
        </Button>
      </div>
    </div>
  );
};

export default AppointmentItem;
