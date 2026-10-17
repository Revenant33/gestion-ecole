import { useState, useEffect } from 'react';
import CalendrierNavigable from '../CalendrierNavigable';
import { getCalendrierProf } from '../../services/calendrierService';
import { getMesRemarques, createRemarque, deleteRemarque } from '../../services/remarqueService';

export default function ProfCalendrier({ profId }) {
  const [remarques, setRemarques] = useState([]);
  const [date, setDate] = useState('');
  const [contenu, setContenu] = useState('');
  const [error, setError] = useState('');

  const charger = async () => setRemarques(await getMesRemarques());

  useEffect(() => {
    charger().catch(() => setError('Erreur lors du chargement des remarques'));
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await createRemarque(date, contenu);
      setDate('');
      setContenu('');
      charger();
    } catch {
      setError("Erreur lors de l'ajout de la remarque");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteRemarque(id);
      charger();
    } catch {
      setError('Erreur lors de la suppression');
    }
  };

  return (
    <div>
      <CalendrierNavigable fetchWeek={(debut) => getCalendrierProf(profId, debut)}showProf={false}remarques={remarques}/>

      <div className="card" style={{ marginTop: 20 }}>
        <h4 style={{ marginTop: 0 }}>Mes remarques</h4>
        <form onSubmit={handleAdd} className="plain" style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          <input
            placeholder="Remarque (ex: apporter le projecteur)"
            value={contenu}
            onChange={(e) => setContenu(e.target.value)}
            required
            style={{ flex: 1 }}
          />
          <button type="submit" className="btn-primary">Ajouter</button>
        </form>

        {error && <p style={{ color: 'var(--danger)' }}>{error}</p>}

        {remarques.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Aucune remarque.</p>
        ) : (
          [...remarques].sort((a, b) => a.date.localeCompare(b.date)).map((r) => (
            <div
              key={r.id}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border-color)' }}
            >
              <div>
                <strong style={{ color: 'var(--brand)', marginRight: 10 }}>{r.date}</strong>
                {r.contenu}
              </div>
              <button onClick={() => handleDelete(r.id)}>Supprimer</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}