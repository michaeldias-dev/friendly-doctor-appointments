
import AppLayout from "@/components/AppLayout";
import AppointmentHeader from "@/components/appointments/AppointmentHeader";
import AppointmentCalendar from "@/components/appointments/AppointmentCalendar";
import AppointmentsList from "@/components/appointments/AppointmentsList";
import AppointmentDetails from "@/components/appointments/AppointmentDetails";
import ProfessionalFilter from "@/components/appointments/ProfessionalFilter";
import AppointmentStats from "@/components/appointments/AppointmentStats";
import { useAppointments } from "@/hooks/useAppointments";

const appointmentTypes = {
  routine: "Consulta de Rotina",
  return: "Retorno",
  exam: "Exames",
  emergency: "Emergência",
} as const;

const Appointments = () => {
  const {
    date,
    setDate,
    isLoading,
    selectedAppointment,
    setSelectedAppointment,
    filteredAppointments,
    isDayWithAppointments,
    loadAppointments,
    professionals,
    selectedProfessionalId,
    setSelectedProfessionalId,
    appointmentsThisMonth,
    upcomingAppointments,
    pastAppointments
  } = useAppointments();

  return (
    <AppLayout>
      <div className="animate-in">
        <AppointmentHeader onSuccess={loadAppointments} />
        
        <ProfessionalFilter 
          professionals={professionals}
          selectedProfessionalId={selectedProfessionalId}
          onChange={setSelectedProfessionalId}
        />
        
        <AppointmentStats 
          appointmentsThisMonth={appointmentsThisMonth}
          upcomingAppointments={upcomingAppointments}
          pastAppointments={pastAppointments}
          isLoading={isLoading}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="md:col-span-1">
            <AppointmentCalendar 
              date={date} 
              onDateSelect={setDate} 
              isDayWithAppointments={isDayWithAppointments} 
            />
          </div>

          <div className="md:col-span-2">
            <AppointmentsList 
              date={date}
              filteredAppointments={filteredAppointments}
              isLoading={isLoading}
              onViewDetails={setSelectedAppointment}
              appointmentTypes={appointmentTypes}
            />
          </div>
        </div>

        <AppointmentDetails 
          appointment={selectedAppointment}
          open={!!selectedAppointment}
          onOpenChange={() => setSelectedAppointment(null)}
          appointmentTypes={appointmentTypes}
        />
      </div>
    </AppLayout>
  );
};

export default Appointments;
