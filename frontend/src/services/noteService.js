import api from './api';

export const createNote = async (note) => {
  const response = await api.post('/notes', note);
  return response.data;
};
export const getNotesByEleve = async (eleveId) => {
  const response = await api.get(`/notes/eleve/${eleveId}`);
  return response.data;
};
export const deleteNote = async (id) => {
  await api.delete(`/notes/${id}`);
};