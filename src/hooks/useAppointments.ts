
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppointmentData } from './useAppointmentData';
import { useProfessionals } from './useProfessionals';
import { useAppointmentStats } from './useAppointmentStats';
import { useAppointmentCalendar } from './useAppointmentCalendar';

export const useAppointments = () => {
  const { 
    appointments, 
    isLoading, 
    appointmentDates, 
    loadAppointments,
    selectedProfessionalId,
    setSelectedProfessionalId
  } = useAppointmentData();
  
  const { professionals } = useProfessionals();
  
  const {
    appointmentsThisMonth,
    upcomingAppointments,
    pastAppointments
  } = useAppointmentStats(appointments);
  
  const {
    date,
    setDate,
    selectedAppointment,
    setSelectedAppointment,
    filteredAppointments,
    isDayWithAppointments
  } = useAppointmentCalendar(appointments, appointmentDates);

  return {
    date,
    setDate,
    appointments,
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
  };
};
