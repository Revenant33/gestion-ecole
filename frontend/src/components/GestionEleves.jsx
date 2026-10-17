import { useState, useEffect } from 'react';
import {
  rechercherEleves,
  changerClasseEnMasse,
  supprimerEnMasse,
  reinitialiserMotDePasse,
} from '../services/eleveAdminService';
import { getClasses } from '../services/classeService';

export default function GestionEleves() {
  const [eleves, setEleves] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [filtres, setFiltres] = useState({ nom: '', classeId: '', annee: '', specialite: '' });
  const [classeCibleId, setClasseCibleId] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const charger = async (f = filtres) => {
    try {
      setEleves(await rechercherEleves(f));
      setSelectedIds([]);
    } catch {
      setError('Erreur lors du chargement des eleves');
    }
  };

  useEffect(() => {
    charger();
    getClasses().then(setClasses);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const annees = [...new Set(classes.map((c) => c.annee))];
  const specialites = [...new Set(classes.map((c) => c.specialite).filter(Boolean))];

  const setFiltre = (cle, valeur) => setFiltres({ ...filtres, [cle]: valeur });

  const reinitialiserFiltres = () => {
    const vide = { nom: '', classeId: '', annee: '', specialite: '' };
    setFiltres(vide);
    charger(vide);
  };

  const toggleSelect = (id) =>
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const toggleSelectAll = () =>
    setSelectedIds(selectedIds.length === eleves.length ? [] : eleves.map((e) => e.id));

  const executer = async (action, message) => {
    setError('');
    setSuccess('');
    if (selectedIds.length === 0) {
      setError('Selectionne au moins un eleve');
      return;
    }
    try {
      await action();
      setSuccess(message);
      await charger();
    } catch (err) {
      setError(String(err.response?.data || "Erreur lors de l'operation"));
    }
  };

  const handleChangerClasse = () => {
    if (!classeCibleId) {
      setError('Choisis une classe cible');
      return;
    }
    executer(
      () => changerClasseEnMasse(selectedIds, classeCibleId),
      `${selectedIds.length} eleve(s) deplace(s)`
    );
  };

  const handleReinitialiser = () => {
    if (!motDePasse) {
      setError('Saisis un mot de passe temporaire');
      return;
    }
    executer(
      () => reinitialiserMotDePasse(selectedIds, motDePasse),
      `Mot de passe reinitialise pour ${selectedIds.length} eleve(s)`
    ).then(() => setMotDePasse(''));
  };

  const handleSupprimer = () => {
    if (selectedIds.length === 0) {
      setError('Selectionne au moins un eleve');
      return;
    }
    if (!confirm(`Supprimer ${selectedIds.length} eleve(s) et toutes leurs notes, absences et reponses ?`)) return;
    executer(() => supprimerEnMasse(selectedIds), 'Eleve(s) supprime(s)');
  };

  const exporterCsv = () => {
    const cible = selectedIds.length ? eleves.filter((e) => selectedIds.includes(e.id)) : eleves;
    const echapper = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const lignes = [
      ['Nom', 'Prenom', 'Email', 'Classe', 'Annee', 'Specialite'].join(';'),
      ...cible.map((e) =>
        [e.nom, e.prenom, e.email, e.classe?.nom, e.classe?.annee, e.classe?.specialite].map(echapper).join(';')
      ),
    ];
    const blob = new Blob(['\uFEFF' + lignes.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'eleves.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <h2>Gestion des eleves</h2>

      <div className="card">
        <h4 style={{ marginTop: 0 }}>Filtres</h4>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <input
            placeholder="Nom"
            value={filtres.nom}
            onChange={(e) => setFiltre('nom', e.target.value)}
          />
          <select value={filtres.classeId} onChange={(e) => setFiltre('classeId', e.target.value)}>
            <option value="">Toutes les classes</option>
            {classes.map((c) => <option key={c.id} value={c.id}>{c.nom}</option>)}
          </select>
          <select value={filtres.annee} onChange={(e) => setFiltre('annee', e.target.value)}>
            <option value="">Toutes les annees</option>
            {annees.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
          <select value={filtres.specialite} onChange={(e) => setFiltre('specialite', e.target.value)}>
            <option value="">Toutes les specialites</option>
            {specialites.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <button className="btn-primary" onClick={() => charger()}>Rechercher</button>
          <button onClick={reinitialiserFiltres}>Reinitialiser</button>
        </div>
      </div>

      <div className="card">
        <h4 style={{ marginTop: 0 }}>
          Actions sur la selection ({selectedIds.length} / {eleves.length})
        </h4>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
          <select value={classeCibleId} onChange={(e) => setClasseCibleId(e.target.value)}>
            <option value="">Classe cible</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>{c.nom} ({c.annee})</option>
            ))}
          </select>
          <button onClick={handleChangerClasse}>Changer de classe</button>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
          <input
            type="text"
            placeholder="Mot de passe temporaire (6 car. min.)"
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
            style={{ width: 260 }}
          />
          <button onClick={handleReinitialiser}>Reinitialiser le mot de passe</button>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={exporterCsv}>Exporter en CSV</button>
          <button onClick={handleSupprimer} style={{ background: 'var(--danger)' }}>
            Supprimer la selection
          </button>
        </div>
      </div>

      {error && <p style={{ color: 'var(--danger)' }}>{error}</p>}
      {success && <p style={{ color: 'var(--success)' }}>{success}</p>}

      <table>
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={eleves.length > 0 && selectedIds.length === eleves.length}
                onChange={toggleSelectAll}
              />
            </th>
            <th>Nom</th>
            <th>Prenom</th>
            <th>Email</th>
            <th>Classe</th>
            <th>Annee</th>
            <th>Specialite</th>
          </tr>
        </thead>
        <tbody>
          {eleves.map((e) => (
            <tr key={e.id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedIds.includes(e.id)}
                  onChange={() => toggleSelect(e.id)}
                />
              </td>
              <td>{e.nom}</td>
              <td>{e.prenom}</td>
              <td>{e.email}</td>
              <td>{e.classe?.nom}</td>
              <td>{e.classe?.annee}</td>
              <td>{e.classe?.specialite || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}