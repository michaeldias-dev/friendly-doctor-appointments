
import { useState, useEffect } from 'react';
import { isSameMonth, isSameDay, isAfter, isBefore, parseISO } from 'date-fns';
import { Appointment } from '@/types/appointment';

export const useAppointmentStats = (appointments: Appointment[]) => {
  const [appointmentsThisMonth, setAppointmentsThisMonth] = useState(0);
  const [upcomingAppointments, setUpcomingAppointments] = useState(0);
  const [pastAppointments, setPastAppointments] = useState(0);

  useEffect(() => {
    // Contagem de consultas do mês atual
    const thisMonth = appointments.filter(appointment => {
      const appointmentDate = parseISO(appointment.date);
      const today = new Date();
      return isSameMonth(appointmentDate, today);
    }).length;

    // Contagem de consultas futuras (a partir de hoje)
    const upcoming = appointments.filter(appointment => {
      const appointmentDate = parseISO(appointment.date);
      const today = new Date();
      return isAfter(appointmentDate, today) || isSameDay(appointmentDate, today);
    }).length;

    // Contagem de consultas passadas
    const past = appointments.filter(appointment => {
      const appointmentDate = parseISO(appointment.date);
      const today = new Date();
      return isBefore(appointmentDate, today) && !isSameDay(appointmentDate, today);
    }).length;

    setAppointmentsThisMonth(thisMonth);
    setUpcomingAppointments(upcoming);
    setPastAppointments(past);
  }, [appointments]);

  return {
    appointmentsThisMonth,
    upcomingAppointments,
    pastAppointments
  };
};
