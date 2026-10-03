const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  position: { type: String, required: true },
  division: { type: String, required: true },
  photo: { type: String },
  major: { type: String, default: '' },
  genMavis: { type: String, default: '' },
  year: { type: Number, required: false },
  instagram: { type: String },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// Sanitize invisible unicode characters (e.g. copied from WhatsApp)
memberSchema.pre('validate', function (next) {
  if (this.name) {
    this.name = this.name.replace(/[\u200B-\u200D\uFEFF\u2060]/g, '').trim();
  }
  if (this.position) {
    this.position = this.position.replace(/[\u200B-\u200D\uFEFF\u2060]/g, '').trim();
  }
  if (this.division) {
    this.division = this.division.replace(/[\u200B-\u200D\uFEFF\u2060]/g, '').trim();
  }
  if (this.major) {
    this.major = this.major.replace(/[\u200B-\u200D\uFEFF\u2060]/g, '').trim();
  }
  next();
});

module.exports = mongoose.model('Member', memberSchema);
