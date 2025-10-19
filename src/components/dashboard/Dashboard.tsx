import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useDashboard } from '../../hooks/useDashboard';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line
} from 'recharts';
import {
  Users,
  Calendar,
  FileText,
  TrendingUp,
  UserCheck,
  Heart,
  Activity,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { dashboardData, loading, error, refetch } = useDashboard();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <p className="text-red-600 text-lg">{error}</p>
        <button
          onClick={refetch}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Réessayer</span>
        </button>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-600">Aucune donnée disponible</p>
      </div>
    );
  }

  const getTodayDate = () => {
    return new Date().toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bonjour';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  };

  // Taux d'activité basé sur les consultations récentes
  const getActivityRate = () => {
    const recentDays = 7;
    const consultationsLastWeek = dashboardData.consultationsByDay.filter(day => {
      const date = new Date(day.dateConsultation);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - recentDays);
      return date >= weekAgo;
    }).length;

    return Math.min(100, Math.round((consultationsLastWeek / recentDays) * 20));
  };

  // Préparer les données pour les graphiques des 7 derniers jours
  const getLast7DaysData = () => {
    const days = [];
    const today = new Date();

    // Créer un tableau des 7 derniers jours
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);

      const dateString = date.toISOString().split('T')[0];
      const formattedDate = date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short'
      });

      // Compter les consultations pour ce jour
      const consultationsCount = dashboardData.consultationsByDay.filter(day => {
        const consultationDate = new Date(day.dateConsultation).toISOString().split('T')[0];
        return consultationDate === dateString;
      }).reduce((sum, day) => sum + day._count._all, 0);

      // Compter les nouveaux patients pour ce jour
      const newPatientsCount = dashboardData.newPatientsByDay.filter(day => {
        const creationDate = new Date(day.dateCreation).toISOString().split('T')[0];
        return creationDate === dateString;
      }).reduce((sum, day) => sum + day._count._all, 0);

      days.push({
        date: formattedDate,
        consultations: consultationsCount,
        nouveauxPatients: newPatientsCount
      });
    }

    return days;
  };

  const chartData = getLast7DaysData();

  const stats = [
    {
      title: 'Total Patients',
      value: dashboardData.totalPatients,
      icon: Users,
      color: 'bg-blue-500',
      description: 'Patients enregistrés'
    },
    {
      title: 'Consultations',
      value: dashboardData.totalConsultations,
      icon: FileText,
      color: 'bg-green-500',
      description: 'Total des consultations'
    },
    {
      title: 'Nouveaux Patients',
      value: dashboardData.newPatients,
      icon: UserCheck,
      color: 'bg-purple-500',
      description: 'Ce mois-ci'
    },
    {
      title: 'Taux d\'activité',
      value: `${getActivityRate()}%`,
      icon: TrendingUp,
      color: 'bg-orange-500',
      description: 'Performance globale'
    }
  ];

  // Préparer les consultations récentes pour l'affichage
  const recentConsultations = dashboardData.recentConsultations.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* En-tête avec salutation */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {getGreeting()}, {user?.prenom} !
            </h1>
            <p className="text-blue-100 text-lg">
              {getTodayDate()}
            </p>
            <p className="text-blue-100 mt-2">
              Bienvenue dans votre espace de gestion des patients
            </p>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <div className="p-4 bg-white/10 rounded-full">
              <Heart className="h-12 w-12 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{stat.title}</h3>
              <p className="text-sm text-gray-600">{stat.description}</p>
            </div>
          );
        })}
      </div>

      {/* Graphiques côte à côte */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graphique des consultations */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Évolution des consultations (7 derniers jours)
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip
                  formatter={(value) => [value, 'Nombre']}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Legend />
                <Bar
                  dataKey="consultations"
                  name="Consultations"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Graphique des nouveaux patients */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Nouveaux patients (7 derniers jours)
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip
                  formatter={(value) => [value, 'Nombre']}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="nouveauxPatients"
                  name="Nouveaux patients"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, fill: '#059669' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Le reste de votre code existant... */}
      <div className="grid grid-cols-1">
        {/* Consultations récentes */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Consultations Récentes</h3>
            <Activity className="h-5 w-5 text-gray-400" />
          </div>

          <div className="space-y-3">
            {recentConsultations.map((consultation) => (
              <div key={consultation.id} className="border border-gray-200 rounded-lg hover:border-gray-300 transition-colors duration-200">
                {/* En-tête de l'accordéon */}
                <button
                  className="flex items-center justify-between w-full p-4 text-left hover:bg-gray-50 transition-colors duration-200"
                  onClick={() => {
                    const details = document.getElementById(`consultation-${consultation.id}`);
                    if (details) {
                      details.classList.toggle('hidden');
                    }
                  }}
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {consultation.dossierMedical.patient.prenom?.[0]}{consultation.dossierMedical.patient.nom?.[0]}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-left">
                        {consultation.dossierMedical.patient.prenom} {consultation.dossierMedical.patient.nom}
                      </p>
                      <p className="text-sm text-gray-600 text-left">{consultation.motifConsultation}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">
                          {new Date(consultation.dateConsultation).toLocaleDateString('fr-FR')}
                        </span>
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                          {consultation.typeConsultation}
                        </span>
                        <span className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                          Terminé
                        </span>
                      </div>
                    </div>
                    <svg
                      className="w-4 h-4 text-gray-500 transition-transform duration-200"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {/* Contenu détaillé de l'accordéon */}
                <div id={`consultation-${consultation.id}`} className="hidden border-t border-gray-200">
                  <div className="p-4 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Détails de la consultation</h4>
                        <div className="space-y-2">
                          <div>
                            <span className="font-medium text-gray-700">Motif :</span>
                            <p className="text-gray-600">{consultation.motifConsultation}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Diagnostic :</span>
                            <p className="text-gray-600">{consultation.diagnostic}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Type :</span>
                            <span className="text-gray-600">{consultation.typeConsultation}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Traitement & Observations</h4>
                        <div className="space-y-2">
                          {consultation.prescriptions && (
                            <div>
                              <span className="font-medium text-gray-700">Prescriptions :</span>
                              <p className="text-gray-600">{consultation.prescriptions}</p>
                            </div>
                          )}
                          {consultation.observations && (
                            <div>
                              <span className="font-medium text-gray-700">Observations :</span>
                              <p className="text-gray-600">{consultation.observations}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Informations patient */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-2">Informations Patient</h4>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="text-gray-600">
                          Dossier créé le {new Date(consultation.dossierMedical.dateCreation).toLocaleDateString('fr-FR')}
                        </span>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-600">
                          ID Patient: {consultation.dossierMedical.patientId}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Statistiques détaillées */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Statistiques Détaillées</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-600">{dashboardData.totalPatients}</p>
            <p className="text-sm text-gray-600">Patients total</p>
          </div>

          <div className="text-center p-4 bg-green-50 rounded-lg">
            <FileText className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">{dashboardData.totalConsultations}</p>
            <p className="text-sm text-gray-600">Consultations total</p>
          </div>

          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-600">
              {dashboardData.newPatientsByDay.length}
            </p>
            <p className="text-sm text-gray-600">Jours avec nouveaux patients</p>
          </div>
        </div>
      </div>

      {/* Accès rapide selon le rôle */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Accès Rapide</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200">
            <Users className="h-8 w-8 text-blue-600 mb-2" />
            <h4 className="font-semibold text-gray-900">Nouveau Patient</h4>
            <p className="text-sm text-gray-600">Créer un dossier patient</p>
          </button>

          {user?.role !== 'Secretaire' && (
            <button className="p-4 text-left bg-green-50 hover:bg-green-100 rounded-lg transition-colors duration-200">
              <FileText className="h-8 w-8 text-green-600 mb-2" />
              <h4 className="font-semibold text-gray-900">Nouvelle Consultation</h4>
              <p className="text-sm text-gray-600">Ajouter un dossier médical</p>
            </button>
          )}

          <button className="p-4 text-left bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors duration-200">
            <Calendar className="h-8 w-8 text-purple-600 mb-2" />
            <h4 className="font-semibold text-gray-900">Rendez-vous</h4>
            <p className="text-sm text-gray-600">Gérer les plannings</p>
          </button>
        </div>
      </div>
    </div>
  );
};