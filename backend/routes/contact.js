import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { sendOwnerNotification, sendAutoReply } from '../utils/mailer.js';

const router = Router();

// Max 5 messages per 15 minutes per IP
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, message: 'Too many messages sent. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[0-9+\-\s()]{7,20}$/;

router.post('/', contactLimiter, async (req, res) => {
  try {
    const { name, email, phone, subject, message, hp_token } = req.body || {};

    // Honeypot: real users never fill this hidden field. If it's filled, silently
    // pretend success so bots don't learn to look for a different signal.
    if (hp_token) {
      return res.status(200).json({ success: true, message: 'Message sent successfully!' });
    }

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email and message are required.' });
    }
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
    }
    if (phone && !phoneRegex.test(phone)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid phone number.' });
    }
    if (message.length < 10) {
      return res.status(400).json({ success: false, message: 'Message is too short.' });
    }
    if (message.length > 5000) {
      return res.status(400).json({ success: false, message: 'Message is too long.' });
    }

    await sendOwnerNotification({ name, email, phone, subject, message });

    // Auto-reply is best-effort; don't fail the request if it errors
    sendAutoReply({ name, email }).catch((err) =>
      console.error('Auto-reply failed:', err.message)
    );

    return res.status(200).json({ success: true, message: 'Message sent successfully!' });
  } catch (err) {
    console.error('Contact form error:', err);
    return res.status(500).json({ success: false, message: 'Something went wrong. Please try again later.' });
  }
});

export default router;
