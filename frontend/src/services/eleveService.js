import api from './api';

export const getMoi = async () => {
  const response = await api.get('/eleves/me');
  return response.data;
};