import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getMoi } from '../services/eleveService';
import { getNotesByEleve } from '../services/noteService';
import { getAbsencesByEleve } from '../services/absenceService';
import { getNotesDisciplinairesByEleve } from '../services/noteDisciplinaireService';
import { getPublicationsByClasse } from '../services/publicationService';
import { createReponse } from '../services/reponseService';
import { getCreneauxByClasse } from '../services/creneauService';
import Tabs from '../components/Tabs';
import StatCard from '../components/StatCard';
import CalendrierNavigable from '../components/CalendrierNavigable';
import { getCalendrierClasse } from '../services/calendrierService';

export default function DashboardEleve() {
  const { user, logout } = useAuth();
  const [moi, setMoi] = useState(null);
  const [notes, setNotes] = useState([]);
  const [absences, setAbsences] = useState([]);
  const [notesDisciplinaires, setNotesDisciplinaires] = useState([]);
  const [publications, setPublications] = useState([]);
  const [reponseTexte, setReponseTexte] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    const charger = async () => {
      try {
        const moiData = await getMoi();
        setMoi(moiData);

        const [notesData, absencesData, disciplinairesData, publicationsData, creneauxData] = await Promise.all([
          getNotesByEleve(moiData.id),
          getAbsencesByEleve(moiData.id),
          getNotesDisciplinairesByEleve(moiData.id),
          getPublicationsByClasse(moiData.classe.id),
          getCreneauxByClasse(moiData.classe.id),
        ]);

        setNotes(notesData);
        setAbsences(absencesData);
        setNotesDisciplinaires(disciplinairesData);
        setPublications(publicationsData);
        setCreneaux(creneauxData);
      } catch (err) {
        setError('Erreur lors du chargement des donnees');
      }
    };
    charger();
  }, []);

  const handleRepondre = async (publicationId) => {
    const contenu = reponseTexte[publicationId];
    if (!contenu) return;
    try {
      await createReponse(publicationId, contenu);
      setReponseTexte((prev) => ({ ...prev, [publicationId]: '' }));
      alert('Reponse envoyee');
    } catch (err) {
      setError('Erreur lors de l\'envoi de la reponse');
    }
  };

  if (!moi) return <p>Chargement...</p>;

  const ongletNotes = (
    <table>
      <thead>
        <tr><th>Matiere</th><th>Note</th><th>Date</th></tr>
      </thead>
      <tbody>
        {notes.map((n) => (
          <tr key={n.id}>
            <td>{n.matiere.nom}</td>
            <td>{n.valeur}</td>
            <td>{n.date}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const ongletAbsences = (
  <table>
    <thead>
      <tr><th>Matiere</th><th>Date</th><th>Heure</th><th>Justifiee</th></tr>
    </thead>
    <tbody>
      {absences.map((a) => (
        <tr key={a.id}>
          <td>{a.matiere.nom}</td>
          <td>{a.date}</td>
          <td>{a.heureDebut?.slice(0, 5)} - {a.heureFin?.slice(0, 5)}</td>
          <td>{a.justifiee ? 'Oui' : 'Non'}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

  const ongletDiscipline =
    notesDisciplinaires.length === 0 ? (
      <p style={{ color: 'var(--text-secondary)' }}>Aucune note disciplinaire</p>
    ) : (
      <ul>
        {notesDisciplinaires.map((nd) => (
          <li key={nd.id}>{nd.date} - {nd.description}</li>
        ))}
      </ul>
    );

  const ongletPublications = (
    <div>
      {publications.map((pub) => (
        <div
          key={pub.id}
          style={{
            border: '1px solid var(--border-color)',
            background: 'var(--bg-panel)',
            borderRadius: 8,
            padding: 14,
            marginBottom: 12,
          }}
        >
          <strong>[{pub.type}] {pub.titre}</strong>
          <p style={{ color: 'var(--text-secondary)' }}>{pub.contenu}</p>
          {pub.type === 'EXERCICE' && (
            <div>
              <textarea
                placeholder="Ta reponse"
                value={reponseTexte[pub.id] || ''}
                onChange={(e) =>
                  setReponseTexte((prev) => ({ ...prev, [pub.id]: e.target.value }))
                }
                style={{ width: '100%', minHeight: 60 }}
              />
              <br />
              <button onClick={() => handleRepondre(pub.id)}>Repondre</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
  const moyenneNotes = notes.length > 0
  ? (notes.reduce((sum, n) => sum + n.valeur, 0) / notes.length).toFixed(2)
  : '—';

const ongletAccueil = (
  <div>
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 24 }}>
      <StatCard icon="📊" label="Moyenne generale" value={moyenneNotes} accent />
      <StatCard icon="📅" label="Absences" value={absences.length} />
      <StatCard icon="⚠️" label="Notes disciplinaires" value={notesDisciplinaires.length} />
      <StatCard icon="📚" label="Cours & exercices" value={publications.length} />
    </div>
    <p style={{ color: 'var(--text-secondary)' }}>
      Bienvenue sur ton espace, {user.prenom}. Utilise les onglets ci-dessus pour consulter
      ton calendrier, tes notes, tes absences et les publications de tes professeurs.
    </p>
  </div>
);

const ongletProfil = (
  <div style={{ maxWidth: 400 }}>
    <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-color)', borderRadius: 10, padding: 20 }}>
      <p><strong>Nom :</strong> {moi.nom}</p>
      <p><strong>Prenom :</strong> {moi.prenom}</p>
      <p><strong>Email :</strong> {moi.email}</p>
      <p><strong>Classe :</strong> {moi.classe?.nom}</p>
      <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 16 }}>
        Pour modifier ces informations, contacte l'administration.
      </p>
    </div>
  </div>
);
  return (
    <div style={{ padding: 20, maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1>Dashboard Eleve</h1>
        <div>
          <span style={{ color: 'var(--text-secondary)' }}>
            {user.prenom} {user.nom} - {moi.classe?.nom}
          </span>
          <button onClick={logout} style={{ marginLeft: 12 }}>Deconnexion</button>
        </div>
      </div>

      {error && <p style={{ color: 'var(--danger)' }}>{error}</p>}

      <Tabs
        tabs={[
          { label: 'Accueil', content: ongletAccueil },
          {label: 'Calendrier',content: (<CalendrierNavigable fetchWeek={(debut) => getCalendrierClasse(moi.classe.id, debut)}showProf={true}/>),},
          { label: 'Notes', content: ongletNotes },
          { label: 'Absences', content: ongletAbsences },
          { label: 'Discipline', content: ongletDiscipline },
          { label: 'Cours & exercices', content: ongletPublications },
          { label: 'Profil', content: ongletProfil },
        ]}
      />
    </div>
  );
}