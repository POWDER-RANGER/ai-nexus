import Database from 'better-sqlite3';
import { join } from 'path';

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    throw new Error('Database not initialized. Call initDb() first.');
  }
  return db;
}

export async function initDb(): Promise<void> {
  const dbPath = process.env.DATABASE_URL?.replace('file:', '') ?? './data/ai-nexus.db';

  // Ensure directory exists
  const fs = await import('fs');
  const dir = join(process.cwd(), 'data');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  db = new Database(dbPath);
  db.pragma('journal_mode = WAL');

  // Create tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS queries (
      id TEXT PRIMARY KEY,
      prompt TEXT NOT NULL,
      response TEXT,
      model TEXT DEFAULT 'mock-llm',
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      completed_at DATETIME
    );

    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_queries_created ON queries(created_at DESC);
  `);

  console.log('✅ SQLite database initialized');
}
