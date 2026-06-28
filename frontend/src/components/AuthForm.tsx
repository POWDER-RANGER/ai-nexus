import { useState } from 'react';

interface Props {
  onAuth: (token: string, username: string) => void;
  apiUrl: string;
}

export default function AuthForm({ onAuth, apiUrl }: Props) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${apiUrl}/auth/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error?.message || 'Authentication failed');
      }

      onAuth(data.token, data.user.username);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: '480px', margin: '4rem auto' }}>
      <div className="badge" style={{ marginBottom: '1.5rem' }}>
        <span className="pulse"></span> Prototype — Under Active Development
      </div>

      <h2 style={{ marginBottom: '0.5rem', fontSize: '1.5rem' }}>
        Welcome to AI Nexus
      </h2>
      <p style={{ color: 'var(--dim)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Sign in or create an account to try the query prototype.
      </p>

      <div className="auth-tabs">
        <button
          className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
          onClick={() => { setMode('login'); setError(''); }}
        >
          Sign In
        </button>
        <button
          className={`auth-tab ${mode === 'register' ? 'active' : ''}`}
          onClick={() => { setMode('register'); setError(''); }}
        >
          Create Account
        </button>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="input-group">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            required
            minLength={3}
          />
        </div>

        <div className="input-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={mode === 'register' ? 'Min 8 characters' : 'Enter password'}
            required
            minLength={mode === 'register' ? 8 : 1}
          />
        </div>

        {error && <div className="error">{error}</div>}

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? '...' : mode === 'login' ? 'Sign In' : 'Create Account'}
        </button>
      </form>
    </div>
  );
}
