import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import contactRoute from './routes/contact.js';
import feedbackRoute from './routes/feedback.js';
import imagesRoute from './routes/images.js';
import projectsRoute from './routes/projects.js';
import { verifyMailer } from './utils/mailer.js';

const app = express();
const PORT = process.env.PORT || 5000;
const ON_VERCEL = !!process.env.VERCEL;

// Vercel / proxy ke peeche X-Forwarded-For set hota hai (express-rate-limit ke liye)
app.set('trust proxy', 1);

const norm = (o) => o.trim().replace(/\/+$/, ''); // aakhir ka "/" hata do
const allowedOrigins = (process.env.FRONTEND_URL || '').split(',').map(norm).filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // origin nahi (curl, health check) ya allowlist khali => allow
      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
  })
);

// ---- MongoDB ----
// Serverless mein har request nayi instance par aa sakti hai, isliye connection cache hota hai
// aur har request se pehle (agar zaroorat ho) connect hone ka intezar karte hain.
let dbPromise = null;
function connectDb() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.warn('MONGO_URI missing — database features will not work.');
    return Promise.resolve();
  }
  if (mongoose.connection.readyState === 1) return Promise.resolve();
  if (!dbPromise) {
    dbPromise = mongoose
      .connect(uri, { serverSelectionTimeoutMS: 8000, maxPoolSize: 5 })
      .then(() => console.log('MongoDB connected'))
      .catch((err) => {
        dbPromise = null; // agli request dobara koshish kare
        console.error('MongoDB connection failed:', err.message);
      });
  }
  return dbPromise;
}

app.use(async (req, res, next) => {
  await connectDb();
  next();
});

// Projects route ka apna bada body limit (pic upload base64 mein aati hai) — global parser se PEHLE
app.use('/api/projects', express.json({ limit: '6mb' }), projectsRoute);

app.use(express.json({ limit: '50kb' }));

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Portfolio backend is running' });
});

app.get('/health', (req, res) =>
  res.json({ status: 'ok', db: mongoose.connection.readyState === 1 ? 'connected' : 'down' })
);

app.use('/api/contact', contactRoute);
app.use('/api/feedback', feedbackRoute);
app.use('/api/images', imagesRoute);

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Not found' });
});

// CORS ya koi aur error — JSON mein wapis do
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  console.error(err.message);
  res.status(err.status || 500).json({ success: false, message: err.message || 'Server error' });
});

// Local / Render par server chalao; Vercel par app export hota hai (api/index.js se)
if (!ON_VERCEL) {
  connectDb();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    verifyMailer();
  });
}

export default app;
