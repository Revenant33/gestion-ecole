import api from './api';

export const getMesRemarques = async () => {
  const response = await api.get('/remarques/mes-remarques');
  return response.data;
};

export const createRemarque = async (date, contenu) => {
  const response = await api.post('/remarques', { date, contenu });
  return response.data;
};

export const deleteRemarque = async (id) => {
  await api.delete(`/remarques/${id}`);
};