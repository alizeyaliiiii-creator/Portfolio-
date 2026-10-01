import { Router } from 'express';
import bcrypt from 'bcryptjs';
import rateLimit from 'express-rate-limit';
import { contentSchema, loginSchema } from '../schemas.js';
import { requireAdmin, signToken } from '../middleware/auth.js';

export function adminRoutes({ db, config }) {
  const r = Router();
  const passwordHash = bcrypt.hashSync(config.adminPassword, 10);

  const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many login attempts, please try again later.' },
  });

  r.post('/auth/login', loginLimiter, (req, res) => {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success || !bcrypt.compareSync(parsed.data.password, passwordHash)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    res.json({ token: signToken(config.jwtSecret) });
  });

  const guard = requireAdmin(config.jwtSecret);

  r.put('/content', guard, (req, res) => {
    const parsed = contentSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid content', details: parsed.error.flatten() });
    db.prepare("UPDATE content SET data = ?, updated_at = datetime('now') WHERE id = 1").run(JSON.stringify(parsed.data));
    res.json(parsed.data);
  });

  r.get('/messages', guard, (_req, res) => {
    const rows = db.prepare('SELECT id, name, email, message, is_read AS isRead, created_at AS createdAt FROM messages ORDER BY id DESC').all();
    res.json(rows.map((m) => ({ ...m, isRead: Boolean(m.isRead) })));
  });

  r.patch('/messages/:id', guard, (req, res) => {
    const id = Number(req.params.id);
    const isRead = req.body?.isRead === false ? 0 : 1;
    const { changes } = db.prepare('UPDATE messages SET is_read = ? WHERE id = ?').run(isRead, id);
    if (!changes) return res.status(404).json({ error: 'Not found' });
    res.json({ id, isRead: Boolean(isRead) });
  });

  r.delete('/messages/:id', guard, (req, res) => {
    const { changes } = db.prepare('DELETE FROM messages WHERE id = ?').run(Number(req.params.id));
    if (!changes) return res.status(404).json({ error: 'Not found' });
    res.status(204).end();
  });

  return r;
}
