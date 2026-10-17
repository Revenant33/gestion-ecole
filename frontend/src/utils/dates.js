export const toIso = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export const getMonday = (d = new Date()) => {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  x.setDate(x.getDate() - ((x.getDay() + 6) % 7));
  return x;
};

export const addDays = (d, n) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};

export const formatSemaine = (lundi) => {
  const samedi = addDays(lundi, 5);
  const debut = lundi.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });
  const fin = samedi.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  return `${debut} – ${fin}`;
};