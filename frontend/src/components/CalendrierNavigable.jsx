import { useState, useEffect } from 'react';
import WeeklyCalendar from './WeeklyCalendar';
import { getMonday, addDays, toIso, formatSemaine } from '../utils/dates';

export default function CalendrierNavigable({ fetchWeek, showProf = true, remarques = [], onSelect, refreshKey = 0 }) {
  const [lundi, setLundi] = useState(getMonday());
  const [occurrences, setOccurrences] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    fetchWeek(toIso(lundi))
      .then((data) => {
        if (!ignore) {
          setOccurrences(data);
          setError('');
        }
      })
      .catch(() => {
        if (!ignore) setError('Impossible de charger le calendrier');
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lundi, refreshKey]);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <button onClick={() => setLundi(addDays(lundi, -7))}>‹ Précédente</button>
        <button onClick={() => setLundi(getMonday())}>Aujourd'hui</button>
        <button onClick={() => setLundi(addDays(lundi, 7))}>Suivante ›</button>
        <strong style={{ marginLeft: 10 }}>{formatSemaine(lundi)}</strong>
        {loading && <span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Chargement...</span>}
      </div>

      {error && <p style={{ color: 'var(--danger)' }}>{error}</p>}

      <WeeklyCalendar
        occurrences={occurrences}
        lundi={lundi}
        showProf={showProf}
        remarques={remarques}
        onSelect={onSelect}
      />
    </div>
  );
}