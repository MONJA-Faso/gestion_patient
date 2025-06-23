import { useState, useEffect } from 'react';
import { Appointment } from '../types';
import { mockAppointments } from '../data/mockData';

export const useAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulation du chargement des données
    setTimeout(() => {
      setAppointments(mockAppointments);
      setLoading(false);
    }, 500);
  }, []);

  const addAppointment = (appointmentData: Omit<Appointment, 'id'>) => {
    const newAppointment: Appointment = {
      ...appointmentData,
      id: Date.now().toString()
    };
    setAppointments(prev => [...prev, newAppointment]);
    return newAppointment;
  };

  const updateAppointment = (id: string, updates: Partial<Appointment>) => {
    setAppointments(prev => prev.map(a => 
      a.id === id ? { ...a, ...updates } : a
    ));
  };

  const deleteAppointment = (id: string) => {
    setAppointments(prev => prev.filter(a => a.id !== id));
  };

  const getAppointmentById = (id: string) => {
    return appointments.find(a => a.id === id);
  };

  const getAppointmentsByPatientId = (patientId: string) => {
    return appointments.filter(a => a.patientId === patientId);
  };

  const getAppointmentsByDoctorId = (doctorId: string) => {
    return appointments.filter(a => a.doctorId === doctorId);
  };

  const getAppointmentsByDate = (date: string) => {
    return appointments.filter(a => a.appointmentDate === date);
  };

  return {
    appointments,
    loading,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    getAppointmentById,
    getAppointmentsByPatientId,
    getAppointmentsByDoctorId,
    getAppointmentsByDate
  };
};