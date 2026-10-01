import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { contactSchema } from '../schemas.js';

export function publicRoutes({ db, notify }) {
  const r = Router();

  r.get('/health', (_req, res) => res.json({ ok: true }));

  r.get('/content', (_req, res) => {
    const row = db.prepare('SELECT data FROM content WHERE id = 1').get();
    res.set('Cache-Control', 'public, max-age=60');
    res.json(JSON.parse(row.data));
  });

  const contactLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many messages, please try again later.' },
  });

  r.post('/contact', contactLimiter, async (req, res) => {
    const parsed = contactSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid input', details: parsed.error.flatten().fieldErrors });
    const { name, email, message, website } = parsed.data;
    // Bots fill the hidden field: pretend success, store nothing.
    if (website) return res.status(201).json({ ok: true });

    db.prepare('INSERT INTO messages (name, email, message) VALUES (?, ?, ?)').run(name, email, message);
    notify({ name, email, message }).catch((err) => console.error('Mail notify failed:', err.message));
    res.status(201).json({ ok: true });
  });

  return r;
}
