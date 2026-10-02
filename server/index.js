/**
 * index.js — Express server entry point
 * StringArt ERN Stack Backend
 */

import express from 'express';
import cors from 'cors';
import generateRouter from './routes/generate.js';

const app = express();
const PORT = process.env.PORT || 3001;

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  exposedHeaders: ['X-Preview-Data', 'Content-Disposition'],
}));
app.use(express.json({ limit: '1mb' }));

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api', generateRouter);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', version: '1.0.0', engine: 'StringArt JS' });
});

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`╔══════════════════════════════════════════╗`);
  console.log(`║   StringArt Server  →  http://localhost:${PORT} ║`);
  console.log(`╚══════════════════════════════════════════╝`);
});

export default app;
