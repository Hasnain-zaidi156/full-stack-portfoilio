import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 40 },
    text: { type: String, required: true, trim: true, maxlength: 400 },
    // Comment banane wale ko hi pata hota hai — apna comment delete karne ke
    // kaam aata hai. select:false = GET /api/feedback response me kabhi nahi jayega.
    ownerToken: { type: String, required: true, select: false },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const feedbackSchema = new mongoose.Schema({
  projectId: { type: String, required: true, unique: true, index: true },
  likes: { type: Number, default: 0, min: 0 },
  comments: { type: [commentSchema], default: [] },
});

export default mongoose.model('Feedback', feedbackSchema);
