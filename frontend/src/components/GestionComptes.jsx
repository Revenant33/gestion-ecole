import { useState, useEffect } from 'react';
import { registerCompte } from '../services/authAdminService';
import { getClasses } from '../services/classeService';

export default function GestionComptes() {
  const [classes, setClasses] = useState([]);
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('ELEVE');
  const [classeId, setClasseId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    getClasses().then(setClasses);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (role === 'ELEVE' && !classeId) {
      setError('Choisis une classe pour cet eleve');
      return;
    }

    try {
      await registerCompte({
        nom,
        prenom,
        email,
        password,
        role,
        classeId: role === 'ELEVE' ? classeId : null,
      });
      setSuccess(`Compte ${role} cree avec succes pour ${prenom} ${nom}`);
      setNom('');
      setPrenom('');
      setEmail('');
      setPassword('');
      setClasseId('');
    } catch (err) {
      setError('Erreur lors de la creation (email deja utilise ?)');
    }
  };

  return (
    <div>
      <h2>Creer un compte</h2>
      <form onSubmit={handleSubmit}>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="ELEVE">Eleve</option>
          <option value="PROFESSEUR">Professeur</option>
          <option value="ADMIN">Admin</option>
        </select>
        <input
          placeholder="Nom"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          required
        />
        <input
          placeholder="Prenom"
          value={prenom}
          onChange={(e) => setPrenom(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {role === 'ELEVE' && (
          <select value={classeId} onChange={(e) => setClasseId(e.target.value)} required>
            <option value="">Choisir une classe</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>{c.nom}</option>
            ))}
          </select>
        )}

        <button type="submit">Creer le compte</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
  );
}