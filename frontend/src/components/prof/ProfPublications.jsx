import { useState } from 'react';
import { createPublication } from '../../services/publicationService';
import { getReponsesByPublication } from '../../services/reponseService';

export default function ProfPublications({ enseignement, publications, onPublished }) {
  const [type, setType] = useState('COURS');
  const [titre, setTitre] = useState('');
  const [contenu, setContenu] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [reponses, setReponses] = useState([]);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await createPublication({
        classeId: enseignement.classe.id,
        matiereId: enseignement.matiere.id,
        type,
        titre,
        contenu,
      });
      setTitre('');
      setContenu('');
      onPublished();
    } catch {
      setError('Erreur lors de la creation de la publication');
    }
  };

  const voirReponses = async (id) => {
    setSelectedId(id);
    setReponses(await getReponsesByPublication(id));
  };

  return (
    <>
      <div className="card">
        <h4 style={{ marginTop: 0 }}>Poster un cours ou exercice</h4>
        <form onSubmit={handleSubmit} className="plain">
          <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
            <select value={type} onChange={(e) => setType(e.target.value)} style={{ width: 140 }}>
              <option value="COURS">Cours</option>
              <option value="EXERCICE">Exercice</option>
            </select>
            <input placeholder="Titre" value={titre} onChange={(e) => setTitre(e.target.value)} required style={{ flex: 1 }} />
          </div>
          <textarea
            placeholder="Contenu"
            value={contenu}
            onChange={(e) => setContenu(e.target.value)}
            required
            style={{ width: '100%', minHeight: 90, marginBottom: 10 }}
          />
          <button type="submit" className="btn-primary">Publier</button>
        </form>
        {error && <p style={{ color: 'var(--danger)' }}>{error}</p>}
      </div>

      <div className="card">
        <h4 style={{ marginTop: 0 }}>Publications ({publications.length})</h4>
        {publications.length === 0 && (
          <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Aucune publication pour le moment.</p>
        )}
        {publications.map((pub) => (
          <div
            key={pub.id}
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border-color)' }}
          >
            <div>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: 4,
                  marginRight: 8,
                  background: pub.type === 'EXERCICE' ? 'var(--brand-soft)' : 'var(--bg-hover)',
                  color: pub.type === 'EXERCICE' ? 'var(--brand)' : 'var(--text-secondary)',
                }}
              >
                {pub.type}
              </span>
              {pub.titre}
            </div>
            {pub.type === 'EXERCICE' && <button onClick={() => voirReponses(pub.id)}>Voir les reponses</button>}
          </div>
        ))}

        {selectedId && (
          <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px dashed var(--border-color)' }}>
            <h4 style={{ marginTop: 0, fontSize: 13 }}>Reponses des eleves</h4>
            {reponses.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Aucune reponse pour le moment.</p>
            ) : (
              reponses.map((rep) => (
                <div key={rep.id} style={{ background: 'var(--bg-panel-light)', borderRadius: 6, padding: '8px 12px', marginBottom: 6, fontSize: 13 }}>
                  <strong>{rep.eleve.prenom} {rep.eleve.nom}</strong> : {rep.contenu}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </>
  );
}