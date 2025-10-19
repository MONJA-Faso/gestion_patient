import { useState, useEffect } from 'react';
import { getDashboardData } from './../api/ApiCenter';
import { DashboardData } from '../types';

export const useDashboard = () => {
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchDashboardData = async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await getDashboardData();
            setDashboardData(data);
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Erreur lors du chargement du dashboard';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const refetch = () => {
        fetchDashboardData();
    };

    return {
        dashboardData,
        loading,
        error,
        refetch
    };
};