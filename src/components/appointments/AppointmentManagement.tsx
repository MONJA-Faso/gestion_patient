import React, { useState } from 'react';
import { useAppointments } from '../../hooks/useAppointments';
import { usePatients } from '../../hooks/usePatients';
import { useUsers } from '../../hooks/useUsers';
// import { useAuth } from '../../hooks/useAuth';
import { 
  Calendar, 
  Plus, 
  Clock, 
  User, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Edit,
  Trash2,
  Search
} from 'lucide-react';

export const AppointmentManagement: React.FC = () => {
  const { appointments, addAppointment, updateAppointment, deleteAppointment, loading } = useAppointments();
  const { patients } = usePatients();
  const { users } = useUsers();
  // const { user: currentUser } = useAuth();
  
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isAddingAppointment, setIsAddingAppointment] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<string | number | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'PROGRAMME' | 'TERMINE' | 'ANNULE' | 'ABSENT'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [newAppointment, setNewAppointment] = useState({
    patientId: '',
    medecinId: '',
    dateHeure: '',
    motif: '',
    notes: '',
    duree: 30 // Durée par défaut de 30 minutes
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PROGRAMME': return 'bg-blue-100 text-blue-800';
      case 'TERMINE': return 'bg-green-100 text-green-800';
      case 'ANNULE': return 'bg-red-100 text-red-800';
      case 'ABSENT': return 'bg-orange-100 text-orange-800';
      case 'CONFIRME': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PROGRAMME': return 'Programmé';
      case 'TERMINE': return 'Terminé';
      case 'ANNULE': return 'Annulé';
      case 'ABSENT': return 'Absent';
      case 'CONFIRME': return 'Confirmé';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PROGRAMME': return <Clock className="h-4 w-4" />;
      case 'TERMINE': return <CheckCircle className="h-4 w-4" />;
      case 'ANNULE': return <XCircle className="h-4 w-4" />;
      case 'ABSENT': return <AlertCircle className="h-4 w-4" />;
      case 'CONFIRME': return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const filteredAppointments = appointments
    .filter(apt => {
      if (filterStatus !== 'all' && apt.statut !== filterStatus) return false;
      if (searchQuery) {
        const patient = patients.find(p => p.id === apt.patientId);
        const searchLower = searchQuery.toLowerCase();
        return patient && (
          patient.prenom.toLowerCase().includes(searchLower) ||
          patient.nom.toLowerCase().includes(searchLower) ||
          apt.motif.toLowerCase().includes(searchLower)
        );
      }
      return true;
    })
    .sort((a, b) => {
      const dateA = new Date(a.dateHeure);
      const dateB = new Date(b.dateHeure);
      return dateB.getTime() - dateA.getTime();
    });

  const todayAppointments = appointments.filter(apt => {
    const aptDate = new Date(apt.dateHeure).toISOString().split('T')[0];
    const today = new Date().toISOString().split('T')[0];
    return aptDate === today && apt.statut === 'PROGRAMME';
  });

  const handleSubmit = () => {
    if (!newAppointment.patientId || !newAppointment.medecinId || !newAppointment.dateHeure || !newAppointment.motif) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const appointmentData = {
      patientId: newAppointment.patientId,
      medecinId: newAppointment.medecinId,
      dateHeure: newAppointment.dateHeure,
      motif: newAppointment.motif,
      notes: newAppointment.notes || null,
      duree: newAppointment.duree,
      statut: 'PROGRAMME' as const
    };

    if (editingAppointment) {
      // updateAppointment(editingAppointment, appointmentData);
      setEditingAppointment(null);
    } else {
      addAppointment(appointmentData);
    }

    setIsAddingAppointment(false);
    setNewAppointment({
      patientId: '',
      medecinId: '',
      dateHeure: '',
      motif: '',
      notes: '',
      duree: 30
    });
  };

  const handleEdit = (appointment: any) => {
    const dateTime = new Date(appointment.dateHeure);
    const date = dateTime.toISOString().split('T')[0];
    const time = dateTime.toTimeString().slice(0, 5);
    
    setNewAppointment({
      patientId: appointment.patientId.toString(),
      medecinId: appointment.medecinId.toString(),
      dateHeure: `${date}T${time}`,
      motif: appointment.motif,
      notes: appointment.notes || '',
      duree: appointment.duree
    });
    setEditingAppointment(appointment.id);
    setIsAddingAppointment(true);
  };

  const doctors = users.filter(u => u.role === 'Medecin_Chef');

  return (
    <div className="space-y-6">
      {/* En-tête avec statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Aujourd'hui</p>
              <p className="text-2xl font-bold text-blue-600">{todayAppointments.length}</p>
            </div>
            <Calendar className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Cette semaine</p>
              <p className="text-2xl font-bold text-green-600">
                {appointments.filter(apt => {
                  const aptDate = new Date(apt.dateHeure);
                  const today = new Date();
                  const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
                  const weekEnd = new Date(today.setDate(today.getDate() - today.getDay() + 6));
                  return aptDate >= weekStart && aptDate <= weekEnd;
                }).length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">En attente</p>
              <p className="text-2xl font-bold text-orange-600">
                {appointments.filter(apt => apt.statut === 'PROGRAMME').length}
              </p>
            </div>
            <Clock className="h-8 w-8 text-orange-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{appointments.length}</p>
            </div>
            <User className="h-8 w-8 text-gray-500" />
          </div>
        </div>
      </div>

      {/* Contrôles */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Gestion des Rendez-vous</h2>
            <p className="text-gray-600">{filteredAppointments.length} rendez-vous trouvé{filteredAppointments.length > 1 ? 's' : ''}</p>
          </div>
          
          <button
            onClick={() => setIsAddingAppointment(true)}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            <Plus className="h-5 w-5" />
            <span>Nouveau Rendez-vous</span>
          </button>
        </div>

        {/* Filtres */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par patient ou motif..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tous les statuts</option>
            <option value="PROGRAMME">Programmés</option>
            <option value="TERMINE">Terminés</option>
            <option value="ANNULE">Annulés</option>
            <option value="ABSENT">Absents</option>
            <option value="CONFIRME">Confirmés</option>
          </select>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Formulaire d'ajout/modification */}
      {isAddingAppointment && (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            {editingAppointment ? 'Modifier le rendez-vous' : 'Nouveau rendez-vous'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Patient *
              </label>
              <select
                value={newAppointment.patientId}
                onChange={(e) => setNewAppointment({ ...newAppointment, patientId: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Sélectionner un patient</option>
                {patients.map(patient => (
                  <option key={patient.id} value={patient.id}>
                    {patient.prenom} {patient.nom}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Médecin *
              </label>
              <select
                value={newAppointment.medecinId}
                onChange={(e) => setNewAppointment({ ...newAppointment, medecinId: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Sélectionner un médecin</option>
                {doctors.map(doctor => (
                  <option key={doctor.id} value={doctor.id}>
                    Dr. {doctor.prenom} {doctor.nom}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date et heure *
              </label>
              <input
                type="datetime-local"
                value={newAppointment.dateHeure}
                onChange={(e) => setNewAppointment({ ...newAppointment, dateHeure: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Durée (minutes) *
              </label>
              <select
                value={newAppointment.duree}
                onChange={(e) => setNewAppointment({ ...newAppointment, duree: parseInt(e.target.value) })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>60 minutes</option>
                <option value={90}>90 minutes</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Motif de consultation *
              </label>
              <input
                type="text"
                value={newAppointment.motif}
                onChange={(e) => setNewAppointment({ ...newAppointment, motif: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: Contrôle, Consultation, Urgence..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (optionnel)
              </label>
              <textarea
                value={newAppointment.notes}
                onChange={(e) => setNewAppointment({ ...newAppointment, notes: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Notes complémentaires..."
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={() => {
                setIsAddingAppointment(false);
                setEditingAppointment(null);
                setNewAppointment({
                  patientId: '',
                  medecinId: '',
                  dateHeure: '',
                  motif: '',
                  notes: '',
                  duree: 30
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
              {editingAppointment ? 'Modifier' : 'Créer'}
            </button>
          </div>
        </div>
      )}

      {/* Liste des rendez-vous */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        {filteredAppointments.length === 0 ? (
          <div className="p-12 text-center">
            <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun rendez-vous trouvé</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || filterStatus !== 'all' 
                ? 'Aucun rendez-vous ne correspond à vos critères.' 
                : 'Commencez par programmer votre premier rendez-vous.'}
            </p>
            <button
              onClick={() => setIsAddingAppointment(true)}
              className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              <Plus className="h-5 w-5" />
              <span>Nouveau rendez-vous</span>
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredAppointments.map((appointment) => {
              const patient = patients.find(p => p.id === appointment.patientId);
              const doctor = users.find(u => u.id === appointment.medecinId);
              const dateTime = new Date(appointment.dateHeure);
              const date = dateTime.toLocaleDateString('fr-FR');
              const time = dateTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
              
              return (
                <div key={appointment.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                        <Calendar className="h-6 w-6 text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {patient ? `${patient.prenom} ${patient.nom}` : 'Patient inconnu'}
                          </h3>
                          <span className={`inline-flex items-center space-x-1 px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(appointment.statut)}`}>
                            {getStatusIcon(appointment.statut)}
                            <span>{getStatusLabel(appointment.statut)}</span>
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{date}</span>
                          </div>
                          
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{time} ({appointment.duree} min)</span>
                          </div>
                          
                          <div className="flex items-center space-x-1">
                            <User className="h-4 w-4" />
                            <span>Dr. {doctor ? `${doctor.prenom} ${doctor.nom}` : 'Médecin inconnu'}</span>
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-800 mt-2 font-medium">{appointment.motif}</p>
                        {appointment.notes && (
                          <p className="text-sm text-gray-600 mt-1">{appointment.notes}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {appointment.statut === 'PROGRAMME' && (
                        <>
                          <button
                            onClick={() => updateAppointment(String(appointment.id), { statut: 'TERMINE' })}
                            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                            title="Marquer comme terminé"
                          >
                            <CheckCircle className="h-5 w-5" />
                          </button>
                          
                          <button
                            onClick={() => handleEdit(appointment)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                            title="Modifier"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          
                          <button
                            onClick={() => updateAppointment(String(appointment.id), { statut: 'ANNULE' })}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                            title="Annuler"
                          >
                            <XCircle className="h-5 w-5" />
                          </button>
                        </>
                      )}
                      
                      <button
                        onClick={() => {
                          if (confirm('Êtes-vous sûr de vouloir supprimer ce rendez-vous ?')) {
                            deleteAppointment(String(appointment.id));
                          }
                        }}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        title="Supprimer"
                      >
                        <Trash2 className="h-5 w-5" />
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