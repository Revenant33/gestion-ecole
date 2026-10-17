import api from './api';

export const registerCompte = async (data) => {
  const response = await api.post('/auth/register', data);
  return response.data;
};