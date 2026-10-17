import { useState, useEffect } from 'react';
import { getClasses, getElevesDeClasse } from '../../services/classeService';
import { getNotesByEleve, deleteNote } from '../../services/noteService';

export default function AdminNotes() {
  const [classes, setClasses] = useState([]);
  const [classeId, setClasseId] = useState('');
  const [eleves, setEleves] = useState([]);
  const [eleveId, setEleveId] = useState('');
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    getClasses().then(setClasses);
  }, []);

  const handleClasse = async (id) => {
    setClasseId(id);
    setEleveId('');
    setNotes([]);
    setEleves(id ? await getElevesDeClasse(id) : []);
  };

  const handleEleve = async (id) => {
    setEleveId(id);
    setNotes(id ? await getNotesByEleve(id) : []);
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cette note ?')) return;
    setError('');
    try {
      await deleteNote(id);
      handleEleve(eleveId);
    } catch {
      setError('Erreur lors de la suppression');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
        <select value={classeId} onChange={(e) => handleClasse(e.target.value)} style={{ flex: 1 }}>
          <option value="">Choisir une classe</option>
          {classes.map((c) => <option key={c.id} value={c.id}>{c.nom}</option>)}
        </select>
        <select value={eleveId} onChange={(e) => handleEleve(e.target.value)} disabled={!classeId} style={{ flex: 1 }}>
          <option value="">Choisir un eleve</option>
          {eleves.map((el) => <option key={el.id} value={el.id}>{el.prenom} {el.nom}</option>)}
        </select>
      </div>

      {error && <p style={{ color: 'var(--danger)' }}>{error}</p>}

      {eleveId && (
        notes.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>Aucune note pour cet eleve.</p>
        ) : (
          <table>
            <thead>
              <tr><th>Matiere</th><th>Note</th><th>Professeur</th><th>Date</th><th>Action</th></tr>
            </thead>
            <tbody>
              {notes.map((n) => (
                <tr key={n.id}>
                  <td>{n.matiere.nom}</td>
                  <td>{n.valeur}</td>
                  <td>{n.professeur.prenom} {n.professeur.nom}</td>
                  <td>{n.date}</td>
                  <td><button onClick={() => handleDelete(n.id)}>Supprimer</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      )}
    </div>
  );
}