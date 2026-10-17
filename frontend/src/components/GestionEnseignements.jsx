import { useState, useEffect } from 'react';
import { getProfesseurs } from '../services/professeurService';
import { getClasses } from '../services/classeService';
import { getMatieres } from '../services/matiereService';
import { assignerEnseignement } from '../services/enseigneAdminService';

export default function GestionEnseignements() {
  const [profs, setProfs] = useState([]);
  const [classes, setClasses] = useState([]);
  const [matieres, setMatieres] = useState([]);
  const [profId, setProfId] = useState('');
  const [classeId, setClasseId] = useState('');
  const [matiereId, setMatiereId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    getProfesseurs().then(setProfs);
    getClasses().then(setClasses);
    getMatieres().then(setMatieres);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await assignerEnseignement(profId, classeId, matiereId);
      setSuccess('Enseignement assigne avec succes');
      setProfId('');
      setClasseId('');
      setMatiereId('');
    } catch (err) {
      setError('Erreur lors de l\'assignation (peut-etre deja existante)');
    }
  };

  return (
    <div>
      <h2>Assigner un enseignement</h2>
      <form onSubmit={handleSubmit}>
        <select value={profId} onChange={(e) => setProfId(e.target.value)} required>
          <option value="">Choisir un professeur</option>
          {profs.map((p) => (
            <option key={p.id} value={p.id}>{p.prenom} {p.nom}</option>
          ))}
        </select>
        <select value={classeId} onChange={(e) => setClasseId(e.target.value)} required>
          <option value="">Choisir une classe</option>
          {classes.map((c) => (
            <option key={c.id} value={c.id}>{c.nom}</option>
          ))}
        </select>
        <select value={matiereId} onChange={(e) => setMatiereId(e.target.value)} required>
          <option value="">Choisir une matiere</option>
          {matieres.map((m) => (
            <option key={m.id} value={m.id}>{m.nom}</option>
          ))}
        </select>
        <button type="submit">Assigner</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
  );
}