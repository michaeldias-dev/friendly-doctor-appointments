
import { useState } from 'react';
import { format, isSameDay, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Appointment } from '@/types/appointment';

export const useAppointmentCalendar = (appointments: Appointment[], appointmentDates: Date[]) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  
 const filteredAppointments = appointments.filter(appointment => {
    if (!date) return false;
    // Parse the ISO string date to ensure proper comparison
    const appointmentDate = parseISO(appointment.date);
    return isSameDay(appointmentDate, date);
  });
  
  // Function to highlight days with appointments in the calendar
  const isDayWithAppointments = (day: Date) => {
    return appointmentDates.some(appointmentDate => 
      isSameDay(day, appointmentDate)
    );
  };

  return {
    date,
    setDate,
    selectedAppointment,
    setSelectedAppointment,
    filteredAppointments,
    isDayWithAppointments
  };
};
