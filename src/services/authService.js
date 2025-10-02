import apiClient from './apiClient';

const authService = {
  login: async (credentials) => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },
  
  register: async (userData) => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },
  
  getProfile: async () => {
    const response = await apiClient.get('/auth/profile');
    return response.data;
  },

  googleLogin: async (googleUserData) => {
    const response = await apiClient.post('/auth/google/login', googleUserData);
    return response.data;
  },
};

export default authService;

