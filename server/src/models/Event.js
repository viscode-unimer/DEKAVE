const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  type: { type: String, enum: ['Workshop', 'Kompetisi', 'Pameran', 'Seminar'], required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  poster: { type: String },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
