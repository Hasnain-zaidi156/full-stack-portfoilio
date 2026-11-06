import express from 'express';
import Image from '../models/Image.js';

const router = express.Router();

// GET /api/images — saari saved pics ki list
router.get('/', async (req, res) => {
  try {
    const rows = await Image.find({}, 'key filename contentType size').sort('key').lean();
    res.json({
      success: true,
      images: rows.map((r) => ({ ...r, url: `/api/images/${encodeURIComponent(r.key)}` })),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not load images' });
  }
});

// GET /api/images/:key — ek pic seedha (img src mein use kar sakte ho)
router.get('/:key', async (req, res) => {
  try {
    const doc = await Image.findOne({ key: req.params.key }).select('+data contentType');
    if (!doc) return res.status(404).json({ success: false, message: 'Not found' });
    res.set('Content-Type', doc.contentType);
    res.set('Cache-Control', 'public, max-age=86400');
    res.send(doc.data);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not load image' });
  }
});

export default router;
