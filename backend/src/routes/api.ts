import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { getDb } from '../db';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET ?? 'dev-secret-change-in-production';

// ── Validation schemas
const querySchema = z.object({
  prompt: z.string().min(1).max(4000),
  model: z.enum(['mock-llm', 'mock-coder']).default('mock-llm'),
});

// ── Auth middleware
function requireAuth(req: any, res: Response, next: Function) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) {
    return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Bearer token required' } });
  }

  try {
    const token = auth.slice(7);
    req.user = jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] });
    next();
  } catch {
    return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Invalid or expired token' } });
  }
}

// ── Mock response generator
function generateMockResponse(prompt: string, model: string): string {
  if (model === 'mock-coder') {
    return `// AI Nexus Code Assistant (MOCK)\n// Prompt: "${prompt.substring(0, 50)}..."\n\nfunction example() {\n  console.log('Hello from AI Nexus code assistant!');\n  // This is a prototype response.\n  // Real code generation will use local models.\n}\n\nexample();`;
  }
  return `Thank you for your question about "${prompt.substring(0, 50)}${prompt.length > 50 ? '...' : ''}".\n\nThis is a prototype response from AI Nexus. In the full implementation, this will be processed by a local LLM running entirely in your browser via WebAssembly and WebGPU — no data sent to any external server.\n\n**Key features coming:**\n- Local GGUF model inference\n- WebGPU acceleration\n- Complete privacy (no cloud dependencies)\n- Zero subscription fees`;
}

// ── GET /api/health
router.get('/health', (_req, res) => {
  res.json({ status: 'ok', version: '0.1.0', prototype: true });
});

// ── POST /api/auth/register
router.post('/auth/register', async (req, res) => {
  const schema = z.object({
    username: z.string().min(3).max(50),
    password: z.string().min(8),
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', details: parsed.error.format() } });
  }

  const { username, password } = parsed.data;
  const db = getDb();

  // Check if user exists
  const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(username);
  if (existing) {
    return res.status(409).json({ error: { code: 'CONFLICT', message: 'Username already exists' } });
  }

  const id = uuidv4();
  const passwordHash = await bcrypt.hash(password, 12);

  db.prepare('INSERT INTO users (id, username, password_hash) VALUES (?, ?, ?)').run(id, username, passwordHash);

  const token = jwt.sign({ userId: id, username }, JWT_SECRET, { algorithm: 'HS256', expiresIn: '24h' });
  res.status(201).json({ token, user: { id, username } });
});

// ── POST /api/auth/login
router.post('/auth/login', async (req, res) => {
  const schema = z.object({
    username: z.string(),
    password: z.string(),
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', details: parsed.error.format() } });
  }

  const { username, password } = parsed.data;
  const db = getDb();

  const user = db.prepare('SELECT id, password_hash FROM users WHERE username = ?').get(username) as any;
  if (!user) {
    return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Invalid credentials' } });
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Invalid credentials' } });
  }

  const token = jwt.sign({ userId: user.id, username }, JWT_SECRET, { algorithm: 'HS256', expiresIn: '24h' });
  res.json({ token, user: { id: user.id, username } });
});

// ── POST /api/query (authenticated)
router.post('/query', requireAuth, (req, res) => {
  const parsed = querySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', details: parsed.error.format() } });
  }

  const { prompt, model } = parsed.data;
  const db = getDb();
  const id = uuidv4();

  // Store query
  db.prepare('INSERT INTO queries (id, prompt, status) VALUES (?, ?, ?)').run(id, prompt, 'processing');

  // Generate mock response
  const response = generateMockResponse(prompt, model);

  // Update with response
  db.prepare('UPDATE queries SET response = ?, status = ?, completed_at = CURRENT_TIMESTAMP WHERE id = ?')
    .run(response, 'completed', id);

  res.json({
    id,
    prompt,
    response,
    model,
    status: 'completed',
    created_at: new Date().toISOString(),
  });
});

// ── GET /api/queries (authenticated)
router.get('/queries', requireAuth, (req: any, res) => {
  const db = getDb();
  const limit = Math.min(Number(req.query.limit ?? 20), 100);
  const offset = Number(req.query.offset ?? 0);

  const queries = db.prepare(
    'SELECT id, prompt, response, model, status, created_at, completed_at FROM queries ORDER BY created_at DESC LIMIT ? OFFSET ?'
  ).all(limit, offset);

  const count = (db.prepare('SELECT COUNT(*) as count FROM queries').get() as any).count;

  res.json({ queries, pagination: { total: count, limit, offset } });
});

export default router;
