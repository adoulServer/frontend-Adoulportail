
import { apiService } from './apiService';
import { API_ENDPOINTS } from './apiConfig';

export interface CertificationForm {
  id: number;
  adoulId: number;
  adoulName?: string;
  requesterName: string;
  certificationType: string;
  price: number;
  Registre: number,
  Ichhad: number,
  status: string;
  createdAt: string;
  additionalInfo?: string;
}

export const formService = {
  async getAllForms(): Promise<CertificationForm[]> {
    return apiService.get<CertificationForm[]>(API_ENDPOINTS.FORMS);
  },
  
  async getFormById(id: number): Promise<CertificationForm> {
    return apiService.get<CertificationForm>(API_ENDPOINTS.FORM_BY_ID(id));
  },
  
  async createForm(form: Omit<CertificationForm, 'id' | 'createdAt'>): Promise<CertificationForm> {
    return apiService.post<CertificationForm>(API_ENDPOINTS.FORMS, form);
  },
  
  async updateForm(id: number, form: Partial<CertificationForm>): Promise<CertificationForm> {
    return apiService.put<CertificationForm>(API_ENDPOINTS.FORM_BY_ID(id), form);
  },
  
  async deleteForm(id: number): Promise<void> {
    return apiService.delete(API_ENDPOINTS.FORM_BY_ID(id));
  }
};
