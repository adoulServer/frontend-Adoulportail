import { apiService } from './apiService';
import { API_BASE_URL, API_ENDPOINTS } from './apiConfig';
import { toast } from 'sonner';

interface LoginCredentials {
  cin: string;
  password: string;
}

interface User {
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

export const authService = {
  login: async ({ cin, password }) => {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.LOGIN}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cin, password }),
    });
  
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }
  
    const data = await response.json();
    
    // Assurez-vous que votre API retourne bien ces champs
    return {
      user: data.user,
    };
  },

  logout(): void {
    localStorage.removeItem('certassist_user');
    toast.info('Vous êtes déconnecté');
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      return await apiService.get<User>(API_ENDPOINTS.CURRENT_USER);
    } catch (error) {
      console.error('Erreur lors de la récupération du profil utilisateur:', error);
      return null;
    }
  }
};
