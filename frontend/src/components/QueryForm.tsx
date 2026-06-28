import { useState } from 'react';

interface Props {
  token: string;
  apiUrl: string;
}

interface QueryResponse {
  id: string;
  prompt: string;
  response: string;
  model: string;
  status: string;
  created_at: string;
}

export default function QueryForm({ token, apiUrl }: Props) {
  const [prompt, setPrompt] = useState('');
  const [model, setModel] = useState('mock-llm');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<QueryResponse | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch(`${apiUrl}/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ prompt, model }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error?.message || 'Query failed');
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="input-group">
        <label>Your Question</label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask anything... (e.g., 'Explain quantum computing in simple terms')"
          required
          maxLength={4000}
        />
      </div>

      <div className="input-group">
        <label>Model</label>
        <select value={model} onChange={(e) => setModel(e.target.value)}>
          <option value="mock-llm">Mock LLM (General)</option>
          <option value="mock-coder">Mock Code Assistant</option>
        </select>
      </div>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Processing...' : 'Submit Query'}
        </button>
        {loading && <span style={{ color: 'var(--dim)', fontSize: '0.8rem' }}>Generating mock response...</span>}
      </div>

      {error && <div className="error">{error}</div>}

      {result && (
        <div>
          <div className="success" style={{ marginTop: '1rem' }}>
            ✅ Response generated in {result.model} mode
          </div>
          <div className="response-box">{result.response}</div>
        </div>
      )}
    </form>
  );
}
