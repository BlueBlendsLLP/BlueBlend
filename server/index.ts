import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import express, { Request, Response, NextFunction } from 'express';
import app from './app.ts';
import { config } from './config/cashfree.config.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files in production if dist directory exists
const cwdDist = path.resolve(process.cwd(), 'dist');
const relDist = path.resolve(__dirname, '../dist');
const distPath = fs.existsSync(cwdDist) ? cwdDist : relDist;
app.use(express.static(distPath));

// In production, delegate any unmatched non-API routes to index.html
app.get('*', (req: Request, res: Response, next: NextFunction) => {
  if (req.path.startsWith('/api')) {
    res.status(404).json({ error: 'Endpoint not found' });
    return;
  }
  const indexPath = path.join(distPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      next();
    }
  });
});

let server: any = null;
if (process.env.NODE_ENV !== 'test') {
  server = app.listen(config.port, '0.0.0.0', () => {
    console.log('====================================================');
    console.log(`  Blueblends Standalone Backend on port ${config.port}`);
    console.log(`  Cashfree Environment: ${config.environment}`);
    console.log(`  Cashfree Configured: ${config.isConfigured ? 'YES (Live API)' : 'NO (Simulated Test Mode)'}`);
    console.log(`  Health Check: http://localhost:${config.port}/api/health`);
    console.log('====================================================');
  });
}

const shutdown = () => {
  if (server) {
    server.close(() => {
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

export default app;
