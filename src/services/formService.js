
import { apiService } from './apiService';
import { API_ENDPOINTS } from './apiConfig';

export const formService = {
  async getAllForms() {
    return apiService.get(API_ENDPOINTS.CERTIFICATIONS);
  },
  
  async getFormById(id) {
    return apiService.get(API_ENDPOINTS.CERTIFICATION_BY_ID(id));
  },
  
  async createForm(form) {
    return apiService.post(API_ENDPOINTS.CERTIFICATIONS, form);
  },
  
  async updateForm(id, form) {
    return apiService.put(API_ENDPOINTS.CERTIFICATION_BY_ID(id), form);
  },
  
  async deleteForm(id) {
    return apiService.delete(API_ENDPOINTS.CERTIFICATION_BY_ID(id));
  },
  
  async getCertificationTypes() {
    return apiService.get(API_ENDPOINTS.CERTIFICATION_TYPES);
  }
};
