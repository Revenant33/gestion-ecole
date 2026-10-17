import { Fragment, useState, useEffect } from 'react';
import { getPublicationsByClasse } from '../../services/publicationService';
import { getElevesDeClasse } from '../../services/classeService';
import { getAbsencesByClasseMatiere } from '../../services/absenceService';
import ProfPublications from './ProfPublications';
import ProfNotation from './ProfNotation';

export default function ProfClasseDetail({ enseignement }) {
  const classeId = enseignement.classe.id;
  const matiereId = enseignement.matiere.id;

  const [publications, setPublications] = useState([]);
  const [eleves, setEleves] = useState([]);
  const [absences, setAbsences] = useState([]);
  const [detailId, setDetailId] = useState(null);

  const chargerPublications = async () => {
    const data = await getPublicationsByClasse(classeId);
    setPublications(data.filter((p) => p.matiere.id === matiereId));
  };

  const chargerAbsences = async () => {
    setAbsences(await getAbsencesByClasseMatiere(classeId, matiereId));
  };

  useEffect(() => {
    chargerPublications();
    chargerAbsences();
    getElevesDeClasse(classeId).then(setEleves);
  }, [classeId, matiereId]);

  return (
    <div>
      <h3 style={{ marginTop: 0 }}>{enseignement.classe.nom} — {enseignement.matiere.nom}</h3>

      <div className="card">
        <h4 style={{ marginTop: 0 }}>Eleves de la classe ({eleves.length})</h4>
        <table>
          <thead>
            <tr><th>Eleve</th><th>Absences</th><th>Non justifiees</th><th>Detail</th></tr>
          </thead>
          <tbody>
            {eleves.map((el) => {
              const abs = absences.filter((a) => a.eleve.id === el.id);
              const nonJust = abs.filter((a) => !a.justifiee).length;
              const ouvert = detailId === el.id;
              return (
                <Fragment key={el.id}>
                  <tr>
                    <td>{el.prenom} {el.nom}</td>
                    <td>{abs.length}</td>
                    <td style={{ color: nonJust > 0 ? 'var(--danger)' : 'inherit' }}>{nonJust}</td>
                    <td>
                      {abs.length > 0 && (
                        <button onClick={() => setDetailId(ouvert ? null : el.id)}>
                          {ouvert ? 'Masquer' : 'Voir'}
                        </button>
                      )}
                    </td>
                  </tr>
                  {ouvert && (
                    <tr>
                      <td colSpan={4} style={{ background: 'var(--bg-panel-light)' }}>
                        {abs.map((a) => (
                          <div key={a.id} style={{ fontSize: 13, padding: '3px 0' }}>
                            {a.date}, {a.heureDebut?.slice(0, 5)} - {a.heureFin?.slice(0, 5)} :{' '}
                            <span style={{ color: a.justifiee ? 'var(--success)' : 'var(--danger)' }}>
                              {a.justifiee ? 'justifiee' : 'non justifiee'}
                            </span>
                          </div>
                        ))}
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      <ProfPublications enseignement={enseignement} publications={publications} onPublished={chargerPublications} />
      <ProfNotation enseignement={enseignement} eleves={eleves} onAbsenceCreated={chargerAbsences} />
    </div>
  );
}