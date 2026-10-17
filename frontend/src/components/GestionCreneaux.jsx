import { useState, useEffect } from 'react';
import { getAllEnseignements } from '../services/enseigneService';
import { createCreneau, deleteCreneau, getCreneauxByClasse } from '../services/creneauService';
import { getClasses } from '../services/classeService';

const JOURS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
const JOURS_LABELS = {
  MONDAY: 'Lundi', TUESDAY: 'Mardi', WEDNESDAY: 'Mercredi',
  THURSDAY: 'Jeudi', FRIDAY: 'Vendredi', SATURDAY: 'Samedi',
};

export default function GestionCreneaux() {
  const [enseignements, setEnseignements] = useState([]);
  const [classes, setClasses] = useState([]);
  const [classeFiltreId, setClasseFiltreId] = useState('');
  const [creneaux, setCreneaux] = useState([]);

  const [enseigneAId, setEnseigneAId] = useState('');
  const [jourSemaine, setJourSemaine] = useState('MONDAY');
  const [heureDebut, setHeureDebut] = useState('08:30');
  const [heureFin, setHeureFin] = useState('10:00');
  const [salle, setSalle] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    getAllEnseignements().then(setEnseignements);
    getClasses().then(setClasses);
  }, []);

  const chargerCreneaux = async (classeId) => {
    if (!classeId) {
      setCreneaux([]);
      return;
    }
    const data = await getCreneauxByClasse(classeId);
    setCreneaux(data);
  };

  const handleFiltreClasse = (id) => {
    setClasseFiltreId(id);
    chargerCreneaux(id);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await createCreneau({ enseigneAId, jourSemaine, heureDebut, heureFin, salle });
      setSalle('');
      if (classeFiltreId) chargerCreneaux(classeFiltreId);
    } catch (err) {
      setError('Erreur lors de la creation du creneau');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer ce creneau ?')) return;
    try {
      await deleteCreneau(id);
      if (classeFiltreId) chargerCreneaux(classeFiltreId);
    } catch (err) {
      setError('Erreur lors de la suppression');
    }
  };

  return (
    <div>
      <h2>Gestion des creneaux de cours</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <select value={enseigneAId} onChange={(e) => setEnseigneAId(e.target.value)} required>
          <option value="">Choisir un enseignement</option>
          {enseignements.map((ens) => (
            <option key={ens.id} value={ens.id}>
              {ens.professeur.prenom} {ens.professeur.nom} - {ens.classe.nom} - {ens.matiere.nom}
            </option>
          ))}
        </select>

        <select value={jourSemaine} onChange={(e) => setJourSemaine(e.target.value)}>
          {JOURS.map((j) => (
            <option key={j} value={j}>{JOURS_LABELS[j]}</option>
          ))}
        </select>

        <input type="time" value={heureDebut} onChange={(e) => setHeureDebut(e.target.value)} required />
        <input type="time" value={heureFin} onChange={(e) => setHeureFin(e.target.value)} required />
        <input placeholder="Salle (optionnel)" value={salle} onChange={(e) => setSalle(e.target.value)} />

        <button type="submit">Ajouter le creneau</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <h3>Voir les creneaux d'une classe</h3>
      <select value={classeFiltreId} onChange={(e) => handleFiltreClasse(e.target.value)}>
        <option value="">Choisir une classe</option>
        {classes.map((c) => (
          <option key={c.id} value={c.id}>{c.nom}</option>
        ))}
      </select>

      <table border="1" cellPadding="8" style={{ marginTop: 10 }}>
        <thead>
          <tr>
            <th>Jour</th><th>Heure</th><th>Matiere</th><th>Prof</th><th>Salle</th><th>Action</th>
          </tr>
        </thead>
        <tbody>
          {creneaux.map((c) => (
            <tr key={c.id}>
              <td>{JOURS_LABELS[c.jourSemaine]}</td>
              <td>{c.heureDebut} - {c.heureFin}</td>
              <td>{c.enseigneA.matiere.nom}</td>
              <td>{c.enseigneA.professeur.prenom} {c.enseigneA.professeur.nom}</td>
              <td>{c.salle || '—'}</td>
              <td><button onClick={() => handleDelete(c.id)}>Supprimer</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}