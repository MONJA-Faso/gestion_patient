import React, { useEffect, useState } from 'react';
import { usePatients } from '../../hooks/usePatients';
import { useAuth } from '../../hooks/useAuth';
import {
  ArrowLeft,
  User,
  MapPin,
  Calendar,
  FileText,
  Heart,
  Baby,
  Activity,
  AlertCircle,
  Plus,
  Edit,
  Save,
  X
} from 'lucide-react';

interface PatientDetailProps {
  patientId: string;
  currentTab: string;
  onBack: () => void;
}

export const PatientDetail: React.FC<PatientDetailProps> = ({ patientId, onBack, currentTab }) => {
  const {
    getPatientById,
    getMedicalRecordsByPatientId,
    getPregnancyRecordsByPatientId,
    getMenstrualRecordsByPatientId,
    getChronicConditionsByPatientId
  } = usePatients();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('overview');
  const [isAddingRecord, setIsAddingRecord] = useState(false);
  const [newRecord, setNewRecord] = useState({
    consultationReason: '',
    diagnosis: '',
    treatment: '',
    dosage: '',
    notes: '',
    vitals: {
      temperature: '',
      bloodPressure: '',
      heartRate: '',
      weight: '',
      height: ''
    }
  });

  console.log("Patient ID :", patientId);


  useEffect(() => {
    setActiveTab(currentTab);
  }, [currentTab])

  const patient = getPatientById(patientId);
  const medicalRecords = getMedicalRecordsByPatientId(patientId);
  const pregnancyRecords = getPregnancyRecordsByPatientId(patientId);
  const menstrualRecords = getMenstrualRecordsByPatientId(patientId);
  const chronicConditions = getChronicConditionsByPatientId(patientId);

  if (!patient) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Patient non trouvé</h3>
          <button
            onClick={onBack}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Retour à la liste
          </button>
        </div>
      </div>
    );
  }

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

  const age = getAgeFromBirthDate(patient.dateNaissance);

  const handleAddMedicalRecord = () => {
    if (!newRecord.consultationReason || !newRecord.diagnosis) {
      alert('Veuillez remplir au moins le motif et le diagnostic');
      return;
    }

    // addMedicalRecord(record);
    setIsAddingRecord(false);
    setNewRecord({
      consultationReason: '',
      diagnosis: '',
      treatment: '',
      dosage: '',
      notes: '',
      vitals: {
        temperature: '',
        bloodPressure: '',
        heartRate: '',
        weight: '',
        height: ''
      }
    });
  };

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: User },
    { id: 'medical', label: 'Dossier Médical', icon: FileText },
    { id: 'pregnancy', label: 'Suivi Grossesse', icon: Baby },
    { id: 'menstrual', label: 'Cycle Menstruel', icon: Heart },
    { id: 'chronic', label: 'Pathologies', icon: Activity }
  ];

  const canAccessMedical = user?.role !== 'Secretaire';

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Retour à la liste</span>
          </button>

          <div className="flex items-center space-x-2">
            <button className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200">
              <Edit className="h-4 w-4" />
              <span>Modifier</span>
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold ${patient.sexe === 'Féminin' ? 'bg-pink-500' : 'bg-blue-500'
            }`}>
            {patient.prenom[0]}{patient.nom[0]}
          </div>

          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">
                {patient.prenom} {patient.nom}
              </h1>
              <span className="text-lg text-gray-600">
                ({age} ans, {patient.sexe === 'Masculin' ? 'Homme' : 'Femme'})
              </span>
              {age < 18 && (
                <span className="inline-block px-3 py-1 text-sm font-medium bg-orange-100 text-orange-800 rounded-full">
                  Mineur
                </span>
              )}
            </div>

            <p className="text-gray-600 mb-4">N° {patient.id}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">

              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span>{new Date(patient.dateNaissance).toLocaleDateString('fr-FR')}</span>
              </div>

              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="truncate">{patient.adresse}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation par onglets */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="border-b border-gray-200 overflow-x-auto">
          <nav className="flex px-4 md:px-6 space-x-4 sm:space-x-6 lg:space-x-8 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              const isAccessible = tab.id === 'overview' || canAccessMedical;

              return (
                <button
                  key={tab.id}
                  onClick={() => isAccessible && setActiveTab(tab.id)}
                  disabled={!isAccessible}
                  className={`flex items-center whitespace-nowrap space-x-2 py-4 border-b-2 font-medium text-sm transition-colors duration-200 ${isActive
                    ? 'border-blue-500 text-blue-600'
                    : isAccessible
                      ? 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      : 'border-transparent text-gray-300 cursor-not-allowed'
                    }`}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>



        {/* Contenu des onglets */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations Personnelles</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Nom complet</label>
                      <p className="text-gray-900">{patient.prenom} {patient.nom}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Date de naissance</label>
                      <p className="text-gray-900">{new Date(patient.dateNaissance).toLocaleDateString('fr-FR')}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Genre</label>
                      <p className="text-gray-900">{patient.sexe === 'Masculin' ? 'Homme' : 'Femme'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Adresse</label>
                      <p className="text-gray-900">{patient.adresse}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact</h3>
                  <div className="space-y-3">

                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-4 mt-6">Contact d'urgence</h3>
                  <div className="space-y-3">
                    //! TEst Affichage
                    LEEEEEEE
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'medical' && canAccessMedical && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Historique Médical</h3>
                <button
                  onClick={() => setIsAddingRecord(true)}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  <Plus className="h-4 w-4" />
                  <span>Nouvelle Consultation</span>
                </button>
              </div>

              {isAddingRecord && (
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-900">Nouvelle Consultation</h4>
                    <button
                      onClick={() => setIsAddingRecord(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Motif de consultation *
                      </label>
                      <input
                        type="text"
                        value={newRecord.consultationReason}
                        onChange={(e) => setNewRecord({ ...newRecord, consultationReason: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Ex: Contrôle, Douleurs..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Diagnostic *
                      </label>
                      <input
                        type="text"
                        value={newRecord.diagnosis}
                        onChange={(e) => setNewRecord({ ...newRecord, diagnosis: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Diagnostic médical"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Traitement
                      </label>
                      <input
                        type="text"
                        value={newRecord.treatment}
                        onChange={(e) => setNewRecord({ ...newRecord, treatment: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Médicaments prescrits"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Posologie
                      </label>
                      <input
                        type="text"
                        value={newRecord.dosage}
                        onChange={(e) => setNewRecord({ ...newRecord, dosage: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Ex: 2 fois par jour"
                      />
                    </div>
                  </div>

                  {/* Constantes vitales */}
                  <div className="mb-4">
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Constantes vitales</h5>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Température (°C)</label>
                        <input
                          type="number"
                          step="0.1"
                          value={newRecord.vitals.temperature}
                          onChange={(e) => setNewRecord({
                            ...newRecord,
                            vitals: { ...newRecord.vitals, temperature: e.target.value }
                          })}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                          placeholder="36.5"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Tension</label>
                        <input
                          type="text"
                          value={newRecord.vitals.bloodPressure}
                          onChange={(e) => setNewRecord({
                            ...newRecord,
                            vitals: { ...newRecord.vitals, bloodPressure: e.target.value }
                          })}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                          placeholder="120/80"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Pouls (bpm)</label>
                        <input
                          type="number"
                          value={newRecord.vitals.heartRate}
                          onChange={(e) => setNewRecord({
                            ...newRecord,
                            vitals: { ...newRecord.vitals, heartRate: e.target.value }
                          })}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                          placeholder="70"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Poids (kg)</label>
                        <input
                          type="number"
                          step="0.1"
                          value={newRecord.vitals.weight}
                          onChange={(e) => setNewRecord({
                            ...newRecord,
                            vitals: { ...newRecord.vitals, weight: e.target.value }
                          })}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                          placeholder="70.0"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Taille (cm)</label>
                        <input
                          type="number"
                          value={newRecord.vitals.height}
                          onChange={(e) => setNewRecord({
                            ...newRecord,
                            vitals: { ...newRecord.vitals, height: e.target.value }
                          })}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                          placeholder="170"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notes complémentaires
                    </label>
                    <textarea
                      value={newRecord.notes}
                      onChange={(e) => setNewRecord({ ...newRecord, notes: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                      placeholder="Observations, recommandations..."
                    />
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setIsAddingRecord(false)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleAddMedicalRecord}
                      className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                    >
                      <Save className="h-4 w-4" />
                      <span>Enregistrer</span>
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {medicalRecords.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Aucun dossier médical</h4>
                    <p className="text-gray-600">Ce patient n'a pas encore de consultation enregistrée.</p>
                  </div>
                ) : (
                  medicalRecords
                    .sort((a, b) => new Date(b.consultationDate).getTime() - new Date(a.consultationDate).getTime())
                    .map((record) => (
                      <div key={record.id} className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h4 className="font-semibold text-gray-900">{record.consultationReason}</h4>
                            <p className="text-sm text-gray-600">
                              {new Date(record.consultationDate).toLocaleDateString('fr-FR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="text-sm font-medium text-gray-700">Diagnostic</label>
                            <p className="text-gray-900">{record.diagnosis}</p>
                          </div>
                          {record.treatment && (
                            <div>
                              <label className="text-sm font-medium text-gray-700">Traitement</label>
                              <p className="text-gray-900">{record.treatment}</p>
                              {record.dosage && (
                                <p className="text-sm text-gray-600">{record.dosage}</p>
                              )}
                            </div>
                          )}
                        </div>

                        {record.vitals && (
                          <div className="mb-4">
                            <label className="text-sm font-medium text-gray-700 mb-2 block">Constantes vitales</label>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                              {record.vitals.temperature && (
                                <div>
                                  <span className="text-gray-600">Température:</span>
                                  <span className="ml-1 font-medium">{record.vitals.temperature}°C</span>
                                </div>
                              )}
                              {record.vitals.bloodPressure && (
                                <div>
                                  <span className="text-gray-600">Tension:</span>
                                  <span className="ml-1 font-medium">{record.vitals.bloodPressure}</span>
                                </div>
                              )}
                              {record.vitals.heartRate && (
                                <div>
                                  <span className="text-gray-600">Pouls:</span>
                                  <span className="ml-1 font-medium">{record.vitals.heartRate} bpm</span>
                                </div>
                              )}
                              {record.vitals.weight && (
                                <div>
                                  <span className="text-gray-600">Poids:</span>
                                  <span className="ml-1 font-medium">{record.vitals.weight} kg</span>
                                </div>
                              )}
                              {record.vitals.height && (
                                <div>
                                  <span className="text-gray-600">Taille:</span>
                                  <span className="ml-1 font-medium">{record.vitals.height} cm</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {record.notes && (
                          <div>
                            <label className="text-sm font-medium text-gray-700">Notes</label>
                            <p className="text-gray-900">{record.notes}</p>
                          </div>
                        )}
                      </div>
                    ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'pregnancy' && canAccessMedical && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Suivi de Grossesse</h3>

              {pregnancyRecords.length === 0 ? (
                <div className="text-center py-8">
                  <Baby className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Aucun suivi de grossesse</h4>
                  <p className="text-gray-600">Aucune grossesse enregistrée pour cette patiente.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pregnancyRecords.map((pregnancy) => (
                    <div key={pregnancy.id} className="bg-white border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-gray-900">
                          Grossesse #{pregnancy.pregnancyNumber}
                        </h4>
                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${pregnancy.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                          }`}>
                          {pregnancy.status === 'active' ? 'En cours' : 'Terminée'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Date de début</label>
                          <p className="text-gray-900">{new Date(pregnancy.startDate).toLocaleDateString('fr-FR')}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Date prévue d'accouchement</label>
                          <p className="text-gray-900">{new Date(pregnancy.expectedDueDate).toLocaleDateString('fr-FR')}</p>
                        </div>
                      </div>

                      <div>
                        <h5 className="font-medium text-gray-900 mb-2">Visites de suivi</h5>
                        {pregnancy.visits.length === 0 ? (
                          <p className="text-gray-600 text-sm">Aucune visite enregistrée</p>
                        ) : (
                          <div className="space-y-2">
                            {pregnancy.visits.map((visit) => (
                              <div key={visit.id} className="bg-gray-50 rounded p-3">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="font-medium">
                                    Semaine {visit.gestationalWeek} - {new Date(visit.visitDate).toLocaleDateString('fr-FR')}
                                  </span>
                                  <span className="text-gray-600">Poids: {visit.weight}kg</span>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">{visit.notes}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'menstrual' && canAccessMedical && patient.sexe === 'Féminin' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Suivi du Cycle Menstruel</h3>

              {menstrualRecords.length === 0 ? (
                <div className="text-center py-8">
                  <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Aucun suivi menstruel</h4>
                  <p className="text-gray-600">Aucun cycle menstruel enregistré pour cette patiente.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {menstrualRecords
                    .sort((a, b) => new Date(b.cycleStartDate).getTime() - new Date(a.cycleStartDate).getTime())
                    .map((record) => (
                      <div key={record.id} className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-700">Date de début</label>
                            <p className="text-gray-900">{new Date(record.cycleStartDate).toLocaleDateString('fr-FR')}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700">Durée du cycle</label>
                            <p className="text-gray-900">{record.cycleLength} jours</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700">Régularité</label>
                            <p className="text-gray-900">
                              {record.cycleLength >= 21 && record.cycleLength <= 35 ? 'Normal' : 'Irrégulier'}
                            </p>
                          </div>
                        </div>
                        {record.notes && (
                          <div className="mt-4">
                            <label className="text-sm font-medium text-gray-700">Notes</label>
                            <p className="text-gray-900">{record.notes}</p>
                          </div>
                        )}
                      </div>
                    ))
                  }
                </div>
              )}
            </div>
          )}

          {activeTab === 'chronic' && canAccessMedical && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Pathologies Chroniques</h3>

              {chronicConditions.length === 0 ? (
                <div className="text-center py-8">
                  <Activity className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Aucune pathologie chronique</h4>
                  <p className="text-gray-600">Aucune pathologie chronique enregistrée pour ce patient.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {chronicConditions.map((condition) => (
                    <div key={condition.id} className="bg-white border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-gray-900">{condition.condition}</h4>
                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${condition.status === 'active'
                          ? 'bg-red-100 text-red-800'
                          : condition.status === 'remission'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                          }`}>
                          {condition.status === 'active' ? 'Actif' :
                            condition.status === 'remission' ? 'En rémission' : 'Guéri'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Date de diagnostic</label>
                          <p className="text-gray-900">{new Date(condition.diagnosisDate).toLocaleDateString('fr-FR')}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Médicaments</label>
                          <p className="text-gray-900">{condition.medications.join(', ')}</p>
                        </div>
                      </div>

                      {condition.notes && (
                        <div>
                          <label className="text-sm font-medium text-gray-700">Notes</label>
                          <p className="text-gray-900">{condition.notes}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};