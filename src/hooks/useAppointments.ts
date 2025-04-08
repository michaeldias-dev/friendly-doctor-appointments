
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppointmentData } from './useAppointmentData';
import { useProfessionals } from './useProfessionals';
import { useAppointmentStats } from './useAppointmentStats';
import { useAppointmentCalendar } from './useAppointmentCalendar';
import { Appointment } from '@/types/appointment';

export const useAppointments = () => {
  const { 
    appointments, 
    isLoading, 
    appointmentDates, 
    loadAppointments,
    selectedProfessionalId,
    setSelectedProfessionalId,
    deleteAppointment,
    updateAppointment
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

  // Memoized handler to avoid recreating on each render
  const handleProfessionalChange = useCallback((id: string) => {
    // Small delay to ensure DOM is ready
    setTimeout(() => {
      setSelectedProfessionalId(id === "all" ? null : id);
    }, 10);
  }, [setSelectedProfessionalId]);

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
    setSelectedProfessionalId: handleProfessionalChange,
    appointmentsThisMonth,
    upcomingAppointments,
    pastAppointments,
    deleteAppointment,
    updateAppointment
  };
};
