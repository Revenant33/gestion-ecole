import { useState, useEffect } from 'react';
import { getClasses, createClasse, deleteClasse } from '../services/classeService';

export default function GestionClasses() {
  const [classes, setClasses] = useState([]);
  const [nom, setNom] = useState('');
  const [annee, setAnnee] = useState('');
  const [specialite, setSpecialite] = useState('');
  const [error, setError] = useState('');

  const chargerClasses = async () => {
    try {
      const data = await getClasses();
      setClasses(data);
    } catch (err) {
      setError('Erreur lors du chargement des classes');
    }
  };

  useEffect(() => {
    chargerClasses();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await createClasse({ nom, annee, specialite });
      setNom('');
      setAnnee('');
      setSpecialite('');
      chargerClasses();
    } catch (err) {
      setError('Erreur lors de la creation');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cette classe ?')) return;
    try {
      await deleteClasse(id);
      chargerClasses();
    } catch (err) {
      setError('Erreur lors de la suppression');
    }
  };

  return (
    <div>
      <h2>Gestion des classes</h2>

      <form onSubmit={handleCreate} style={{ marginBottom: 20 }}>
        <input
          placeholder="Nom (ex: 4DSI G11)"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          required
        />
        <input
          placeholder="Annee (ex: 2025-2026)"
          value={annee}
          onChange={(e) => setAnnee(e.target.value)}
          required
        />
        <input
          placeholder="Specialite (ex: DSI)"
          value={specialite}
          onChange={(e) => setSpecialite(e.target.value)}
        />
        <button type="submit">Ajouter</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Annee</th>
            <th>Specialite</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {classes.map((classe) => (
            <tr key={classe.id}>
              <td>{classe.nom}</td>
              <td>{classe.annee}</td>
              <td>{classe.specialite}</td>
              <td>
                <button onClick={() => handleDelete(classe.id)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}