// components/MedRecords.tsx
import React, { useState } from 'react';
import { useMedRecords } from '../../hooks/useMedRecords';
import { usePatients } from '../../hooks/usePatients';
import { useAuth } from '../../hooks/useAuth';
import {
    Plus,
    Edit,
    Trash2,
    Eye,
    FileText,
    Calendar,
    User,
    Save,
    X,
    Search,
    Stethoscope
} from 'lucide-react';
import Swal from 'sweetalert2';

interface MedRecordProps {
    onPatientSelect: (patientId: string) => void;
}

const MedRecords: React.FC<MedRecordProps> = ({onPatientSelect}) => {
    const { dossiers, loading, error, addDossier, updateDossier, removeDossier } = useMedRecords();
    const { patients, loading: patientsLoading } = usePatients();
    const { user: currentUser } = useAuth();

    const [isAddingDossier, setIsAddingDossier] = useState(false);
    const [editingDossier, setEditingDossier] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [newDossier, setNewDossier] = useState({
        patientId: '',
        creePar: currentUser?.id || ''
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    // Filtrer les dossiers selon la recherche
    const filteredDossiers = dossiers.filter(dossier => {
        const patient = patients.find(p => p.id.toString() === dossier.patientId.toString());
        if (!patient) return false;

        return (
            patient.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
            dossier.patientId.toString().includes(searchTerm)
        );
    });

    // Patients sans dossier médical
    const patientsWithoutDossier = patients.filter(patient =>
        !dossiers.some(dossier => dossier.patientId.toString() === patient.id.toString())
    );

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!newDossier.patientId) {
            newErrors.patientId = 'La sélection d\'un patient est obligatoire';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            if (editingDossier) {
                await updateDossier(editingDossier, { ...newDossier, patientId: Number(newDossier.patientId) });
                Swal.fire({
                    icon: 'success',
                    title: 'Succès',
                    text: 'Dossier médical modifié avec succès',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#3085d6'
                });
            } else {
                await addDossier({ ...newDossier, patientId: Number(newDossier.patientId) });
                Swal.fire({
                    icon: 'success',
                    title: 'Succès',
                    text: 'Dossier médical créé avec succès',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#3085d6'
                });
            }

            handleCancel();
        } catch (err: any) {
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: err.message,
                confirmButtonText: 'OK',
                confirmButtonColor: '#d33'
            });
        }
    };

    const handleEdit = (dossier: any) => {
        setNewDossier({
            patientId: dossier.patientId,
            creePar: currentUser?.id || ''
        });
        setEditingDossier(dossier.id);
        setIsAddingDossier(true);
    };

    const handleDelete = async (id: string, patientName: string) => {
        const result = await Swal.fire({
            icon: 'warning',
            title: 'Confirmer la suppression',
            text: `Êtes-vous sûr de vouloir supprimer le dossier médical de ${patientName} ?`,
            showCancelButton: true,
            confirmButtonText: 'Oui, supprimer',
            cancelButtonText: 'Annuler',
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6'
        });

        if (result.isConfirmed) {
            try {
                await removeDossier(id);
                Swal.fire({
                    icon: 'success',
                    title: 'Supprimé',
                    text: 'Dossier médical supprimé avec succès',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#3085d6'
                });
            } catch (err: any) {
                Swal.fire({
                    icon: 'error',
                    title: 'Erreur',
                    text: err.message,
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#d33'
                });
            }
        }
    };

    const handleCancel = () => {
        setIsAddingDossier(false);
        setEditingDossier(null);
        setNewDossier({
            patientId: '',
            creePar: currentUser?.id || ''
        });
        setErrors({});
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getPatientInfo = (patientId: string) => {
        return patients.find(p => p.id.toString() === patientId.toString());
    };

    if (loading || patientsLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* En-tête */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <Stethoscope className="h-6 w-6" />
                            Dossiers Médicaux
                        </h2>
                        <p className="text-gray-600">
                            {dossiers.length} dossier{dossiers.length > 1 ? 's' : ''} médical{dossiers.length > 1 ? 'aux' : ''} •
                            {' '}{patientsWithoutDossier.length} patient{patientsWithoutDossier.length > 1 ? 's' : ''} sans dossier
                        </p>
                    </div>

                    <button
                        onClick={() => setIsAddingDossier(true)}
                        disabled={patientsWithoutDossier.length === 0}
                        className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors duration-200"
                    >
                        <Plus className="h-5 w-5" />
                        <span>Nouveau Dossier</span>
                    </button>
                </div>
            </div>

            {/* Barre de recherche */}
            <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                        type="text"
                        placeholder="Rechercher par nom, prénom ou ID patient..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            </div>

            {/* Formulaire d'ajout/modification */}
            {isAddingDossier && (
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">
                            {editingDossier ? 'Modifier le dossier' : 'Nouveau dossier médical'}
                        </h3>
                        <button
                            onClick={handleCancel}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Patient *
                            </label>
                            <select
                                value={newDossier.patientId}
                                onChange={(e) => setNewDossier({ ...newDossier, patientId: e.target.value })}
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.patientId ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                    }`}
                            >
                                <option value="">Sélectionner un patient</option>
                                {patientsWithoutDossier.map(patient => (
                                    <option key={patient.id} value={patient.id}>
                                        {patient.prenom} {patient.nom} - {formatDate(patient.dateNaissance)} - {patient.sexe}
                                    </option>
                                ))}
                            </select>
                            {errors.patientId && (
                                <p className="mt-1 text-sm text-red-600">{errors.patientId}</p>
                            )}
                            {patientsWithoutDossier.length === 0 && (
                                <p className="mt-2 text-sm text-orange-600">
                                    Tous les patients ont déjà un dossier médical. Ajoutez d'abord un nouveau patient.
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end space-x-4 mt-6 pt-6 border-t border-gray-200">
                        <button
                            onClick={handleCancel}
                            className="px-6 py-3 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                        >
                            Annuler
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={patientsWithoutDossier.length === 0}
                            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition-colors duration-200"
                        >
                            <Save className="h-5 w-5" />
                            <span>{editingDossier ? 'Modifier' : 'Créer'}</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Liste des dossiers */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDossiers.map((dossier) => {
                    const patient = getPatientInfo(dossier.patientId);
                    if (!patient) return null;

                    return (
                        <div key={dossier.id} className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-200">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                        <FileText className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">
                                            {dossier.id } {patient.prenom} {patient.nom}
                                        </h3>
                                        <p className="text-sm text-gray-600">ID: {dossier.patientId}</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-1">
                                    <button
                                        onClick={() => handleEdit(dossier)}
                                        className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors duration-200"
                                        title="Modifier"
                                    >
                                        <Edit className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(dossier.id, `${patient.prenom} ${patient.nom}`)}
                                        className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors duration-200"
                                        title="Supprimer"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2 text-sm text-gray-600">
                                <div className="flex items-center space-x-2">
                                    <Calendar className="h-4 w-4" />
                                    <span>Créé le {formatDate(dossier.dateCreation)}</span>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <User className="h-4 w-4" />
                                    <span>
                                        {['Féminin', 'F'].includes(patient.sexe) ? 'Née' : 'Né'} le {formatDate(patient.dateNaissance)}
                                    </span>
                                </div>

                                {dossier.utilisateurCreateur && (
                                    <div className="text-xs text-gray-500">
                                        Créé par {dossier.utilisateurCreateur.prenom} {dossier.utilisateurCreateur.nom}
                                    </div>
                                )}
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <button
                                    onClick={ () => onPatientSelect(dossier.patientId.toString()) }
                                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                                >
                                    <Eye className="h-4 w-4" />
                                    <span>Voir les consultations</span>
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* État vide */}
            {filteredDossiers.length === 0 && !loading && (
                <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-gray-100">
                    <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {searchTerm ? 'Aucun dossier trouvé' : 'Aucun dossier médical'}
                    </h3>
                    <p className="text-gray-600 mb-6">
                        {searchTerm
                            ? 'Aucun dossier ne correspond à votre recherche.'
                            : patientsWithoutDossier.length > 0
                                ? 'Commencez par créer votre premier dossier médical.'
                                : 'Tous les patients ont un dossier médical. Ajoutez d\'abord un nouveau patient.'
                        }
                    </p>
                    {!searchTerm && patientsWithoutDossier.length > 0 && (
                        <button
                            onClick={() => setIsAddingDossier(true)}
                            className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                        >
                            <Plus className="h-5 w-5" />
                            <span>Créer un dossier</span>
                        </button>
                    )}
                </div>
            )}

            {/* Message d'erreur */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <p className="text-red-800 text-sm">{error}</p>
                </div>
            )}
        </div>
    );
};

export default MedRecords;