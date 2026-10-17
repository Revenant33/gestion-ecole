import api from './api';

export const getCalendrierClasse = async (classeId, debut) =>
  (await api.get(`/calendrier/classe/${classeId}`, { params: { debut } })).data;

export const getCalendrierProf = async (profId, debut) =>
  (await api.get(`/calendrier/prof/${profId}`, { params: { debut } })).data;

export const annulerSeance = async (creneauId, date) =>
  (await api.post('/calendrier/annulations', { creneauId, date })).data;

export const retablirSeance = async (annulationId) => {
  await api.delete(`/calendrier/annulations/${annulationId}`);
};

export const ajouterSeance = async (data) =>
  (await api.post('/calendrier/seances', data)).data;

export const supprimerSeance = async (id) => {
  await api.delete(`/calendrier/seances/${id}`);
};