import api from './api';

// Note: il faut l'ID du prof connecte (recupere via le token, mais l'API attend un profId dans l'URL)
export const getMesClasses = async (profId) => {
  const response = await api.get(`/enseigne/prof/${profId}`);
  return response.data;
};
export const getAllEnseignements = async () => {
  const response = await api.get('/enseigne');
  return response.data;
};