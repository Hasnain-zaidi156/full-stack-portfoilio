import crypto from 'crypto';

// timing-safe compare
export function safeEqual(a = '', b = '') {
  const bufA = Buffer.from(String(a));
  const bufB = Buffer.from(String(b));
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

// Middleware: header `x-admin-key` ADMIN_KEY (env) se match honi chahiye
export function requireAdmin(req, res, next) {
  const key = req.headers['x-admin-key'];
  if (!process.env.ADMIN_KEY) {
    return res.status(503).json({ success: false, message: 'Admin login not configured on server.' });
  }
  if (!key || !safeEqual(key, process.env.ADMIN_KEY)) {
    return res.status(401).json({ success: false, message: 'Admin key galat hai.' });
  }
  next();
}
