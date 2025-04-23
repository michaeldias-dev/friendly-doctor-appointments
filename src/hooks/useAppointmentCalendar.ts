
import { useState } from 'react';
import { format, isSameDay, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Appointment } from '@/types/appointment';

export const useAppointmentCalendar = (appointments: Appointment[], appointmentDates: Date[]) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  
const normalizeDate = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

 const filteredAppointments = appointments.filter(appointment => {
  if (!date) return false;
  const appointmentDate = normalizeDate(parseISO(appointment.date));
  const selectedDate = normalizeDate(date);
  return isSameDay(appointmentDate, selectedDate);
});

const isDayWithAppointments = (day: Date) => {
  const normalizedDay = normalizeDate(day);
  return appointmentDates.some(appointmentDate =>
    isSameDay(normalizeDate(appointmentDate), normalizedDay)
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
