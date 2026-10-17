import { useState, useEffect } from 'react';
import { getClasses } from '../../services/classeService';
import { getPublicationsByClasse, deletePublication } from '../../services/publicationService';
import { getReponsesByPublication, deleteReponse } from '../../services/reponseService';

export default function AdminPublications() {
  const [classes, setClasses] = useState([]);
  const [classeId, setClasseId] = useState('');
  const [publications, setPublications] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [reponses, setReponses] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    getClasses().then(setClasses);
  }, []);

  const chargerPublications = async (id) => {
    setPublications(id ? await getPublicationsByClasse(id) : []);
  };

  const handleClasse = (id) => {
    setClasseId(id);
    setSelectedId(null);
    setReponses([]);
    chargerPublications(id);
  };

  const voirReponses = async (id) => {
    setSelectedId(id);
    setReponses(await getReponsesByPublication(id));
  };

  const handleDeletePublication = async (id) => {
    if (!confirm('Supprimer cette publication et toutes ses reponses ?')) return;
    setError('');
    try {
      await deletePublication(id);
      if (selectedId === id) {
        setSelectedId(null);
        setReponses([]);
      }
      chargerPublications(classeId);
    } catch {
      setError('Erreur lors de la suppression');
    }
  };

  const handleDeleteReponse = async (id) => {
    if (!confirm('Supprimer cette reponse ?')) return;
    try {
      await deleteReponse(id);
      voirReponses(selectedId);
    } catch {
      setError('Erreur lors de la suppression');
    }
  };

  return (
    <div>
      <select value={classeId} onChange={(e) => handleClasse(e.target.value)} style={{ width: 300, marginBottom: 16 }}>
        <option value="">Choisir une classe</option>
        {classes.map((c) => <option key={c.id} value={c.id}>{c.nom}</option>)}
      </select>

      {error && <p style={{ color: 'var(--danger)' }}>{error}</p>}

      {classeId && (
        publications.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>Aucune publication pour cette classe.</p>
        ) : (
          <table>
            <thead>
              <tr><th>Type</th><th>Titre</th><th>Matiere</th><th>Professeur</th><th>Date</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {publications.map((p) => (
                <tr key={p.id}>
                  <td>{p.type}</td>
                  <td>{p.titre}</td>
                  <td>{p.matiere.nom}</td>
                  <td>{p.professeur.prenom} {p.professeur.nom}</td>
                  <td>{p.date}</td>
                  <td>
                    {p.type === 'EXERCICE' && <button onClick={() => voirReponses(p.id)}>Reponses</button>}
                    <button onClick={() => handleDeletePublication(p.id)}>Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      )}

      {selectedId && (
        <div className="card" style={{ marginTop: 20 }}>
          <h4 style={{ marginTop: 0 }}>Reponses ({reponses.length})</h4>
          {reponses.length === 0 && (
            <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Aucune reponse.</p>
          )}
          {reponses.map((r) => (
            <div
              key={r.id}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border-color)' }}
            >
              <div><strong>{r.eleve.prenom} {r.eleve.nom}</strong> : {r.contenu}</div>
              <button onClick={() => handleDeleteReponse(r.id)}>Supprimer</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}