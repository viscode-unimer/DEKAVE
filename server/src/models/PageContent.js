const mongoose = require('mongoose');

const pageContentSchema = new mongoose.Schema(
  {
    pageKey: {
      type: String,
      required: true,
      unique: true,
      enum: ['home', 'about', 'contact'],
    },
    content: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    updatedBy: {
      type: String,
      default: 'superadmin',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('PageContent', pageContentSchema);
