import React, { useEffect, useState } from 'react';
import { usePatients } from '../../hooks/usePatients';
import { ArrowLeft, Save, User, MapPin } from 'lucide-react';
import Swal from 'sweetalert2';

interface AddPatientFormProps {
  onBack: () => void;
  onPatientAdded: () => void;
  patientInfo?: any;
}

export const AddPatientForm: React.FC<AddPatientFormProps> = ({ onBack, onPatientAdded, patientInfo }) => {
  const { addPatient, updatePatient } = usePatients();
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    sexe: 'Féminin' as 'Féminin' | 'Masculin',
    dateNaissance: '',
    adresse: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const isEditMode = !!patientInfo;

  useEffect(() => {
    if (isEditMode && patientInfo) {
      console.log('Patient info reçu:', patientInfo);
      setFormData({
        nom: patientInfo.nom || '',
        prenom: patientInfo.prenom || '',
        sexe: patientInfo.sexe || 'Féminin',
        dateNaissance: patientInfo.dateNaissance
          ? patientInfo.dateNaissance.split('T')[0]
          : '',
        adresse: patientInfo.adresse || '',
      });
    }
  }, [isEditMode, patientInfo]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.prenom.trim()) newErrors.prenom = 'Le prénom est obligatoire';
    if (!formData.nom.trim()) newErrors.nom = 'Le nom est obligatoire';
    if (!formData.dateNaissance) {
      newErrors.dateNaissance = 'La date de naissance est obligatoire';
    } else {
      const birthDate = new Date(formData.dateNaissance);
      if (birthDate > new Date()) {
        newErrors.dateNaissance = 'La date de naissance ne peut pas être dans le futur';
      }
    }
    if (!formData.adresse.trim()) newErrors.adresse = "L'adresse est obligatoire";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generatePatientNumber = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, '0');
    return `PAT-${year}-${random}`;
  };

  const resetForm = () => {
    setFormData({
      nom: '',
      prenom: '',
      sexe: 'Féminin',
      dateNaissance: '',
      adresse: '',
    });
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (isEditMode) {        
        await updatePatient(patientInfo.id, {
          ...formData,
          dateNaissance: new Date(formData.dateNaissance + 'T00:00:00.000Z').toISOString(),
        });

        await Swal.fire({
          title: 'Succès !',
          text: 'Le patient a été modifié avec succès',
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#2563eb',
        });

        onPatientAdded();
      } else {
        // Mode ajout
        await addPatient({
          patientNumber: generatePatientNumber(),
          prenom: formData.prenom.trim(),
          nom: formData.nom.trim(),
          sexe: formData.sexe,
          dateNaissance: new Date(formData.dateNaissance + 'T00:00:00.000Z').toISOString(),
          adresse: formData.adresse.trim(),
        });

        await Swal.fire({
          title: 'Succès !',
          text: 'Le patient a été créé avec succès',
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#2563eb',
        });

        resetForm();
      }

      onPatientAdded();
    } catch (error) {
      console.error('Erreur patient:', error);
      await Swal.fire({
        title: 'Erreur !',
        text: 'Une erreur est survenue. Veuillez réessayer.',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#dc2626',
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Retour à la liste</span>
          </button>

          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {isEditMode ? 'Modifier Patient' : 'Nouveau Patient'}
              </h1>
              <p className="text-gray-600">
                {isEditMode
                  ? 'Modifier les informations du patient'
                  : 'Créer un nouveau dossier patient'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Formulaire */}
      <form
        className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
      >
        <div className="space-y-8">
          {/* Informations personnelles */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <User className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Informations Personnelles</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Prénom */}
              <div>
                <label htmlFor="prenom" className="block text-sm font-medium text-gray-700 mb-2">
                  Prénom *
                </label>
                <input
                  type="text"
                  id="prenom"
                  value={formData.prenom}
                  onChange={(e) => handleInputChange('prenom', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${errors.prenom ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                  placeholder="Prénom du patient"
                />
                {errors.prenom && <p className="mt-1 text-sm text-red-600">{errors.prenom}</p>}
              </div>

              {/* Nom */}
              <div>
                <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-2">
                  Nom *
                </label>
                <input
                  type="text"
                  id="nom"
                  value={formData.nom}
                  onChange={(e) => handleInputChange('nom', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${errors.nom ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                  placeholder="Nom du patient"
                />
                {errors.nom && <p className="mt-1 text-sm text-red-600">{errors.nom}</p>}
              </div>

              {/* Sexe */}
              <div>
                <label htmlFor="sexe" className="block text-sm font-medium text-gray-700 mb-2">
                  Genre *
                </label>
                <select
                  id="sexe"
                  value={formData.sexe}
                  onChange={(e) => handleInputChange('sexe', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Féminin">Femme</option>
                  <option value="Masculin">Homme</option>
                </select>
              </div>

              {/* Date de naissance */}
              <div>
                <label
                  htmlFor="dateNaissance"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Date de naissance *
                </label>
                <input
                  type="date"
                  id="dateNaissance"
                  value={formData.dateNaissance}
                  onChange={(e) => handleInputChange('dateNaissance', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${errors.dateNaissance ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                />
                {errors.dateNaissance && (
                  <p className="mt-1 text-sm text-red-600">{errors.dateNaissance}</p>
                )}
              </div>
            </div>

            {/* Adresse */}
            <div className="mt-6">
              <div className="flex items-center space-x-2 mb-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <label htmlFor="adresse" className="block text-sm font-medium text-gray-700">
                  Adresse complète *
                </label>
              </div>
              <textarea
                id="adresse"
                value={formData.adresse}
                onChange={(e) => handleInputChange('adresse', e.target.value)}
                rows={3}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${errors.adresse ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                placeholder="Adresse complète du patient"
              />
              {errors.adresse && <p className="mt-1 text-sm text-red-600">{errors.adresse}</p>}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-3 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"

            >
              Annuler
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <Save className="h-5 w-5" />
              <span>{isEditMode ? 'Modifier' : 'Créer le Patient'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};