import { useState, useEffect } from 'react';
import { getClasses } from '../services/classeService';
import { getElevesDeClasse } from '../services/classeService';
import { createNoteDisciplinaire, getNotesDisciplinairesByEleve } from '../services/noteDisciplinaireService';

export default function GestionDiscipline() {
  const [classes, setClasses] = useState([]);
  const [classeId, setClasseId] = useState('');
  const [eleves, setEleves] = useState([]);
  const [eleveId, setEleveId] = useState('');
  const [description, setDescription] = useState('');
  const [historique, setHistorique] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    getClasses().then(setClasses);
  }, []);

  const handleClasseChange = async (id) => {
    setClasseId(id);
    setEleveId('');
    setHistorique([]);
    if (id) {
      const data = await getElevesDeClasse(id);
      setEleves(data);
    } else {
      setEleves([]);
    }
  };

  const handleEleveChange = async (id) => {
    setEleveId(id);
    if (id) {
      const data = await getNotesDisciplinairesByEleve(id);
      setHistorique(data);
    } else {
      setHistorique([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await createNoteDisciplinaire(eleveId, description);
      setDescription('');
      setSuccess('Mesure disciplinaire enregistree');
      const data = await getNotesDisciplinairesByEleve(eleveId);
      setHistorique(data);
    } catch (err) {
      setError('Erreur lors de l\'enregistrement');
    }
  };

  return (
    <div>
      <h2>Mesures disciplinaires</h2>

      <div
        style={{
          background: 'var(--bg-panel)',
          border: '1px solid var(--border-color)',
          borderRadius: 10,
          padding: 18,
          marginBottom: 20,
        }}
      >
        <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
          <select value={classeId} onChange={(e) => handleClasseChange(e.target.value)} style={{ flex: 1 }}>
            <option value="">Choisir une classe</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>{c.nom}</option>
            ))}
          </select>
          <select
            value={eleveId}
            onChange={(e) => handleEleveChange(e.target.value)}
            disabled={!classeId}
            style={{ flex: 1 }}
          >
            <option value="">Choisir un eleve</option>
            {eleves.map((el) => (
              <option key={el.id} value={el.id}>{el.prenom} {el.nom}</option>
            ))}
          </select>
        </div>

        {eleveId && (
          <form onSubmit={handleSubmit} style={{ background: 'transparent', border: 'none', padding: 0 }}>
            <textarea
              placeholder="Description de la mesure disciplinaire"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              style={{ width: '100%', minHeight: 70, marginBottom: 10 }}
            />
            <button type="submit" className="btn-primary">Enregistrer</button>
          </form>
        )}

        {error && <p style={{ color: 'var(--danger)' }}>{error}</p>}
        {success && <p style={{ color: 'var(--success)' }}>{success}</p>}
      </div>

      {eleveId && (
        <div>
          <h3>Historique</h3>
          {historique.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>Aucune mesure disciplinaire enregistree.</p>
          ) : (
            <table>
              <thead>
                <tr><th>Date</th><th>Description</th></tr>
              </thead>
              <tbody>
                {historique.map((h) => (
                  <tr key={h.id}>
                    <td>{h.date}</td>
                    <td>{h.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}