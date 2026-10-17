import api from './api';

export const getClasses = async () => {
  const response = await api.get('/classes');
  return response.data;
};

export const createClasse = async (classe) => {
  const response = await api.post('/classes', classe);
  return response.data;
};

export const deleteClasse = async (id) => {
  await api.delete(`/classes/${id}`);
};
export const getElevesDeClasse = async (classeId) => {
  const response = await api.get(`/classes/${classeId}/eleves`);
  return response.data;
};