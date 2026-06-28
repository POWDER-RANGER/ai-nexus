import { useState, useEffect } from 'react';

interface Props {
  token: string;
  apiUrl: string;
}

interface Query {
  id: string;
  prompt: string;
  response: string;
  model: string;
  status: string;
  created_at: string;
}

export default function QueryHistory({ token, apiUrl }: Props) {
  const [queries, setQueries] = useState<Query[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchQueries = async () => {
    try {
      const res = await fetch(`${apiUrl}/queries?limit=20`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error?.message || 'Failed to fetch history');
      }

      setQueries(data.queries);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueries();
    const interval = setInterval(fetchQueries, 10000);
    return () => clearInterval(interval);
  }, [token, apiUrl]);

  if (loading) return <p style={{ color: 'var(--dim)', fontSize: '0.85rem' }}>Loading history...</p>;
  if (error) return <div className="error">{error}</div>;
  if (queries.length === 0) return <p style={{ color: 'var(--dim)', fontSize: '0.85rem' }}>No queries yet. Submit your first question above.</p>;

  return (
    <ul className="query-list">
      {queries.map((q) => (
        <li key={q.id} className="query-item">
          <div className="prompt">{q.prompt}</div>
          <div className="meta">
            {q.model} • {q.status} • {new Date(q.created_at).toLocaleString()}
          </div>
        </li>
      ))}
    </ul>
  );
}
