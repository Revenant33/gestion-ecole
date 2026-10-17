import { useState, useEffect } from 'react';
import { getMatieres, createMatiere, deleteMatiere } from '../services/matiereService';
import { getAllEnseignements } from '../services/enseigneService';

export default function GestionMatieres() {
  const [matieres, setMatieres] = useState([]);
  const [enseignements, setEnseignements] = useState([]);
  const [nom, setNom] = useState('');
  const [error, setError] = useState('');

  const chargerMatieres = async () => {
    try {
      const data = await getMatieres();
      setMatieres(data);
    } catch (err) {
      setError('Erreur lors du chargement des matieres');
    }
  };

  const chargerEnseignements = async () => {
    try {
      const data = await getAllEnseignements();
      setEnseignements(data);
    } catch (err) {
      // pas bloquant si ca echoue, on affiche juste sans les profs
    }
  };

  useEffect(() => {
    chargerMatieres();
    chargerEnseignements();
  }, []);

  const getProfsPourMatiere = (matiereId) => {
    const profs = enseignements
      .filter((ens) => ens.matiere.id === matiereId)
      .map((ens) => `${ens.professeur.prenom} ${ens.professeur.nom}`);
    // dedoublonne au cas ou un prof enseigne la matiere dans plusieurs classes
    return [...new Set(profs)];
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await createMatiere({ nom });
      setNom('');
      chargerMatieres();
    } catch (err) {
      setError('Erreur lors de la creation (nom peut-etre deja pris)');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cette matiere ?')) return;
    try {
      await deleteMatiere(id);
      chargerMatieres();
    } catch (err) {
      setError('Erreur lors de la suppression');
    }
  };

  return (
    <div>
      <h2>Gestion des matieres</h2>

      <form onSubmit={handleCreate} style={{ marginBottom: 20 }}>
        <input
          placeholder="Nom de la matiere"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          required
        />
        <button type="submit">Ajouter</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Professeurs</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {matieres.map((matiere) => {
            const profs = getProfsPourMatiere(matiere.id);
            return (
              <tr key={matiere.id}>
                <td>{matiere.nom}</td>
                <td>{profs.length > 0 ? profs.join(', ') : '—'}</td>
                <td>
                  <button onClick={() => handleDelete(matiere.id)}>Supprimer</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}