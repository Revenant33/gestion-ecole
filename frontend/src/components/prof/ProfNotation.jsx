import { useState } from 'react';
import { createNote } from '../../services/noteService';
import { createAbsence } from '../../services/absenceService';

export default function ProfNotation({ enseignement, eleves, onAbsenceCreated }) {
  const matiereId = enseignement.matiere.id;

  const [noteEleveId, setNoteEleveId] = useState('');
  const [valeur, setValeur] = useState('');

  const [absEleveId, setAbsEleveId] = useState('');
  const [date, setDate] = useState('');
  const [heureDebut, setHeureDebut] = useState('08:30');
  const [heureFin, setHeureFin] = useState('10:00');

  const [error, setError] = useState('');

  const handleNote = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await createNote({ eleveId: noteEleveId, matiereId, valeur });
      setNoteEleveId('');
      setValeur('');
      alert('Note enregistree');
    } catch {
      setError('Erreur lors de la notation');
    }
  };

  const handleAbsence = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await createAbsence(absEleveId, matiereId, date, heureDebut, heureFin);
      setAbsEleveId('');
      setDate('');
      alert('Absence enregistree');
      onAbsenceCreated();
    } catch {
      setError("Erreur lors de l'enregistrement de l'absence");
    }
  };

  const choixEleves = (
    <>
      <option value="">Choisir un eleve</option>
      {eleves.map((el) => (
        <option key={el.id} value={el.id}>{el.prenom} {el.nom}</option>
      ))}
    </>
  );

  return (
    <div>
      {error && <p style={{ color: 'var(--danger)' }}>{error}</p>}
      <div style={{ display: 'flex', gap: 20 }}>
        <div className="card" style={{ flex: 1 }}>
          <h4 style={{ marginTop: 0 }}>Noter un eleve</h4>
          <form onSubmit={handleNote} className="plain">
            <select value={noteEleveId} onChange={(e) => setNoteEleveId(e.target.value)} required style={{ width: '100%', marginBottom: 8 }}>
              {choixEleves}
            </select>
            <input
              type="number"
              step="0.5"
              placeholder="Note"
              value={valeur}
              onChange={(e) => setValeur(e.target.value)}
              required
              style={{ width: '100%', marginBottom: 8 }}
            />
            <button type="submit" className="btn-primary" style={{ width: '100%' }}>Enregistrer la note</button>
          </form>
        </div>

        <div className="card" style={{ flex: 1 }}>
          <h4 style={{ marginTop: 0 }}>Marquer une absence</h4>
          <form onSubmit={handleAbsence} className="plain">
            <select value={absEleveId} onChange={(e) => setAbsEleveId(e.target.value)} required style={{ width: '100%', marginBottom: 8 }}>
              {choixEleves}
            </select>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required style={{ width: '100%', marginBottom: 8 }} />
            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <input type="time" value={heureDebut} onChange={(e) => setHeureDebut(e.target.value)} required style={{ flex: 1 }} />
              <input type="time" value={heureFin} onChange={(e) => setHeureFin(e.target.value)} required style={{ flex: 1 }} />
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%' }}>Marquer absent</button>
          </form>
        </div>
      </div>
    </div>
  );
}