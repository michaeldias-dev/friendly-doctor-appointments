
import { useAppointmentsLoader } from './useAppointmentsLoader';
import { useAppointmentOperations } from './useAppointmentOperations';

export const useAppointmentData = () => {
  const {
    appointments,
    isLoading,
    appointmentDates,
    loadAppointments,
    selectedProfessionalId,
    setSelectedProfessionalId
  } = useAppointmentsLoader();

  const {
    deleteAppointment,
    updateAppointment,
    isLoading: operationsLoading
  } = useAppointmentOperations(loadAppointments);

  return {
    appointments,
    isLoading: isLoading || operationsLoading,
    appointmentDates,
    loadAppointments,
    selectedProfessionalId,
    setSelectedProfessionalId,
    deleteAppointment,
    updateAppointment
  };
};
