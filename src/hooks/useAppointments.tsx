import { useState, useEffect } from 'react';
import { Appointment } from '../types';
import { fetchAllApointement } from '../api/ApiCenter';

export const useAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    loadAppointement();
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  const loadAppointement = async () => {
    try {
      const appointments = await fetchAllApointement();
      setAppointments(appointments)
    } catch (error: any) {
      console.error("Erreur lors du chargement des patients:", error.message);
    } finally {
      setLoading(false)
    }
  }

  const addAppointment = (appointmentData: Omit<Appointment, 'id'>) => {
    const newAppointment: Appointment = {
      ...appointmentData,
      id: Date.now().toString()
    };
    setAppointments(prev => [...prev, newAppointment]);
    return newAppointment;
  };

  const getAllAppointment = async () => {
    const allAppointment = await fetchAllApointement();
    return allAppointment;
  }

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
    return appointments.filter(a => a.medecinId === doctorId);
  };

  const getAppointmentsByDate = (date: string) => {
    return appointments.filter(a => a.dateHeure === date);
  };

  return {
    appointments,
    loading,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    getAllAppointment,
    getAppointmentById,
    getAppointmentsByPatientId,
    getAppointmentsByDoctorId,
    getAppointmentsByDate
  };
};