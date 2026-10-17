import api from './api';

export const assignerEnseignement = async (profId, classeId, matiereId) => {
  const response = await api.post('/enseigne', { profId, classeId, matiereId });
  return response.data;
};