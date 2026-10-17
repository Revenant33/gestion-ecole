import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Tabs from '../components/Tabs';
import StatCard from '../components/StatCard';
import ProfCalendrier from '../components/prof/ProfCalendrier';
import ProfClasseDetail from '../components/prof/ProfClasseDetail';
import { getMesClasses } from '../services/enseigneService';
import { getCreneauxByProf } from '../services/creneauService';
import { getMoiProf } from '../services/professeurService';

export default function DashboardProfesseur() {
  const { user, logout } = useAuth();
  const [enseignements, setEnseignements] = useState([]);
  const [creneaux, setCreneaux] = useState([]);
  const [moiProf, setMoiProf] = useState(null);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const charger = async () => {
      try {
        setEnseignements(await getMesClasses(user.id));
        setCreneaux(await getCreneauxByProf(user.id));
        setMoiProf(await getMoiProf());
      } catch {
        setError('Erreur lors du chargement des donnees');
      }
    };
    charger();
  }, [user.id]);

  const classesUniques = new Set(enseignements.map((e) => e.classe.nom)).size;
  const matieresUniques = new Set(enseignements.map((e) => e.matiere.nom)).size;

  const ongletAccueil = (
    <div>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 24 }}>
        <StatCard icon="🏫" label="Classes enseignees" value={classesUniques} accent />
        <StatCard icon="📘" label="Matieres" value={matieresUniques} />
        <StatCard icon="🗓️" label="Creneaux par semaine" value={creneaux.length} />
      </div>
      <p style={{ color: 'var(--text-secondary)' }}>
        Bienvenue, {user.prenom}. Consulte ton calendrier et gere tes classes depuis les onglets ci-dessus.
      </p>
    </div>
  );

  const ongletClasses = (
    <div style={{ display: 'flex', gap: 20 }}>
      <div style={{ width: 260, flexShrink: 0 }}>
        <h4 style={{ marginTop: 0 }}>Mes enseignements</h4>
        {enseignements.map((ens) => {
          const actif = selected?.id === ens.id;
          return (
            <button
              key={ens.id}
              onClick={() => setSelected(ens)}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                marginBottom: 8,
                padding: '10px 14px',
                background: actif ? 'var(--brand-soft)' : 'var(--bg-panel)',
                border: `1px solid ${actif ? 'var(--brand)' : 'var(--border-color)'}`,
                color: actif ? 'var(--brand)' : 'var(--text-primary)',
              }}
            >
              <div style={{ fontWeight: 600, fontSize: 13 }}>{ens.classe.nom}</div>
              <div style={{ fontSize: 12, opacity: 0.8 }}>{ens.matiere.nom}</div>
            </button>
          );
        })}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        {selected ? (
          <ProfClasseDetail key={selected.id} enseignement={selected} />
        ) : (
          <p style={{ color: 'var(--text-secondary)' }}>Selectionne une classe a gauche pour commencer.</p>
        )}
      </div>
    </div>
  );

  const ongletProfil = (
    <div style={{ maxWidth: 400 }}>
      {moiProf && (
        <div className="card">
          <p><strong>Nom :</strong> {moiProf.nom}</p>
          <p><strong>Prenom :</strong> {moiProf.prenom}</p>
          <p><strong>Email :</strong> {moiProf.email}</p>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 16 }}>
            Pour modifier ces informations, contacte l'administration.
          </p>
        </div>
      )}
    </div>
  );

  return (
    <div style={{ padding: 20, maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1>Dashboard Professeur</h1>
        <div>
          <span style={{ color: 'var(--text-secondary)' }}>{user.prenom} {user.nom}</span>
          <button onClick={logout} style={{ marginLeft: 12 }}>Deconnexion</button>
        </div>
      </div>

      {error && <p style={{ color: 'var(--danger)' }}>{error}</p>}

      <Tabs
        tabs={[
          { label: 'Accueil', content: ongletAccueil },
          { label: 'Calendrier', content: <ProfCalendrier profId={user.id} /> },
          { label: 'Mes classes', content: ongletClasses },
          { label: 'Profil', content: ongletProfil },
        ]}
      />
    </div>
  );
}