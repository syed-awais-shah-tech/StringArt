/**
 * index.js — Express server entry point
 * StringArt ERN Stack Backend
 */

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import generateRouter from './routes/generate.js';
import ordersRouter from './routes/orders.js';
import adminRouter from './routes/admin.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  exposedHeaders: ['X-Preview-Data', 'Content-Disposition'],
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve saved order uploads statically if needed
app.use('/data', express.static(path.join(__dirname, 'data')));

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api', generateRouter);
app.use('/api', ordersRouter);
app.use('/api/admin', adminRouter);

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
