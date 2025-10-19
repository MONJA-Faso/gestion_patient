import { useState } from 'react';
import { generateReport, downloadReport } from './../api/ApiCenter';
import { GenerateReportData } from '../types';

interface Report {
  id: string;
  title: string;
  type: 'mensuel' | 'hebdomadaire';
  year: number;
  month?: number;
  week?: number;
  fileName: string;
  generatedAt: string;
  data?: any;
}

export const useReports = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateNewReport = async (reportData: GenerateReportData) => {
    setLoading(true);
    setError(null);

    try {
      const result = await generateReport(reportData);

      const newReport: Report = {
        id: Date.now().toString(),
        title: reportData.type === 'mensuel'
          ? `Rapport Mensuel - ${reportData.month}/${reportData.year}`
          : `Rapport Hebdomadaire - Semaine ${reportData.week} (${reportData.year})`,
        type: reportData.type,
        year: reportData.year,
        month: reportData.month,
        week: reportData.week,
        fileName: result.fileName,
        generatedAt: new Date().toISOString(),
      };

      setReports(prev => [newReport, ...prev]);
      return newReport;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erreur lors de la génération du rapport';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const downloadReportFile = async (fileName: string) => {
    try {
      const blob = await downloadReport(fileName);

      // Créer un URL pour le blob et déclencher le téléchargement
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erreur lors du téléchargement';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const clearError = () => setError(null);

  return {
    reports,
    loading,
    error,
    generateReport: generateNewReport,
    downloadReport: downloadReportFile,
    clearError,
  };
};