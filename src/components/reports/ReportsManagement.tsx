import React, { useState } from 'react';
import { useReports } from '../../hooks/useReports';
import { usePatients } from '../../hooks/usePatients';
import { useAppointments } from '../../hooks/useAppointments';
import { 
  BarChart3, 
  Download, 
  Calendar, 
  Users, 
  FileText, 
  TrendingUp,
  Activity,
  PieChart,
  Filter,
  RefreshCw
} from 'lucide-react';

export const ReportsManagement: React.FC = () => {
  const { reports, generateReport, loading } = useReports();
  const { patients, medicalRecords } = usePatients();
  const { appointments } = useAppointments();
  
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [isGenerating, setIsGenerating] = useState(false);

  const getDateRange = () => {
    const now = new Date();
    let start: Date, end: Date;

    switch (selectedPeriod) {
      case 'week':
        start = new Date(now.setDate(now.getDate() - now.getDay()));
        end = new Date(now.setDate(now.getDate() - now.getDay() + 6));
        break;
      case 'month':
        start = new Date(selectedYear, selectedMonth - 1, 1);
        end = new Date(selectedYear, selectedMonth, 0);
        break;
      case 'year':
        start = new Date(selectedYear, 0, 1);
        end = new Date(selectedYear, 11, 31);
        break;
      default:
        start = new Date(selectedYear, selectedMonth - 1, 1);
        end = new Date(selectedYear, selectedMonth, 0);
    }

    return { start, end };
  };

  const generateCurrentReport = async () => {
    setIsGenerating(true);
    const { start, end } = getDateRange();
    
    // Simulation de génération de rapport
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const periodPatients = patients.filter(p => {
      const createdDate = new Date(p.createdAt);
      return createdDate >= start && createdDate <= end;
    });

    const periodRecords = medicalRecords.filter(r => {
      const consultDate = new Date(r.consultationDate);
      return consultDate >= start && consultDate <= end;
    });

    const periodAppointments = appointments.filter(a => {
      const aptDate = new Date(a.appointmentDate);
      return aptDate >= start && aptDate <= end;
    });

    // Analyse des diagnostics les plus fréquents
    const diagnosisCount: Record<string, number> = {};
    periodRecords.forEach(record => {
      diagnosisCount[record.diagnosis] = (diagnosisCount[record.diagnosis] || 0) + 1;
    });

    const commonDiagnoses = Object.entries(diagnosisCount)
      .map(([diagnosis, count]) => ({ diagnosis, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const getAgeFromBirthDate = (birthDate: string) => {
      const today = new Date();
      const birth = new Date(birthDate);
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      return age;
    };

    const minorPatients = periodPatients.filter(p => getAgeFromBirthDate(p.dateOfBirth) < 18).length;
    const majorPatients = periodPatients.length - minorPatients;

    const reportData = {
      newPatients: periodPatients.length,
      totalConsultations: periodRecords.length,
      totalAppointments: periodAppointments.length,
      completedAppointments: periodAppointments.filter(a => a.status === 'completed').length,
      cancelledAppointments: periodAppointments.filter(a => a.status === 'cancelled').length,
      minorPatients,
      majorPatients,
      commonDiagnoses,
      genderDistribution: {
        male: periodPatients.filter(p => p.gender === 'male').length,
        female: periodPatients.filter(p => p.gender === 'female').length
      }
    };

    const title = `Rapport ${selectedPeriod === 'month' ? 'Mensuel' : selectedPeriod === 'year' ? 'Annuel' : 'Hebdomadaire'} - ${
      selectedPeriod === 'month' 
        ? `${getMonthName(selectedMonth)} ${selectedYear}`
        : selectedPeriod === 'year'
          ? selectedYear
          : 'Cette semaine'
    }`;

    generateReport({
      title,
      type: selectedPeriod as 'monthly' | 'annual' | 'custom',
      dateRange: {
        start: start.toISOString().split('T')[0],
        end: end.toISOString().split('T')[0]
      },
      data: reportData
    });

    setIsGenerating(false);
  };

  const getMonthName = (month: number) => {
    const months = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    return months[month - 1];
  };

  const downloadReport = (report: any) => {
    const content = `
RAPPORT MÉDICAL
===============

${report.title}
Période: ${new Date(report.dateRange.start).toLocaleDateString('fr-FR')} - ${new Date(report.dateRange.end).toLocaleDateString('fr-FR')}
Généré le: ${new Date(report.generatedAt).toLocaleDateString('fr-FR')}

STATISTIQUES GÉNÉRALES
======================
- Nouveaux patients: ${report.data.newPatients}
- Total consultations: ${report.data.totalConsultations}
- Patients mineurs (< 18 ans): ${report.data.minorPatients}
- Patients majeurs (≥ 18 ans): ${report.data.majorPatients}

DIAGNOSTICS LES PLUS FRÉQUENTS
==============================
${report.data.commonDiagnoses.map((d: any, i: number) => `${i + 1}. ${d.diagnosis}: ${d.count} cas`).join('\n')}

RÉPARTITION PAR GENRE
=====================
- Hommes: ${report.data.genderDistribution?.male || 0}
- Femmes: ${report.data.genderDistribution?.female || 0}

RENDEZ-VOUS
===========
- Total programmés: ${report.data.totalAppointments || 0}
- Terminés: ${report.data.completedAppointments || 0}
- Annulés: ${report.data.cancelledAppointments || 0}
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.title.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
              <p className="text-sm font-medium text-gray-600">Consultations</p>
              <p className="text-2xl font-bold text-green-600">{medicalRecords.length}</p>
            </div>
            <FileText className="h-8 w-8 text-green-500" />
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
              <p className="text-sm font-medium text-gray-600">Rapports</p>
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
            <p className="text-gray-600">Créez des rapports personnalisés pour analyser l'activité</p>
          </div>
          
          <button
            onClick={generateCurrentReport}
            disabled={isGenerating}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <RefreshCw className="h-5 w-5 animate-spin" />
            ) : (
              <BarChart3 className="h-5 w-5" />
            )}
            <span>{isGenerating ? 'Génération...' : 'Générer Rapport'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Période
            </label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="week">Cette semaine</option>
              <option value="month">Mensuel</option>
              <option value="year">Annuel</option>
            </select>
          </div>

          {selectedPeriod !== 'week' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Année
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          )}

          {selectedPeriod === 'month' && (
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
            <p className="text-gray-600 mb-6">Commencez par générer votre premier rapport d'activité.</p>
            <button
              onClick={generateCurrentReport}
              className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              <BarChart3 className="h-5 w-5" />
              <span>Générer un rapport</span>
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {reports
              .sort((a, b) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime())
              .map((report) => (
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
                            {new Date(report.dateRange.start).toLocaleDateString('fr-FR')} - {new Date(report.dateRange.end).toLocaleDateString('fr-FR')}
                          </span>
                          <span>•</span>
                          <span>Généré le {new Date(report.generatedAt).toLocaleDateString('fr-FR')}</span>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 text-sm">
                          <div className="flex items-center space-x-2">
                            <Users className="h-4 w-4 text-blue-500" />
                            <span>{report.data.newPatients} nouveaux patients</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4 text-green-500" />
                            <span>{report.data.totalConsultations} consultations</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Activity className="h-4 w-4 text-purple-500" />
                            <span>{report.data.minorPatients} mineurs</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <TrendingUp className="h-4 w-4 text-orange-500" />
                            <span>{report.data.majorPatients} majeurs</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => downloadReport(report)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                        title="Télécharger"
                      >
                        <Download className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  {/* Aperçu des diagnostics les plus fréquents */}
                  {report.data.commonDiagnoses.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Diagnostics les plus fréquents</h5>
                      <div className="flex flex-wrap gap-2">
                        {report.data.commonDiagnoses.slice(0, 5).map((diagnosis: any, index: number) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full"
                          >
                            {diagnosis.diagnosis} ({diagnosis.count})
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))
            }
          </div>
        )}
      </div>
    </div>
  );
};