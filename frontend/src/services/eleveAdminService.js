import api from './api';

export const rechercherEleves = async (filtres) => {
  const params = new URLSearchParams();
  if (filtres.nom) params.append('nom', filtres.nom);
  if (filtres.classeId) params.append('classeId', filtres.classeId);
  if (filtres.annee) params.append('annee', filtres.annee);
  if (filtres.specialite) params.append('specialite', filtres.specialite);

  const response = await api.get(`/admin/eleves?${params.toString()}`);
  return response.data;
};

export const changerClasseEnMasse = async (eleveIds, nouvelleClasseId) => {
  const response = await api.post('/admin/eleves/changer-classe', {
    eleveIds,
    nouvelleClasseId,
  });
  return response.data;
};

export const supprimerEnMasse = async (eleveIds) => {
  await api.delete('/admin/eleves/supprimer-en-masse', {
    data: { eleveIds },
  });
};

export const reinitialiserMotDePasse = async (eleveIds, motDePasse) => {
  const response = await api.post('/admin/eleves/reinitialiser-mot-de-passe', {
    eleveIds,
    motDePasse,
  });
  return response.data;
};