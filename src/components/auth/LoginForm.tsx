import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Heart, Eye, EyeOff, Lock, User } from 'lucide-react';
import { loginUser } from '../../api/ApiCenter';

interface LoginFormProps {
  isRegister: boolean;
  setIsRegister: (value: boolean) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ isRegister, setIsRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    const success = await loginUser(username, password);
    console.log(success);
    
    if (!success) {
      setError('Identifiants incorrects');
    }
  };

  const demoAccounts = [
    { username: 'marie.RAZA', role: 'Secrétaire', password: 'demo123' },
    { username: 'sophie.ZETY', role: 'Infirmière', password: 'demo123' },
    { username: 'dr.MONJA', role: 'Médecin-Chef', password: 'demo123' }
  ];

  useEffect(() => {
    console.log(isRegister);
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo et titre */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Heart className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">FANANTENANA</h1>
          <p className="text-gray-600">Système de Gestion des Patients</p>
        </div>

        {/* Formulaire de connexion */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Nom d'utilisateur
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Entrez votre nom d'utilisateur"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Entrez votre mot de passe"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <span>Se connecter</span>
              )}
            </button>
          </form>
          <div className='flex gap-3 justify-center mt-5'>
            <div>Pas de compte ? </div>
            <button
              onClick={() => setIsRegister(!isRegister)}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >En Créer ...</button>
          </div>
        </div>

        {/* Comptes de démonstration */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Comptes de démonstration</h3>
          <div className="space-y-3">
            {demoAccounts.map((account, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{account.role}</p>
                  <p className="text-sm text-gray-600">{account.username}</p>
                </div>
                <button
                  onClick={() => {
                    setUsername(account.username);
                    setPassword(account.password);
                  }}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Utiliser
                </button>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-4">
            Mot de passe pour tous les comptes : <code className="bg-gray-200 px-1 rounded">demo123</code>
          </p>
        </div>
      </div>
    </div>
  );
};