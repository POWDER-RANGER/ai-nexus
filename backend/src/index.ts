import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { initDb } from './db';
import apiRouter from './routes/api';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT ?? 3000);

// Security middleware
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN ?? 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '1mb' }));

// Request ID
app.use((req: any, _res, next) => {
  req.id = crypto.randomUUID();
  next();
});

// ── Routes
app.use('/api', apiRouter);

// ── Error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[ERROR]', err.message);
  res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
    },
  });
});

// ── Boot
async function start() {
  await initDb();

  app.listen(PORT, () => {
    console.log(`🚀 AI Nexus Backend → http://localhost:${PORT}`);
    console.log(`   Health           → http://localhost:${PORT}/api/health`);
    console.log(`   Query            → POST http://localhost:${PORT}/api/query`);
  });
}

start().catch((err) => {
  console.error('❌ Startup failed:', err);
  process.exit(1);
});

export default app;
