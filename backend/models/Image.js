import mongoose from 'mongoose';

// Portfolio ki pictures DB mein (binary) — `npm run images` yahan upsert karta hai.
const imageSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, index: true }, // file ka naam bina extension
    filename: { type: String, required: true },
    contentType: { type: String, required: true },
    size: { type: Number, required: true },
    data: { type: Buffer, required: true, select: false }, // list mein heavy data nahi jata
  },
  { timestamps: true }
);

export default mongoose.model('Image', imageSchema);
