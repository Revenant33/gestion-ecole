import api from './api';

export const getCreneauxByClasse = async (classeId) => {
  const response = await api.get(`/creneaux/classe/${classeId}`);
  return response.data;
};

export const getCreneauxByProf = async (profId) => {
  const response = await api.get(`/creneaux/prof/${profId}`);
  return response.data;
};

export const createCreneau = async (creneau) => {
  const response = await api.post('/creneaux', creneau);
  return response.data;
};

export const deleteCreneau = async (id) => {
  await api.delete(`/creneaux/${id}`);
};