import React, { ReactNode, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import {
  Users,
  Calendar,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  Stethoscope,
  User,
  Heart,
  Menu,
  X
} from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentPage, onNavigate }) => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const getNavigationItems = () => {
    const baseItems = [
      { id: 'dashboard', label: 'Tableau de Bord', icon: BarChart3 },
      { id: 'patients', label: 'Patients', icon: Users },
    ];

    if (user?.role === 'secretary') {
      return [...baseItems, { id: 'appointments', label: 'Rendez-vous', icon: Calendar }];
    }

    if (user?.role === 'nurse') {
      return [
        ...baseItems,
        { id: 'appointments', label: 'Rendez-vous', icon: Calendar },
        { id: 'medical-records', label: 'Dossiers Médicaux', icon: FileText },
      ];
    }

    if (user?.role === 'doctor') {
      return [
        ...baseItems,
        { id: 'appointments', label: 'Rendez-vous', icon: Calendar },
        { id: 'medical-records', label: 'Dossiers Médicaux', icon: FileText },
        { id: 'reports', label: 'Rapports', icon: BarChart3 },
        { id: 'users', label: 'Utilisateurs', icon: User },
        { id: 'settings', label: 'Paramètres', icon: Settings },
      ];
    }

    return baseItems;
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'secretary': return 'Secrétaire';
      case 'nurse': return 'Infirmière';
      case 'doctor': return 'Médecin-Chef';
      default: return role;
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Backdrop mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg border-r border-gray-200 transform
          transition-transform duration-200 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:inset-0
        `}
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">FANANTENANA</h1>
              <p className="text-sm text-gray-500">Gestion Patients</p>
            </div>
          </div>
        </div>

        <nav className="mt-6 px-4">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 mb-1 ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 w-64 p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {getRoleLabel(user?.role || '')}
              </p>
            </div>
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors duration-200"
          >
            <LogOut className="h-4 w-4" />
            <span className="font-medium">Se déconnecter</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-4 flex justify-between items-center lg:px-6">
          <div className="flex items-center space-x-3">
            <button
              className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 focus:outline-none"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <h2 className="text-2xl font-semibold text-gray-900 capitalize">
              {navigationItems.find(item => item.id === currentPage)?.label || 'Dashboard'}
            </h2>
          </div>
          <div className="hidden lg:flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Stethoscope className="h-4 w-4" />
              <span>Système Médical Sécurisé</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto bg-gray-50 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
