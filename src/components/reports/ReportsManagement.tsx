import React, { useState } from 'react';
import { useReports } from '../../hooks/useReports';
import { usePatients } from '../../hooks/usePatients';
import { useAppointments } from '../../hooks/useAppointments';
import { 
  BarChart3, 
  Download, 
  Calendar, 
  Users, 
  RefreshCw,
  AlertCircle
} from 'lucide-react';

export const ReportsManagement: React.FC = () => {
  const { reports, generateReport, downloadReport, loading, error } = useReports();
  const { patients } = usePatients();
  const { appointments } = useAppointments();
  
  const [selectedType, setSelectedType] = useState<'mensuel' | 'hebdomadaire'>('mensuel');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    try {
      const reportData = {
        type: selectedType,
        year: selectedYear,
        ...(selectedType === 'mensuel' && { month: selectedMonth }),
        ...(selectedType === 'hebdomadaire' && { week: selectedWeek }),
      };

      await generateReport(reportData);
    } catch (err) {
      // L'erreur est gérée dans le hook
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadReport = async (fileName: string) => {
    try {
      await downloadReport(fileName);
    } catch (err) {
      // L'erreur est gérée dans le hook
    }
  };

  const getMonthName = (month: number) => {
    const months = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    return months[month - 1];
  };

  const getWeekOptions = () => {
    return Array.from({ length: 52 }, (_, i) => i + 1);
  };

  const getYearOptions = () => {
    return Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Patients</p>
              <p className="text-2xl font-bold text-blue-600">{patients.length}</p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Rendez-vous</p>
              <p className="text-2xl font-bold text-purple-600">{appointments.length}</p>
            </div>
            <Calendar className="h-8 w-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Rapports Générés</p>
              <p className="text-2xl font-bold text-orange-600">{reports.length}</p>
            </div>
            <BarChart3 className="h-8 w-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Générateur de rapports */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Génération de Rapports</h2>
            <p className="text-gray-600">Créez des rapports statistiques pour analyser l'activité</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2 text-red-700">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type de rapport
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as 'mensuel' | 'hebdomadaire')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="mensuel">Mensuel</option>
              <option value="hebdomadaire">Hebdomadaire</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Année
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {getYearOptions().map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          {selectedType === 'mensuel' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mois
              </label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                  <option key={month} value={month}>{getMonthName(month)}</option>
                ))}
              </select>
            </div>
          )}

          {selectedType === 'hebdomadaire' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Semaine
              </label>
              <select
                value={selectedWeek}
                onChange={(e) => setSelectedWeek(parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {getWeekOptions().map(week => (
                  <option key={week} value={week}>Semaine {week}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleGenerateReport}
            disabled={isGenerating}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <RefreshCw className="h-5 w-5 animate-spin" />
            ) : (
              <BarChart3 className="h-5 w-5" />
            )}
            <span>{isGenerating ? 'Génération...' : 'Générer le Rapport PDF'}</span>
          </button>
        </div>
      </div>

      {/* Liste des rapports générés */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Rapports Générés</h3>
        </div>

        {reports.length === 0 ? (
          <div className="p-12 text-center">
            <BarChart3 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Aucun rapport généré</h4>
            <p className="text-gray-600 mb-6">Commencez par générer votre premier rapport statistique.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {reports.map((report) => (
              <div key={report.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                      <BarChart3 className="h-6 w-6 text-white" />
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900 mb-1">{report.title}</h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>
                          Type: {report.type === 'mensuel' ? 'Mensuel' : 'Hebdomadaire'}
                        </span>
                        <span>•</span>
                        <span>Généré le {new Date(report.generatedAt).toLocaleDateString('fr-FR')}</span>
                        <span>•</span>
                        <span>Fichier: {report.fileName}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleDownloadReport(report.fileName)}
                      className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                      title="Télécharger le PDF"
                    >
                      <Download className="h-4 w-4" />
                      <span>Télécharger</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};