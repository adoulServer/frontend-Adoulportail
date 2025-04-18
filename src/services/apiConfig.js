
// Configuration for API calls

// Base URL for the API - Change to your Spring Boot backend URL
export const API_BASE_URL = import.meta.env.VITE_API_URL;

console.log("API base URL:", API_BASE_URL);

// Utility function to include authentication token in headers
export const getAuthHeaders = () => {
  const token = localStorage.getItem('certassist_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

// API endpoints constants
export const API_ENDPOINTS = {
  // Authentication
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',

  UPDATE_USER: (id) => `/api/auth/users/${id}`,  // Ajoute cette ligne pour mettre à jour l'utilisateur

  // Adouls
  ADOULS: '/api/adouls',
  ADOUL_BY_ID: (id) => `/api/adouls/${id}`,
  ADOULS_COUNT: '/api/adouls/count',  
  CREATE_ADOUL: '/api/adouls',
  
  // Certifications
  CERTIFICATIONS_COUNT: '/api/certifications/count',
  CERTIFICATIONS: '/api/certifications',
  CERTIFICATION_BY_ID: (id) => `/api/certifications/${id}`,
  CERTIFICATION_TYPES: '/api/certifications/types',
  TOTAL_CERTIFICATION_PRIX: '/api/certifications/sum-prix',

};
