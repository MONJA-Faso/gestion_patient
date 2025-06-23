import { useState, useEffect } from 'react';
import { Report } from '../types';
import { mockReports } from '../data/mockData';

export const useReports = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulation du chargement des données
    setTimeout(() => {
      setReports(mockReports);
      setLoading(false);
    }, 500);
  }, []);

  const generateReport = (reportData: Omit<Report, 'id' | 'generatedAt' | 'generatedBy'>) => {
    const newReport: Report = {
      ...reportData,
      id: Date.now().toString(),
      generatedAt: new Date().toISOString(),
      generatedBy: '3' // ID du médecin-chef par défaut
    };
    setReports(prev => [newReport, ...prev]);
    return newReport;
  };

  const deleteReport = (id: string) => {
    setReports(prev => prev.filter(r => r.id !== id));
  };

  const getReportById = (id: string) => {
    return reports.find(r => r.id === id);
  };

  return {
    reports,
    loading,
    generateReport,
    deleteReport,
    getReportById
  };
};