// hooks/useMedRecords.tsx
import { useState, useEffect } from 'react';
import { DossierMedical, CreateDossierMedicalData, UpdateDossierMedicalData } from '../types';
import {
    createDossierMedical,
    getAllDossierMedicals,
    getDossierMedicalById,
    updateDossierMedical,
    deleteDossierMedical
} from '../api/ApiCenter';

export const useMedRecords = () => {
    const [dossiers, setDossiers] = useState<DossierMedical[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchDossiers();
    }, []);

    const fetchDossiers = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getAllDossierMedicals();
            setDossiers(data);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Erreur lors du chargement des dossiers');
        } finally {
            setLoading(false);
        }
    };

    const addDossier = async (dossierData: CreateDossierMedicalData): Promise<DossierMedical> => {
        try {
            setError(null);
            const newDossier = await createDossierMedical(dossierData);
            setDossiers(prev => [...prev, newDossier]);
            return newDossier;
        } catch (err: any) {
            const errorMsg = err.response?.data?.error || 'Erreur lors de la création du dossier';
            setError(errorMsg);
            throw new Error(errorMsg);
        }
    };

    const updateDossier = async (id: string, updates: UpdateDossierMedicalData): Promise<DossierMedical> => {
        try {
            setError(null);
            const updatedDossier = await updateDossierMedical(id, updates);
            setDossiers(prev => prev.map(d =>
                d.id === id ? updatedDossier : d
            ));
            return updatedDossier;
        } catch (err: any) {
            const errorMsg = err.response?.data?.error || 'Erreur lors de la modification du dossier';
            setError(errorMsg);
            throw new Error(errorMsg);
        }
    };

    const removeDossier = async (id: string): Promise<void> => {
        try {
            setError(null);
            await deleteDossierMedical(id);
            setDossiers(prev => prev.filter(d => d.id !== id));
        } catch (err: any) {
            const errorMsg = err.response?.data?.error || 'Erreur lors de la suppression du dossier';
            setError(errorMsg);
            throw new Error(errorMsg);
        }
    };

    const getDossier = async (id: string): Promise<DossierMedical> => {
        try {
            setError(null);
            return await getDossierMedicalById(id);
        } catch (err: any) {
            const errorMsg = err.response?.data?.error || 'Erreur lors de la récupération du dossier';
            setError(errorMsg);
            throw new Error(errorMsg);
        }
    };

    return {
        dossiers,
        loading,
        error,
        fetchDossiers,
        addDossier,
        updateDossier,
        removeDossier,
        getDossier
    };
};