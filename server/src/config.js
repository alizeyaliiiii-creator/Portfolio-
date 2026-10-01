import 'dotenv/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const isProd = process.env.NODE_ENV === 'production';

if (isProd && (!process.env.JWT_SECRET || !process.env.ADMIN_PASSWORD)) {
  throw new Error('JWT_SECRET and ADMIN_PASSWORD must be set in production');
}

export const config = {
  isProd,
  port: Number(process.env.PORT) || 4000,
  jwtSecret: process.env.JWT_SECRET || 'dev-only-secret',
  adminPassword: process.env.ADMIN_PASSWORD || 'admin',
  dbPath: process.env.DATABASE_PATH || path.resolve(root, '../data/portfolio.db'),
  corsOrigins: (process.env.CORS_ORIGIN || 'http://localhost:5173').split(',').map((s) => s.trim()),
  clientDist: path.resolve(root, '../../client/dist'),
  smtp: process.env.SMTP_HOST
    ? {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      }
    : null,
  notifyTo: process.env.NOTIFY_TO || 'alizeyaliiiii@gmail.com',
};
