import React, { useState } from 'react';
import { useUsers } from '../../hooks/useUsers';
import { useAuth } from '../../hooks/useAuth';
import {
  Users,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Save,
  X,
  Shield,
  Mail,
  Calendar
} from 'lucide-react';
import { createUser } from '../../api/ApiCenter';
import Swal from 'sweetalert2';

export const UserManagement: React.FC = () => {
  const { users, addUser, updateUser, deleteUser, loading } = useUsers();
  const { user: currentUser } = useAuth();
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});
  const [newUser, setNewUser] = useState({
    username: '',
    prenom: '',
    nom: '',
    email: '',
    role: 'Secretaire' as 'Secretaire' | 'Infirmiere' | 'Medecin_Chef',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!newUser.prenom.trim()) {
      newErrors.prenom = 'Le prénom est obligatoire';
    }

    if (!newUser.nom.trim()) {
      newErrors.nom = 'Le nom est obligatoire';
    }

    if (!newUser.email.trim()) {
      newErrors.email = 'L\'email est obligatoire';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newUser.email)) {
      newErrors.email = 'Format d\'email invalide';
    }

    if (!editingUser) {
      if (!newUser.password) {
        newErrors.password = 'Le mot de passe est obligatoire';
      } else if (newUser.password.length < 6) {
        newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
      }

      if (newUser.password !== newUser.confirmPassword) {
        newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    if (editingUser) {
      updateUser(editingUser, {
        prenom: newUser.prenom,
        nom: newUser.nom,
        email: newUser.email,
        role: newUser.role
      });
      setEditingUser(null);
    } else {
      try {
        const response = await createUser({
          firstName: newUser.prenom,
          lastName: newUser.nom,
          email: newUser.email,
          role: newUser.role,
          password: newUser.password
        });

        Swal.fire({
          icon: 'success',
          title: 'Succès',
          text: `Utilisateur ${newUser.prenom} ${newUser.nom} Crée avec Succes`,
          confirmButtonText: 'OK',
          confirmButtonColor: '#3085d6',
          timer: 3000,
          timerProgressBar: true
        });

        setIsAddingUser(false);

        setNewUser({
          username: '',
          prenom: '',
          nom: '',
          email: '',
          role: 'Secretaire',
          password: '',
          confirmPassword: ''
        });

      } catch (error: any) {
        if (error.response) {

          await Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: error.response?.data.error,
            confirmButtonText: 'OK',
            confirmButtonColor: '#d33'
          });
          return;

        } else {
          throw new Error('Erreur de connexion');
        }
      }
    }


    setErrors({});
  };

  const handleEdit = (user: any) => {
    setNewUser({
      username: user.username,
      prenom: user.prenom,
      nom: user.nom,
      email: user.email,
      role: user.role,
      password: '',
      confirmPassword: ''
    });
    setEditingUser(user.id);
    setIsAddingUser(true);
  };

  const handleCancel = () => {
    setIsAddingUser(false);
    setEditingUser(null);
    setNewUser({
      username: '',
      prenom: '',
      nom: '',
      email: '',
      role: 'Secretaire',
      password: '',
      confirmPassword: ''
    });
    setErrors({});
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'Secretaire': return 'Secrétaire';
      case 'Infirmiere': return 'Infirmière';
      case 'Medecin_Chef': return 'Médecin-Chef';
      default: return role;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Secretaire': return 'bg-blue-100 text-blue-800';
      case 'Infirmiere': return 'bg-green-100 text-green-800';
      case 'Medecin_Chef': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const canManageUser = (targetUser: any) => {
    return currentUser?.role === 'Medecin_Chef' && targetUser.id !== currentUser.id;
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Gestion des Utilisateurs</h2>
            <p className="text-gray-600">{users.length} utilisateur{users.length > 1 ? 's' : ''} enregistré{users.length > 1 ? 's' : ''}</p>
          </div>

          <button
            onClick={() => setIsAddingUser(true)}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            <Plus className="h-5 w-5" />
            <span>Nouvel Utilisateur</span>
          </button>
        </div>
      </div>

      {/* Formulaire d'ajout/modification */}
      {isAddingUser && (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              {editingUser ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}
            </h3>
            <button
              onClick={handleCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prénom *
              </label>
              <input
                type="text"
                value={newUser.prenom}
                onChange={(e) => setNewUser({ ...newUser, prenom: e.target.value })}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.prenom ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                placeholder="Prénom"
              />
              {errors.prenom && (
                <p className="mt-1 text-sm text-red-600">{errors.prenom}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom *
              </label>
              <input
                type="text"
                value={newUser.nom}
                onChange={(e) => setNewUser({ ...newUser, nom: e.target.value })}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.nom ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                placeholder="Nom"
              />
              {errors.nom && (
                <p className="mt-1 text-sm text-red-600">{errors.nom}</p>
              )}
            </div>

            <div className='md:col-span-2'>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rôle *
              </label>
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value as any })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Secretaire">Secrétaire</option>
                <option value="Infirmiere">Infirmière</option>
                <option value="Medecin_Chef">Médecin-Chef</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                placeholder="utilisateur@medcare.fr"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {!editingUser && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mot de passe *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword.new ? 'text' : 'password'}
                      value={newUser.password}
                      onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                      className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                      placeholder="Mot de passe"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword.new ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmer le mot de passe *
                  </label>
                  <input
                    type="password"
                    value={newUser.confirmPassword}
                    onChange={(e) => setNewUser({ ...newUser, confirmPassword: e.target.value })}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                    placeholder="Confirmer le mot de passe"
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                  )}
                </div>
              </>
            )}
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
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-200"
            >
              <Save className="h-5 w-5" />
              <span>{editingUser ? 'Modifier' : 'Créer'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Liste des utilisateurs */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="divide-y divide-gray-100">
          {users.map((user) => (
            <div key={user.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">
                      {user.prenom[0]}{user.nom[0]}
                    </span>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {user.prenom} {user.nom}
                      </h3>
                      <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${getRoleColor(user.role)}`}>
                        {getRoleLabel(user.role)}
                      </span>
                      {!user.isActive && (
                        <span className="inline-block px-3 py-1 text-sm font-medium bg-red-100 text-red-800 rounded-full">
                          Inactif
                        </span>
                      )}
                      {user.id === currentUser?.id && (
                        <span className="inline-block px-3 py-1 text-sm font-medium bg-yellow-100 text-yellow-800 rounded-full">
                          Vous
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Mail className="h-4 w-4" />
                        <span>{user.email}</span>
                      </div>

                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>Créé le {new Date(user.createdAt).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {canManageUser(user) && (
                    <>
                      <button
                        onClick={() => handleEdit(user)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                        title="Modifier"
                      >
                        <Edit className="h-5 w-5" />
                      </button>

                      <button
                        onClick={() => {
                          if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
                            deleteUser(user.id);
                          }
                        }}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        title="Supprimer"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {users.length === 0 && (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-gray-100">
          <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun utilisateur</h3>
          <p className="text-gray-600 mb-6">Commencez par ajouter votre premier utilisateur.</p>
          <button
            onClick={() => setIsAddingUser(true)}
            className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            <Plus className="h-5 w-5" />
            <span>Ajouter un utilisateur</span>
          </button>
        </div>
      )}
    </div>
  );
};