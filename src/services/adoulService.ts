import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS, getAuthHeaders } from './apiConfig';

export type Certification = {
  id: number;
  type: string;
  nomDemandeur: string;
  prix: number;
  certRegistre: number;
  certIchhad: number;
  dateCreation: string;
};

export type Adoul = {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  phone: string;
  cin: String;
  location: string;
  status: string;
  certifications: Certification[];
};


export const adoulService = {
  getAllAdouls: async (): Promise<Adoul[]> => {
    const response = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.ADOULS}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },

  createAdoul: async (adoul: Omit<Adoul, 'id'>) => {
    const response = await axios.post(`${API_BASE_URL}${API_ENDPOINTS.CREATE_ADOUL}`, adoul, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },
};
