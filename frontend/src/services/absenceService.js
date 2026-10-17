import api from './api';

export const getAbsencesByEleve = async (eleveId) => {
  const response = await api.get(`/absences/eleve/${eleveId}`);
  return response.data;
};

export const createAbsence = async (eleveId, matiereId, date, heureDebut, heureFin) => {
  const response = await api.post('/absences', { eleveId, matiereId, date, heureDebut, heureFin });
  return response.data;
};
export const justifierAbsence = async (id) => {
  const response = await api.put(`/absences/${id}/justifier`);
  return response.data;
};
export const getAbsencesByClasseMatiere = async (classeId, matiereId) => {
  const response = await api.get(`/absences/classe/${classeId}/matiere/${matiereId}`);
  return response.data;
};