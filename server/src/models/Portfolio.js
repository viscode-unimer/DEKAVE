const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category: { type: String, enum: ['Branding', 'Illustration', 'UI/UX', 'Photography', 'Motion'], required: true },
  images: [{ type: String }],
  creator: { type: String, required: true, trim: true },
  tags: [{ type: String }],
  isFeatured: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Portfolio', portfolioSchema);
