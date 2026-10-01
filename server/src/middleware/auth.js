import jwt from 'jsonwebtoken';

export function signToken(secret) {
  return jwt.sign({ role: 'admin' }, secret, { expiresIn: '12h' });
}

export function requireAdmin(secret) {
  return (req, res, next) => {
    const header = req.get('authorization') || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    try {
      if (!token) throw new Error('missing');
      jwt.verify(token, secret);
      next();
    } catch {
      res.status(401).json({ error: 'Unauthorized' });
    }
  };
}
