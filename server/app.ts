import express, { Request, Response, NextFunction } from 'express';
import { config } from './config/cashfree.config.ts';
import paymentRoutes from './routes/payment.routes.ts';
import productRoutes from './routes/product.routes.ts';

const app = express();

// 1. CORS headers middleware
app.use((_req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-client-id, x-client-secret, x-api-version, x-webhook-signature, x-webhook-timestamp'
  );
  if (_req.method === 'OPTIONS') {
    res.sendStatus(204);
    return;
  }
  next();
});

// 2. Request body parsers (with rawBody retention for Cashfree webhook signature verification)
app.use(
  express.json({
    verify: (req: any, _res: any, buf: Buffer) => {
      req.rawBody = buf ? buf.toString('utf8') : '';
    },
  })
);
app.use(express.urlencoded({ extended: true }));

// 3. Request logger for API calls
app.use((req: Request, _res: Response, next: NextFunction) => {
  if (req.url.startsWith('/api')) {
    console.log(`[API ${new Date().toISOString()}] ${req.method} ${req.url}`);
  }
  next();
});

// 4. System Healthcheck endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Blueblends Backend & Cashfree Payment Gateway',
    environment: config.environment.toLowerCase(),
    cashfreeConfigured: config.isConfigured,
    apiVersion: config.apiVersion,
  });
});

// 5. Mount API Routes
app.use('/api/payment', paymentRoutes);
app.use('/api/products', productRoutes);

// 6. API Error handler
app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  if (req.url.startsWith('/api')) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[API Error]:', err);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? message : undefined,
    });
    return;
  }
  next(err);
});

export default app;
