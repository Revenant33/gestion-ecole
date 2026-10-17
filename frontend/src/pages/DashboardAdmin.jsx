import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import GestionClasses from '../components/GestionClasses';
import GestionMatieres from '../components/GestionMatieres';
import GestionEleves from '../components/GestionEleves';
import GestionComptes from '../components/GestionComptes';
import GestionEnseignements from '../components/GestionEnseignements';
import GestionCreneaux from '../components/GestionCreneaux';
import GestionDiscipline from '../components/GestionDiscipline';
import Tabs from '../components/Tabs';
import StatCard from '../components/StatCard';
import { getClasses } from '../services/classeService';
import { getMatieres } from '../services/matiereService';
import { getProfesseurs } from '../services/professeurService';
import GestionProfils from '../components/GestionProfils';
import GestionAbsences from '../components/GestionAbsences';
import GestionContenu from '../components/admin/GestionContenu';
import AdminCalendrier from '../components/admin/AdminCalendrier';

export default function DashboardAdmin() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({ classes: 0, matieres: 0, profs: 0 });

  useEffect(() => {
    const charger = async () => {
      const [classes, matieres, profs] = await Promise.all([
        getClasses(),
        getMatieres(),
        getProfesseurs(),
      ]);
      setStats({ classes: classes.length, matieres: matieres.length, profs: profs.length });
    };
    charger();
  }, []);

  const ongletAccueil = (
    <div>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 24 }}>
        <StatCard icon="🏫" label="Classes" value={stats.classes} accent />
        <StatCard icon="📘" label="Matieres" value={stats.matieres} />
        <StatCard icon="👨‍🏫" label="Professeurs" value={stats.profs} />
      </div>
      <p style={{ color: 'var(--text-secondary)' }}>
        Bienvenue, {user.prenom}. Utilise les onglets ci-dessus pour gerer les comptes, les classes,
        les matieres, les enseignements, les creneaux, les eleves et les mesures disciplinaires.
      </p>
    </div>
  );

  const tabs = [
    { label: 'Accueil', content: ongletAccueil },
    { label: 'Comptes', content: <GestionComptes /> },
    { label: 'Classes', content: <GestionClasses /> },
    { label: 'Matieres', content: <GestionMatieres /> },
    { label: 'Enseignements', content: <GestionEnseignements /> },
    { label: 'Creneaux', content: <GestionCreneaux /> },
    { label: 'Calendrier', content: <AdminCalendrier /> },
    { label: 'Eleves', content: <GestionEleves /> },
    { label: 'Absences', content: <GestionAbsences /> },
    { label: 'Profils', content: <GestionProfils /> },
    { label: 'Contenu', content: <GestionContenu /> },
    { label: 'Discipline', content: <GestionDiscipline /> },
  ];

  return (
    <div style={{ padding: 20, maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1>Dashboard Admin</h1>
        <div>
          <span style={{ color: 'var(--text-secondary)' }}>
            {user.prenom} {user.nom}
          </span>
          <button onClick={logout} style={{ marginLeft: 12 }}>Deconnexion</button>
        </div>
      </div>
      <Tabs tabs={tabs} />
    </div>
  );
}