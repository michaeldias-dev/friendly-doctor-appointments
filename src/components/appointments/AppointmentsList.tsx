
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AppointmentItem from "./AppointmentItem";
import { Appointment, AppointmentTypes } from "@/types/appointment";
import ListEmptyState from "./ListEmptyState";
import ListLoadingState from "./ListLoadingState";

interface AppointmentsListProps {
  date: Date | undefined;
  filteredAppointments: Appointment[];
  isLoading: boolean;
  onViewDetails: (appointment: Appointment) => void;
  appointmentTypes: AppointmentTypes;
}

const AppointmentsList = ({
  date,
  filteredAppointments,
  isLoading,
  onViewDetails,
  appointmentTypes
}: AppointmentsListProps) => {
  const formattedDate = date 
    ? format(date, "d 'de' MMMM, yyyy", { locale: ptBR }) 
    : "hoje";

  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle>
          Consultas para {formattedDate}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-[500px] overflow-y-auto">
          {isLoading ? (
            <ListLoadingState />
          ) : filteredAppointments.length === 0 ? (
            <ListEmptyState />
          ) : (
            filteredAppointments.map((appointment) => (
              <AppointmentItem
                key={appointment.id}
                appointment={appointment}
                onViewDetails={onViewDetails}
                appointmentTypes={appointmentTypes}
              />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentsList;
