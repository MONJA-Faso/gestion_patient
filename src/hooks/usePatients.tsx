import { useState, useEffect } from 'react';
import { Patient, MedicalRecord, PregnancyRecord, MenstrualCycleRecord, ChronicCondition } from '../types';
import { mockPatients, mockMedicalRecords, mockPregnancyRecords, mockMenstrualRecords, mockChronicConditions } from '../data/mockData';
import { createPatient } from '../api/ApiCenter';

export const usePatients = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [pregnancyRecords, setPregnancyRecords] = useState<PregnancyRecord[]>([]);
  const [menstrualRecords, setMenstrualRecords] = useState<MenstrualCycleRecord[]>([]);
  const [chronicConditions, setChronicConditions] = useState<ChronicCondition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulation du chargement des données
    setTimeout(() => {
      setPatients(mockPatients);
      setMedicalRecords(mockMedicalRecords);
      setPregnancyRecords(mockPregnancyRecords);
      setMenstrualRecords(mockMenstrualRecords);
      setChronicConditions(mockChronicConditions);
      setLoading(false);
    }, 500);
  }, []);

  const getPatientById = (id: string) => {
    return patients.find(p => p.id === id);
  };

  const getMedicalRecordsByPatientId = (patientId: string) => {
    return medicalRecords.filter(r => r.patientId === patientId);
  };

  const getPregnancyRecordsByPatientId = (patientId: string) => {
    return pregnancyRecords.filter(r => r.patientId === patientId);
  };

  const getMenstrualRecordsByPatientId = (patientId: string) => {
    return menstrualRecords.filter(r => r.patientId === patientId);
  };

  const getChronicConditionsByPatientId = (patientId: string) => {
    return chronicConditions.filter(r => r.patientId === patientId);
  };

  const searchPatients = (query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return patients.filter(patient => 
      patient.prenom.toLowerCase().includes(lowercaseQuery) ||
      patient.nom.toLowerCase().includes(lowercaseQuery) ||
      patient.patientNumber.toLowerCase().includes(lowercaseQuery)
    );
  };

  const addPatient = (patient: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>) => {
    createPatient(patient).then( () => {
      setPatients(prev => [...prev, patient as Patient]);
    })
  };

  const updatePatient = (id: string, updates: Partial<Patient>) => {
    setPatients(prev => prev.map(p => 
      p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
    ));
  };

  const addMedicalRecord = (record: Omit<MedicalRecord, 'id'>) => {
    const newRecord: MedicalRecord = {
      ...record,
      id: Date.now().toString()
    };
    setMedicalRecords(prev => [...prev, newRecord]);
    return newRecord;
  };

  return {
    patients,
    medicalRecords,
    pregnancyRecords,
    menstrualRecords,
    chronicConditions,
    loading,
    getPatientById,
    getMedicalRecordsByPatientId,
    getPregnancyRecordsByPatientId,
    getMenstrualRecordsByPatientId,
    getChronicConditionsByPatientId,
    searchPatients,
    addPatient,
    updatePatient,
    addMedicalRecord
  };
};