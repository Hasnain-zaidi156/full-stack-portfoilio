import crypto from 'crypto';
import express from 'express';
import mongoose from 'mongoose';
import rateLimit from 'express-rate-limit';
import Feedback from '../models/Feedback.js';

const router = express.Router();

// Har IP: 40 write requests / 10 minutes (spam se bachao)
const writeLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 40,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please try again later.' },
});

// Admin login ke liye zyada tight limit (password guessing na ho sake)
const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many attempts. Try again later.' },
});

// DB connected hai ya nahi — warna saaf error do
function requireDb(req, res, next) {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ success: false, message: 'Database not connected.' });
  }
  next();
}

const clean = (id = '') => String(id).toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 80);

// timing-safe string compare (dono same length honi chahiye warna crypto.timingSafeEqual crash karta hai)
function safeEqual(a = '', b = '') {
  const bufA = Buffer.from(String(a));
  const bufB = Buffer.from(String(b));
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

function isAdminRequest(req) {
  const key = req.headers['x-admin-key'];
  if (!key || !process.env.ADMIN_KEY) return false;
  return safeEqual(key, process.env.ADMIN_KEY);
}

// ---- Admin login (password verify — key kabhi response me wapis nahi jaati) ----
router.post('/admin/verify', adminLimiter, (req, res) => {
  const key = String(req.body?.key || '');
  if (!process.env.ADMIN_KEY) {
    return res.status(503).json({ success: false, message: 'Admin login not configured on server.' });
  }
  if (!key || !safeEqual(key, process.env.ADMIN_KEY)) {
    return res.status(401).json({ success: false, message: 'Wrong admin key.' });
  }
  res.json({ success: true });
});

// GET /api/feedback  → saare projects ka data ek saath (ownerToken kabhi shamil nahi hota)
router.get('/', requireDb, async (req, res) => {
  try {
    const docs = await Feedback.find({}).lean();
    const data = {};
    docs.forEach((d) => {
      data[d.projectId] = {
        likes: d.likes || 0,
        comments: (d.comments || []).map((c) => ({
          id: c._id.toString(),
          name: c.name,
          text: c.text,
          at: new Date(c.createdAt).getTime(),
        })),
      };
    });
    res.json({ success: true, data });
  } catch (err) {
    console.error('feedback GET error:', err.message);
    res.status(500).json({ success: false, message: 'Could not load feedback.' });
  }
});

// POST /api/feedback/:projectId/like   body: { action: 'like' | 'unlike' }
router.post('/:projectId/like', writeLimiter, requireDb, async (req, res) => {
  const projectId = clean(req.params.projectId);
  if (!projectId) return res.status(400).json({ success: false, message: 'Invalid project.' });

  const delta = req.body?.action === 'unlike' ? -1 : 1;

  try {
    let doc = await Feedback.findOneAndUpdate(
      { projectId },
      { $inc: { likes: delta }, $setOnInsert: { comments: [] } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    // negative na ho jaye
    if (doc.likes < 0) {
      doc.likes = 0;
      await doc.save();
    }

    res.json({ success: true, likes: doc.likes });
  } catch (err) {
    console.error('like error:', err.message);
    res.status(500).json({ success: false, message: 'Could not update like.' });
  }
});

// POST /api/feedback/:projectId/comments   body: { name, text }
router.post('/:projectId/comments', writeLimiter, requireDb, async (req, res) => {
  const projectId = clean(req.params.projectId);
  const name = String(req.body?.name || '').trim().slice(0, 40);
  const text = String(req.body?.text || '').trim().slice(0, 400);

  if (!projectId) return res.status(400).json({ success: false, message: 'Invalid project.' });
  if (!name) return res.status(400).json({ success: false, message: 'Name is required.' });
  if (text.length < 2) return res.status(400).json({ success: false, message: 'Comment is too short.' });

  const ownerToken = crypto.randomBytes(20).toString('hex');

  try {
    const doc = await Feedback.findOneAndUpdate(
      { projectId },
      { $push: { comments: { name, text, ownerToken } } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    const last = doc.comments[doc.comments.length - 1];
    res.status(201).json({
      success: true,
      comment: {
        id: last._id.toString(),
        name: last.name,
        text: last.text,
        at: new Date(last.createdAt).getTime(),
        ownerToken, // sirf isi response me — frontend ye khud save kar leta hai
      },
      total: doc.comments.length,
    });
  } catch (err) {
    console.error('comment error:', err.message);
    res.status(500).json({ success: false, message: 'Could not post comment.' });
  }
});

// DELETE /api/feedback/:projectId/comments/:commentId
// body: { ownerToken }  — apna comment delete karne ke liye
// header: x-admin-key   — admin ke liye, koi bhi comment delete kar sakta hai
router.delete('/:projectId/comments/:commentId', writeLimiter, requireDb, async (req, res) => {
  const projectId = clean(req.params.projectId);
  const { commentId } = req.params;
  const admin = isAdminRequest(req);

  if (!mongoose.isValidObjectId(commentId)) {
    return res.status(400).json({ success: false, message: 'Invalid comment id.' });
  }

  try {
    if (!admin) {
      // Admin nahi hai to token match hona zaroori hai
      const ownerToken = String(req.body?.ownerToken || '');
      const doc = await Feedback.findOne(
        { projectId, 'comments._id': commentId },
        { 'comments.$': 1 }
      ).select('+comments.ownerToken');

      const found = doc?.comments?.[0];
      if (!found) return res.status(404).json({ success: false, message: 'Not found.' });
      if (!ownerToken || !safeEqual(ownerToken, found.ownerToken)) {
        return res.status(403).json({ success: false, message: 'Not allowed to delete this comment.' });
      }
    }

    const doc = await Feedback.findOneAndUpdate(
      { projectId },
      { $pull: { comments: { _id: commentId } } },
      { new: true }
    );
    if (!doc) return res.status(404).json({ success: false, message: 'Not found.' });
    res.json({ success: true, total: doc.comments.length });
  } catch (err) {
    console.error('delete comment error:', err.message);
    res.status(500).json({ success: false, message: 'Could not delete comment.' });
  }
});

export default router;
