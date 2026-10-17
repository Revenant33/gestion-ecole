import api from './api';

export const getMatieres = async () => {
  const response = await api.get('/matieres');
  return response.data;
};

export const createMatiere = async (matiere) => {
  const response = await api.post('/matieres', matiere);
  return response.data;
};

export const deleteMatiere = async (id) => {
  await api.delete(`/matieres/${id}`);
};