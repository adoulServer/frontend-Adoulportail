
import { apiService } from './apiService';
import { API_ENDPOINTS } from './apiConfig';
import { toast } from 'sonner';

export const authService = {
  async login(credentials) {
    try {
      const response = await apiService.post(API_ENDPOINTS.LOGIN, credentials);
      
      // Store token and user info
      localStorage.setItem('certassist_token', response.token);
      localStorage.setItem('certassist_user', JSON.stringify(response.user));
      
      return response;
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed');
      return null;
    }
  },
  
  async register(userData) {
    try {
      return await apiService.post(API_ENDPOINTS.REGISTER, userData);
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Registration failed');
      return null;
    }
  },
  
  logout() {
    localStorage.removeItem('certassist_token');
    localStorage.removeItem('certassist_user');
    toast.info('You have been logged out');
  },
  
  async getCurrentUser() {
    try {
      return await apiService.get(API_ENDPOINTS.CURRENT_USER);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }
};
