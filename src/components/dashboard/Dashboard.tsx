import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { usePatients } from '../../hooks/usePatients';
import { 
  Users, 
  Calendar, 
  FileText, 
  TrendingUp,
  Clock,
  UserCheck,
  Heart,
  Activity
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { patients, medicalRecords, loading } = usePatients();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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

  const minorPatients = patients.filter(p => getAgeFromBirthDate(p.dateOfBirth) < 18).length;
  const majorPatients = patients.length - minorPatients;
  
  const recentConsultations = medicalRecords
    .sort((a, b) => new Date(b.consultationDate).getTime() - new Date(a.consultationDate).getTime())
    .slice(0, 5);

  const stats = [
    {
      title: 'Total Patients',
      value: patients.length,
      icon: Users,
      color: 'bg-blue-500',
      description: `${minorPatients} mineurs, ${majorPatients} majeurs`
    },
    {
      title: 'Consultations',
      value: medicalRecords.length,
      icon: FileText,
      color: 'bg-green-500',
      description: 'Total des consultations'
    },
    {
      title: 'Nouveaux Patients',
      value: patients.filter(p => {
        const createdDate = new Date(p.createdAt);
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        return createdDate > lastMonth;
      }).length,
      icon: UserCheck,
      color: 'bg-purple-500',
      description: 'Ce mois-ci'
    },
    {
      title: 'Taux d\'activité',
      value: '94%',
      icon: TrendingUp,
      color: 'bg-orange-500',
      description: 'Performance globale'
    }
  ];

  return (
    <div className="space-y-6">
      {/* En-tête avec salutation */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {getGreeting()}, {user?.firstName} !
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Consultations récentes */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Consultations Récentes</h3>
            <Activity className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {recentConsultations.map((record) => {
              const patient = patients.find(p => p.id === record.patientId);
              return (
                <div key={record.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {patient?.firstName?.[0]}{patient?.lastName?.[0]}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {patient?.firstName} {patient?.lastName}
                    </p>
                    <p className="text-sm text-gray-600">{record.consultationReason}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(record.consultationDate).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                      Terminé
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Aperçu rapide */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Aperçu Rapide</h3>
            <Clock className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Rendez-vous aujourd'hui</p>
                  <p className="text-sm text-gray-600">Prochaine consultation</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-blue-600">3</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FileText className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Dossiers à traiter</p>
                  <p className="text-sm text-gray-600">En attente de validation</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-green-600">2</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Patients actifs</p>
                  <p className="text-sm text-gray-600">Suivis réguliers</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-purple-600">{patients.length}</span>
            </div>
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
          
          {user?.role !== 'secretary' && (
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