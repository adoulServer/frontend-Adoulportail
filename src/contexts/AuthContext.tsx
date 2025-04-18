import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'sonner';
import { authService } from '../services/authService';

interface User {
  [x: string]: string;
  username: string;
  id: number;
  name: string;
  cin: string;
  role: string;
  email?: string;
  phone: string;
  address: String;
  ville: String;
  region: String;
  code_postale: number;
  avatar: string
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (cin: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('certassist_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    setIsLoading(false);
  }, []);
  const login = async (cin: string, password: string) => {
    setIsLoading(true);

    try {
      const response = await authService.login({ cin, password });

      if (response && response.user) {
        // ✅ Corriger ici
        setUser(response.user);
        localStorage.setItem('certassist_user', JSON.stringify(response.user));
        toast.success('Connexion réussie');
        return true; // ✅ on laisse la redirection au composant Login
      } else {
        toast.error('CIN ou mot de passe invalide');
        return false;
      }
    } catch (error) {
      toast.error('Erreur lors de la connexion');
      return false;
    } finally {
      setIsLoading(false);
    }
  };


  const logout = () => {
    authService.logout();
    setUser(null);
    localStorage.removeItem('certassist_user');
    toast.success('Déconnexion réussie');
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
