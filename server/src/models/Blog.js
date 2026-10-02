const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  thumbnail: { type: String },
  author: { type: String, required: true },
  division: { type: String, default: '' },
  tags: [{ type: String }],
  isPublished: { type: Boolean, default: false },
}, { timestamps: true });

blogSchema.pre('validate', function (next) {
  if (this.title) {
    this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  next();
});

module.exports = mongoose.model('Blog', blogSchema);
