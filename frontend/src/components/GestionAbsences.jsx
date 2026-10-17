import { useState, useEffect } from 'react';
import { getClasses, getElevesDeClasse } from '../services/classeService';
import { getAbsencesByEleve, justifierAbsence } from '../services/absenceService';

export default function GestionAbsences() {
  const [classes, setClasses] = useState([]);
  const [classeId, setClasseId] = useState('');
  const [eleves, setEleves] = useState([]);
  const [eleveId, setEleveId] = useState('');
  const [absences, setAbsences] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    getClasses().then(setClasses);
  }, []);

  const handleClasseChange = async (id) => {
    setClasseId(id);
    setEleveId('');
    setAbsences([]);
    setEleves(id ? await getElevesDeClasse(id) : []);
  };

  const chargerAbsences = async (id) => {
    setEleveId(id);
    setAbsences(id ? await getAbsencesByEleve(id) : []);
  };

  const handleJustifier = async (absenceId) => {
    setError('');
    try {
      await justifierAbsence(absenceId);
      chargerAbsences(eleveId);
    } catch (err) {
      setError('Erreur lors de la justification');
    }
  };

  const nonJustifiees = absences.filter((a) => !a.justifiee).length;

  return (
    <div>
      <h2>Absences</h2>

      <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
        <select value={classeId} onChange={(e) => handleClasseChange(e.target.value)} style={{ flex: 1 }}>
          <option value="">Choisir une classe</option>
          {classes.map((c) => (
            <option key={c.id} value={c.id}>{c.nom}</option>
          ))}
        </select>
        <select
          value={eleveId}
          onChange={(e) => chargerAbsences(e.target.value)}
          disabled={!classeId}
          style={{ flex: 1 }}
        >
          <option value="">Choisir un eleve</option>
          {eleves.map((el) => (
            <option key={el.id} value={el.id}>{el.prenom} {el.nom}</option>
          ))}
        </select>
      </div>

      {error && <p style={{ color: 'var(--danger)' }}>{error}</p>}

      {eleveId && (
        <>
          <p style={{ color: 'var(--text-secondary)' }}>
            {absences.length} absence(s), dont {nonJustifiees} non justifiee(s)
          </p>
          <table>
            <thead>
              <tr><th>Matiere</th><th>Date</th><th>Heure</th><th>Statut</th><th>Action</th></tr>
            </thead>
            <tbody>
              {absences.map((a) => (
                <tr key={a.id}>
                  <td>{a.matiere.nom}</td>
                  <td>{a.date}</td>
                  <td>{a.heureDebut?.slice(0, 5)} - {a.heureFin?.slice(0, 5)}</td>
                  <td style={{ color: a.justifiee ? 'var(--success)' : 'var(--danger)' }}>
                    {a.justifiee ? 'Justifiee' : 'Non justifiee'}
                  </td>
                  <td>
                    {!a.justifiee && (
                      <button onClick={() => handleJustifier(a.id)}>Justifier</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}