import { useState, useEffect } from 'react';
import { getUsers, updateUser } from '../services/userAdminService';
import { getClasses } from '../services/classeService';

export default function GestionProfils() {
  const [users, setUsers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [roleFiltre, setRoleFiltre] = useState('');
  const [recherche, setRecherche] = useState('');
  const [edition, setEdition] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const charger = async (role = roleFiltre) => {
    try {
      setUsers(await getUsers(role));
    } catch (err) {
      setError('Erreur lors du chargement des utilisateurs');
    }
  };

  useEffect(() => {
    charger('');
    getClasses().then(setClasses);
  }, []);

  const handleRoleChange = (role) => {
    setRoleFiltre(role);
    charger(role);
  };

  const ouvrirEdition = (u) => {
    setSuccess('');
    setError('');
    setEdition({
      id: u.id,
      role: u.role,
      nom: u.nom,
      prenom: u.prenom,
      email: u.email,
      password: '',
      photoUrl: u.photoUrl || '',
      classeId: u.classe?.id || '',
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await updateUser(edition.id, {
        nom: edition.nom,
        prenom: edition.prenom,
        email: edition.email,
        password: edition.password,
        photoUrl: edition.photoUrl,
        classeId: edition.role === 'ELEVE' ? String(edition.classeId) : null,
      });
      setSuccess('Profil mis a jour');
      setEdition(null);
      charger();
    } catch (err) {
      setError(err.response?.status === 409 ? 'Cet email est deja utilise' : 'Erreur lors de la mise a jour');
    }
  };

  const filtres = users.filter((u) =>
    `${u.prenom} ${u.nom} ${u.email}`.toLowerCase().includes(recherche.toLowerCase())
  );

  return (
    <div>
      <h2>Profils utilisateurs</h2>

      <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
        <select value={roleFiltre} onChange={(e) => handleRoleChange(e.target.value)}>
          <option value="">Tous les roles</option>
          <option value="ELEVE">Eleves</option>
          <option value="PROFESSEUR">Professeurs</option>
          <option value="ADMIN">Admins</option>
        </select>
        <input
          placeholder="Rechercher (nom, email)"
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
          style={{ flex: 1 }}
        />
      </div>

      {error && <p style={{ color: 'var(--danger)' }}>{error}</p>}
      {success && <p style={{ color: 'var(--success)' }}>{success}</p>}

      {edition && (
        <form onSubmit={handleSave} style={{ border: '1px solid var(--brand)' }}>
          <h3 style={{ marginTop: 0 }}>Modifier {edition.prenom} {edition.nom} ({edition.role})</h3>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <input placeholder="Nom" value={edition.nom}
              onChange={(e) => setEdition({ ...edition, nom: e.target.value })} required />
            <input placeholder="Prenom" value={edition.prenom}
              onChange={(e) => setEdition({ ...edition, prenom: e.target.value })} required />
            <input type="email" placeholder="Email" value={edition.email}
              onChange={(e) => setEdition({ ...edition, email: e.target.value })} required />
            <input type="password" placeholder="Nouveau mot de passe (vide = inchange)" value={edition.password}
              onChange={(e) => setEdition({ ...edition, password: e.target.value })} />
            <input placeholder="URL de la photo" value={edition.photoUrl}
              onChange={(e) => setEdition({ ...edition, photoUrl: e.target.value })} />
            {edition.role === 'ELEVE' && (
              <select value={edition.classeId}
                onChange={(e) => setEdition({ ...edition, classeId: e.target.value })} required>
                <option value="">Choisir une classe</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>{c.nom}</option>
                ))}
              </select>
            )}
          </div>
          <div style={{ marginTop: 10 }}>
            <button type="submit" className="btn-primary">Enregistrer</button>
            <button type="button" onClick={() => setEdition(null)}>Annuler</button>
          </div>
        </form>
      )}

      <table>
        <thead>
          <tr><th>Nom</th><th>Prenom</th><th>Email</th><th>Role</th><th>Classe</th><th>Action</th></tr>
        </thead>
        <tbody>
          {filtres.map((u) => (
            <tr key={u.id}>
              <td>{u.nom}</td>
              <td>{u.prenom}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>{u.classe?.nom || '—'}</td>
              <td><button onClick={() => ouvrirEdition(u)}>Modifier</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}