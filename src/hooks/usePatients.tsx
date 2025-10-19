import { useState, useEffect } from 'react';
import { Patient, MedicalRecord } from '../types';
import { createPatient, deleteSinglePatient, getAllPatients, updateSignlePatient } from '../api/ApiCenter';

export const usePatients = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPatients = async () => {
      try {
        const patientsData = await getAllPatients();
        setPatients(patientsData);
      } catch (error: any) {
        console.error("Erreur lors du chargement des patients:", error.message);
      } finally {
        setLoading(false);
      }
    };

    loadPatients();
  }, []);

  const getPatientById = (id: string | number) => {
    // Normaliser l'ID
    let normalizedId: string | number = id;

    // Si c'est une string, nettoyer et convertir en nombre si possible
    if (typeof id === 'string') {
      const cleanId = id.replace(/\D/g, ''); // Supprimer tout sauf les chiffres
      normalizedId = cleanId ? parseInt(cleanId) : id;
    }

    const patient = patients.find(p => {
      // Comparaison flexible selon le type
      return p.id === normalizedId ||
        p.id.toString() === normalizedId.toString() ||
        p.id === parseInt(normalizedId.toString());
    });

    console.log("Patient trouvé:", patient);
    return patient;
  };

  const getMedicalRecordsByPatientId = (patientId: string) => {
    return medicalRecords.filter(r => r.patientId === patientId);
  };


  const searchPatients = (query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return patients.filter(patient =>
      patient.prenom.toLowerCase().includes(lowercaseQuery) ||
      patient.nom.toLowerCase().includes(lowercaseQuery) ||
      (patient.patientNumber && patient.patientNumber.toLowerCase().includes(lowercaseQuery))
    );
  };

  const addPatient = async (patient: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newPatient = await createPatient(patient);
      setPatients(prev => [...prev, newPatient]);
      return newPatient;
    } catch (error) {
      console.error("Erreur lors de l'ajout du patient:", error);
      throw error;
    }
  };

  const deletePatient = async (id: string | number) => {
    try {
      deleteSinglePatient(id.toString());

      setLoading(true);
      const patientsData = await getAllPatients();
      setPatients(patientsData);

      setTimeout(() => {
        setPatients(patientsData);
        setLoading(false)
      }, 1000);

    } catch (error: any) {
      console.error("Erreur lors de la suppression du patient:", error.message);
      throw error;
    }
  }

  const updatePatient = async (id: string, updates: Partial<Patient>) => {
    try {

      const updatedPatient = await updateSignlePatient(id, updates);

      // Mettre à jour l'état local
      setPatients(prev => prev.map(patient =>
        patient.id.toString() === id ? { ...patient, ...updatedPatient } : patient
      ));

      return updatedPatient;
      
    } catch (error: any) {
      console.error("Erreur lors de la modification:", error);
      throw error;
    }
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
    loading,
    getPatientById,
    getMedicalRecordsByPatientId,
    searchPatients,
    addPatient,
    deletePatient,
    updatePatient,
    addMedicalRecord
  };
};