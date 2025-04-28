
// Configuration de base pour les appels API

// URL de base de l'API - À remplacer par l'URL de votre backend Spring Boot
export const API_BASE_URL = import.meta.env.VITE_API_URL;

console.log("API base URL:", API_BASE_URL);


// Fonction utilitaire pour inclure le token d'authentification dans les headers
export const getAuthHeaders = () => {
  const token = localStorage.getItem('certassist_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

// Constantes pour les endpoints API
export const API_ENDPOINTS = {
  // Authentification
  LOGIN: '/api/auth/login',
  
  // Utilisateurs
  USERS: '/api/users',
  CURRENT_USER: '/users/me',
  UPDATE_USER: (id: number) => `/users/${id}`,  // Ajoute cette ligne pour mettre à jour l'utilisateur

  
  // Adouls
  ADOULS: '/api/adouls',
  ADOUL_BY_ID: (id: number) => `/adouls/${id}`,
  ADOULS_COUNT: '/api/adouls/count',  
  CREATE_ADOUL: '/api/adouls',
  
  // Formulaires de certification
  FORMS: '/forms',
  FORM_BY_ID: (id: number) => `/forms/${id}`,
  
  // Certifications
  CERTIFICATIONS_COUNT: '/api/certifications/count',
  CERTIFICATIONS: '/certifications',
  CERTIFICATION_BY_ID: (id: number) => `/certifications/${id}`,
  TOTAL_CERTIFICATION_PRIX: '/api/certifications/sum-prix',
  CERTIFICATION_TYPES: '/api/certifications/types',
  DELETE_ALL_CERTIFICATIONS:'/api/certifications/delete-all'


};
