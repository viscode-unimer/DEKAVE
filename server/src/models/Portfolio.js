const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category: { type: String, enum: ['Desain Grafis & Poster', 'Fotografi & Dokumentasi', 'Videografi & Sinematik', 'Konten Media & Publikasi', 'Desain', 'Photography', 'Videography', 'Public Relation', 'Branding', 'Illustration', 'UI/UX', 'Motion'], required: true },
  images: [{ type: String }],
  creator: { type: String, required: true, trim: true },
  videoUrl: { type: String, default: '', trim: true },
  videoType: { type: String, enum: ['youtube', 'instagram', 'other', 'none', ''], default: 'none' },
  tags: [{ type: String }],
  isFeatured: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Portfolio', portfolioSchema);
