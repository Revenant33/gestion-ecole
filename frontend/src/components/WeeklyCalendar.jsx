import { addDays, toIso } from '../utils/dates';

const JOURS_LABELS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

const HEURE_DEBUT = 8;
const HEURE_FIN = 19;
const HEURES = Array.from({ length: HEURE_FIN - HEURE_DEBUT }, (_, i) => HEURE_DEBUT + i);
const HEADER = 56;

const PALETTE = [
  '#6c8ee8', '#e8866c', '#6ce89b', '#d66ce8', '#e8d26c',
  '#6ce8df', '#e86c8e', '#9b6ce8', '#8ee86c', '#e8a76c',
];
function couleurPourMatiere(nom) {
  let hash = 0;
  for (let i = 0; i < nom.length; i++) hash = nom.charCodeAt(i) + ((hash << 5) - hash);
  return PALETTE[Math.abs(hash) % PALETTE.length];
}

function toMinutes(heureStr) {
  const [h, m] = heureStr.split(':').map(Number);
  return h * 60 + m;
}

export default function WeeklyCalendar({ occurrences, lundi, showProf = true, remarques = [], onSelect }) {
  const aujourdhui = toIso(new Date());

  return (
    <div
      style={{
        display: 'flex',
        border: '1px solid var(--border-color)',
        borderRadius: 10,
        overflow: 'hidden',
        background: 'var(--bg-panel)',
      }}
    >
      <div style={{ width: 55, flexShrink: 0 }}>
        <div style={{ height: HEADER, borderBottom: '1px solid var(--border-color)' }} />
        {HEURES.map((h) => (
          <div
            key={h}
            style={{
              height: 60,
              borderBottom: '1px solid var(--border-color)',
              fontSize: 11,
              color: 'var(--text-secondary)',
              paddingRight: 6,
              textAlign: 'right',
            }}
          >
            {h}:00
          </div>
        ))}
      </div>

      {JOURS_LABELS.map((label, index) => {
        const date = addDays(lundi, index);
        const iso = toIso(date);
        const estAujourdhui = iso === aujourdhui;
        const occsDuJour = occurrences.filter((o) => o.date === iso);
        const notes = remarques.filter((r) => r.date === iso);

        return (
          <div
            key={iso}
            style={{
              flex: 1,
              minWidth: 0,
              borderLeft: '1px solid var(--border-color)',
              background: estAujourdhui ? 'rgba(108,142,232,0.04)' : 'transparent',
            }}
          >
            <div
              style={{
                height: HEADER,
                borderBottom: '1px solid var(--border-color)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                background: estAujourdhui ? 'var(--brand-soft)' : 'var(--bg-panel-light)',
                color: estAujourdhui ? 'var(--brand)' : 'var(--text-primary)',
              }}
            >
              <div style={{ fontWeight: 600, fontSize: 13 }}>{label}</div>
              <div style={{ fontSize: 12, opacity: 0.8 }}>
                {date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
              </div>
              {notes.length > 0 && (
                <span
                  title={notes.map((n) => n.contenu).join('\n')}
                  style={{ position: 'absolute', top: 4, right: 6, fontSize: 12, cursor: 'help' }}
                >
                  📝
                </span>
              )}
            </div>

            <div style={{ position: 'relative', height: HEURES.length * 60 }}>
              {HEURES.map((h) => (
                <div
                  key={h}
                  style={{
                    position: 'absolute',
                    top: (h - HEURE_DEBUT) * 60,
                    width: '100%',
                    height: 60,
                    borderBottom: '1px solid var(--border-color)',
                  }}
                />
              ))}

              {occsDuJour.map((o) => {
                const debutMin = toMinutes(o.heureDebut);
                const finMin = toMinutes(o.heureFin);
                const couleur = couleurPourMatiere(o.enseigneA.matiere.nom);
                const cliquable = Boolean(onSelect);

                return (
                  <div
                    key={`${o.creneauId ?? 's' + o.seanceId}-${o.date}`}
                    onClick={cliquable ? () => onSelect(o) : undefined}
                    style={{
                      position: 'absolute',
                      top: debutMin - HEURE_DEBUT * 60,
                      height: finMin - debutMin,
                      left: 4,
                      right: 4,
                      background: o.annule ? `${couleur}33` : couleur,
                      border: o.annule ? `1px dashed ${couleur}` : o.ponctuelle ? '1px solid #fff' : 'none',
                      color: o.annule ? 'var(--text-secondary)' : '#fff',
                      borderRadius: 6,
                      padding: '5px 7px',
                      fontSize: 11.5,
                      overflow: 'hidden',
                      boxSizing: 'border-box',
                      cursor: cliquable ? 'pointer' : 'default',
                      boxShadow: o.annule ? 'none' : '0 2px 6px rgba(0,0,0,0.25)',
                    }}
                  >
                    <div style={{ fontWeight: 700, textDecoration: o.annule ? 'line-through' : 'none' }}>
                      {o.enseigneA.matiere.nom}
                    </div>
                    {o.annule && <div style={{ fontWeight: 700 }}>Annulé</div>}
                    {o.ponctuelle && <div style={{ fontWeight: 700 }}>Séance exceptionnelle</div>}
                    <div style={{ opacity: 0.9 }}>
                      {showProf
                        ? `${o.enseigneA.professeur.prenom} ${o.enseigneA.professeur.nom}`
                        : o.enseigneA.classe.nom}
                    </div>
                    <div style={{ opacity: 0.85 }}>
                      {o.heureDebut.slice(0, 5)} - {o.heureFin.slice(0, 5)}
                    </div>
                    {o.salle && <div style={{ opacity: 0.85 }}>Salle {o.salle}</div>}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}