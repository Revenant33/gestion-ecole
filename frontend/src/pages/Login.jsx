import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const authResponse = await login(email, password);
      loginUser(authResponse);
      if (authResponse.role === 'ADMIN') navigate('/admin');
      else if (authResponse.role === 'PROFESSEUR') navigate('/professeur');
      else navigate('/eleve');
    } catch (err) {
      setError('Email ou mot de passe incorrect');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at 30% 20%, rgba(108,142,232,0.08), transparent 50%)',
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: 360,
          background: 'var(--bg-panel)',
          borderTop: '3px solid var(--brand)',
          boxShadow: '0 10px 40px rgba(0,0,0,0.4)',
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            background: 'var(--brand-soft)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 22,
            margin: '0 auto 16px',
          }}
        >
          🎓
        </div>
        <h2 style={{ marginTop: 0, textAlign: 'center' }}>Gestion Ecole</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: 13, marginTop: -8 }}>
          Connectez-vous a votre espace
        </p>

        <div style={{ marginBottom: 10, marginTop: 20 }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%' }}
          />
        </div>
        <div style={{ marginBottom: 14 }}>
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%' }}
          />
        </div>
        {error && <p style={{ color: 'var(--danger)', fontSize: 13 }}>{error}</p>}
        <button type="submit" className="btn-primary" style={{ width: '100%' }}>
          Se connecter
        </button>
      </form>
    </div>
  );
}