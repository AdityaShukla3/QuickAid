const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['accident', 'medical', 'fire', 'violence', 'other'],
    default: 'other'
  },
  location: {
    lat: Number,
    lng: Number
  },
  severity: { type: String, default: 'medium' },
  status: { type: String, enum: ['pending', 'responding', 'resolved'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Alert', alertSchema);
