import request from 'supertest';
import app from '../backend/src';
import { getDb, initDb } from '../backend/src/db';

// Test database
process.env.DATABASE_URL = 'file:./data/test.db';
process.env.JWT_SECRET = 'test-secret-key-minimum-32-characters-long';

beforeAll(async () => {
  await initDb();
});

afterAll(() => {
  // Cleanup test database
  const db = getDb();
  db.exec('DELETE FROM queries');
  db.exec('DELETE FROM users');
});

describe('AI Nexus Backend API', () => {
  describe('GET /api/health', () => {
    it('should return status ok', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
      expect(res.body.version).toBe('0.1.0');
      expect(res.body.prototype).toBe(true);
    });
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ username: 'testuser', password: 'password123' });

      expect(res.status).toBe(201);
      expect(res.body.token).toBeDefined();
      expect(res.body.user.username).toBe('testuser');
    });

    it('should reject duplicate username', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ username: 'testuser', password: 'password123' });

      expect(res.status).toBe(409);
    });

    it('should validate password length', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ username: 'newuser', password: 'short' });

      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ username: 'testuser', password: 'password123' });

      expect(res.status).toBe(200);
      expect(res.body.token).toBeDefined();
    });

    it('should reject invalid password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ username: 'testuser', password: 'wrongpassword' });

      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/query', () => {
    let token: string;

    beforeAll(async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ username: 'testuser', password: 'password123' });
      token = res.body.token;
    });

    it('should require authentication', async () => {
      const res = await request(app)
        .post('/api/query')
        .send({ prompt: 'Hello' });

      expect(res.status).toBe(401);
    });

    it('should process a query with valid token', async () => {
      const res = await request(app)
        .post('/api/query')
        .set('Authorization', `Bearer ${token}`)
        .send({ prompt: 'Explain quantum computing' });

      expect(res.status).toBe(200);
      expect(res.body.id).toBeDefined();
      expect(res.body.response).toBeDefined();
      expect(res.body.status).toBe('completed');
    });

    it('should validate empty prompt', async () => {
      const res = await request(app)
        .post('/api/query')
        .set('Authorization', `Bearer ${token}`)
        .send({ prompt: '' });

      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/queries', () => {
    let token: string;

    beforeAll(async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ username: 'testuser', password: 'password123' });
      token = res.body.token;
    });

    it('should return query history', async () => {
      const res = await request(app)
        .get('/api/queries')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.queries)).toBe(true);
      expect(res.body.pagination).toBeDefined();
    });
  });
});
