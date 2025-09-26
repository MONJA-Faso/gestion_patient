import React, { useState } from 'react';
import { usePatients } from '../../hooks/usePatients';
import { 
  Search, 
  Plus, 
  Eye, 
  Edit, 
  Calendar,
  MapPin,
  UserPlus
} from 'lucide-react';

interface PatientListProps {
  onPatientSelect: (patientId: string) => void;
  onAddPatient: () => void;
}

export const PatientList: React.FC<PatientListProps> = ({ onPatientSelect, onAddPatient }) => {
  const { patients, loading, searchPatients } = usePatients();
  const [searchQuery, setSearchQuery] = useState('');
  const [filtersexe, setFiltersexe] = useState<'all' | 'Masculin' | 'Féminin'>('all');
  const [filterAge, setFilterAge] = useState<'all' | 'minor' | 'major'>('all');

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

  const getFilteredPatients = () => {
    let filteredPatients = searchQuery ? searchPatients(searchQuery) : patients;

    if (filtersexe !== 'all') {
      filteredPatients = filteredPatients.filter(p => p.sexe === filtersexe);
    }

    if (filterAge !== 'all') {
      filteredPatients = filteredPatients.filter(p => {
        const age = getAgeFromBirthDate(p.dateNaissance);
        return filterAge === 'minor' ? age < 18 : age >= 18;
      });
    }

    return filteredPatients.sort((a, b) => a.nom.localeCompare(b.nom));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const filteredPatients = getFilteredPatients();

  return (
    <div className="space-y-6">
      {/* En-tête avec recherche et actions */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Gestion des Patients</h2>
            <p className="text-gray-600">
              {filteredPatients.length} patient{filteredPatients.length > 1 ? 's' : ''} trouvé{filteredPatients.length > 1 ? 's' : ''}
            </p>
          </div>
          
          <button
            onClick={onAddPatient}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            <Plus className="h-5 w-5" />
            <span>Nouveau Patient</span>
          </button>
        </div>

        {/* Barre de recherche et filtres */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par nom, prénom, numéro..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={filtersexe}
            onChange={(e) => setFiltersexe(e.target.value as 'all' | 'Masculin' | 'Féminin')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tous les genres</option>
            <option value="Masculin">Hommes</option>
            <option value="Féminin">Femmes</option>
          </select>
          
          <select
            value={filterAge}
            onChange={(e) => setFilterAge(e.target.value as 'all' | 'minor' | 'major')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tous les âges</option>
            <option value="minor">Mineurs (&lt; 18 ans)</option>
            <option value="major">Majeurs (≥ 18 ans)</option>
          </select>
        </div>
      </div>

      {/* Liste des patients */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        {filteredPatients.length === 0 ? (
          <div className="p-12 text-center">
            <UserPlus className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun patient trouvé</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery ? 'Aucun patient ne correspond à votre recherche.' : 'Commencez par ajouter votre premier patient.'}
            </p>
            <button
              onClick={onAddPatient}
              className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              <Plus className="h-5 w-5" />
              <span>Ajouter un patient</span>
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredPatients.map((patient) => {
              const age = getAgeFromBirthDate(patient.dateNaissance);
              
              return (
                <div
                  key={patient.id}
                  className="p-6 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                  onClick={() => onPatientSelect(patient.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold ${
                        patient.sexe === 'Féminin' ? 'bg-pink-500' : 'bg-blue-500'
                      }`}>
                        {patient.prenom[0]}{patient.nom[0]}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {patient.prenom} {patient.nom}
                          </h3>
                          <span className="text-sm text-gray-500">
                            ({age} ans, {patient.sexe === 'Masculin' ? 'H' : 'F'})
                          </span>
                          {age < 18 && (
                            <span className="inline-block px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
                              Mineur
                            </span>
                          )}
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2">
                          N° {patient.patientNumber}
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                          {/* <div className="flex items-center space-x-1">
                            <Phone className="h-4 w-4" />
                            <span>{patient.phone}</span>
                          </div>
                          
                          {patient.email && (
                            <div className="flex items-center space-x-1">
                              <Mail className="h-4 w-4" />
                              <span>{patient.email}</span>
                            </div>
                          )} */}
                          
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-4 w-4" />
                            <span className="truncate max-w-xs">{patient.address}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onPatientSelect(patient.id);
                        }}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                        title="Voir le détail"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // TODO: Implémenter l'édition
                        }}
                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                        title="Modifier"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // TODO: Implémenter les rendez-vous
                        }}
                        className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors duration-200"
                        title="Rendez-vous"
                      >
                        <Calendar className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};