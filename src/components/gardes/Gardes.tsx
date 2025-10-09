import React, { useState } from 'react';
import { useGardes } from '../../hooks/useGardes';
import { useUsers } from '../../hooks/useUsers';
import { Plus, Calendar, User, Edit, Trash2, ChevronLeft, ChevronRight, Sun, Moon } from 'lucide-react';
import { Garde, CreateGardeData, TypeGardeEnum } from '../../types';

export const GardeManagement: React.FC = () => {
    const { gardes, loading, currentYear, currentMonth, addGarde, updateGardeById, deleteGardeById, changeMonth, changeYear } = useGardes();
    const { users } = useUsers();

    const [isAddingGarde, setIsAddingGarde] = useState(false);
    const [editingGarde, setEditingGarde] = useState<string | null>(null);

    const [newGarde, setNewGarde] = useState<CreateGardeData>({
        dateDebut: new Date(),
        dateFin: new Date(),
        medecinId: 0,
        typeGarde: TypeGardeEnum.JOUR
    });

    const formatForDateTimeLocal = (date: Date) => {
        return new Date(date.getTime() - (date.getTimezoneOffset() * 60000))
            .toISOString()
            .slice(0, 16);
    };

    const doctors = users.filter(u => u.role === 'Medecin_Chef');

    // Navigation mois/année
    const months = [
        'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];

    const goToPreviousMonth = () => {
        if (currentMonth === 1) {
            changeYear(currentYear - 1);
            changeMonth(12);
        } else {
            changeMonth(currentMonth - 1);
        }
    };

    const goToNextMonth = () => {
        if (currentMonth === 12) {
            changeYear(currentYear + 1);
            changeMonth(1);
        } else {
            changeMonth(currentMonth + 1);
        }
    };

    const goToCurrentMonth = () => {
        const now = new Date();
        changeYear(now.getFullYear());
        changeMonth(now.getMonth() + 1);
    };

    const handleSubmit = async () => {
        if (!newGarde.medecinId || !newGarde.dateDebut || !newGarde.dateFin || !newGarde.typeGarde) {
            alert('Veuillez remplir tous les champs obligatoires');
            return;
        }

        if (newGarde.dateDebut >= newGarde.dateFin) {
            alert('La date de fin doit être postérieure à la date de début');
            return;
        }

        try {
            if (editingGarde) {
                await updateGardeById(editingGarde, newGarde);
                setEditingGarde(null);
            } else {
                await addGarde(newGarde);
            }

            setIsAddingGarde(false);
            setNewGarde({
                dateDebut: new Date(),
                dateFin: new Date(Date.now() + 8 * 60 * 60 * 1000),
                medecinId: 0,
                typeGarde: TypeGardeEnum.JOUR
            });
        } catch (error) {
            console.error('Erreur lors de la sauvegarde:', error);
            alert('Erreur lors de la sauvegarde de la garde');
        }
    };

    const handleEdit = (garde: Garde) => {
        setNewGarde({
            dateDebut: new Date(garde.dateDebut),
            dateFin: new Date(garde.dateFin),
            medecinId: garde.medecinId,
            typeGarde: garde.typeGarde
        });
        setEditingGarde(garde.id.toString());
        setIsAddingGarde(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette garde ?')) {
            try {
                await deleteGardeById(id);
            } catch (error) {
                console.error('Erreur lors de la suppression:', error);
            }
        }
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getDoctorName = (medecinId: number) => {
        const doctor = doctors.find(d => parseInt(d.id) === medecinId);
        return doctor ? `Dr. ${doctor.prenom} ${doctor.nom}` : 'Médecin inconnu';
    };

    const getTypeGardeColor = (type: TypeGardeEnum) => {
        switch (type) {
            case TypeGardeEnum.JOUR:
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case TypeGardeEnum.NUIT:
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case TypeGardeEnum.WEEK_END:
                return 'bg-purple-100 text-purple-800 border-purple-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getTypeGardeIcon = (type: TypeGardeEnum) => {
        switch (type) {
            case TypeGardeEnum.JOUR:
                return <Sun className="h-4 w-4" />;
            case TypeGardeEnum.NUIT:
                return <Moon className="h-4 w-4" />;
            case TypeGardeEnum.WEEK_END:
                return <Calendar className="h-4 w-4" />;
            default:
                return <Calendar className="h-4 w-4" />;
        }
    };

    const getTypeGardeLabel = (type: TypeGardeEnum) => {
        switch (type) {
            case TypeGardeEnum.JOUR:
                return 'Garde de jour';
            case TypeGardeEnum.NUIT:
                return 'Garde de nuit';
            case TypeGardeEnum.WEEK_END:
                return 'Garde de week-end';
            default:
                return type;
        }
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
            {/* En-tête avec navigation */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Gestion des Gardes</h2>
                        <p className="text-gray-600">Planification des gardes médicales</p>
                    </div>

                    <button
                        onClick={() => setIsAddingGarde(true)}
                        className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                    >
                        <Plus className="h-5 w-5" />
                        <span>Nouvelle Garde</span>
                    </button>
                </div>

                {/* Navigation mois/année */}
                <div className="mt-6 flex items-center justify-center space-x-4">
                    <button
                        onClick={goToPreviousMonth}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>

                    <div className="flex items-center space-x-4">
                        <select
                            value={currentMonth}
                            onChange={(e) => changeMonth(parseInt(e.target.value))}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            {months.map((month, index) => (
                                <option key={month} value={index + 1}>
                                    {month}
                                </option>
                            ))}
                        </select>

                        <select
                            value={currentYear}
                            onChange={(e) => changeYear(parseInt(e.target.value))}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            {Array.from({ length: 5 }, (_, i) => currentYear - 2 + i).map(year => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>

                        <button
                            onClick={goToCurrentMonth}
                            className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                        >
                            Aujourd'hui
                        </button>
                    </div>

                    <button
                        onClick={goToNextMonth}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </button>
                </div>
            </div>

            {/* Formulaire d'ajout/modification */}
            {isAddingGarde && (
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">
                        {editingGarde ? 'Modifier la garde' : 'Nouvelle garde'}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Médecin *
                            </label>
                            <select
                                value={newGarde.medecinId}
                                onChange={(e) => setNewGarde({ ...newGarde, medecinId: parseInt(e.target.value) })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value={0}>Sélectionner un médecin</option>
                                {doctors.map(doctor => (
                                    <option key={doctor.id} value={doctor.id}>
                                        Dr. {doctor.prenom} {doctor.nom}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Type de garde *
                            </label>
                            <select
                                value={newGarde.typeGarde}
                                onChange={(e) => setNewGarde({ ...newGarde, typeGarde: e.target.value as TypeGardeEnum })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value={TypeGardeEnum.JOUR}>Garde de jour</option>
                                <option value={TypeGardeEnum.NUIT}>Garde de nuit</option>
                                <option value={TypeGardeEnum.WEEK_END}>Garde de week-end</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Date et heure de début *
                            </label>
                            <input
                                type="datetime-local"
                                value={formatForDateTimeLocal(newGarde.dateDebut)}
                                onChange={(e) => setNewGarde({ ...newGarde, dateDebut: new Date(e.target.value) })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Date et heure de fin *
                            </label>
                            <input
                                type="datetime-local"
                                value={formatForDateTimeLocal(newGarde.dateFin)}
                                onChange={(e) => setNewGarde({ ...newGarde, dateFin: new Date(e.target.value) })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end space-x-4 mt-6 pt-6 border-t border-gray-200">
                        <button
                            onClick={() => {
                                setIsAddingGarde(false);
                                setEditingGarde(null);
                                setNewGarde({
                                    dateDebut: new Date(),
                                    dateFin: new Date(Date.now() + 8 * 60 * 60 * 1000),
                                    medecinId: 0,
                                    typeGarde: TypeGardeEnum.JOUR
                                });
                            }}
                            className="px-6 py-3 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                        >
                            Annuler
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-200"
                        >
                            {editingGarde ? 'Modifier' : 'Créer'}
                        </button>
                    </div>
                </div>
            )}

            {/* Liste des gardes */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                {gardes.length === 0 ? (
                    <div className="p-12 text-center">
                        <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune garde planifiée</h3>
                        <p className="text-gray-600 mb-6">
                            Aucune garde n'est planifiée pour {months[currentMonth - 1]} {currentYear}.
                        </p>
                        <button
                            onClick={() => setIsAddingGarde(true)}
                            className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                        >
                            <Plus className="h-5 w-5" />
                            <span>Planifier une garde</span>
                        </button>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {gardes.map((garde) => (
                            <div key={garde.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                                            <User className="h-6 w-6 text-white" />
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3 mb-2">
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    {getDoctorName(garde.medecinId)}
                                                </h3>
                                                <span className={`inline-flex items-center space-x-1 px-3 py-1 text-sm font-medium rounded-full border ${getTypeGardeColor(garde.typeGarde)}`}>
                                                    {getTypeGardeIcon(garde.typeGarde)}
                                                    <span>{getTypeGardeLabel(garde.typeGarde)}</span>
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                                                <div className="flex items-center space-x-1">
                                                    <Calendar className="h-4 w-4" />
                                                    <span>Début: {formatDate(garde.dateDebut)}</span>
                                                </div>

                                                <div className="flex items-center space-x-1">
                                                    <Calendar className="h-4 w-4" />
                                                    <span>Fin: {formatDate(garde.dateFin)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => handleEdit(garde)}
                                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                                            title="Modifier"
                                        >
                                            <Edit className="h-5 w-5" />
                                        </button>

                                        <button
                                            onClick={() => handleDelete(garde.id.toString())}
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                                            title="Supprimer"
                                        >
                                            <Trash2 className="h-5 w-5" />
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