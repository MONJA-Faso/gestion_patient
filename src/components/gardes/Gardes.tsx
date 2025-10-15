import React, { useState, useEffect } from 'react';
import { useGardes } from '../../hooks/useGardes';
import { useUsers } from '../../hooks/useUsers';
import { Plus, Calendar, User, Edit, Trash2, ChevronLeft, ChevronRight, Sun, Moon } from 'lucide-react';
import { Garde, CreateGardeData, TypeGardeEnum } from '../../types';

export const GardeManagement: React.FC = () => {
    const { gardes, loading, currentYear, currentMonth, addGarde, updateGardeById, deleteGardeById, changeMonth, changeYear } = useGardes();
    const { users } = useUsers();

    const [isAddingGarde, setIsAddingGarde] = useState(false);
    const [editingGarde, setEditingGarde] = useState<string | null>(null);
    const [currentWeek, setCurrentWeek] = useState<number>(1);

    const [newGarde, setNewGarde] = useState<CreateGardeData>({
        dateDebut: new Date(),
        dateFin: new Date(),
        medecinId: 0,
        typeGarde: TypeGardeEnum.JOUR
    });

    // Fonction pour obtenir la semaine actuelle
    function getCurrentWeek(): number {
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 1);
        const diff = now.getTime() - start.getTime();
        return Math.ceil(diff / (7 * 24 * 60 * 60 * 1000));
    }

    // Fonction pour obtenir les dates de la semaine basée sur le mois et l'année
    function getWeekDates(year: number, month: number, week: number): Date[] {
        const firstDayOfMonth = new Date(year, month - 1, 1);
        const firstDayOfWeek = new Date(firstDayOfMonth);
        
        // Trouver le premier lundi du mois ou avant
        const dayOfWeek = firstDayOfMonth.getDay();
        const daysToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
        firstDayOfWeek.setDate(firstDayOfMonth.getDate() + daysToMonday + (week - 1) * 7);
        
        const weekDates = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date(firstDayOfWeek);
            date.setDate(firstDayOfWeek.getDate() + i);
            weekDates.push(date);
        }
        return weekDates;
    }

    // Fonction pour obtenir le nombre de semaines dans un mois
    function getWeeksInMonth(year: number, month: number): number {
        const firstDay = new Date(year, month - 1, 1);
        const lastDay = new Date(year, month, 0);
        
        const firstWeek = getWeekNumber(firstDay);
        const lastWeek = getWeekNumber(lastDay);
        
        return lastWeek - firstWeek + 1;
    }

    // Fonction pour obtenir le numéro de semaine d'une date
    function getWeekNumber(date: Date): number {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        d.setDate(d.getDate() + 4 - (d.getDay() || 7));
        const yearStart = new Date(d.getFullYear(), 0, 1);
        return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
    }

    // Initialiser la semaine courante
    useEffect(() => {
        const now = new Date();
        const currentWeekNumber = getWeekNumber(now);
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const firstWeekOfMonth = getWeekNumber(firstDayOfMonth);
        setCurrentWeek(currentWeekNumber - firstWeekOfMonth + 1);
    }, []);

    // Mettre à jour la semaine quand le mois change
    useEffect(() => {
        setCurrentWeek(1);
    }, [currentMonth, currentYear]);

    const formatForDateTimeLocal = (date: Date) => {
        return new Date(date.getTime() - (date.getTimezoneOffset() * 60000))
            .toISOString()
            .slice(0, 16);
    };

    const doctors = users.filter(u => u.role === 'Medecin_Chef');

    // Navigation mois/année/semaine
    const months = [
        'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];

    const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

    const goToPreviousWeek = () => {
        if (currentWeek === 1) {
            if (currentMonth === 1) {
                changeYear(currentYear - 1);
                changeMonth(12);
            } else {
                changeMonth(currentMonth - 1);
            }
            setCurrentWeek(getWeeksInMonth(currentYear, currentMonth));
        } else {
            setCurrentWeek(currentWeek - 1);
        }
    };

    const goToNextWeek = () => {
        const weeksInMonth = getWeeksInMonth(currentYear, currentMonth);
        if (currentWeek === weeksInMonth) {
            if (currentMonth === 12) {
                changeYear(currentYear + 1);
                changeMonth(1);
            } else {
                changeMonth(currentMonth + 1);
            }
            setCurrentWeek(1);
        } else {
            setCurrentWeek(currentWeek + 1);
        }
    };

    const goToCurrentWeek = () => {
        const now = new Date();
        changeYear(now.getFullYear());
        changeMonth(now.getMonth() + 1);
        
        const currentWeekNumber = getWeekNumber(now);
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const firstWeekOfMonth = getWeekNumber(firstDayOfMonth);
        setCurrentWeek(currentWeekNumber - firstWeekOfMonth + 1);
    };

    // Obtenir les dates de la semaine courante
    const weekDates = getWeekDates(currentYear, currentMonth, currentWeek);
    const weeksInMonth = getWeeksInMonth(currentYear, currentMonth);

    // Fonction pour obtenir les gardes d'un jour spécifique
    const getGardesForDay = (date: Date): Garde[] => {
        return gardes.filter(garde => {
            const gardeDate = new Date(garde.dateDebut);
            return gardeDate.getDate() === date.getDate() &&
                   gardeDate.getMonth() === date.getMonth() &&
                   gardeDate.getFullYear() === date.getFullYear();
        });
    };

    // Fonction pour formater la date en format court
    const formatShortDate = (date: Date): string => {
        return date.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'short'
        });
    };

    // Vérifier si une date est dans le mois courant
    const isDateInCurrentMonth = (date: Date): boolean => {
        return date.getMonth() === currentMonth - 1 && date.getFullYear() === currentYear;
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
                        <p className="text-gray-600">
                            {months[currentMonth - 1]} {currentYear} - Semaine {currentWeek}
                        </p>
                    </div>

                    <button
                        onClick={() => setIsAddingGarde(true)}
                        className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                    >
                        <Plus className="h-5 w-5" />
                        <span>Nouvelle Garde</span>
                    </button>
                </div>

                {/* Navigation semaine */}
                <div className="mt-6 flex items-center justify-center space-x-4">
                    <button
                        onClick={goToPreviousWeek}
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

                        <select
                            value={currentWeek}
                            onChange={(e) => setCurrentWeek(parseInt(e.target.value))}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            {Array.from({ length: weeksInMonth }, (_, i) => i + 1).map(week => (
                                <option key={week} value={week}>
                                    Semaine {week}
                                </option>
                            ))}
                        </select>

                        <button
                            onClick={goToCurrentWeek}
                            className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                        >
                            Aujourd'hui
                        </button>
                    </div>

                    <button
                        onClick={goToNextWeek}
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

            {/* Calendrier hebdomadaire - TOUJOURS AFFICHÉ */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="grid grid-cols-7 gap-px bg-gray-200">
                    {/* En-têtes des jours */}
                    {days.map((day, index) => (
                        <div key={day} className="bg-gray-50 p-4 text-center">
                            <div className="font-semibold text-gray-900">{day}</div>
                            <div className="text-sm text-gray-600 mt-1">
                                {formatShortDate(weekDates[index])}
                            </div>
                        </div>
                    ))}

                    {/* Cellules des jours avec gardes */}
                    {weekDates.map((date, index) => {
                        const dayGardes = getGardesForDay(date);
                        const isToday = new Date().toDateString() === date.toDateString();
                        const isInCurrentMonth = isDateInCurrentMonth(date);
                        
                        return (
                            <div
                                key={index}
                                className={`min-h-32 bg-white p-3 ${
                                    isToday ? 'ring-2 ring-blue-500 ring-inset' : ''
                                } ${
                                    !isInCurrentMonth ? 'bg-gray-50 opacity-60' : ''
                                }`}
                            >
                                {/* Date */}
                                <div className={`text-sm font-medium mb-2 ${
                                    isToday ? 'text-blue-600' : 
                                    isInCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                                }`}>
                                    {date.getDate()}
                                    {!isInCurrentMonth && ` ${months[date.getMonth()].substring(0, 3)}`}
                                </div>

                                {/* Gardes */}
                                <div className="space-y-2">
                                    {dayGardes.map((garde) => (
                                        <div
                                            key={garde.id}
                                            className={`p-2 rounded-lg border text-xs ${getTypeGardeColor(garde.typeGarde)} cursor-pointer hover:shadow-sm transition-shadow duration-200`}
                                            onClick={() => handleEdit(garde)}
                                        >
                                            <div className="flex items-center space-x-1 mb-1">
                                                {getTypeGardeIcon(garde.typeGarde)}
                                                <span className="font-medium truncate">
                                                    {getDoctorName(garde.medecinId)}
                                                </span>
                                            </div>
                                            <div className="text-xs opacity-75">
                                                {new Date(garde.dateDebut).toLocaleTimeString('fr-FR', {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })} - {new Date(garde.dateFin).toLocaleTimeString('fr-FR', {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Bouton d'ajout */}
                                {isInCurrentMonth && (
                                    <button
                                        onClick={() => {
                                            const newDate = new Date(date);
                                            setNewGarde(prev => ({
                                                ...prev,
                                                dateDebut: new Date(newDate.setHours(8, 0, 0, 0)),
                                                dateFin: new Date(newDate.setHours(18, 0, 0, 0))
                                            }));
                                            setIsAddingGarde(true);
                                        }}
                                        className="mt-2 w-full text-xs text-gray-400 hover:text-blue-600 hover:bg-blue-50 py-1 rounded transition-colors duration-200 flex items-center justify-center space-x-1"
                                    >
                                        <Plus className="h-3 w-3" />
                                        <span>Ajouter</span>
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};