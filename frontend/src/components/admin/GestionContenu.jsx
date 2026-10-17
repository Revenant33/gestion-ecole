import Tabs from '../Tabs';
import AdminNotes from './AdminNotes';
import AdminPublications from './AdminPublications';

export default function GestionContenu() {
  return (
    <div>
      <h2>Contenu pedagogique</h2>
      <Tabs
        tabs={[
          { label: 'Notes', content: <AdminNotes /> },
          { label: 'Cours & exercices', content: <AdminPublications /> },
        ]}
      />
    </div>
  );
}