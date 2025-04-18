
import { apiService } from './apiService';
import { API_ENDPOINTS } from './apiConfig';

export const adoulService = {
  async getAllAdouls() {
    return apiService.get(API_ENDPOINTS.ADOULS);
  },
  
  async getAdoulById(id) {
    return apiService.get(API_ENDPOINTS.ADOUL_BY_ID(id));
  },
  
  async createAdoul(adoul) {
    return apiService.post(API_ENDPOINTS.CREATE_ADOUL, adoul);
  },
  
  async updateAdoul(id, adoul) {
    return apiService.put(API_ENDPOINTS.ADOUL_BY_ID(id), adoul);
  },
  
  async deleteAdoul(id) {
    return apiService.delete(API_ENDPOINTS.ADOUL_BY_ID(id));
  }
};
