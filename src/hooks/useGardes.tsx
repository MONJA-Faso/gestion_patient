import { useState, useEffect } from 'react';
import { Garde, CreateGardeData, UpdateGardeData } from '../types';
import { createGarde, getGardes, updateGarde, deleteGarde } from '../api/ApiCenter';

export const useGardes = () => {
    const [gardes, setGardes] = useState<Garde[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);

    useEffect(() => {
        loadGardes(currentYear, currentMonth);
    }, [currentYear, currentMonth]);

    const loadGardes = async (year: number, month: number) => {
        try {
            setLoading(true);
            const gardesData = await getGardes(year, month);
            setGardes(gardesData);
        } catch (error: any) {
            console.error("Erreur lors du chargement des gardes:", error.message);
        } finally {
            setLoading(false);
        }
    };

    const addGarde = async (gardeData: CreateGardeData) => {
        try {
            const newGarde = await createGarde(gardeData);
            setGardes(prev => [...prev, newGarde]);
            return newGarde;
        } catch (error: any) {
            console.error("Erreur lors de l'ajout de la garde:", error.message);
            throw error;
        }
    };

    const updateGardeById = async (id: string, updates: UpdateGardeData) => {
        try {
            const updatedGarde = await updateGarde(id, updates);
            setGardes(prev => prev.map(g => g.id === parseInt(id) ? updatedGarde : g));
            return updatedGarde;
        } catch (error: any) {
            console.error("Erreur lors de la modification de la garde:", error.message);
            throw error;
        }
    };

    const deleteGardeById = async (id: string) => {
        try {
            await deleteGarde(id);
            setGardes(prev => prev.filter(g => g.id !== parseInt(id)));
        } catch (error: any) {
            console.error("Erreur lors de la suppression de la garde:", error.message);
            throw error;
        }
    };

    const changeMonth = (month: number) => {
        setCurrentMonth(month);
    };

    const changeYear = (year: number) => {
        setCurrentYear(year);
    };

    const getGardeById = (id: string) => {
        return gardes.find(g => g.id === parseInt(id));
    };

    const getGardesByMedecinId = (medecinId: number) => {
        return gardes.filter(g => g.medecinId === medecinId);
    };

    return {
        gardes,
        loading,
        currentYear,
        currentMonth,
        addGarde,
        updateGardeById,
        deleteGardeById,
        changeMonth,
        changeYear,
        getGardeById,
        getGardesByMedecinId,
        refreshGardes: () => loadGardes(currentYear, currentMonth)
    };
};