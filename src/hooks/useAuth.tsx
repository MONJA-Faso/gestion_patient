import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User } from '../types';
import { loginUser, getMe } from '../api/ApiCenter';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Vérifier si un utilisateur est déjà connecté
    const savedUser = localStorage.getItem('medcare_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {

      const response = await loginUser(email, password);
      localStorage.setItem('medcare_token', response.token);

      const user = await getMe(response.id, response.token);
      localStorage.setItem('medcare_user', JSON.stringify(user));

      console.log("Utilisateur connecté:", user.nom);
      

      setUser(user);
      setIsLoading(false);
      return true;

    } catch (error) {

      console.error("Erreur de connexion:", error);
      setIsLoading(false);
      return false;

    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('medcare_user');
    localStorage.removeItem('medcare_token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
