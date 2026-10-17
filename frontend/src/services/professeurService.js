import api from './api';


export const getProfesseurs = async () => {
  const response = await api.get('/professeurs');
  return response.data;
};
export const getMoiProf = async () => {
  const response = await api.get('/professeurs/me');
  return response.data;
};