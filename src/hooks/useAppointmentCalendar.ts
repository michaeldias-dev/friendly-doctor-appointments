
import { useState } from 'react';
import { format } from 'date-fns';
import { Appointment } from '@/types/appointment';

export const useAppointmentCalendar = (appointments: Appointment[], appointmentDates: Date[]) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const filteredAppointments = appointments.filter(appointment => {
    if (!date) return false;
    return appointment.date === format(date, "yyyy-MM-dd");
  });
  
  // Função para destacar dias com consultas no calendário
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

// Importar isSameDay
import { isSameDay } from 'date-fns';
