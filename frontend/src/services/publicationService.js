import api from './api';

export const getPublicationsByClasse = async (classeId) => {
  const response = await api.get(`/publications/classe/${classeId}`);
  return response.data;
};

export const createPublication = async (publication) => {
  const response = await api.post('/publications', publication);
  return response.data;
};
export const deletePublication = async (id) => {
  await api.delete(`/publications/${id}`);
};