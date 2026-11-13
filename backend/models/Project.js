import mongoose from 'mongoose';

// Portfolio ke projects — admin panel se add / edit / delete hote hain.
const projectSchema = new mongoose.Schema(
  {
    // Likes/comments isi slug se bandhe hain (Feedback.projectId) — create hone ke baad change nahi hota
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 80 },
    desc: { type: String, default: '', trim: true, maxlength: 600 },
    tags: { type: [String], default: [] },
    category: { type: String, enum: ['Websites', 'Tools & Apps'], default: 'Websites' },
    // pic: ya to koi bhi URL, ya upload ki hui pic ka URL (/api/images/<key>)
    img: { type: String, default: '', trim: true, maxlength: 600 },
    imgKey: { type: String, default: '' }, // upload ki hui pic ki Image.key (delete/replace ke liye)
    demo: { type: String, default: '', trim: true, maxlength: 400 },
    github: { type: String, default: '', trim: true, maxlength: 400 },
    placeholder: { type: String, default: '' }, // pic na ho to icon: cart, document, food...
    order: { type: Number, default: 0, index: true },
  },
  { timestamps: true }
);

export default mongoose.model('Project', projectSchema);
