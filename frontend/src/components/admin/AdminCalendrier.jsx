import { useState, useEffect } from 'react';
import CalendrierNavigable from '../CalendrierNavigable';
import { getClasses } from '../../services/classeService';
import { getAllEnseignements } from '../../services/enseigneService';
import {
  getCalendrierClasse, annulerSeance, retablirSeance, ajouterSeance, supprimerSeance,
} from '../../services/calendrierService';

export default function AdminCalendrier() {
  const [classes, setClasses] = useState([]);
  const [enseignements, setEnseignements] = useState([]);
  const [classeId, setClasseId] = useState('');
  const [selected, setSelected] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [enseigneAId, setEnseigneAId] = useState('');
  const [date, setDate] = useState('');
  const [heureDebut, setHeureDebut] = useState('08:30');
  const [heureFin, setHeureFin] = useState('10:00');
  const [salle, setSalle] = useState('');

  useEffect(() => {
    getClasses().then(setClasses);
    getAllEnseignements().then(setEnseignements);
  }, []);

  const enseignementsClasse = enseignements.filter((e) => String(e.classe.id) === String(classeId));

  const rafraichir = () => {
    setSelected(null);
    setRefreshKey((k) => k + 1);
  };

  const agir = async (action, messageSucces) => {
    setError('');
    setSuccess('');
    try {
      await action();
      setSuccess(messageSucces);
      rafraichir();
    } catch (err) {
      setError(err.response?.data || "Erreur lors de l'operation");
    }
  };

  const handleAjout = async (e) => {
    e.preventDefault();
    if (new Date(date).getDay() === 0) {
      setError('Le calendrier affiche du lundi au samedi');
      return;
    }
    await agir(
      () => ajouterSeance({ enseigneAId, date, heureDebut, heureFin, salle }),
      `Seance ajoutee le ${date}. Navigue jusqu'a cette semaine pour la voir.`
    );
    setSalle('');
  };

  return (
    <div>
      <h2>Calendrier par semaine</h2>
      <p style={{ color: 'var(--text-secondary)', marginTop: -8 }}>
        L'onglet "Creneaux" definit l'emploi du temps type. Ici, tu geres les exceptions d'une semaine precise.
      </p>

      <select
        value={classeId}
        onChange={(e) => {
          setClasseId(e.target.value);
          setSelected(null);
          setEnseigneAId('');
        }}
        style={{ width: 300, marginBottom: 16 }}
      >
        <option value="">Choisir une classe</option>
        {classes.map((c) => <option key={c.id} value={c.id}>{c.nom}</option>)}
      </select>

      {error && <p style={{ color: 'var(--danger)' }}>{String(error)}</p>}
      {success && <p style={{ color: 'var(--success)' }}>{success}</p>}

      {classeId && (
        <>
          <CalendrierNavigable
            key={classeId}
            fetchWeek={(debut) => getCalendrierClasse(classeId, debut)}
            showProf={true}
            onSelect={setSelected}
            refreshKey={refreshKey}
          />

          {selected && (
            <div className="card" style={{ marginTop: 20, border: '1px solid var(--brand)' }}>
              <h4 style={{ marginTop: 0 }}>
                {selected.enseigneA.matiere.nom} : {selected.date}, {selected.heureDebut.slice(0, 5)} - {selected.heureFin.slice(0, 5)}
              </h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
                {selected.enseigneA.professeur.prenom} {selected.enseigneA.professeur.nom}
                {selected.ponctuelle ? ' (seance exceptionnelle)' : selected.annule ? ' (annule)' : ''}
              </p>

              {selected.ponctuelle && (
                <button onClick={() => agir(() => supprimerSeance(selected.seanceId), 'Seance supprimee')}>
                  Supprimer cette seance
                </button>
              )}
              {!selected.ponctuelle && !selected.annule && (
                <button onClick={() => agir(() => annulerSeance(selected.creneauId, selected.date), 'Seance annulee pour cette semaine')}>
                  Annuler cette seance
                </button>
              )}
              {!selected.ponctuelle && selected.annule && (
                <button onClick={() => agir(() => retablirSeance(selected.annulationId), 'Seance retablie')}>
                  Retablir cette seance
                </button>
              )}
              <button onClick={() => setSelected(null)}>Fermer</button>
            </div>
          )}

          <div className="card" style={{ marginTop: 20 }}>
            <h4 style={{ marginTop: 0 }}>Ajouter une séance ponctuelle</h4>
            <form onSubmit={handleAjout} className="plain" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <select value={enseigneAId} onChange={(e) => setEnseigneAId(e.target.value)} required style={{ minWidth: 260 }}>
                <option value="">Choisir un enseignement</option>
                {enseignementsClasse.map((ens) => (
                  <option key={ens.id} value={ens.id}>
                    {ens.matiere.nom} : {ens.professeur.prenom} {ens.professeur.nom}
                  </option>
                ))}
              </select>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
              <input type="time" value={heureDebut} onChange={(e) => setHeureDebut(e.target.value)} required />
              <input type="time" value={heureFin} onChange={(e) => setHeureFin(e.target.value)} required />
              <input placeholder="Salle" value={salle} onChange={(e) => setSalle(e.target.value)} />
              <button type="submit" className="btn-primary">Ajouter</button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}