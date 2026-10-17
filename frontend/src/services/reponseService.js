import api from './api';

export const getReponsesByPublication = async (publicationId) => {
  const response = await api.get(`/reponses/publication/${publicationId}`);
  return response.data;
};
export const createReponse = async (publicationId, contenu) => {
  const response = await api.post('/reponses', { publicationId, contenu });
  return response.data;
};
export const deleteReponse = async (id) => {
  await api.delete(`/reponses/${id}`);
};