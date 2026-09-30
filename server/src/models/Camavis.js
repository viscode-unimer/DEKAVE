const mongoose = require('mongoose');

const camavisSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  nickname: { type: String, required: true, trim: true },
  nim: { type: String, required: true, trim: true },
  faculty: { type: String, required: true },
  major: { type: String, required: true },
  phone: { type: String, required: true },
  instagram: { type: String, required: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  motivation: { type: String, required: true },
  division: { type: String, default: 'Desain' },
  portfolioLink: { type: String, default: '' },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  submittedAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Camavis', camavisSchema);
