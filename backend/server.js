import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import contactRoute from './routes/contact.js';
import { verifyMailer } from './utils/mailer.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Render (and most hosts) sit behind a reverse proxy that sets X-Forwarded-For;
// trust the first hop so express-rate-limit can identify clients correctly.
app.set('trust proxy', 1);

const allowedOrigins = (process.env.FRONTEND_URL || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (curl, server-to-server, health checks)
      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
  })
);

app.use(express.json({ limit: '50kb' }));

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Portfolio backend is running' });
});

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/contact', contactRoute);

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Not found' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  verifyMailer();
});
