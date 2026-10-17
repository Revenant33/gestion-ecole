import api from './api';

export const getUsers = async (role) => {
  const response = await api.get('/admin/users', { params: role ? { role } : {} });
  return response.data;
};

export const updateUser = async (id, data) => {
  const response = await api.put(`/admin/users/${id}`, data);
  return response.data;
};