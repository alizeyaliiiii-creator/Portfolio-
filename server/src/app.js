import fs from 'node:fs';
import path from 'node:path';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { publicRoutes } from './routes/public.js';
import { adminRoutes } from './routes/admin.js';

export function createApp({ db, config, notify = async () => {} }) {
  const app = express();
  app.set('trust proxy', 1);
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          ...helmet.contentSecurityPolicy.getDefaultDirectives(),
          // the design loads Google Fonts and a few Unsplash photos
          'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
          'font-src': ["'self'", 'https://fonts.gstatic.com'],
          'img-src': ["'self'", 'data:', 'https://images.unsplash.com'],
        },
      },
    }),
  );
  app.use(cors({ origin: config.corsOrigins }));
  app.use(express.json({ limit: '100kb' }));

  app.use('/api', publicRoutes({ db, notify }));
  app.use('/api', adminRoutes({ db, config }));
  app.use('/api', (_req, res) => res.status(404).json({ error: 'Not found' }));

  // Serve the built frontend (client/dist) with SPA fallback
  if (fs.existsSync(config.clientDist)) {
    app.use(express.static(config.clientDist));
    app.use((_req, res) => res.sendFile(path.join(config.clientDist, 'index.html')));
  }

  app.use((err, _req, res, _next) => {
    if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'Invalid JSON' });
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  });
  return app;
}
