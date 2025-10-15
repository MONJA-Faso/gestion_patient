import React, { useEffect, useState, useMemo } from 'react';
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
import { FichierConsultation } from '../../types';

interface PatientDetailProps {
  patientId: string;
  currentTab: string;
  onBack: () => void;
  consultations: FichierConsultation[];
}

export const PatientDetail: React.FC<PatientDetailProps> = ({ patientId, onBack, currentTab, consultations }) => {
  const {
    getPatientById
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
    console.log("*** *** Dossiers in PatientDetail:", consultations);
    console.log("+++ +++ :", fetchConsultationsByDossier(patientId));
  }, [currentTab]);

  const fetchConsultationsByDossier = (patientId: string): FichierConsultation[] => {
    return consultations.filter(consultation => (
      consultation.dossierMedical?.patientId === parseInt(patientId, 10)
    ));
  };

  const getPregnancyFollowUps = useMemo(() => {
    const patientConsultations = fetchConsultationsByDossier(patientId);
    const pregnancyFollowUps: any[] = [];

    patientConsultations.forEach(consultation => {
      consultation.suivisMedicaux?.forEach(suivi => {
        if (suivi.typeSuivi === 'Grossesse') {
          pregnancyFollowUps.push({
            ...suivi,
            consultation: {
              date: consultation.dateConsultation,
              motif: consultation.motifConsultation,
              medecin: consultation.utilisateurCreateur
            }
          });
        }
      });
    });

    return pregnancyFollowUps.sort((a, b) => new Date(b.dateSuivi).getTime() - new Date(a.dateSuivi).getTime());
  }, [patientId, consultations]);

  const getMenstrualFollowUps = useMemo(() => {
    const patientConsultations = fetchConsultationsByDossier(patientId);
    const menstrualFollowUps: any[] = [];

    patientConsultations.forEach(consultation => {
      consultation.suivisMedicaux?.forEach(suivi => {
        if (suivi.typeSuivi === 'Cycle') {
          menstrualFollowUps.push({
            ...suivi,
            consultation: {
              date: consultation.dateConsultation,
              motif: consultation.motifConsultation,
              medecin: consultation.utilisateurCreateur
            }
          });
        }
      });
    });

    return menstrualFollowUps.sort((a, b) => new Date(b.dateSuivi).getTime() - new Date(a.dateSuivi).getTime());
  }, [patientId, consultations]);

  const getChronicConditionFollowUps = useMemo(() => {
    const patientConsultations = fetchConsultationsByDossier(patientId);
    const chronicFollowUps: any[] = [];

    patientConsultations.forEach(consultation => {
      consultation.suivisMedicaux?.forEach(suivi => {
        if (suivi.typeSuivi === 'Pathologie_Chronique') {
          chronicFollowUps.push({
            ...suivi,
            consultation: {
              date: consultation.dateConsultation,
              motif: consultation.motifConsultation,
              medecin: consultation.utilisateurCreateur
            }
          });
        }
      });
    });

    return chronicFollowUps.sort((a, b) => new Date(b.dateSuivi).getTime() - new Date(a.dateSuivi).getTime());
  }, [patientId, consultations]);

  const patient = getPatientById(patientId);

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
    { id: 'medical', label: 'Consultations', icon: FileText },
    { id: 'pregnancy', label: 'Suivi Grossesse', icon: Baby },
    { id: 'menstrual', label: 'Cycle Menstruel', icon: Heart },
    { id: 'chronic', label: 'Pathologies', icon: Activity }
  ];

  const canAccessMedical = user?.role !== 'Secretaire';

  return (
    <div className="space-y-6">
      {/* En-tête et navigation restent identiques */}
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
                      <label className="text-sm font-medium text-gray-700">Genre</label>
                      <p className="text-gray-900">{patient.sexe === 'Masculin' ? 'Homme' : 'Femme'}</p>
                    </div>

                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 opacity-0">Informations Personnelles</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Date de naissance</label>
                      <p className="text-gray-900">{new Date(patient.dateNaissance).toLocaleDateString('fr-FR')}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Adresse</label>
                      <p className="text-gray-900">{patient.adresse}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'medical' && canAccessMedical && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Historique des Consultations</h3>
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
                {fetchConsultationsByDossier(patientId).length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Aucune consultation</h4>
                    <p className="text-gray-600">Ce patient n'a pas encore de consultation enregistrée.</p>
                  </div>
                ) : (
                  fetchConsultationsByDossier(patientId)
                    .sort((a: FichierConsultation, b: FichierConsultation) => new Date(b.dateConsultation).getTime() - new Date(a.dateConsultation).getTime())
                    .map((consultation: FichierConsultation) => (
                      <div key={consultation.id} className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h4 className="font-semibold text-gray-900">{consultation.motifConsultation}</h4>
                            <p className="text-sm text-gray-600">
                              {new Date(consultation.dateConsultation).toLocaleDateString('fr-FR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })} - {consultation.typeConsultation}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              Par Dr. {consultation.utilisateurCreateur.prenom} {consultation.utilisateurCreateur.nom}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="text-sm font-medium text-gray-700">Diagnostic</label>
                            <p className="text-gray-900">
                              {consultation.diagnostic || 'Aucun diagnostic spécifié'}
                            </p>
                          </div>

                          {consultation.prescriptions && (
                            <div>
                              <label className="text-sm font-medium text-gray-700">Prescriptions</label>
                              <p className="text-gray-900">{consultation.prescriptions}</p>
                            </div>
                          )}
                        </div>

                        {consultation.observations && (
                          <div className="mb-4">
                            <label className="text-sm font-medium text-gray-700">Observations</label>
                            <p className="text-gray-900">{consultation.observations}</p>
                          </div>
                        )}

                        {consultation.suivisMedicaux && consultation.suivisMedicaux.length > 0 && (
                          <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 block">Suivis médicaux</label>
                            <div className="space-y-3">
                              {consultation.suivisMedicaux.map((suivi) => (
                                <div key={suivi.id} className="bg-gray-50 rounded p-3 border-l-4 border-blue-500">
                                  <div className="flex items-center justify-between text-sm mb-1">
                                    <span className="font-medium text-gray-900">{suivi.typeSuivi}</span>
                                    <span className="text-gray-600">
                                      {new Date(suivi.dateSuivi).toLocaleDateString('fr-FR')}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-600">{suivi.details}</p>
                                </div>
                              ))}
                            </div>
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

              {getPregnancyFollowUps.length === 0 ? (
                <div className="text-center py-8">
                  <Baby className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Aucun suivi de grossesse</h4>
                  <p className="text-gray-600">Aucune grossesse enregistrée pour cette patiente.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Affichage des suivis de grossesse depuis les consultations */}
                  {getPregnancyFollowUps.length > 0 && (
                    <div>
                      <h4 className="text-md font-semibold text-gray-900 mb-4">Suivis de grossesse</h4>
                      <div className="space-y-4">
                        {getPregnancyFollowUps.map((suivi) => (
                          <div key={suivi.id} className="bg-white border border-gray-200 rounded-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                              <h5 className="font-semibold text-gray-900">Suivi Grossesse</h5>
                              <span className="text-sm text-gray-600">
                                {new Date(suivi.dateSuivi).toLocaleDateString('fr-FR')}
                              </span>
                            </div>
                            <p className="text-gray-900 mb-3">{suivi.details}</p>
                            <div className="text-sm text-gray-600">
                              <p>Consultation: {new Date(suivi.consultation.date).toLocaleDateString('fr-FR')}</p>
                              <p>Motif: {suivi.consultation.motif}</p>
                              <p>Médecin: Dr. {suivi.consultation.medecin.prenom} {suivi.consultation.medecin.nom}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'menstrual' && canAccessMedical && patient.sexe === 'Féminin' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Suivi du Cycle Menstruel</h3>

              {getMenstrualFollowUps.length === 0 ? (
                <div className="text-center py-8">
                  <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Aucun suivi menstruel</h4>
                  <p className="text-gray-600">Aucun cycle menstruel enregistré pour cette patiente.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Affichage des suivis de cycle depuis les consultations */}
                  {getMenstrualFollowUps.length > 0 && (
                    <div>
                      <h4 className="text-md font-semibold text-gray-900 mb-4">Suivis de cycle menstruel</h4>
                      <div className="space-y-4">
                        {getMenstrualFollowUps.map((suivi) => (
                          <div key={suivi.id} className="bg-white border border-gray-200 rounded-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                              <h5 className="font-semibold text-gray-900">Suivi Cycle</h5>
                              <span className="text-sm text-gray-600">
                                {new Date(suivi.dateSuivi).toLocaleDateString('fr-FR')}
                              </span>
                            </div>
                            <p className="text-gray-900 mb-3">{suivi.details}</p>
                            <div className="text-sm text-gray-600">
                              <p>Consultation: {new Date(suivi.consultation.date).toLocaleDateString('fr-FR')}</p>
                              <p>Motif: {suivi.consultation.motif}</p>
                              <p>Médecin: Dr. {suivi.consultation.medecin.prenom} {suivi.consultation.medecin.nom}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'chronic' && canAccessMedical && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Pathologies Chroniques</h3>

              {getChronicConditionFollowUps.length === 0 ? (
                <div className="text-center py-8">
                  <Activity className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Aucune pathologie chronique</h4>
                  <p className="text-gray-600">Aucune pathologie chronique enregistrée pour ce patient.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Affichage des suivis de pathologies depuis les consultations */}
                  {getChronicConditionFollowUps.length > 0 && (
                    <div>
                      <h4 className="text-md font-semibold text-gray-900 mb-4">Suivis des pathologies</h4>
                      <div className="space-y-4">
                        {getChronicConditionFollowUps.map((suivi) => (
                          <div key={suivi.id} className="bg-white border border-gray-200 rounded-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                              <h5 className="font-semibold text-gray-900">Suivi Pathologie Chronique</h5>
                              <span className="text-sm text-gray-600">
                                {new Date(suivi.dateSuivi).toLocaleDateString('fr-FR')}
                              </span>
                            </div>
                            <p className="text-gray-900 mb-3">{suivi.details}</p>
                            <div className="text-sm text-gray-600">
                              <p>Consultation: {new Date(suivi.consultation.date).toLocaleDateString('fr-FR')}</p>
                              <p>Motif: {suivi.consultation.motif}</p>
                              <p>Médecin: Dr. {suivi.consultation.medecin.prenom} {suivi.consultation.medecin.nom}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};