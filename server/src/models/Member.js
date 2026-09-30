const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  position: { type: String, required: true },
  division: { type: String, required: true },
  photo: { type: String },
  major: { type: String, default: '' },
  year: { type: Number, required: false },
  instagram: { type: String },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Member', memberSchema);
