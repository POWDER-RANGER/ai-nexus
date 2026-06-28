import { useState, useEffect } from 'react';
import AuthForm from './components/AuthForm';
import QueryForm from './components/QueryForm';
import QueryHistory from './components/QueryHistory';

const API_URL = import.meta.env.VITE_API_URL ?? '/api';

function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [username, setUsername] = useState<string | null>(localStorage.getItem('username'));
  const [health, setHealth] = useState<{ status: string; version: string } | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/health`)
      .then((r) => r.json())
      .then((data) => setHealth(data))
      .catch(() => setHealth({ status: 'offline', version: 'unknown' }));
  }, []);

  const handleAuth = (newToken: string, newUsername: string) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('username', newUsername);
    setToken(newToken);
    setUsername(newUsername);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setToken(null);
    setUsername(null);
  };

  return (
    <div>
      <nav className="nav">
        <div className="nav-brand">
          AI<span>Nexus</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {health && (
            <span className="badge">
              <span className="pulse"></span>
              {health.status === 'ok' ? 'API Online' : 'API Offline'}
            </span>
          )}
          {username && (
            <>
              <span style={{ color: 'var(--dim)', fontSize: '0.8rem' }}>{username}</span>
              <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.65rem' }}>
                Logout
              </button>
            </>
          )}
        </div>
      </nav>

      <div className="container" style={{ paddingTop: '2rem' }}>
        {!token ? (
          <AuthForm onAuth={handleAuth} apiUrl={API_URL} />
        ) : (
          <>
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h2>New Query</h2>
                <span className="badge" style={{ fontSize: '0.6rem' }}>Mock LLM Mode</span>
              </div>
              <QueryForm token={token} apiUrl={API_URL} />
            </div>

            <div className="card">
              <h2>Query History</h2>
              <QueryHistory token={token} apiUrl={API_URL} />
            </div>
          </>
        )}
      </div>

      <footer className="footer">
        <p>AI Nexus v0.1.0 — Prototype Under Active Development</p>
        <p style={{ marginTop: '0.5rem', opacity: 0.5 }}>
          Local LLM inference coming soon • WebAssembly • WebGPU
        </p>
      </footer>
    </div>
  );
}

export default App;
