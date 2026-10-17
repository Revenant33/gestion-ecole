import api from './api';

export const getNotesDisciplinairesByEleve = async (eleveId) => {
  const response = await api.get(`/notes-disciplinaires/eleve/${eleveId}`);
  return response.data;
};
export const createNoteDisciplinaire = async (eleveId, description) => {
  const response = await api.post('/notes-disciplinaires', { eleveId, description });
  return response.data;
};