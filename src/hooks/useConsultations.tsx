import { useState } from 'react';
import {
    FichierConsultation,
    CreateFichierConsultationData,
    UpdateFichierConsultationData,
    SuiviMedical,
    CreateSuiviMedicalData,
    UpdateSuiviMedicalData
} from '../types';
import {
    createFichierConsultation,
    getAllFichiersConsultation,
    getFichierConsultationById,
    updateFichierConsultation,
    deleteFichierConsultation,
    createSuiviMedical,
    getSuivisByConsultationId,
    updateSuiviMedical,
    deleteSuiviMedical
} from '../api/ApiCenter';

export const useConsultations = () => {
    const [allConsultations, setAllConsultations] = useState<FichierConsultation[]>([]);
    const [suivis, setSuivis] = useState<SuiviMedical[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Charger toutes les consultations
    const fetchConsultations = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getAllFichiersConsultation();
            setAllConsultations(data);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Erreur lors du chargement des consultations');
        } finally {
            setLoading(false);
        }
    };

    // Filtrer les consultations par dossier ID (côté frontend)
    const getConsultationsByDossierId = (dossierId: string) => {
        return allConsultations.filter(consultation => 
            consultation.dossierId === parseInt(dossierId, 10)
        );
    };

    // Charger les consultations par dossier (utilise le filtrage côté frontend)
    const fetchConsultationsByDossier = async (dossierId: string) => {
        try {
            setLoading(true);
            setError(null);
            
            // Si nous n'avons pas encore chargé toutes les consultations, on les charge d'abord
            if (allConsultations.length === 0) {
                await fetchConsultations();
            }
            
            // Le filtrage se fait côté frontend via getConsultationsByDossierId
            const filteredConsultations = getConsultationsByDossierId(dossierId);
            return filteredConsultations;
        } catch (err: any) {
            setError(err.response?.data?.error || 'Erreur lors du chargement des consultations');
            return [];
        } finally {
            setLoading(false);
        }
    };

    // Charger les suivis par consultation
    const fetchSuivisByConsultation = async (consultationId: string) => {
        try {
            setError(null);
            const data = await getSuivisByConsultationId(consultationId);
            setSuivis(data);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Erreur lors du chargement des suivis');
        }
    };

    // CRUD pour les consultations
    const addConsultation = async (consultationData: CreateFichierConsultationData): Promise<FichierConsultation> => {
        try {
            setError(null);
            const newConsultation = await createFichierConsultation(consultationData);
            setAllConsultations(prev => [...prev, newConsultation]);
            return newConsultation;
        } catch (err: any) {
            const errorMsg = err.response?.data?.error || 'Erreur lors de la création de la consultation';
            setError(errorMsg);
            throw new Error(errorMsg);
        }
    };

    const fetchConsultationById = async (id: string): Promise<FichierConsultation | null> => {
        try {
            setError(null);
            const consultation = await getFichierConsultationById(id);
            return consultation;
        } catch (err: any) {
            const errorMsg = err.response?.data?.error || 'Erreur lors de la récupération de la consultation';
            setError(errorMsg);
            return null;
        }
    };

    const updateConsultation = async (id: string, updates: UpdateFichierConsultationData): Promise<FichierConsultation> => {
        try {
            setError(null);
            const updatedConsultation = await updateFichierConsultation(id, updates);
            setAllConsultations(prev => prev.map(c =>
                c.id === parseInt(id, 10) ? updatedConsultation : c
            ));
            return updatedConsultation;
        } catch (err: any) {
            const errorMsg = err.response?.data?.error || 'Erreur lors de la modification de la consultation';
            setError(errorMsg);
            throw new Error(errorMsg);
        }
    };

    const removeConsultation = async (id: string): Promise<void> => {
        try {
            setError(null);
            await deleteFichierConsultation(id);
            setAllConsultations(prev => prev.filter(c => c.id !== parseInt(id, 10)));
        } catch (err: any) {
            const errorMsg = err.response?.data?.error || 'Erreur lors de la suppression de la consultation';
            setError(errorMsg);
            throw new Error(errorMsg);
        }
    };

    // CRUD pour les suivis
    const addSuivi = async (suiviData: CreateSuiviMedicalData): Promise<SuiviMedical> => {
        try {
            setError(null);
            const newSuivi = await createSuiviMedical(suiviData);
            setSuivis(prev => [...prev, newSuivi]);
            return newSuivi;
        } catch (err: any) {
            const errorMsg = err.response?.data?.error || 'Erreur lors de la création du suivi';
            setError(errorMsg);
            throw new Error(errorMsg);
        }
    };

    const updateSuivi = async (id: string, updates: UpdateSuiviMedicalData): Promise<SuiviMedical> => {
        try {
            setError(null);
            const updatedSuivi = await updateSuiviMedical(id, updates);
            setSuivis(prev => prev.map(s =>
                s.id === parseInt(id, 10) ? updatedSuivi : s
            ));
            return updatedSuivi;
        } catch (err: any) {
            const errorMsg = err.response?.data?.error || 'Erreur lors de la modification du suivi';
            setError(errorMsg);
            throw new Error(errorMsg);
        }
    };

    const removeSuivi = async (id: string): Promise<void> => {
        try {
            setError(null);
            await deleteSuiviMedical(id);
            setSuivis(prev => prev.filter(s => s.id !== parseInt(id, 10)));
        } catch (err: any) {
            const errorMsg = err.response?.data?.error || 'Erreur lors de la suppression du suivi';
            setError(errorMsg);
            throw new Error(errorMsg);
        }
    };

    return {
        consultations: allConsultations,
        suivis,
        loading,
        error,
        fetchConsultations,
        fetchConsultationsByDossier,
        getConsultationsByDossierId, // Exporte aussi la fonction de filtrage
        fetchConsultationById,
        fetchSuivisByConsultation,
        addConsultation,
        updateConsultation,
        removeConsultation,
        addSuivi,
        updateSuivi,
        removeSuivi
    };
};